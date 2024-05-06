"use client";
import ToggleThemeButton from "@/components/buttons/ToggleThemeButton";
import TopNav from "@/components/nav/TopNav";
import ChatSection from "@/components/sections/ChatSection";
import SideSection from "@/components/sections/SideSection";
import ModelSelect from "@/components/selects/ModelSelect";
import theme from "@/config/theme";
import { useChatContext } from "@/contexts/ChatContext";
import { withAuth } from "@/middleware/AuthMiddleware";
import { useState, useEffect, useRef } from "react";
import {
    MdKeyboardArrowDown,
    MdOutlineArrowBackIosNew,
    MdOutlineArrowForwardIos,
} from "react-icons/md";

const useDefaultOpenState = () => {
    const isClient = typeof window === "object";
    const getSize = () => window.innerWidth > 768;
    const [isOpen, setIsOpen] = useState(isClient ? getSize() : false);

    useEffect(() => {
        if (!isClient) return undefined;
        const handleResize = () => setIsOpen(getSize());
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [isClient]);

    return { isOpen, setIsOpen };
};

const Chat = () => {
    const messagesContainerRef = useRef<null | HTMLDivElement>(null);
    const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const { isOpen, setIsOpen } = useDefaultOpenState();
    const { messages, renderConversation, selectedImage, setSelectedImage } =
        useChatContext();
    const isMobile = window.innerWidth < 768;

    const toggleSideSection = () => setIsOpen(!isOpen);

    const handleScroll = () => {
        const element = messagesContainerRef.current;
        if (!element) return;
        const isCloseToBottom =
            element.scrollHeight - element.scrollTop <=
            element.clientHeight + 100;
        setIsUserScrolledUp(!isCloseToBottom);
    };

    const scrollToBottom = () => {
        const element = messagesContainerRef.current;
        if (element) {
            element.scrollTo({
                top: element.scrollHeight,
                behavior: "smooth",
            });
            setIsUserScrolledUp(false);
        }
    };

    useEffect(() => {
        setShowScrollButton(isUserScrolledUp);
    }, [isUserScrolledUp]);

    useEffect(() => {
        const element = messagesContainerRef.current;
        if (element) {
            element.addEventListener("scroll", handleScroll);
            return () => element.removeEventListener("scroll", handleScroll);
        }
    }, []);

    useEffect(() => {
        if (messagesContainerRef.current && !isUserScrolledUp) {
            scrollToBottom();
        }
    }, [messages, isUserScrolledUp]);

    return (
        <main className="overflow-hidden w-full h-screen relative flex z-0">
            <SideSection isOpen={isOpen} />
            {!isMobile ? (
                <>
                    {/* <div
                        style={{
                            position: "absolute",
                            top: 20,
                            right: 20,
                            zIndex: 1000,
                        }}
                    >
                        <ToggleThemeButton />
                    </div> */}

                    <button onClick={toggleSideSection}>
                        {isOpen ? (
                            <MdOutlineArrowBackIosNew />
                        ) : (
                            <MdOutlineArrowForwardIos />
                        )}
                    </button>
                </>
            ) : (
                <TopNav />
            )}

            <div className="relative flex h-full max-w-full flex-1 flex-col overflow-hidden">
                <div className="relative h-full w-full flex-1 overflow-autot transition-width">
                    <div
                        role="presentation"
                        className="flex h-full flex-col position-relative"
                    >
                        {!isMobile && (
                            <div
                                style={{
                                    margin: "10px 0px 0px 0px",
                                    zIndex: 1000,
                                    top: 0,
                                    left: 0,
                                    position: "absolute",
                                }}
                            >
                                <ModelSelect />
                            </div>
                        )}
                        <div
                            className="flex-1 overflow-auto lg:px-48 xl:px-[28%] mt-16 mb-30 mb-[50px] pb-[50px] px-2"
                            ref={messagesContainerRef}
                        >
                            {messages.length === 0 ? (
                                <div className="flex h-full flex-col items-center justify-center">
                                    <div className="w-full pb-2 flex justify-center">
                                        <img
                                            src={theme.button.icon.src}
                                            alt="Icon"
                                            width="100px"
                                        />
                                    </div>
                                    <h1 className="text-3xl font-semibold text-center text-primary-200 dark:text-gray-600 mt-4 mb-10 sm:mb-16">
                                        {theme.chatWindow.welcomeMessage}
                                    </h1>
                                </div>
                            ) : (
                                <>
                                    {renderConversation(messages)}
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
                                                style={{ borderRadius: "10px" }}
                                            />
                                        </div>
                                    )}
                                    {showScrollButton && (
                                        <button
                                            onClick={scrollToBottom}
                                            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 p-2 rounded-full bg-gray-200 shadow-lg"
                                            aria-label="Scroll to bottom"
                                            style={{ zIndex: 1050 }}
                                        >
                                            <MdKeyboardArrowDown size="20" />
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        <ChatSection />
                    </div>
                </div>
            </div>
        </main>
    );
};

export default withAuth(Chat, () => "/chat", ["free"]);
