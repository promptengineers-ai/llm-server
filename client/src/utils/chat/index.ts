import marked from '../../config/marked';

export const getLastUserIndex = (messages: {role: string, content: string}[]): number => {
  for (let i = messages.length - 1; i >= 0; i--) {
    if (messages[i].role === 'user') {
      // Return the index if the object property "role" is equal to "user"
      return i;
    }
  }
  // Return -1 if no object property "role" is equal to "user"
  return -1;
};

// export function constructAssistantMessageDiv() {
//     let assistantMessageDiv = document.createElement('div');
//     assistantMessageDiv.className = 'message assistant';
//     assistantMessageDiv.style.display = 'block';

//     // Create and add the "🤖 Assistant:" message title
//     let messageTitle = document.createElement('p');
//     messageTitle.innerHTML = '🤖 Assistant:';
//     messageTitle.style.color = '#a0aec0';
//     assistantMessageDiv.appendChild(messageTitle);

//     // Create a separate <p> for the message content (left empty for now) and append it to assistantMessageDiv
//     let messageContent = document.createElement('p');
//     messageTitle.style.fontSize = '18px';
//     assistantMessageDiv.appendChild(messageContent);

//     return assistantMessageDiv;
// }

export function constructDeleteMessageButton() {
  let deleteButton = document.createElement('button');
	let icon = document.createElement('i');
	icon.className = 'bi bi-arrow-counterclockwise';
	deleteButton.appendChild(icon);
	deleteButton.className = 'delete-btn';
  return deleteButton;
}

export function constructAssistantHttpMessageDiv(message: string) {
    let assistantMessageDiv = document.createElement('div');
    assistantMessageDiv.className = 'message assistant';
    assistantMessageDiv.style.display = 'block';

    // Create and add the "🤖 Assistant:" message title
    let messageTitle = document.createElement('p');
    messageTitle.innerHTML = '🤖 Assistant:';
    messageTitle.style.color = '#a0aec0';
    messageTitle.style.fontSize = '18px';
    assistantMessageDiv.appendChild(messageTitle);

    // Create a separate <p> for the message content and set its content
    let messageContent = document.createElement('p');
    messageContent.innerHTML = message;
    assistantMessageDiv.appendChild(messageContent);

    return assistantMessageDiv;
}

export function constructAssistantMessageDiv() {
  let assistantMessageDiv = document.createElement('div');
  assistantMessageDiv.className = 'message assistant';

  // Create a container for the top row which will hold the title and toolContainer
  let topRowDiv = document.createElement('div');
  topRowDiv.style.display = 'flex';
  topRowDiv.style.alignItems = 'center';
  topRowDiv.style.justifyContent = 'space-between';
  assistantMessageDiv.appendChild(topRowDiv);

  // Create and add the "🤖 Assistant:" message title
  let messageTitle = document.createElement('p');
  messageTitle.innerHTML = '🤖 Assistant:';
  messageTitle.style.color = '#a0aec0';
  messageTitle.style.fontSize = '18px';
  messageTitle.style.margin = '0'; // Remove default margin
  topRowDiv.appendChild(messageTitle);

  // Create a container for the tool messages similar to #state-container
  let toolContainer = document.createElement('div');
  toolContainer.id = 'tool-container';  // Ensure unique ID or class if needed
  toolContainer.style.border = '1px solid #A0AEC0';
  toolContainer.style.color = '#A0AEC0';
  toolContainer.style.padding = '2px 5px';
  toolContainer.style.width = '200px';
  toolContainer.style.borderRadius = '5px';
  toolContainer.style.position = 'relative';
  assistantMessageDiv.appendChild(toolContainer);

  // Append toolContainer to the top row
  topRowDiv.appendChild(toolContainer);

  // Create a separate <p> for the message content and append it to assistantMessageDiv
  let messageContent = document.createElement('p');
  assistantMessageDiv.appendChild(messageContent);

  // Create a div for displaying the current state (similar to #state-display)
  let stateDisplay = document.createElement('div');
  stateDisplay.id = 'state-display';
  stateDisplay.textContent = 'Waiting for action...';  // Example text
  toolContainer.appendChild(stateDisplay);

  // Create a dropdown arrow (similar to #dropdown-arrow)
  let dropdownArrow = document.createElement('div');
  dropdownArrow.id = 'dropdown-arrow';
  dropdownArrow.style.cursor = 'pointer';
  dropdownArrow.style.position = 'absolute';
  dropdownArrow.style.right = '5px';
  dropdownArrow.style.top = '2px';
  dropdownArrow.textContent = '▼';
  toolContainer.appendChild(dropdownArrow);

  // Create the log section (similar to #log)
  let log = document.createElement('div');
  log.id = 'log';
  log.style.display = 'none';
  log.style.borderTop = '1px solid #ddd';
  log.style.maxHeight = '200px';
  log.style.overflowY = 'auto';
  toolContainer.appendChild(log);

  // Event listener for the dropdown arrow
  dropdownArrow.addEventListener('click', function() {
    if (log.style.display === 'none') {
      log.style.display = 'block';
    } else {
      log.style.display = 'none';
    }
  });

  return assistantMessageDiv;
}

export function constructUserMessageDiv(messages: { role: string, content: string }[]) {
  let userMessageDiv = document.createElement('div');
  userMessageDiv.className = 'message user';

  // Create and add the "👨‍💻 You:" message title
  let messageTitle = document.createElement('p');
  messageTitle.innerHTML = '👨‍💻 You:';
  messageTitle.style.color = '#0bc5ea';
  messageTitle.style.fontSize = '18px';
  userMessageDiv.appendChild(messageTitle);

  // Create a separate <p> for the parsed message content and append it to userMessageDiv
  let messageContent = document.createElement('p');
  messageContent.innerHTML = marked.parse(messages[getLastUserIndex(messages)].content);
  userMessageDiv.appendChild(messageContent);

  // Add a delete button to the user's message
  let deleteButton = constructDeleteMessageButton();

  // Add the delete button to the message div
  let messageWrapper = document.createElement('div');
  messageWrapper.className = 'message-wrapper';
  messageWrapper.appendChild(deleteButton);
  userMessageDiv.appendChild(messageWrapper);

  return userMessageDiv;
}


export function readStreamResponse(
  response: any,
  messages: {role: string, content: string}[],
  chatbox: HTMLDivElement,
  cb: (streamMessages: {role: string, content: string}[]) => void
) {
  let reader = response.body?.getReader();
  let decoder = new TextDecoder();
  let accumulator = "";
  let assistantMessage = "";
  let assistantMessageDiv = constructAssistantMessageDiv();

  reader?.read().then(function processMessage(
    {done, value}: {done: boolean, value: Uint8Array}
  ): Promise<void> {
    if (done) {
      console.log('Stream complete', messages)
      cb(messages)
      return Promise.resolve();  // return a resolved Promise
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
        let stateDisplay = assistantMessageDiv.querySelector('#state-display');
        if (stateDisplay) {
          stateDisplay.textContent = `Action(s): ${toolMessage}`;
        }
      }

      if (JSON.parse(message).type === "log") {
        let logMessage = JSON.parse(message).message;

        // Find the log div in the current assistantMessageDiv
        let logDiv = assistantMessageDiv.querySelector('#log');
        if (logDiv) {
          let logEntry = document.createElement('p');
          logEntry.textContent = logMessage;
          logDiv.appendChild(logEntry);
        }
      }

      // Push to response chunks
      if (JSON.parse(message).type === "stream") {
        let parsed = JSON.parse(message).message;
        assistantMessage += parsed;
      }

      if (JSON.parse(message).type === "end") {
        messages.push({
          role: "assistant",
          content: assistantMessage
        });
        assistantMessage = ""; // reset the assistant message for the next response
      } else {
        assistantMessageDiv.children[1].innerHTML = marked.parse(assistantMessage);
      }

      // add the assistant message to the chatbox
      chatbox.appendChild(assistantMessageDiv);

      // scroll to the bottom every time a new message is added
      chatbox.scrollTop = chatbox.scrollHeight;
    }

    // continue reading from the stream
    return (reader?.read().then(processMessage)) ?? Promise.resolve();
  })
}

export const filterChatHistory = (list: any[], type?: string) => {
  // If no type is provided, return the entire list
  if (!type) {
    return list;
  }

  let filteredList = [];

  switch (type) {
    case 'agent':
      filteredList = list.filter((item) => item.tools.length > 0);
      break;
    case 'vectorstore':
      filteredList = list.filter((item) => item.vectorstore);
      break;
    default:
      filteredList = list.filter((item) => (item.tools.length === 0 && !item.vectorstore));
      break;
  }

  return filteredList;
};