import { useChatContext } from "@/contexts/ChatContext";
import ViewImagesSection from "./ViewImageSection";
import DocumentSection from "./DocumentSection";
import CsvSection from "./CsvSection";
import ScrollToBottomButton from "../buttons/ScrollToBottomButton";
import { useAppContext } from "@/contexts/AppContext";


const MessageSection = ({ showScrollButton, scrollToBottom }: any) => {
    const { isMobile } = useAppContext();
    const {
        messages,
        renderConversation,
        selectedImage,
        setSelectedImage,
        selectedDocument,
        setSelectedDocument,
        setCsvContent,
        csvContent,
    } = useChatContext();

    return (
        <>
            {renderConversation(messages)}
            {selectedImage && (
                <ViewImagesSection
                    onClick={() => setSelectedImage(null)}
                    image={selectedImage}
                />
            )}
            {/* {isMobile() && selectedDocument && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-2 cursor-pointer"
                    style={{ zIndex: 1000 }}
                    onClick={() => setSelectedDocument(null)}
                >
                    <DocumentSection document={selectedDocument.src} />
                </div>
            )} */}
            {csvContent && (
                <CsvSection
                    onClick={() => setCsvContent(null)}
                    content={csvContent}
                />
            )}
            {showScrollButton && (
                <ScrollToBottomButton onClick={scrollToBottom} />
            )}
        </>
    );
};

export default MessageSection;