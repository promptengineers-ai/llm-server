import ChatIcon from "@/components/icons/ChatIcon";
import EditIcon from "@/components/icons/EditIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import { useAppContext } from "@/contexts/AppContext";
import { useChatContext } from "@/contexts/ChatContext";

export default function ChatHistoryButton({ chat }: { chat: any }) {
    const { isMobile } = useAppContext();
    const { deleteChat, findChat, chatPayload, setChatPayload } = useChatContext();

    // Determine the background color based on the condition
    const bgColorClass =
        chatPayload.history_id === chat.id
            ? (isMobile()
                ? "bg-black text-white"
                : "bg-white text-black")
            : "hover:bg-gray-100 dark:hover:bg-gray-800";

    return (
        <a
            href="#"
            onClick={(e) => {
                e.preventDefault();
                findChat(chat.id);
                setChatPayload({
                    ...chatPayload,
                    history_id: chat.id,
                });
            }}
            className={`group relative flex items-center gap-3 rounded-md p-3 pr-14 ${bgColorClass}`}
        >
            <ChatIcon />
            <div className="relative max-h-5 flex-1 overflow-hidden text-ellipsis break-all text-secondary-100">
                {chat.messages.slice(-1)[0].content}
                <div className="absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-primary-800 dark:from-primary-800" />
            </div>
            <div className="visible absolute right-1 z-10 flex">
                <button
                    className="hover:text-token-text-primary p-1"
                    onClick={(e) => {
                        e.stopPropagation();
                    }}
                >
                    <EditIcon />
                </button>
                <button
                    className="hover:text-token-text-primary p-1 z-999"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                    }}
                >
                    <TrashIcon />
                </button>
            </div>
        </a>
    );
}

