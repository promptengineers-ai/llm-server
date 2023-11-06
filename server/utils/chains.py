"""Utilites for Chains"""
def get_chat_history(inputs: tuple) -> str:
    """Formats the chat history into a readable format for the chatbot"""
    res = []
    for human, assistant in inputs:
        res.append(f"Human: {human}\Assistant: {assistant}")
    return "\n".join(res)

def filter_tools(keys, dictionary):
    """
    Fetches values from the dictionary based on provided keys.

    Args:
    - dictionary (dict): The source dictionary.
    - keys (list): List of keys to fetch values for.

    Returns:
    - list: List of values corresponding to the provided keys.
    """
    return [dictionary.get(key) for key in keys]