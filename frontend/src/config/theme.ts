const primaryColor = undefined;
const secondaryColor = "#6f42c1";
const tertiaryColor = undefined;

const boxShadow = "0 2px 4px rgba(0, 0, 0, 0.2)";
const boxShadowChatWindow = "0 4px 10px rgba(0, 0, 0, 0.2)";
const boxShadowChatWindowButton = "0 1px 2px rgba(0, 0, 0, 0.2)";

const logo = process.env.NEXT_PUBLIC_LOGO_URL || "/icons/512.png";

const theme = {
    button: {
        backgroundColor: primaryColor,
        hoverColor: secondaryColor,
        padding: "2px",
        borderRadius: "8px",
        height: "50px",
        width: "50px",
        bottom: "20px",
        position: "right",
        boxShadow: boxShadow,
        icon: {
            src: logo,
            fontSize: "30px",
            color: "white",
            width: "50px",
            height: "50px",
            borderRadius: "8px",
        },
    },
    chatWindow: {
        title: "Prompt Engineers AI",
        titleAvatarSrc:
            "https://raw.githubusercontent.com/walkxcode/dashboard-icons/main/svg/google-messages.svg",
        welcomeMessage:
            process.env.NEXT_PUBLIC_WELCOME_MESSAGE ||
            "Prompt Engineers AI",
        welcomeButtons: [
            {
                label: "Website",
                href: "https://promptengineers.ai",
            },
            {
                label: "Slack Channel",
                href: "https://promptengineersai.slack.com/join/shared_invite/zt-21upjsftv-gX~gNjTCU~2HfbeM_ZwTEQ#/shared-invite/email",
            },
            {
                label: "Github",
                href: "https://github.com/promptengineers-ai",
            },
            {
                label: "Documentation",
                href: "https://prompt-engineers.gitbook.io/documentation",
            },
            {
                label: "Youtube",
                href: "https://www.youtube.com/@promptengineersai",
            },
            {
                label: "Meetups",
                href: "https://www.meetup.com/plano-prompt-engineers",
            },
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
        },
        chatInput: {
            placeholder: "Type your question here...",
            backgroundColor: "#ffffff",
            textColor: "#303235",
            fontSize: "14px",
            spinner: {
                backgroundColor: primaryColor,
                height: "25px",
                width: "25px",
                margin: "0px 4px",
                strokeWidth: "5",
            },
        },
        submitButton: {
            backgroundColor: primaryColor,
            hoverColor: secondaryColor,
            padding: "3px 5px 0px 0px",
        },
    },
};

export default theme;
