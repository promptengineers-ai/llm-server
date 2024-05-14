import { useEffect } from "react";
import SubmitIcon from "../icons/SubmitIcon";
import { useChatContext } from "../../contexts/ChatContext";
import { FcCancel } from "react-icons/fc";
import SuggestionButton from "../buttons/SuggestionButton";
import ChatInputSelect from "../selects/ChatInputSelect";
import { multiModalModels } from "@/types/llm";
import DocumentIcon from "../icons/DocumentIcon";
import { FaFileUpload } from "react-icons/fa";
import { generateRandomNumber } from "@/utils/random";
import { ChatClient } from "@/utils/api";

const SUGGESTIONS = [
    {
        id: 1,
        label: "How to setup a FastAPI server",
        description: "Step-by-step guide to set up a FastAPI server",
    },
    {
        id: 2,
        label: "What is Chain-of-Thought (CoT) reasoning?",
        description:
            "Explain the concept of Chain-of-Thought reasoning in AI",
    },
    {
        id: 3,
        label: "Interview Tips",
        description: "Tips to make a good first impression in an interview",
    },
    {
        id: 4,
        label: "Thank-You Note",
        description: "Write a thank-you note to my interviewer",
    },
];


export default function ChatSection() {
    const {
        done,
        chatInputRef,
        chatPayload,
        setChatPayload,
        sendChatPayload,
        resetChat,
        images,
        files,
        setFiles,
        setImages,
        userInput,
        setUserInput,
        messages,
        selectedImage,
        setSelectedImage,
        handleImageClick,
        adjustHeight,
    } = useChatContext();

    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault(); // Prevent the default paste action
        const items = e.clipboardData.items; // Get clipboard items
        const textarea = e.target as HTMLTextAreaElement;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.startsWith("image")) {
                const blob = item.getAsFile(); // Get the image as a blob
                const reader = new FileReader(); // Create a file reader

                // Check if the model is not in multiModalModels after handling the image
                if (!(chatPayload.model in multiModalModels)) {
                    alert(`${chatPayload.model} does not support images.`);
                    return;
                }

                if (blob) {
                    reader.onloadend = () => {
                        setImages((prevImages: any) => [
                            ...prevImages,
                            {
                                id: generateRandomNumber(),
                                src: reader.result as string,
                                type: blob.type,
                            },
                        ]); // Update the state with the new image
                    };
                    reader.readAsDataURL(blob); // Read the blob as a Data URL
                }
            }
        }

        // Handle text if no images are pasted
        const text = e.clipboardData.getData("text");
        const cursorPosition = textarea.selectionStart;
        const textBeforeCursor = textarea.value.substring(0, cursorPosition);
        const textAfterCursor = textarea.value.substring(
            textarea.selectionEnd,
            textarea.value.length
        );

        setUserInput(textBeforeCursor + text + textAfterCursor); // Insert text at the cursor position
        setTimeout(() => {
            textarea.selectionStart = cursorPosition + text.length;
            textarea.selectionEnd = cursorPosition + text.length;
        }, 0);
    };

    const removeImage = (id: number) => {
        setImages((prev: any) => prev.filter((image: any) => image.id !== id));
        setFiles((prev: any) => prev.filter((image: any) => image.id !== id));
    };

    useEffect(() => {
        localStorage.removeItem("chatbox");
    }, []);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendChatPayload(e);
            submitCleanUp();
        }
        if (e.altKey && e.key === "n") {
            e.preventDefault();
            resetChat();
        }
    };

    const submitCleanUp = () => {
        setChatPayload({ ...chatPayload, query: "" });
        chatInputRef.current?.focus();
    };


    useEffect(() => {
        adjustHeight();
    }, [userInput]);

    const selectedFiles = [...images, ...files]

    return (
        <div className="w-full pt-2 md:pt-0 border-t md:border-t-0 bg-white md:!bg-transparent">
            <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
                <div className="relative flex h-full flex-1 items-stretch md:flex-col">
                    {messages.length === 0 && (
                        <div className="h-full flex ml-1 md:w-full md:m-auto md:mb-4 gap-0 md:gap-2 justify-center">
                            <div className="grow">
                                <div className="absolute bottom-full left-0 mb-4 flex w-full grow gap-2 px-1 pb-1 sm:px-2 sm:pb-0 md:mb-0 md:max-w-none">
                                    <div className="grid w-full grid-flow-row grid-cols-1 md:grid-cols-2 gap-2">
                                        {SUGGESTIONS.map((suggestion) => (
                                            <SuggestionButton
                                                key={suggestion.id}
                                                title={suggestion.label}
                                                description={
                                                    suggestion.description
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className="flex w-full items-center">
                        <div className="shadow-custom overflow-hidden flex flex-col w-full flex-grow relative border border-black/10 bg-primary-300 rounded-xl shadow-xs">
                            {/* Images container */}
                            {selectedFiles.length > 0 && (
                                <div className="flex w-full flex-row flex-wrap items-center justify-start gap-2 p-2">
                                    {/* Enlarged Image Preview Overlay */}
                                    {selectedImage && (
                                        <div
                                            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
                                            onClick={() =>
                                                setSelectedImage(null)
                                            }
                                        >
                                            <img
                                                src={selectedImage}
                                                alt="Enlarged content"
                                                className="max-w-full max-h-full"
                                                style={{ borderRadius: "5px" }}
                                            />
                                        </div>
                                    )}
                                    {selectedFiles.map((file: any) => (
                                        <div
                                            key={file.id}
                                            className="group relative inline-block text-sm text-token-text-primary"
                                        >
                                            {file.type.startsWith("image/") ? (
                                                <div
                                                    key={file.id}
                                                    className="relative"
                                                >
                                                    <img
                                                        src={file.src}
                                                        alt={`Pasted content ${file.id}`}
                                                        onClick={() =>
                                                            handleImageClick(
                                                                file.src
                                                            )
                                                        }
                                                        style={{
                                                            maxWidth: "50px",
                                                            maxHeight: "50px",
                                                            cursor: "pointer",
                                                            borderRadius: "7px",
                                                        }}
                                                    />
                                                    <button
                                                        onClick={() =>
                                                            removeImage(file.id)
                                                        }
                                                        className="absolute"
                                                        style={{
                                                            bottom: 0,
                                                            right: 0,
                                                        }}
                                                    >
                                                        <FcCancel />
                                                    </button>
                                                </div>
                                            ) : (
                                                <>
                                                    <div className="relative overflow-hidden rounded-xl border border-token-border-light bg-token-main-surface-primary">
                                                        <div className="p-2 w-48">
                                                            <div className="flex flex-row items-center gap-2">
                                                                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                                                                    <DocumentIcon />
                                                                </div>
                                                                <div className="overflow-hidden">
                                                                    <div className="truncate font-medium">
                                                                        {
                                                                            file.name
                                                                        }
                                                                    </div>
                                                                    <div className="truncate text-token-text-tertiary">
                                                                        {file.type
                                                                            .split(
                                                                                "/"
                                                                            )[1]
                                                                            .toUpperCase()}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            removeImage(
                                                                file.id
                                                            );
                                                        }}
                                                        className="absolute right-1 top-1 -translate-y-1/2 translate-x-1/2 rounded-full border border-token-border-heavy bg-token-main-surface-secondary p-0.5 text-token-text-primary transition-colors hover:opacity-100 group-hover:opacity-100 md:opacity-0"
                                                    >
                                                        <svg
                                                            width="24"
                                                            height="24"
                                                            viewBox="0 0 24 24"
                                                            fill="none"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            className="icon-sm"
                                                        >
                                                            <path
                                                                d="M6.34315 6.34338L17.6569 17.6571M17.6569 6.34338L6.34315 17.6571"
                                                                stroke="currentColor"
                                                                strokeWidth="2"
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                            ></path>
                                                        </svg>
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                            <textarea
                                ref={chatInputRef}
                                value={userInput}
                                onChange={(e) => setUserInput(e.target.value)}
                                onPaste={handlePaste}
                                onKeyDown={handleKeyDown}
                                id="prompt-textarea"
                                tabIndex={0}
                                data-id="root"
                                rows={1}
                                disabled={files.length > 0}
                                placeholder={
                                    files.length > 0
                                        ? `Upload ${files.length} files`
                                        : "Acting as a expert at..."
                                }
                                className="m-0 w-full resize-none border-0 bg-transparent py-[10px] pr-10 md:py-3.5 md:pr-12 max-h-[25dvh] max-h-52 placeholder-black/50 pl-10 md:pl-[55px] focus:outline-none"
                                style={{
                                    overflowY: "auto",
                                    borderRadius: "10px",
                                    // backgroundColor:
                                    //     files.length > 0 ? "#F9F9F9" : "",
                                }}
                            ></textarea>
                            <div className="absolute bottom-1 md:bottom-2 left-2 md:left-4">
                                <div className="flex">
                                    <ChatInputSelect />
                                </div>
                            </div>
                            {files.length > 0 ? (
                                <button
                                    onClick={async (e) => {
                                        try {
                                            e.preventDefault();
                                            const chatClient = new ChatClient();
                                            const docs = await chatClient.createDocuments({data: files});
                                            const upsert =  await chatClient.upsert({documents: docs['documents'], history_id: chatPayload.history_id});
                                            setChatPayload((prev: any) => ({
                                                ...prev,
                                                retrieval: {
                                                    ...prev.retrieval,
                                                    index_name: chatPayload.history_id
                                                }
                                            }));
                                            alert(upsert.message);
                                            setFiles([]);
                                        } catch (error) {
                                            console.error(error);
                                            alert("Error uploading the file");
                                        }
                                    }}
                                    className="absolute bottom-1.5 right-2 rounded-lg border border-black bg-black p-1 text-white transition-colors enabled:bg-black disabled:text-gray-400 disabled:opacity-10 md:bottom-3 md:right-3"
                                >
                                    <span className="">
                                        <FaFileUpload fontSize={22} />
                                    </span>
                                </button>
                            ) : (
                                <button
                                    onClick={(e) => {
                                        if (userInput === "") {
                                            e.preventDefault();
                                            alert("Please enter a message");
                                            return;
                                        } else {
                                            sendChatPayload(e);
                                        };
                                        
                                    }}
                                    disabled={!done}
                                    className="absolute bottom-1.5 right-2 rounded-lg border border-black bg-black p-0.5 text-white transition-colors enabled:bg-black disabled:text-gray-400 disabled:opacity-10 md:bottom-3 md:right-3"
                                >
                                    <span className="">
                                        <SubmitIcon />
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
            <div className="relative px-2 py-2 text-center text-[11px] text-secondary-100 bg-white">
                <span>
                    ChatGPT can make mistakes. Consider checking important
                    information.
                </span>
            </div>
        </div>
    );
}
