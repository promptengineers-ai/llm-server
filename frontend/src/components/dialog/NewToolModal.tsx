import {
    Dialog,
    DialogPanel,
    Field,
    Fieldset,
    Tab,
    TabGroup,
    TabList,
    TabPanel,
    TabPanels,
} from "@headlessui/react";
import { useAppContext } from "@/contexts/AppContext";
import HeaderDataGrid from "../forms/tools/HeaderDataGrid";
import ToolDetailsForm from "../forms/tools/ToolDetailsForm";
import EndpointForm from "../forms/tools/EndpointForm";
import ArgsDataGrid from "../forms/tools/ArgDataGrid";
import { useToolContext } from "@/contexts/ToolContext";
import { initToolState } from "@/hooks/state/useToolState";
import { useState, useRef } from "react";
import { FaMagic } from "react-icons/fa";
import { API_URL } from "@/config/app";

const JsonGeneratorPopover = ({ isOpen, setIsOpen, onGenerate }: { 
    isOpen: boolean, 
    setIsOpen: (open: boolean) => void,
    onGenerate: (prompt: string) => void 
}) => {
    const [prompt, setPrompt] = useState('');
    
    const handleGenerate = () => {
        try {
            onGenerate(prompt); 

        } catch (error) {
            // Keep the prompt and popover open if there was an error
            console.error('Failed to generate:', error);
        } finally {
            // Only clear and close if generation was successful
            setPrompt('');
            setIsOpen(false);
        }
    };
    
    return isOpen ? (
        <div className="absolute right-0 top-8 w-64 bg-white border rounded-lg shadow-lg p-3 z-50">
            <textarea
                className="w-full h-24 p-2 border rounded-md text-sm mb-2"
                placeholder="Describe the API tool you want to create. For example: Create a weather API tool that takes a city name and returns the current weather."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="flex justify-end gap-2">
                <button 
                    className="text-sm px-3 py-1 rounded-md bg-gray-200"
                    onClick={() => {
                        setIsOpen(false);
                    }}
                >
                    Cancel
                </button>
                <button 
                    className="text-sm px-3 py-1 rounded-md bg-black text-white"
                    onClick={handleGenerate}
                >
                    Generate
                </button>
            </div>
        </div>
    ) : null;
};

const NewToolModal = () => {
    const { tool, updateToolState, createTool, updateTool, toolEqual } =
        useToolContext();
    const { isNewToolOpen, setIsNewToolOpen, setIsOpen, setIsCustomizeOpen } =
        useAppContext();
    const [jsonError, setJsonError] = useState<string | null>(null);
    const [jsonContent, setJsonContent] = useState<string>('');
    const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    if (!isNewToolOpen) {
        return null;
    }

    const action = tool.id ? "Update" : "Create";

    const handleJsonChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const jsonStr = e.target.value;
        setJsonContent(jsonStr);

        try {
            if (!jsonStr.trim()) {
                setJsonError(null);
                return;
            }

            const config = JSON.parse(jsonStr);
            
            // Validate required fields
            if (!config.name || !config.description || !config.method || !config.url) {
                setJsonError("Missing required fields: name, description, method, and url are required");
                return;
            }

            // Update the entire tool state with the parsed configuration
            updateToolState({
                name: config.name,
                description: config.description,
                link: config.link || "",
                method: config.method,
                toolkit: config.toolkit || "API",
                url: config.url,
                headers: config.headers || {},
                args: config.args || {},
            });

            setJsonError(null);
        } catch (error) {
            setJsonError("Invalid JSON format");
        }
    };

    const generateJsonConfig = async (prompt: string) => {
        try {
            setIsGenerating(true);
            abortControllerRef.current = new AbortController();

            const systemPrompt = `Generate a JSON configuration for an API tool based on the user's description. Follow this exact format:

{
    "name": "short_tool_name",
    "description": "Concise description of what the tool does.",
    "link": "documentation_url",
    "method": "HTTP_METHOD",
    "toolkit": "API",
    "url": "api_endpoint_url",
    "headers": {
        "header-name": {
            "value": "header_value",
            "encrypted": boolean
        }
    },
    "args": {
        "parameter_name": {
            "description": "Brief description of the parameter",
            "type": "str",
            "default": "default_value",
            "required": boolean
        }
    }
}

Respond ONLY with the JSON. No explanations or markdown formatting.`;

            // Make direct fetch call to localhost
            const response = await fetch(`${API_URL}/api/v1/chat`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                    streaming: false,
                    messages: [
                        { role: "system", content: systemPrompt },
                        { role: "user", content: prompt }
                    ],
                    model: 'openai-gpt-4o',
                    temperature: 0,
                    tools: [],
                    retrieval: {
                        provider: "redis",
                        embedding: "openai-text-embedding-3-small",
                        indexes: [],
                        search_type: "similarity",
                        search_kwargs: {
                            k: 10,
                            fetch_k: 20,
                            score_threshold: 0.9,
                            lambda_mult: 0.25,
                        }
                    }
                }),
                signal: abortControllerRef.current.signal,
            });

            if (!response.ok) {
                throw new Error('Failed to get response from server');
            }

            const data = await response.json();
            const content = data.result.output;

            if (!content) {
                throw new Error('No content in response');
            }

            // Extract the JSON from the response
            const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('No valid JSON found in response');
            }

            const jsonStr = jsonMatch[1] || jsonMatch[0];
            const parsedJson = JSON.parse(jsonStr.trim());
            
            // Update the JSON content
            const formattedJson = JSON.stringify(parsedJson, null, 2);
            setJsonContent(formattedJson);
            handleJsonChange({ target: { value: formattedJson } } as any);
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                setJsonError('Generation cancelled');
            } else {
                console.error('Error generating config:', error);
                setJsonError(error instanceof Error ? error.message : 'Failed to generate configuration');
            }
        } finally {
            setIsGenerating(false);
            abortControllerRef.current = null;
        }
    };

    const handleAbort = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 cursor-pointer"
            style={{ zIndex: 1000 }}
        >
            <Dialog open={true} onClose={() => {}} className="relative z-50">
                <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
                    <DialogPanel className="max-w-lg border bg-white rounded-2xl w-full">
                        <div className="px-4 pb-4 pt-5 sm:p-6 sm:py-3 flex items-center justify-between border-b border-black/10 dark:border-white/10">
                            <div className="flex">
                                <div className="flex items-center">
                                    <div className="flex grow flex-col gap-1">
                                        <h2
                                            id="radix-:re0:"
                                            className="text-lg font-semibold leading-6 text-token-text-primary"
                                        >
                                            {action} Tool
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex-grow p-4">
                            <TabGroup>
                                <TabList className="flex gap-2 overflow-x-auto pb-2">
                                    <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white whitespace-nowrap">
                                        Details
                                    </Tab>
                                    <Tab className="disabled:opacity-50 rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white whitespace-nowrap">
                                        Endpoint
                                    </Tab>
                                    <Tab className="disabled:opacity-50 rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white whitespace-nowrap">
                                        Headers
                                    </Tab>
                                    <Tab className="disabled:opacity-50 rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white whitespace-nowrap">
                                        Arguments
                                    </Tab>
                                    <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white whitespace-nowrap">
                                        JSON
                                    </Tab>
                                </TabList>
                                <div className="max-h-[60vh] overflow-y-auto md:max-h-[calc(100vh-300px)] min-h-[200px]">
                                    <TabPanels className={"mt-3"}>
                                        <TabPanel>
                                            <ToolDetailsForm />
                                        </TabPanel>
                                        <TabPanel>
                                            <EndpointForm />
                                        </TabPanel>
                                        <TabPanel>
                                            <Fieldset className={"mb-2"}>
                                                <Field
                                                    className={
                                                        "border rounded-md p-2"
                                                    }
                                                >
                                                    <label className="font-semibold">
                                                        Headers
                                                    </label>
                                                    <p className="mt-1 mb-1 text-xs">
                                                        The headers to be used
                                                        for the request
                                                    </p>
                                                    <HeaderDataGrid />
                                                </Field>
                                            </Fieldset>
                                        </TabPanel>
                                        <TabPanel>
                                            <Fieldset className={"mb-2"}>
                                                <Field
                                                    className={
                                                        "border rounded-md p-2"
                                                    }
                                                >
                                                    <label className="font-semibold">
                                                        Arguments
                                                    </label>
                                                    <p className="mt-1 mb-1 text-xs">
                                                        The arguments to be used
                                                        for the request
                                                    </p>
                                                    <ArgsDataGrid />
                                                </Field>
                                            </Fieldset>
                                        </TabPanel>
                                        <TabPanel>
                                            <Fieldset className={"mb-2"}>
                                                <Field className={"border rounded-md p-2"}>
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div>
                                                            <label className="font-semibold">JSON Configuration</label>
                                                            <p className="mt-1 mb-1 text-xs">
                                                                Paste your tool configuration JSON here
                                                            </p>
                                                        </div>
                                                        <div className="relative">
                                                            <button
                                                                className={`p-2 hover:bg-gray-100 rounded-full ${isGenerating ? 'cursor-not-allowed' : ''}`}
                                                                onClick={() => {
                                                                    if (isGenerating) {
                                                                        handleAbort();
                                                                    } else {
                                                                        setIsGeneratorOpen(!isGeneratorOpen);
                                                                    }
                                                                }}
                                                                title={isGenerating ? "Cancel generation" : "Generate JSON configuration"}
                                                            >
                                                                <FaMagic 
                                                                    className={`text-gray-600 ${isGenerating ? 'animate-spin' : ''}`} 
                                                                />
                                                            </button>
                                                            {!isGenerating && (
                                                                <JsonGeneratorPopover 
                                                                    isOpen={isGeneratorOpen}
                                                                    setIsOpen={setIsGeneratorOpen}
                                                                    onGenerate={generateJsonConfig}
                                                                />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <textarea
                                                        className={`w-full h-48 p-2 border rounded-md font-mono text-sm ${
                                                            jsonError ? 'border-red-500' : ''
                                                        }`}
                                                        placeholder={`{
  "name": "Tool Name",
  "description": "Tool Description",
  "link": "https://docs.example.com",
  "method": "GET",
  "toolkit": "API",
  "url": "https://api.example.com",
  "headers": {
    "Authorization": {
      "value": "Bearer token",
      "encrypted": true
    }
  },
  "args": {
    "param1": {
      "description": "Parameter description",
      "type": "str",
      "default": "",
      "required": true
    }
  }
}`}
                                                        value={jsonContent}
                                                        onChange={handleJsonChange}
                                                    />
                                                    {jsonError && (
                                                        <p className="text-red-500 text-xs mt-1">
                                                            {jsonError}
                                                        </p>
                                                    )}
                                                </Field>
                                            </Fieldset>
                                        </TabPanel>
                                    </TabPanels>
                                </div>
                            </TabGroup>

                            <div className="mt-4 md:mt-5 flex gap-4">
                                <button
                                    onClick={() => {
                                        setIsNewToolOpen(false);
                                        setIsCustomizeOpen(true);
                                        updateToolState(initToolState.tool);
                                        setJsonContent('');
                                        setJsonError(null);
                                    }}
                                >
                                    Cancel
                                </button>
                                {tool.id ? (
                                    <button
                                        onClick={async () => {
                                            try {
                                                await updateTool(tool);
                                                alert(
                                                    "Tool updated successfully"
                                                );
                                                setIsNewToolOpen(false);
                                                updateToolState(
                                                    initToolState.tool
                                                );
                                                setIsCustomizeOpen(true);
                                            } catch (e) {
                                                alert("Failed to update tool");
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-3xl ${
                                            !toolEqual
                                                ? "bg-gray-500 text-white"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        Update
                                    </button>
                                ) : (
                                    <button
                                        onClick={async () => {
                                            try {
                                                await createTool(tool);
                                                alert(
                                                    "Tool created successfully"
                                                );
                                                setIsNewToolOpen(false);
                                                updateToolState(
                                                    initToolState.tool
                                                );
                                            } catch (e) {
                                                alert("Failed to create tool");
                                            }
                                        }}
                                        className={`px-4 py-2 rounded-3xl ${
                                            tool.name &&
                                            tool.description &&
                                            tool.method &&
                                            tool.url &&
                                            tool.toolkit
                                                ? "bg-gray-500 text-white"
                                                : "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        }`}
                                    >
                                        Create
                                    </button>
                                )}
                            </div>
                        </div>
                    </DialogPanel>
                </div>
            </Dialog>
        </div>
    );
};

export default NewToolModal;
