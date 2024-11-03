import { Console } from "console-feed";
import { useChatContext } from "@/contexts/ChatContext";

const ConsoleCard: React.FC = () => {
    const { logs } = useChatContext();

    return (
        <div style={{ backgroundColor: "#242424", maxHeight: "300px", overflow: "auto" }}>
            <Console
                logs={logs}
                variant="dark"
            />
        </div>
    );
};

export default ConsoleCard;
