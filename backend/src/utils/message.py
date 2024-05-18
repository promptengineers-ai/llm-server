from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

from src.config.llm import ACCEPTED_MULTIMODAL_MODELS

def retrieve_system_message(messages, use_class=False):
    """Retrieve the system message"""
    try:
        # Filter messages to find those with 'system' role
        filtered_messages = list(filter(lambda message: message['role'] == 'system', messages))
        # Return as SystemMessage object or content based on use_class
        return SystemMessage(content=filtered_messages[0]['content']) if use_class else filtered_messages[0]['content']
    except IndexError:
        return None
    
# def retrieve_chat_messages(messages):
#     """Retrieve the chat messages"""
#     return [
#         (msg["content"]) for msg in messages if msg["role"] in ["user", "assistant"]
#     ]

def _move_system_to_front(messages):
    """Move system messages to the front of the message list."""
    system_messages = [msg for msg in messages if msg['role'] == 'system']
    non_system_messages = [msg for msg in messages if msg['role'] != 'system']
    return system_messages + non_system_messages

def retrieve_chat_messages(body, use_class=False):
    """Retrieve chat messages and wrap them in HumanMessage or AIMessage based on the sender."""
    messages = _move_system_to_front(body.messages)
    result = []

    for msg in messages:
        content_list = []  # This will hold all content items (text and image)

        # Capture text content directly
        if 'content' in msg:
            content_list.append({"type": "text", "text": msg["content"]})

        # Capture images if present in the message
        if 'images' in msg and isinstance(msg['images'], list) and len(msg['images']) > 0:
            if body.model not in ACCEPTED_MULTIMODAL_MODELS:
                raise ValueError(f"Model {body.model} does not support images.")
            for img in msg['images']:
                if body.model.startswith('ollama'):
                    content_list.append({
                        "type": "image_url",
                        "image_url": img
                    })
                else:
                    content_list.append({
                        "type": "image_url",
                        "image_url": {
                            "url": img,
                            "detail": "auto"
                        }
                    })

        # Create message object based on role and append to result
        if content_list:
            content = " ".join([c["text"] for c in content_list if c["type"] == "text"])
            if msg["role"] == "system":
                if use_class:
                    result.append(SystemMessage(content))
                else:
                    result.append(('system', content))
            elif msg["role"] == "user":
                if use_class:
                    result.append(HumanMessage(content))
                else:
                    result.append(('human', content))
            elif msg["role"] == "assistant":
                if use_class:
                    result.append(AIMessage(content))
                else:
                    result.append(('ai', content))

    return result


