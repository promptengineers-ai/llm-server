
def format_agent_actions(steps: list[tuple]) -> list[dict]:
    return [
        {"tool": step[0].tool, "input": step[0].tool_input, "output": step[1], "log": step[0].log}
        for step in steps
    ]
    
def flatten_array(arr):
    result = []
    for item in arr:
        # Check if the item is a list and has more than one element
        if isinstance(item, list) and len(item) > 1:
            # Extend the result list with the elements of the item
            result.extend(item)
        else:
            # Append the item itself if it doesn't meet the criteria
            result.append(item)
    return result