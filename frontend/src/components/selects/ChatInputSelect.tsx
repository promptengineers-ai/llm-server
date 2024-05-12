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
    const { setImages, adjustHeight, chatPayload } = useChatContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const toggleMenu = (e: any) => {
        e.preventDefault();
        !isMenuOpen ? adjustHeight((isMobile() && chatPayload.model in multiModalModels) ? "170px" : "145px") : adjustHeight();
        setIsMenuOpen(!isMenuOpen);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files[0]) {
            const file = files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((prevImages: any) => [
                    ...prevImages,
                    { id: Math.random(), src: reader.result as string },
                ]);
            };
            reader.readAsDataURL(file);
        }
    };

    const triggerFileInput = (e: any) => {
        e.preventDefault();
        fileInputRef.current?.setAttribute("capture", "environment");
        fileInputRef.current?.click();
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
                            onClick={() =>
                                alert("Will open Document Loader Modal")
                            }
                            href="#"
                            className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100`}
                            role="menuitem"
                            tabIndex={-1}
                        >
                            <span className="mr-2">Document</span>
                            <FileIcon />
                        </a>

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

                        {isMobile() && chatPayload.model in multiModalModels && (
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
