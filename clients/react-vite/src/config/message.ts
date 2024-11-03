import defaultTheme from "./theme";

const messageTitleMargin = "0";

export const userMessageStyle = (theme?: any) => {
    return {
        backgroundColor:
            theme?.chatWindow?.userMessage?.backgroundColor ||
            defaultTheme.chatWindow.userMessage.backgroundColor,
        borderRadius: "5px",
        color:
            theme?.chatWindow?.userMessage?.textColor ||
            defaultTheme.chatWindow.userMessage.textColor,
        padding: "5px 10px",
        fontSize: "14px",
        marginBottom: "5px",
    };
};

export const assistMessageStyle = (theme?: any) => {
    return {
        backgroundColor:
            theme?.chatWindow?.botMessage?.backgroundColor ||
            defaultTheme.chatWindow.botMessage.backgroundColor,
        color:
            theme?.chatWindow?.botMessage?.textColor ||
            defaultTheme.chatWindow.botMessage.textColor,
        borderRadius: "5px",
        padding: "5px 10px",
        fontSize: "14px",
        marginBottom: "5px",
    };
};

export const topRowDivStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
};

export const userMessageTitleStyle = {
    fontSize: "18px",
    fontWeight: 600,
    margin: "5px 0px",
};

export const assistantMessageTitleStyle = {
    fontSize: "18px",
    fontWeight: 600,
    margin: "5px 0px",
};

export const docLinkStyle = {
    display: "inline-block",
    border: "1px solid #A0AEC0",
    marginRight: "10px",
    padding: "2px",
    fontSize: "12px",
    borderRadius: "5px",
    cursor: "pointer",
};

export const tooltipLinkStyle = {
    display: "block",
    margin: "5px 0",
    textDecoration: "underline",
};

export const tooltipStyle = {
    visibility: "hidden",
    position: "absolute",
    backgroundColor: "#000",
    color: "#fff",
    padding: "5px",
    borderRadius: "5px",
    zIndex: "1",
    whiteSpace: "normal",
    maxWidth: "300px",
    fontSize: "12px",
    overflowY: "auto",
    maxHeight: "200px",
    marginTop: "15px",
};

export const docContentStyle = {
    maxWidth: "200px",
    overflow: "hidden",
    textOverflow: "ellipsis",
};
