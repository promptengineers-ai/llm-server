const boxShadowChatWindow = "0px 12px 24px rgba(0, 0, 0, 0.1)";
const boxShadowChatWindowButton = "0px 2px 4px rgba(0, 0, 0, 0.1)";
const primaryColor = "#f0f0f0";
const secondaryColor = "#e0e0e0";
const tertiaryColor = "#ffffff";

// Use import.meta.env instead of process.env
const logo = import.meta.env.VITE_LOGO_URL || "/icons/512.png";

export default {
    button: {
        backgroundColor: primaryColor,
        border: "none",
        borderRadius: "50%",
        width: "60px",
        height: "60px",
        position: "fixed",
        bottom: "20px",
        right: "20px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        cursor: "pointer",
        boxShadow: boxShadowChatWindowButton,
        hoverColor: secondaryColor,
        icon: {
            src: logo,
            height: "35px",
            width: "35px",
            borderRadius: "50%",
        },
    },
    chatWindow: {
        welcomeMessage: "How can I help you today?",
        placeholderText: "Type your message...",
        position: [
            "bottom-right",
            "bottom-left",
            "top-right",
            "top-left",
        ],
        height: "500px",
        width: "340px",
        bottom: "85px",
        right: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#ffffff",
        boxShadow: boxShadowChatWindow,
        borderRadius: "8px",
        padding: "10px",
        controlButton: {
            backgroundColor: "#f0f0f0",
            border: "none",
            borderRadius: "20%",
            width: "30px",
            height: "30px",
            hoverColor: "#e0e0e0",
            boxShadow: boxShadowChatWindowButton,
            color: "black",
        },
        icon: {
            src: logo,
            height: "100px",
            width: "100px",
            borderRadius: "10px",
        },
        gridButton: {
            padding: "10px",
            color: "black",
            borderRadius: "2px",
            border: "none",
            backgroundColor: "#f0f0f0",
            hoverColor: "#e0e0e0",
            boxShadow: boxShadowChatWindowButton,
        },
        userMessage: {
            backgroundColor: primaryColor,
            textColor: "#000",
            showAvatar: true,
            avatarSrc:
                "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png",
        },
        botMessage: {
            backgroundColor: tertiaryColor,
            textColor: "#000",
            showAvatar: true,
            avatarSrc:
                "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/parroticon.png",
        }
    }
};
