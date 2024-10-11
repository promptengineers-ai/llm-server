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

const NewToolModal = () => {
    const { tool, updateToolState, createTool, updateTool, toolEqual } =
        useToolContext();
    const { isNewToolOpen, setIsNewToolOpen, setIsOpen, setIsCustomizeOpen } =
        useAppContext();

    if (!isNewToolOpen) {
        return null;
    }

    const action = tool.id ? "Update" : "Create";

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
                                <TabList className="flex gap-2">
                                    <Tab className="rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white">
                                        Details
                                    </Tab>
                                    <Tab className="disabled:opacity-50 rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white">
                                        Endpoint
                                    </Tab>
                                    <Tab className="disabled:opacity-50 rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white">
                                        Headers
                                    </Tab>
                                    <Tab className="disabled:opacity-50 rounded-full py-1 px-3 text-sm/6 font-semibold focus:outline-none data-[selected]:bg-black/10 data-[hover]:bg-black/5 data-[selected]:data-[hover]:bg-black/10 data-[focus]:outline-1 data-[focus]:outline-white">
                                        Arguments
                                    </Tab>
                                </TabList>
                                <div className="max-h-[60vh] overflow-y-auto md:max-h-[calc(100vh-300px)]">
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
                                    </TabPanels>
                                </div>
                            </TabGroup>

                            <div className="mt-4 md:mt-5 flex gap-4">
                                <button
                                    onClick={() => {
                                        setIsNewToolOpen(false);
                                        setIsCustomizeOpen(true);
                                        updateToolState(initToolState.tool);
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
