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

def retrieve_chat_messages(body, use_class=False):
    """Retrieve chat messages and wrap them in HumanMessage or AIMessage based on the sender."""
    result = []
    for msg in body.messages:
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
            if msg["role"] == "system":
                result.append(SystemMessage(content_list))
            if msg["role"] == "user":
                result.append(HumanMessage(content_list))
            elif msg["role"] == "assistant":
                if msg.get('content'):
                    if use_class:
                        result.append(AIMessage(content_list))
                    else:
                        result.append(('ai', msg["content"]))

    return result