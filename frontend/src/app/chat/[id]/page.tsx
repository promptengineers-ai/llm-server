"use client";
import TopNav from "@/components/nav/TopNav";
import ChatSection from "@/components/sections/ChatSection";
import SideSection from "@/components/sections/SideSection";
import ModelSelect from "@/components/selects/ModelSelect";
import { useChatContext } from "@/contexts/ChatContext";
import { withAuth } from "@/middleware/AuthMiddleware";
import { useState, useEffect, useRef } from "react";
import {
    MdOutlineArrowBackIosNew,
    MdOutlineArrowForwardIos,
} from "react-icons/md";
import HomeSection from "@/components/sections/HomeSection";
import MessageSection from "@/components/sections/MessageSection";
import DocumentSection from "@/components/sections/DocumentSection";
import { useAppContext } from "@/contexts/AppContext";

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

const mobileFixedBottomStyle: React.CSSProperties = {
    position: "fixed",
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
};

const Chat = () => {
    const messagesContainerRef = useRef<null | HTMLDivElement>(null);
    const [isUserScrolledUp, setIsUserScrolledUp] = useState(false);
    const [showScrollButton, setShowScrollButton] = useState(false);
    const { isOpen, setIsOpen } = useDefaultOpenState();
    const { isMobile } = useAppContext();
    const { messages, fetchChats, expand, selectedDocument } = useChatContext();

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
                // behavior: "smooth",
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

    useEffect(() => {
        fetchChats();
    }, []);

    return (
        <main className="overflow w-full h-svh relative flex z-0">
            <SideSection isOpen={isOpen} />
            {!isMobile() ? (
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
            {!isMobile() && expand && selectedDocument && (
                <div className="w-4/6 flex flex-col">
                    <DocumentSection
                        expand={true}
                        document={selectedDocument.src}
                        style={{ background: "#fff" }}
                    />
                </div>
            )}
            <div
                className={
                    expand && selectedDocument
                        ? "w-2/6 flex flex-col"
                        : "relative flex h-full max-w-full flex-1 flex-col overflow-hidden"
                }
            >
                <div className="relative h-full w-full flex-1 overflow-auto transition-width">
                    <div
                        role="presentation"
                        className="flex h-full flex-col position-relative"
                    >
                        {!isMobile() && (
                            <div
                                style={{
                                    margin: `10px 0px 0px ${
                                        expand ? "10px" : "0px"
                                    }`,
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
                            className={`flex-1 overflow-auto px-2 mt-16 ${
                                !expand && "lg:px-48 xl:px-[27%]"
                            } pb-[40px] md:pb-[30px] ${
                                isMobile() && "mb-[50px]"
                            }`}
                            ref={messagesContainerRef}
                        >
                            {messages.length === 0 ? (
                                <HomeSection />
                            ) : (
                                <MessageSection
                                    showScrollButton={showScrollButton}
                                    scrollToBottom={scrollToBottom}
                                />
                            )}
                        </div>
                        <div
                            style={
                                isMobile() ? mobileFixedBottomStyle : undefined
                            }
                        >
                            <ChatSection />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default withAuth(Chat, () => "/chat", ["free"]);
