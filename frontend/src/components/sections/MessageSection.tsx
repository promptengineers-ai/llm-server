import { useChatContext } from "@/contexts/ChatContext";
import ViewImagesSection from "./ViewImageSection";
import DocumentSection from "./DocumentSection";
import CsvSection from "./CsvSection";
import ScrollToBottomButton from "../buttons/ScrollToBottomButton";


const MessageSection = ({ showScrollButton, scrollToBottom }: any) => {
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
            {selectedDocument && (
                <DocumentSection
                    onClick={() => setSelectedDocument(null)}
                    document={selectedDocument}
                />
            )}
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