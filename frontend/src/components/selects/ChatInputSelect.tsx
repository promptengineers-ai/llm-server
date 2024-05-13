"use client";
import { useState, useRef, useEffect } from "react";
import { useChatContext } from "@/contexts/ChatContext";
import { FaCog } from "react-icons/fa";
import { FaCamera, FaGlobe } from "react-icons/fa";
import FileIcon from "../icons/FileIcon";
import { useAppContext } from "@/contexts/AppContext";
import { multiModalModels } from "@/types/llm";

const ChatInputSelect: React.FC = () => {
    const { isMobile } = useAppContext();
    const { setFiles, adjustHeight, chatPayload } = useChatContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const documentInputRef = useRef<HTMLInputElement>(null);

    const toggleMenu = (e?: any) => {
        if (e) e.preventDefault();
        !isMenuOpen ? adjustHeight((isMobile() && chatPayload.model in multiModalModels) ? "170px" : "145px") : adjustHeight();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files) {
            Array.from(files).forEach((file) => {
                const reader = new FileReader();
                const fileType = file.type; // Capture the MIME type of the file
                const fileName = file.name; // Capture the file name

                reader.onloadend = () => {
                    setFiles((prev: any) => [
                        ...prev,
                        {
                            id: Math.random(),
                            src: reader.result as string,
                            type: fileType,
                            name: fileName,
                        },
                    ]); // Update the state with the new file information
                };
                reader.readAsDataURL(file);
            });
            adjustHeight();
            toggleMenu();
        }
    };

    const triggerFileInput = (e: any) => {
        e.preventDefault();
        fileInputRef.current?.setAttribute("capture", "environment");
        fileInputRef.current?.click();
    };

    const triggerDocumentInput = (e: any) => {
        e.preventDefault();
        documentInputRef.current?.click();
    };

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef]);

    return (
        <div ref={menuRef} className="relative inline-block text-left">
            <button
                onClick={toggleMenu}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
            >
                <FaCog fontSize={"24px"} />
            </button>
            {isMenuOpen && (
                <div
                    className="absolute bottom-full mb-2 w-40 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex={-1}
                >
                    <div className="py-1" role="none">
                        <a
                            onClick={triggerDocumentInput}
                            href="#"
                            className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                            role="menuitem"
                            tabIndex={-1}
                        >
                            <span className="mr-2">Document</span>
                            <FileIcon />
                        </a>
                        <input
                            type="file"
                            ref={documentInputRef}
                            style={{ display: "none" }}
                            accept=".doc,.docx,.pdf,.csv,.txt,.html"
                            multiple
                            onChange={handleFileChange}
                        />

                        <a
                            onClick={() => alert("Will open Web Loader Modal")}
                            href="#"
                            className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                            role="menuitem"
                            tabIndex={-1}
                        >
                            <span className="mr-2">Web</span>
                            <FaGlobe fontSize={"20px"} />
                        </a>

                        {isMobile() &&
                            chatPayload.model in multiModalModels && (
                                <>
                                    <a
                                        onClick={triggerFileInput}
                                        href="#"
                                        className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                                        role="menuitem"
                                        tabIndex={-1}
                                    >
                                        <span className="mr-2">Camera</span>
                                        <FaCamera fontSize={"20px"} />
                                    </a>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        accept="image/*"
                                        onChange={handleFileChange}
                                    />
                                </>
                            )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChatInputSelect;
