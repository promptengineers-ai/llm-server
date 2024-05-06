import { useEffect, useRef, useState } from "react";
import FileIcon from "../icons/FileIcon";
import SubmitIcon from "../icons/SubmitIcon";
import { useChatContext } from "../../contexts/ChatContext";
import DOMPurify from "dompurify";
import { FcCancel } from "react-icons/fc";



export default function ChatInputSection() {

    const {
        loading,
        chatInputRef,
        chatPayload,
        setChatPayload,
        sendChatPayload,
        resetChat,
        images,
        setImages,
        userInput,
        setUserInput,
        messages,
        selectedImage,
        setSelectedImage,
        handleImageClick,
    } = useChatContext();
    
    const handlePaste = (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault(); // Prevent the default paste action
        const items = e.clipboardData.items; // Get clipboard items
        let isImagePasted = false;
        const textarea = e.target as HTMLTextAreaElement;

        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            if (item.type.startsWith("image")) {
                isImagePasted = true;
                const blob = item.getAsFile(); // Get the image as a blob
                const reader = new FileReader(); // Create a file reader

                if (blob) {
                    // Add null check
                    reader.onloadend = () => {
                        setImages((prevImages: any) => [
                            ...prevImages,
                            { id: Math.random(), src: reader.result as string },
                        ]); // Update the state with the new image
                    };
                    reader.readAsDataURL(blob); // Read the blob as a Data URL
                }
            }
        }

        if (!isImagePasted) {
            // Handle text
            const text = e.clipboardData.getData("text");
            const cursorPosition = textarea.selectionStart;
            const textBeforeCursor = textarea.value.substring(
                0,
                cursorPosition
            );
            const textAfterCursor = textarea.value.substring(
                textarea.selectionEnd,
                textarea.value.length
            );

            setUserInput(textBeforeCursor + text + textAfterCursor); // Insert text at the cursor position
            // Optionally, set cursor position right after the inserted text
            setTimeout(() => {
                textarea.selectionStart = cursorPosition + text.length;
                textarea.selectionEnd = cursorPosition + text.length;
            }, 0);
        }
    };

    const removeImage = (id: number) => {
        setImages((prevImages: any) =>
            prevImages.filter((image: any) => image.id !== id)
        );
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

    const adjustHeight = () => {
        const textarea = chatInputRef.current as unknown as HTMLTextAreaElement; // Type assertion
        if (textarea) {
            textarea.style.height = "auto";
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    };

    useEffect(() => {
        adjustHeight();
    }, [userInput]);

    return (
        <div className="w-full pt-2 md:pt-0 border-t md:border-t-0 gizmo:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent md:pl-2 gizmo:pl-0 gizmo:md:pl-0 md:w-[calc(100%-.5rem)] absolute bottom-0 left-0 md:bg-vert-light-gradient bg-white dark:bg-gray-800 md:!bg-transparent dark:md:bg-vert-dark-gradient">
            <form className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
                <div className="relative flex h-full flex-1 items-stretch md:flex-col">
                    <div>
                        <div className="h-full flex ml-1 md:w-full md:m-auto md:mb-4 gap-0 md:gap-2 justify-center">
                            <div className="grow">
                                {messages.length === 0 && (
                                    <div className="absolute bottom-full left-0 mb-4 flex w-full grow gap-2 px-1 pb-1 sm:px-2 sm:pb-0 md:static md:mb-0 md:max-w-none">
                                        <div className="grid w-full grid-flow-row grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-2">
                                            <div className="flex flex-col gap-2">
                                                <span
                                                    data-projection-id="113"
                                                    style={{
                                                        opacity: 1,
                                                        transform: "none",
                                                    }}
                                                >
                                                    <button className="btn relative btn-neutral group w-full whitespace-nowrap rounded-xl text-left text-gray-700 dark:text-gray-300 md:whitespace-normal border-solid border-2 border-secondary-outline-dark">
                                                        <div className="flex w-full gap-2 items-center justify-center">
                                                            <div className="flex w-full items-center justify-between">
                                                                <div className="flex flex-col overflow-hidden py-1 px-2 text-secondary-100">
                                                                    <div className="truncate font-semibold">
                                                                        Come up
                                                                        with
                                                                        concepts
                                                                    </div>
                                                                    <div className="truncate opacity-50">
                                                                        for a
                                                                        retro-style
                                                                        arcade
                                                                        game
                                                                    </div>
                                                                </div>
                                                                <div className="absolute bottom-0 right-0 top-0 flex items-center rounded-xl bg-gradient-to-l from-gray-100 from-[60%] pl-6 pr-2 text-gray-700 opacity-0 group-hover:opacity-100 dark:from-gray-700 dark:text-gray-200">
                                                                    <span
                                                                        className=""
                                                                        data-state="closed"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 16 16"
                                                                            fill="none"
                                                                            className="icon-sm pr-1"
                                                                        >
                                                                            <path
                                                                                d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                                                                                fill="currentColor"
                                                                            ></path>
                                                                        </svg>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </span>
                                                <span
                                                    data-projection-id="114"
                                                    style={{
                                                        opacity: 1,
                                                        transform: "none",
                                                    }}
                                                >
                                                    <button className="btn relative btn-neutral group w-full whitespace-nowrap rounded-xl text-left text-gray-700 dark:text-gray-300 md:whitespace-normal border-solid border-2 border-secondary-outline-dark">
                                                        <div className="flex w-full gap-2 items-center justify-center">
                                                            <div className="flex w-full items-center justify-between">
                                                                <div className="flex flex-col overflow-hidden py-1 px-2 text-secondary-100">
                                                                    <div className="truncate font-semibold">
                                                                        Brainstorm
                                                                        names
                                                                    </div>
                                                                    <div className="truncate opacity-50">
                                                                        for a
                                                                        non-alcoholic
                                                                        cocktail
                                                                        with
                                                                        Coke and
                                                                        pomegranate
                                                                        syrup
                                                                    </div>
                                                                </div>
                                                                <div className="absolute bottom-0 right-0 top-0 flex items-center rounded-xl bg-gradient-to-l from-gray-100 from-[60%] pl-6 pr-2 text-gray-700 opacity-0 group-hover:opacity-100 dark:from-gray-700 dark:text-gray-200">
                                                                    <span
                                                                        className=""
                                                                        data-state="closed"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 16 16"
                                                                            fill="none"
                                                                            className="icon-sm pr-1"
                                                                        >
                                                                            <path
                                                                                d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                                                                                fill="currentColor"
                                                                            ></path>
                                                                        </svg>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <span
                                                    data-projection-id="115"
                                                    style={{
                                                        opacity: 1,
                                                        transform: "none",
                                                    }}
                                                >
                                                    <button className="btn relative btn-neutral group w-full whitespace-nowrap rounded-xl text-left text-gray-700 dark:text-gray-300 md:whitespace-normal border-solid border-2 border-secondary-outline-dark">
                                                        <div className="flex w-full gap-2 items-center justify-center">
                                                            <div className="flex w-full items-center justify-between">
                                                                <div className="flex flex-col overflow-hidden py-1 px-2 text-secondary-100">
                                                                    <div className="truncate font-semibold">
                                                                        Compare
                                                                        storytelling
                                                                        techniques
                                                                    </div>
                                                                    <div className="truncate opacity-50">
                                                                        in
                                                                        novels
                                                                        and in
                                                                        films
                                                                    </div>
                                                                </div>
                                                                <div className="absolute bottom-0 right-0 top-0 flex items-center rounded-xl bg-gradient-to-l from-gray-100 from-[60%] pl-6 pr-2 text-gray-700 opacity-0 group-hover:opacity-100 dark:from-gray-700 dark:text-gray-200">
                                                                    <span
                                                                        className=""
                                                                        data-state="closed"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 16 16"
                                                                            fill="none"
                                                                            className="icon-sm pr-1"
                                                                        >
                                                                            <path
                                                                                d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                                                                                fill="currentColor"
                                                                            ></path>
                                                                        </svg>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </span>
                                                <span
                                                    data-projection-id="116"
                                                    style={{
                                                        opacity: 1,
                                                        transform: "none",
                                                    }}
                                                >
                                                    <button className="btn relative btn-neutral group w-full whitespace-nowrap rounded-xl text-left text-gray-700 dark:text-gray-300 md:whitespace-normal border-solid border-2 border-secondary-outline-dark">
                                                        <div className="flex w-full gap-2 items-center justify-center">
                                                            <div className="flex w-full items-center justify-between">
                                                                <div className="flex flex-col overflow-hidden py-1 px-2 text-secondary-100">
                                                                    <div className="truncate font-semibold">
                                                                        Write a
                                                                        thank-you
                                                                        note
                                                                    </div>
                                                                    <div className="truncate opacity-50">
                                                                        to my
                                                                        interviewer
                                                                    </div>
                                                                </div>
                                                                <div className="absolute bottom-0 right-0 top-0 flex items-center rounded-xl bg-gradient-to-l from-gray-100 from-[60%] pl-6 pr-2 text-gray-700 opacity-0 group-hover:opacity-100 dark:from-gray-700 dark:text-gray-200">
                                                                    <span
                                                                        className=""
                                                                        data-state="closed"
                                                                    >
                                                                        <svg
                                                                            xmlns="http://www.w3.org/2000/svg"
                                                                            viewBox="0 0 16 16"
                                                                            fill="none"
                                                                            className="icon-sm pr-1"
                                                                        >
                                                                            <path
                                                                                d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                                                                                fill="currentColor"
                                                                            ></path>
                                                                        </svg>
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex w-full items-center">
                        <div className="shadow-custom overflow-hidden gizmo:[&amp;:has(textarea:focus)]:border-token-border-xheavy gizmo:[&amp;:has(textarea:focus)]:shadow-[0_2px_6px_rgba(0,0,0,.05)] flex flex-col w-full dark:border-gray-900/50 gizmo:dark:border-token-border-heavy flex-grow relative border border-black/10 dark:text-white rounded-xl shadow-xs dark:shadow-xs dark:bg-gray-700 bg-primary-300">
                            {/* Images container */}
                            {images.length > 0 && (
                                <div className="flex w-full flex-row flex-wrap items-center justify-start gap-2 p-2">
                                    {/* Enlarged Image Preview Overlay */}
                                    {selectedImage && (
                                        <div
                                            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
                                            style={{ zIndex: 1000 }}
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
                                    {images.map((image: any) => (
                                        <div
                                            key={image.id}
                                            className="relative"
                                        >
                                            <img
                                                src={image.src}
                                                alt={`Pasted content ${image.id}`}
                                                onClick={() =>
                                                    handleImageClick(image.src)
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
                                                    removeImage(image.id)
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
                                    ))}
                                </div>
                            )}
                            <textarea
                                ref={chatInputRef}
                                value={userInput}
                                // disabled={loading}
                                onChange={(e) => setUserInput(e.target.value)}
                                onPaste={handlePaste}
                                onKeyDown={handleKeyDown}
                                id="prompt-textarea"
                                tabIndex={0}
                                data-id="root"
                                rows={1}
                                placeholder="Message ChatGPT..."
                                className="m-0 w-full resize-none border-0 focus:ring-0 focus-visible:ring-0 dark:bg-transparent py-[10px] pr-10 md:py-3.5 md:pr-12 max-h-[25dvh] max-h-52 placeholder-black/50 dark:placeholder-white/50 pl-10 md:pl-[55px]"
                                style={{
                                    // height: "auto",
                                    overflowY: "auto",
                                    borderRadius: "10px",
                                }}
                            ></textarea>
                            <div className="absolute bottom-2 md:bottom-3 left-2 md:left-4">
                                <div className="flex">
                                    <button
                                        className="btn relative p-0 text-black dark:text-white"
                                        aria-label="Attach files"
                                    >
                                        <div className="flex w-full gap-2 items-center justify-center">
                                            <FileIcon />
                                        </div>
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={(e) => sendChatPayload(e)}
                                disabled={loading}
                                className="absolute bottom-1.5 right-2 rounded-lg border border-black bg-black p-0.5 text-white transition-colors enabled:bg-black disabled:text-gray-400 disabled:opacity-10 dark:border-white dark:bg-white dark:hover:bg-white md:bottom-3 md:right-3"
                                data-testid="send-button"
                            >
                                <span className="" data-state="closed">
                                    <SubmitIcon />
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </form>
            <div className="relative px-2 py-2 text-center text-[11px] text-secondary-100 dark:text-gray-300 md:px-[60px] bg-white">
                <span>
                    ChatGPT can make mistakes. Consider checking important
                    information.
                </span>
            </div>
        </div>
    );
}
