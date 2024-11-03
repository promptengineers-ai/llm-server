import React, { useState } from "react";
import ChatHistoryButton from "../buttons/ChatHistoryButton";
import SidebarIcon from "../icons/SidebarIcon";
import PlusIcon from "../icons/PlusIcon";
import DotsIcon from "../icons/DotsIcon";
import { useAuthContext } from "@/contexts/AuthContext";
import NewChatIcon from "../icons/NewChatIcon";
import ModelSelect from "../selects/ModelSelect";
import { useChatContext } from "@/contexts/ChatContext";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "@/contexts/AppContext";
import SettingsPopover from "../../../../../frontend/src/components/dialog/SettingsPopover";
import { FaSpinner, FaTools } from "react-icons/fa";

const TopNav: React.FC = () => {
    const navigate = useNavigate();
    const { isDrawerOpen, toggleDrawer, setIsPopoverOpen, setIsWebLoaderOpen } = useAppContext();
    const { loading } = useChatContext();

    return (
        <nav className="fixed top-0 z-10 flex w-full items-center justify-between border-b border-gray-200 bg-white px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-center gap-2">
                <button
                    onClick={toggleDrawer}
                    className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <SidebarIcon />
                </button>
                <ModelSelect />
            </div>

            <div className="flex items-center gap-2">
                {loading && <FaSpinner className="animate-spin" />}
                <button
                    onClick={() => setIsWebLoaderOpen(true)}
                    className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <FaTools />
                </button>
                <button
                    onClick={() => setIsPopoverOpen(true)}
                    className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <DotsIcon />
                </button>
            </div>
        </nav>
    );
};

export default TopNav; 