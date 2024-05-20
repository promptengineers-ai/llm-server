"use client";
import ToggleThemeButton from "@/components/buttons/ToggleThemeButton";
import TopNav from "@/components/nav/TopNav";
import ChatSection from "@/components/sections/ChatSection";
import ModelSection from "@/components/sections/ModelSection";
import SideSection from "@/components/sections/SideSection";
import ModelSelect from "@/components/selects/ModelSelect";
import theme from "@/config/theme";
import { useAppContext } from "@/contexts/AppContext";
import { useChatContext } from "@/contexts/ChatContext";
import { withAuth } from "@/middleware/AuthMiddleware";
import {
    useState,
    useEffect,
    useRef,
    AwaitedReactNode,
    JSXElementConstructor,
    Key,
    ReactElement,
    ReactNode,
    ReactPortal,
} from "react";
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
    const {
        messages,
        renderConversation,
        selectedImage,
        setSelectedImage,
        fetchChats,
        selectedDocument,
        setSelectedDocument,
        setCsvContent,
        csvContent,
    } = useChatContext();
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
                <div className="relative h-full w-full flex-1 overflow-auto transition-width">
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
                            className={`flex-1 overflow-auto px-2 mt-16 lg:px-48 xl:px-[27%] pb-[40px] md:pb-[30px] ${
                                isMobile && "mb-[50px]"
                            }`}
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
                                    <h1 className="text-3xl font-semibold text-center text-primary-200 dark:text-gray-600 mt-4 mb-64 sm:mb-16">
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
                                    {/* {selectedDocument && (
                                        <div
                                            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4"
                                            style={{ zIndex: 1000 }}
                                            onClick={() =>
                                                setSelectedDocument(null)
                                            }
                                        >
                                            <iframe
                                                src={selectedDocument}
                                                title="Selected Document"
                                                className="max-w-full max-h-full"
                                                style={{
                                                    border: "none",
                                                    borderRadius: "10px",
                                                }}
                                            ></iframe>
                                        </div>
                                    )} */}
                                    {selectedDocument && (
                                        <div
                                            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 cursor-pointer"
                                            style={{ zIndex: 1000 }}
                                            onClick={() =>
                                                setSelectedDocument(null)
                                            }
                                        >
                                            <iframe
                                                src={selectedDocument}
                                                // sandbox=""
                                                title="Selected Document"
                                                className="w-full h-5/6 md:w-3/4 md:h-3/4"
                                                style={{
                                                    background: "#fff", // Ensure white background for text files
                                                    border: "none",
                                                    borderRadius: "10px",
                                                }}
                                            ></iframe>
                                        </div>
                                    )}
                                    {csvContent && (
                                        <div
                                            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 cursor-pointer"
                                            style={{ zIndex: 1000 }}
                                            onClick={() => setCsvContent(null)}
                                        >
                                            <div className="bg-white rounded-lg max-w-full h-5/6 overflow-auto">
                                                <table className="table-auto w-full border-collapse border border-gray-400 text-sm">
                                                    <thead>
                                                        <tr>
                                                            {csvContent[0].map(
                                                                (
                                                                    header: string,
                                                                    index: number
                                                                ) => (
                                                                    <th
                                                                        key={
                                                                            index
                                                                        }
                                                                        className="border border-gray-300 px-1 py-0.5"
                                                                    >
                                                                        {header}
                                                                    </th>
                                                                )
                                                            )}
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        {csvContent
                                                            .slice(1)
                                                            .map(
                                                                (
                                                                    row: any,
                                                                    rowIndex: number
                                                                ) => (
                                                                    <tr
                                                                        key={
                                                                            rowIndex
                                                                        }
                                                                    >
                                                                        {row.map(
                                                                            (
                                                                                cell: any,
                                                                                cellIndex: number
                                                                            ) => (
                                                                                <td
                                                                                    key={
                                                                                        cellIndex
                                                                                    }
                                                                                    className="border border-gray-300 px-1 py-0.5"
                                                                                >
                                                                                    {
                                                                                        cell
                                                                                    }
                                                                                </td>
                                                                            )
                                                                        )}
                                                                    </tr>
                                                                )
                                                            )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    )}
                                    {showScrollButton && (
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={scrollToBottom}
                                                className="fixed bottom-24 p-2 rounded-full bg-gray-200 shadow-lg z-30"
                                                aria-label="Scroll to bottom"
                                            >
                                                <MdKeyboardArrowDown size="20" />
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                        <div
                            style={
                                isMobile ? mobileFixedBottomStyle : undefined
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
