import React from "react";
import PlusIcon from "@/components/icons/PlusIcon";
import ChatHistoryButton from "@/components/buttons/ChatHistoryButton";
import { useChatContext } from "@/contexts/ChatContext";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";
import { useAppContext } from "@/contexts/AppContext";
import { FaSpinner } from "react-icons/fa";
import { RxValueNone } from "react-icons/rx";
import DotsIcon from "@/components/icons/DotsIcon";
import SettingsPopover from "@/components/dialog/SettingsPopover";

interface DrawerProps {
    isOpen?: boolean;
}

const SideSection: React.FC<DrawerProps> = () => {
    const navigate = useNavigate();
    const { chats, loading, resetChat } = useChatContext();
    const { retrieveUser } = useAuthContext();
    const { isDrawerOpen, toggleDrawer, isPopoverOpen, setIsPopoverOpen } = useAppContext();

    const handleNewChat = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate("/chat");
        resetChat(e);
    };

    return (
        <div 
            className={`fixed bottom-0 left-0 top-0 z-20 flex-shrink-0 overflow-x-hidden bg-gray-900 transition-transform dark:bg-gray-800 ${
                isDrawerOpen ? "translate-x-0" : "-translate-x-full"
            } md:relative md:top-[57px] md:h-[calc(100vh-57px)] md:translate-x-0`}
            style={{ width: "260px" }}
        >
            <div className="flex h-full min-h-0 w-full flex-col">
                <nav className="flex h-full w-full flex-col p-2">
                    <div className="mb-1 flex flex-row gap-2">
                        <a
                            href="#"
                            onClick={handleNewChat}
                            className="flex flex-grow items-center gap-3 rounded-md border border-white/20 px-3 py-2 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10"
                        >
                            <PlusIcon />
                            <span className="truncate">New Chat</span>
                        </a>

                        <button
                            onClick={toggleDrawer}
                            className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md border border-white/20 text-white hover:bg-gray-500/10"
                        >
                            <DotsIcon />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto">
                        <div className="flex flex-col gap-2 pb-2 text-gray-100">
                            {loading ? (
                                <div className="flex items-center justify-center h-[80dvh]">
                                    <FaSpinner className="animate-spin mr-2" fontSize={22} />
                                    <div>Loading...</div>
                                </div>
                            ) : !chats || chats.length === 0 ? (
                                <div className="flex items-center justify-center h-[80dvh]">
                                    <RxValueNone fontSize={22} />
                                    <div className="ml-2">No History</div>
                                </div>
                            ) : (
                                <div>
                                    <h3 className="h-9 pb-2 pt-3 px-3 text-xs text-gray-500 font-medium">
                                        Today
                                    </h3>
                                    <ol>
                                        {chats.map((chat: any) => (
                                            <li key={chat.id}>
                                                <ChatHistoryButton chat={chat} />
                                            </li>
                                        ))}
                                    </ol>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="border-t border-white/20 pt-2">
                        <button
                            className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm text-white transition-colors duration-200 hover:bg-gray-500/10"
                            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                        >
                            <div className="flex-shrink-0">
                                <img
                                    alt="User"
                                    width="36"
                                    height="36"
                                    className="rounded-sm"
                                    src="https://lh3.googleusercontent.com/a/AEdFTp7F9XoUlOFkNY9zwbe3wRpFaMGxshzDtsHHdLvN=s96-c"
                                />
                            </div>
                            <div className="grow overflow-hidden">
                                <div className="font-semibold">
                                    {retrieveUser()?.full_name}
                                </div>
                            </div>
                            <DotsIcon />
                        </button>
                        {isPopoverOpen && <SettingsPopover />}
                    </div>
                </nav>
            </div>
        </div>
    );
};

export default SideSection;
