import ChatIcon from "@/components/icons/ChatIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import { IoDuplicateOutline } from "react-icons/io5";
import { useAppContext } from "@/contexts/AppContext";
import { useChatContext } from "@/contexts/ChatContext";

export default function ChatHistoryButton({ chat }: { chat: any }) {
    const { isMobile, closeDrawer } = useAppContext();
    const { deleteChat, findChat, chatPayload, setChatPayload, duplicateChat, chats } =
        useChatContext();

    // Determine the background color based on the condition
    const bgColorClass =
        chatPayload.history_id === chat.id
            ? (!isMobile()
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
                setTimeout(() => {
                    closeDrawer();
                }, 500);
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
                        duplicateChat(chat.id);
                    }}
                    title={`Duplicate Settings: ${JSON.stringify(
                        {
                            system: chats.find((c: any) => c.id === chat.id)
                                ?.system,
                            tools: chats.find((c: any) => c.id === chat.id)
                                ?.tools,
                            retrieval: chats.find((c: any) => c.id === chat.id)
                                ?.retrieval,
                        },
                        null,
                        2
                    )}`}
                >
                    <IoDuplicateOutline />
                </button>
                <button
                    className="hover:text-token-text-primary p-1 z-999"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteChat(chat.id);
                    }}
                    title="Delete chat"
                >
                    <TrashIcon />
                </button>
            </div>
        </a>
    );
}

