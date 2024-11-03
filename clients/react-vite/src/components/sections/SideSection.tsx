import React, { useState } from "react";
import PlusIcon from "@/components/icons/PlusIcon";
import ChatHistoryButton from "@/components/buttons/ChatHistoryButton";
import { useChatContext } from "@/contexts/ChatContext";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAppContext } from "@/contexts/AppContext";
import { FaSpinner } from "react-icons/fa";
import { RxValueNone } from "react-icons/rx";

interface DrawerProps {
    isOpen?: boolean;
}

const SideSection: React.FC<DrawerProps> = () => {
    const navigate = useNavigate();
    const { chats, loading, findChat } = useChatContext();
    const { logout } = useAuthContext();
    const { isDrawerOpen, toggleDrawer } = useAppContext();

    const handleNewChat = () => {
        navigate("/chat");
    };

    return (
        <aside
            className={`fixed bottom-0 left-0 top-0 z-20 flex h-full w-64 flex-none flex-col space-y-2 bg-gray-900 p-2 text-white transition-transform dark:bg-gray-800 ${
                isDrawerOpen ? "translate-x-0" : "-translate-x-full"
            } md:relative md:top-[57px] md:h-[calc(100vh-57px)] md:translate-x-0 ${
                isDrawerOpen ? "md:block" : "md:hidden"
            }`}
        >
            <div className="flex-1 overflow-y-auto">
                <div className="mb-2 flex gap-2">
                    <button
                        onClick={handleNewChat}
                        className="flex w-full items-center gap-3 rounded-md border border-white/20 px-3 py-2 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10"
                    >
                        <PlusIcon /> New chat
                    </button>
                </div>

                <div className="flex-1 flex-col">
                    {loading ? (
                        <div className="flex justify-center pt-4">
                            <FaSpinner className="animate-spin" />
                        </div>
                    ) : !chats || chats.length === 0 ? (
                        <div className="flex flex-col items-center justify-center gap-2 text-sm text-gray-500">
                            <RxValueNone />
                            <span>No chat history</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 pb-2 text-gray-100">
                            {chats.map((chat: any) => (
                                <ChatHistoryButton
                                    key={chat.id}
                                    chat={chat}
                                    // onClick={() => findChat(chat.id)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="border-t border-white/20 pt-2">
                <button
                    onClick={logout}
                    className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10"
                >
                    Log out
                </button>
            </div>
        </aside>
    );
};

export default SideSection;
