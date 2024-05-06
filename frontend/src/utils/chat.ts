import { log } from "../utils/log";
import marked from "../config/marked";
import {
    docLinkStyle,
    tooltipStyle,
    tooltipLinkStyle,
    userMessageStyle,
    assistMessageStyle,
    userMessageTitleStyle,
    assistantMessageTitleStyle,
    docContentStyle,
} from "../config/message";
import { setStyles } from "./style";
import { Message } from "../types";

export const constructBubbleMessage = (
    sender: string,
    src?: string,
    label?: string
) => {
    const image = (src: string) => {
        return `<img src=${src} alt="${sender} avatar" />`;
    };

    if (sender === "user")
        return `${src ? image(src) : "👨‍💻 "} ${label ? label : "You:"}`;

    return `${src ? image(src) : "🤖 "} ${label ? label : "Assistant:"}`;
};

export const getLastUserIndex = (messages: Message[]): number => {
    for (let i = messages.length - 1; i >= 0; i--) {
        if (messages[i].role === "user") {
            // Return the index if the object property "role" is equal to "user"
            return i;
        }
    }
    // Return -1 if no object property "role" is equal to "user"
    return -1;
};

export function constructDeleteMessageButton() {
    let deleteButton = document.createElement("button");
    let icon = document.createElement("i");
    icon.className = "fas fa-undo";
    deleteButton.appendChild(icon);
    deleteButton.className = "delete-btn";
    return deleteButton;
}

// export function constructUserMessageDiv(messages: Message[], theme: any) {
//     let userMessageDiv = document.createElement("div");
//     userMessageDiv.className = "message user";
//     setStyles(userMessageDiv, userMessageStyle(theme));

//     // Create and add the "👨‍💻 You:" message title
//     let messageTitle = document.createElement("p");
//     messageTitle.innerHTML = constructBubbleMessage("user");
//     setStyles(messageTitle, userMessageTitleStyle);
//     userMessageDiv.appendChild(messageTitle);

//     // Create a separate <p> for the parsed message content and append it to userMessageDiv
//     let messageContent = document.createElement("p");
//     messageContent.innerHTML = marked.parse(
//         messages[getLastUserIndex(messages)].content
//     );
//     userMessageDiv.appendChild(messageContent);

//     return userMessageDiv;
// }

export function constructUserMessageDiv(messages: Message[], theme: any) {
    let userMessageDiv = document.createElement("div");
    userMessageDiv.className = "message user";
    setStyles(userMessageDiv, userMessageStyle(theme));

    // Create and add the "👨‍💻 You:" message title
    let messageTitle = document.createElement("p");
    messageTitle.innerHTML = constructBubbleMessage("user");
    setStyles(messageTitle, userMessageTitleStyle);
    userMessageDiv.appendChild(messageTitle);

    // Create a separate <p> for the parsed message content and append it to userMessageDiv
    let messageContent = document.createElement("p");
    const lastUserMessage = messages[getLastUserIndex(messages)];
    messageContent.innerHTML = marked.parse(lastUserMessage.content);
    userMessageDiv.appendChild(messageContent);

    // Create a container for images
    let imagesContainer = document.createElement("div");
    setStyles(imagesContainer, {
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        gap: "10px",
    });

    // Iterate through base64 image strings and append as img elements
    lastUserMessage.images?.forEach((base64Image) => {
        let img = document.createElement("img");
        img.src = base64Image;
        setStyles(img, { maxWidth: "350px", maxHeight: '450px' }); // Adjust size as necessary
        imagesContainer.appendChild(img);
    });

    userMessageDiv.appendChild(imagesContainer);

    return userMessageDiv;
}

export function constructAssistantMessageDiv(theme: any) {
    let assistantMessageDiv = document.createElement("div");
    assistantMessageDiv.className = "message assistant";
    setStyles(assistantMessageDiv, assistMessageStyle(theme));

    // Create a container for the top row which will hold the title and toolContainer
    let topRowDiv = document.createElement("div");
    setStyles(topRowDiv, assistantMessageTitleStyle);
    assistantMessageDiv.appendChild(topRowDiv);

    // Create and add the "🤖 Assistant:" message title
    let messageTitle = document.createElement("p");
    messageTitle.innerHTML = constructBubbleMessage("assistant");
    setStyles(messageTitle, assistantMessageTitleStyle);
    topRowDiv.appendChild(messageTitle);

    // Create a separate <p> for the message content and append it to assistantMessageDiv
    let messageContent = document.createElement("p");
    assistantMessageDiv.appendChild(messageContent);

    let spinner = constructSpinner();
    spinner.style.display = "none"; // hide the spinner initially
    assistantMessageDiv.appendChild(spinner);

    return { assistantMessageDiv, spinner };
}

export function constructSpinner() {
    let spinnerContainer = document.createElement("div");
    spinnerContainer.className = "spinner-container"; // Use this class to style the container
    spinnerContainer.style.display = "flex";
    spinnerContainer.style.alignItems = "center";

    let spinner = document.createElement("div");
    spinner.className = "spinner";
    spinnerContainer.appendChild(spinner); // Add spinner to the container

    let processingText = document.createElement("span");
    processingText.className = "processing-text"; // Use this class to style the text
    processingText.textContent = "Processing...";
    spinnerContainer.appendChild(processingText); // Add text to the container

    return spinnerContainer; // Return the container with spinner and text
}

export function readStreamResponse(
    response: any,
    messages: Message[],
    chatbox: HTMLDivElement,
    assistantMessageDiv: HTMLElement, // Now it's passed as a parameter
    spinner: HTMLElement, // Now it's passed as a parameter
    cb: (streamMessages: Message[]) => void
) {
    let reader = response.body?.getReader();
    let decoder = new TextDecoder();
    let accumulator = "";
    let assistantMessage = "";

    reader
        ?.read()
        .then(function processMessage({
            done,
            value,
        }: {
            done: boolean;
            value: Uint8Array;
        }): Promise<void> {
            if (done) {
                log("utils.chat.readStreamResponse", messages, "Messages");
                cb(messages);
                localStorage.setItem("chatbox", chatbox.innerHTML);
                localStorage.setItem("messages", JSON.stringify(messages));
                spinner.remove(); // remove spinner when stream is complete
                return Promise.resolve(); // return a resolved Promise
            }

            // Once the first chunk of data is received or the stream is complete
            if (spinner) {
                spinner.style.display = "none"; // Hide the spinner
            }

            // add the new data to the accumulator
            accumulator += decoder.decode(value);

            // while there are complete messages in the accumulator, process them
            let newlineIndex;
            while ((newlineIndex = accumulator.indexOf("\n\n")) >= 0) {
                let message = accumulator.slice(0, newlineIndex);
                accumulator = accumulator.slice(newlineIndex + 2);

                if (message.startsWith("data: ")) {
                    message = message.slice(6);
                }

                // append the message to the DOM
                console.log(JSON.parse(message));

                if (JSON.parse(message).type === "tool") {
                    let toolMessage = JSON.parse(message).message;

                    // Find the state display in the current assistantMessageDiv
                    let stateDisplay =
                        assistantMessageDiv.querySelector("#state-display");
                    if (stateDisplay) {
                        stateDisplay.textContent = `Action(s): ${toolMessage}`;
                    }
                }

                if (JSON.parse(message).type === "log") {
                    let logMessage = JSON.parse(message).message;

                    // Find the log div in the current assistantMessageDiv
                    let logDiv = assistantMessageDiv.querySelector("#log");
                    if (logDiv) {
                        let logEntry = document.createElement("p");
                        logEntry.textContent = JSON.stringify(logMessage);
                        logDiv.appendChild(logEntry);
                    }
                }

                if (JSON.parse(message).type === "doc") {
                    let docMessage = JSON.parse(message).message;
                    let sourceURL = docMessage.metadata?.source?.replace(
                        "rtdocs/",
                        "http://"
                    );

                    // Find the docs container in the current assistantMessageDiv
                    let docsContainer =
                        assistantMessageDiv.querySelector("#docs-container");
                    if (docsContainer) {
                        // Create a link for each doc message
                        let docLink = document.createElement("a");
                        setStyles(docLink, docLinkStyle);

                        // Create a tooltip for the link
                        let tooltip = document.createElement("span");

                        // Create an anchor tag instead of a button
                        let tooltipLink = document.createElement("a");
                        setStyles(tooltipLink, tooltipLinkStyle);
                        tooltipLink.textContent = "View Document";
                        tooltipLink.href = sourceURL;
                        tooltipLink.target = "_blank";

                        // Append the button to the tooltip before setting its innerHTML with the content
                        tooltip.appendChild(tooltipLink);
                        tooltip.innerHTML += marked.parse(
                            docMessage.page_content
                        );

                        // Tooltip styles
                        setStyles(tooltip, tooltipStyle);

                        // Show the tooltip on hover
                        docLink.addEventListener("click", function (e) {
                            e.stopPropagation(); // Prevent the click from propagating to the document

                            // Toggle visibility
                            if (tooltip.style.visibility === "visible") {
                                tooltip.style.visibility = "hidden";
                            } else {
                                // Positioning the tooltip
                                const linkRect = this.getBoundingClientRect();
                                tooltip.style.left = `${
                                    linkRect.left + window.scrollX
                                }px`;
                                tooltip.style.top = `${
                                    linkRect.bottom + window.scrollY + 10
                                }px`;

                                // Append to body and show
                                document.body.appendChild(tooltip);
                                tooltip.style.visibility = "visible";
                            }
                        });

                        // Hide the tooltip on mouseout
                        document.addEventListener("click", function (e) {
                            const target = e.target as HTMLElement;
                            if (
                                tooltip.style.visibility === "visible" &&
                                !tooltip.contains(target)
                            ) {
                                tooltip.style.visibility = "hidden";
                                // Optionally remove the tooltip from the body to clean up
                                document.body.removeChild(tooltip);
                            }
                        });

                        // Append the tooltip to the link
                        docLink.appendChild(tooltip);

                        // Parse and set the doc message content
                        let docContent = document.createElement("p");
                        let title =
                            docMessage.metadata?.title ||
                            docMessage.page_content.slice(0, 20);
                        docContent.textContent = title;
                        setStyles(docContent, docContentStyle);
                        docLink.appendChild(docContent);

                        // Append the doc link to the docs container
                        docsContainer.appendChild(docLink);
                    }
                }

                // Push to response chunks
                if (JSON.parse(message).type === "stream") {
                    let parsed = JSON.parse(message).message;
                    assistantMessage += parsed;
                }

                if (JSON.parse(message).type === "end") {
                    if (assistantMessage) {
                        messages.push({
                            role: "assistant",
                            content: assistantMessage,
                        });
                    }
                    assistantMessage = ""; // reset the assistant message for the next response
                } else {
                    assistantMessageDiv.children[1].innerHTML =
                        marked.parse(assistantMessage);
                }

                // add the assistant message to the chatbox
                chatbox.appendChild(assistantMessageDiv);

                // scroll to the bottom every time a new message is added
                chatbox.scrollTop = chatbox.scrollHeight;
            }

            // continue reading from the stream
            return reader?.read().then(processMessage) ?? Promise.resolve();
        });
}

export const filterChatHistory = (list: any[], type?: string) => {
    // If no type is provided, return the entire list
    if (!type) {
        return list;
    }

    let filteredList = [];

    switch (type) {
        case "agent":
            filteredList = list.filter((item) => item.tools.length > 0);
            break;
        case "vectorstore":
            filteredList = list.filter((item) => item.vectorstore);
            break;
        default:
            filteredList = list.filter(
                (item) => item.tools.length === 0 && !item.vectorstore
            );
            break;
    }

    return filteredList;
};
