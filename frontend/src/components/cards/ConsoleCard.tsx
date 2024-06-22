import { Console } from "console-feed";
import { useChatContext } from "@/contexts/ChatContext";

const ConsoleCard: React.FC = () => {
    const { logs } = useChatContext();

    return (
        <div style={{ backgroundColor: "#242424" }} className="rounded-md">
            <Console
                logs={logs}
                variant="dark"
                styles={{ borderRadius: "10px" }}
            />
        </div>
    );
};

export default ConsoleCard;
