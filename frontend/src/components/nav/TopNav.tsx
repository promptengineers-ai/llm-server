"use client";

import React, { useState, useEffect } from "react";
// import ToggleThemeButton from "../buttons/ToggleThemeButton";
import ChatHistoryButton from "../buttons/ChatHistoryButton";
import SidebarIcon from "../icons/SidebarIcon";
import PlusIcon from "../icons/PlusIcon";
import DotsIcon from "../icons/DotsIcon";
import { useAuthContext } from "@/contexts/AuthContext";
import NewChatIcon from "../icons/NewChatIcon";
import ModelSelect from "../selects/ModelSelect";
import { useChatContext } from "@/contexts/ChatContext";
import { useRouter } from "next/navigation";
import { useAppContext } from "@/contexts/AppContext";

const TopNav: React.FC = () => {
    const router = useRouter();
    const { toggleDrawer, closeDrawer, isDrawerOpen } = useAppContext();
    const { logout, retrieveUser } = useAuthContext();
    const { chats, setDone, resetChat } = useChatContext();

    return (
        <>
            <nav className="fixed left-0 top-0 z-10 w-full transition-all duration-300 ease-in-out border-b border-">
                <div className="px-4">
                    <div className="flex items-center justify-between py-3">
                        <button
                            onClick={toggleDrawer}
                            className="text-black sm:hidden"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                />
                            </svg>
                        </button>
                        <ModelSelect />
                        {/* <ToggleThemeButton /> */}
                        <NewChatIcon />
                    </div>
                </div>
            </nav>
            <div
                id="drawer" // Add an ID here for the drawer
                style={{ padding: "0px", width: "65%" }}
                className={`z-50 fixed top-0 h-full w-65 transform bg-black p-4 text-gray-100 shadow-md transition-transform shadow-xl ${
                    isDrawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <nav className="flex h-full w-full flex-col p-2 bg-primary-800">
                    <div className="mb-1 flex flex-row gap-2 bg-primary-800">
                        <a
                            href="#"
                            onClick={(event) => {
                                event.preventDefault();
                                router.push("/chat");
                                resetChat(event);
                            }}
                            className="flex px-3 min-h-[44px] py-1 items-center gap-3 transition-colors duration-200 cursor-pointer text-sm rounded-md border-solid border-2 border-secondary-outline-dark dark:border-white/20 hover:bg-gray-500/10 h-11 gizmo:rounded-lg bg-primary-800 dark:bg-transparent flex-grow overflow-hidden"
                        >
                            <PlusIcon />
                            <span className="truncate text-secondary-100">
                                New Chat
                            </span>
                        </a>

                        <span>
                            <a
                                onClick={(e) => {
                                    e.preventDefault();
                                    closeDrawer();
                                }}
                                href="#"
                                className="flex px-3 min-h-[44px] py-1 gap-3 transition-colors duration-200 dark:text-white cursor-pointer text-sm rounded-md border-solid border-2 border-secondary-outline-dark dark:border-gray-600 gizmo:min-h-0 hover:bg-gray-500/10 h-11 gizmo:h-10 gizmo:rounded-lg gizmo:border-[rgba(0,0,0,0.1)] w-11 flex-shrink-0 items-center justify-center bg-primary-800 dark:bg-transparent"
                            >
                                <SidebarIcon />
                                <span
                                    style={{
                                        position: "absolute",
                                        border: "0px",
                                        width: "1px",
                                        height: "1px",
                                        padding: "0px",
                                        margin: "-1px",
                                        overflow: "hidden",
                                        clip: "rect(0px, 0px, 0px, 0px)",
                                        whiteSpace: "nowrap",
                                        overflowWrap: "normal",
                                    }}
                                >
                                    Close sidebar
                                </span>
                            </a>
                        </span>
                    </div>
                    <div className="sidebar flex-col flex-1 transition-opacity duration-500 -mr-2 pr-2 overflow-y-auto bg-primary-800">
                        <div className="flex flex-col gap-2 pb-2 dark:test-gray-100 text-sm">
                            <div>
                                <span>
                                    <div className="relative h-auto opacity-1">
                                        <div className="sticky top-0 z-[16] opacity-1">
                                            <h3 className="h-9 pb-2 pt-3 px-3 text-xs text-gray-500 font-medium text-ellipsis overflow-hidden break-all bg-primary-800 gizmo:bg-white bg:black gizmo:dark:bg-gray-800">
                                                Today
                                            </h3>
                                        </div>
                                        <ol className="bg-primary-800">
                                            {chats?.map((chat: any) => (
                                                <li
                                                    key={chat.id}
                                                    className="relative z-[15] h-auto bg-primary-800"
                                                    style={{
                                                        opacity: 1,
                                                    }}
                                                >
                                                    <ChatHistoryButton
                                                        chat={chat}
                                                    />
                                                </li>
                                            ))}
                                        </ol>
                                    </div>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-black/20 pt-2 empty:hidden gizmo:border-token-border-light dark:border-white/20 bg-primary-800">
                        <div
                            className="group relative"
                            data-headlessui-state=""
                        >
                            <button
                                className="flex w-full items-center gap-3 rounded-md px-3 py-3 text-sm transition-colors duration-200 hover:bg-gray-100 group-ui-open:bg-gray-100 dark:hover:bg-gray-800 dark:group-ui-open:bg-gray-800"
                                id="headlessui-menu-button-:rb:"
                                type="button"
                                aria-haspopup="true"
                                aria-expanded="false"
                                data-headlessui-state=""
                                onClick={logout}
                            >
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center rounded">
                                        <div className="relative flex">
                                            <img
                                                alt="User"
                                                loading="lazy"
                                                width="36"
                                                height="36"
                                                decoding="async"
                                                data-nimg="1"
                                                className="rounded-sm"
                                                style={{
                                                    color: "transparent",
                                                }}
                                                src="https://lh3.googleusercontent.com/a/AEdFTp7F9XoUlOFkNY9zwbe3wRpFaMGxshzDtsHHdLvN=s96-c"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-gray-700 text-white">
                                    <div className="font-semibold text-secondary-50">
                                        {" "}
                                        {retrieveUser()?.name}
                                    </div>
                                    <div className="text-xs text-gray-500"></div>
                                </div>
                                <DotsIcon />
                            </button>
                        </div>
                    </div>
                </nav>
            </div>
        </>
    );
};

export default TopNav;
