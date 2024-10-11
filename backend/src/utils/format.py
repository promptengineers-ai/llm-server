import hashlib
from collections.abc import Mapping

def format_agent_actions(steps: list[tuple]) -> list[dict]:
    return [
        {"tool": step[0].tool, "input": step[0].tool_input, "output": step[1], "log": step[0].log}
        for step in steps
    ]
    
def flatten_array(arr) -> list:
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

def hash_string(string: str) -> str:
    return hashlib.sha256(string.encode()).hexdigest()

# Function to remove the second element from each tuple and flatten the result
def flatten_tuples(tuples_list: list[tuple]) -> list:
    # Flatten the list of tuples into a single list
    flattened_list = [element for tup in tuples_list for element in tup]
    
    return flattened_list

def flatten_dict(d, parent_key='', sep='.'):
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, Mapping):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

def find_differences(dict1, dict2):
    diffs = []
    keys = set(dict1.keys()).union(dict2.keys())  # Combine keys from both dictionaries

    for key in keys:
        if dict1.get(key) != dict2.get(key):
            diffs.append(key)
    
    return diffs