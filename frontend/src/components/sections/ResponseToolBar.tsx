import CopyIcon from "@/components/icons/CopyIcon";
import RegenerateIcon from "@/components/icons/RegenerateIcon";
import ThumbDownIcon from "@/components/icons/ThumbDownIcon";
import { useChatContext } from "@/contexts/ChatContext";
import { Message } from "@/types/chat";

const ResponseToolBar = ({ conversationItem, index }: { conversationItem: Message, index: number }) => {
    const { handleRegenerateClick } = useChatContext();

    return (
        <div className="cursor-pointer mt-2 flex items-center gap-3">
            <div
                className="flex items-center justify-center"
                onClick={() => {
                    const textToCopy =
                        conversationItem.content || "No content to copy";
                    navigator.clipboard
                        .writeText(textToCopy)
                        .then(() => {
                            alert("Copied to clipboard!");
                        })
                        .catch((err) => {
                            console.error("Failed to copy: ", err);
                        });
                }}
            >
                <CopyIcon />
            </div>
            <div
                className="flex items-center justify-center"
                onClick={() => handleRegenerateClick(index)}
            >
                <RegenerateIcon />
            </div>
            <div
                className="flex items-center justify-center"
                onClick={() => alert("Will downvote")}
            >
                <ThumbDownIcon />
            </div>
            {conversationItem.model && (
                <div className="flex items-center justify-center bg-black text-white px-1 rounded">
                    <small>{conversationItem.model}</small>
                </div>
            )}
        </div>
    );
};

export default ResponseToolBar;
