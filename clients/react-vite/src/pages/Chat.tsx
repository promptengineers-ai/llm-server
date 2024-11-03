import TopNav from "@/components/nav/TopNav";
import ChatSection from "@/components/sections/ChatSection";
import SideSection from "@/components/sections/SideSection";
import { useChatContext } from "@/contexts/ChatContext";
import { withAuth } from "@/middleware/AuthMiddleware";
import { useState, useEffect } from "react";
import { MdOutlineArrowBackIosNew, MdOutlineArrowForwardIos } from "react-icons/md";
import HomeSection from "@/components/sections/HomeSection";
import MessageSection from "@/components/sections/MessageSection";
import DocumentSection from "@/components/sections/DocumentSection";
import { useAppContext } from "@/contexts/AppContext";
import CustomizeModal from "@/components/dialog/CustomizeModal";
import { FaTools } from "react-icons/fa";
import WebLoaderModal from "@/components/dialog/WebLoaderModal";

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

function Chat() {
    const { isOpen, setIsOpen } = useDefaultOpenState();
    const { messages, selectedConversation } = useChatContext();
    const { isDrawerOpen } = useAppContext();

    return (
        <div className="flex h-screen flex-col">
            <TopNav />
            
            <div className="flex flex-1 overflow-hidden pt-[57px]">
                {/* Side Panel */}
                <SideSection isOpen={false} />

                {/* Main Content */}
                <main className={`flex-1 overflow-hidden transition-all duration-200 ${isDrawerOpen ? 'md:pl-64' : ''}`}>
                    <div className="relative h-full w-full transition-width">
                        {messages.length === 0 && !selectedConversation ? (
                            <HomeSection />
                        ) : (
                            <div className="flex h-full flex-col">
                                <MessageSection />
                                <ChatSection />
                            </div>
                        )}
                    </div>
                </main>

                {/* Document Panel */}
                {isOpen && <DocumentSection />}
            </div>

            {/* Modals */}
            <CustomizeModal />
            <WebLoaderModal />
        </div>
    );
}

export default withAuth(Chat); 