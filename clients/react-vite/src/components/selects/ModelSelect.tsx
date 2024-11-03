"use client";
import { useState, useRef, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ModelType, modelLabels, multiModalModels } from "@/types/llm";
import { useChatContext } from "@/contexts/ChatContext";
import { IoMdImages } from "react-icons/io";
import { LLM } from "@/types/chat";

const ModelSelect: React.FC = () => {
    const { setChatPayload, chatPayload, models } = useChatContext();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const setQueryParam = (model: ModelType) => {
        setSearchParams({ model });
        setChatPayload((prev: any) => ({
            ...prev,
            model: model,
        }));
        localStorage.setItem("model", model);
    };

    useEffect(() => {
        const queryModel =
            searchParams.get("model") ||
            localStorage.getItem("model") ||
            chatPayload?.model ||
            "gpt-3.5-turbo";
        if (setChatPayload) {
            setChatPayload((prev: any) => ({
                ...prev,
                model: queryModel as ModelType,
            }));
        }
        if (queryModel) {
            setSearchParams({ model: queryModel });
        }
    }, []);

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
            <div
                onMouseDown={toggleMenu}
                aria-haspopup="menu"
                aria-expanded={isMenuOpen}
                className="group flex cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-75"
            >
                <span className="flex items-center justify-start space-x-2">
                    <span>{chatPayload?.model ? modelLabels[chatPayload.model as ModelType] : ''}</span>
                    {chatPayload?.model && multiModalModels[
                        chatPayload.model as keyof typeof multiModalModels
                    ] && <IoMdImages fontSize="20px" />}
                </span>
                <svg
                    className={`transform transition ${
                        isMenuOpen ? "rotate-180" : ""
                    }`}
                    width="16"
                    height="16"
                    viewBox="0 0 20 20"
                    fill="none"
                >
                    <path
                        d="M5 7l5 5 5-5"
                        stroke="#6B7280"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>
            {isMenuOpen && (
                <div
                    className="absolute mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
                    role="menu"
                    aria-orientation="vertical"
                    aria-labelledby="menu-button"
                    tabIndex={-1}
                >
                    <div className="py-1" role="none">
                        {models?.filter((model: LLM) => !model.embedding).map((model: LLM) => (
                            <a
                                key={model.model_name}
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setQueryParam(
                                        model.model_name as ModelType
                                    );
                                }}
                                className={`flex items-center justify-between px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                                    chatPayload.model === model.model_name
                                        ? "bg-gray-200"
                                        : ""
                                }`}
                                role="menuitem"
                                tabIndex={-1}
                            >
                                <span className="mr-2">{modelLabels[model.model_name as ModelType]}</span>
                                {multiModalModels[
                                    model.model_name as keyof typeof multiModalModels
                                ] && <IoMdImages fontSize={"20px"} />}
                            </a>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ModelSelect;
