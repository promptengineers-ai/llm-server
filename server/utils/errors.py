"""Utils for error handling."""

def token_not_found_message(available_tokens: dict, required_keys: list[str]):
    if available_tokens is None:
        return ', '.join(required_keys) + " not found in Env settings, please add to Account Settings -> Env and try again."
    missing_keys = [key for key in required_keys if key not in available_tokens]
    if not missing_keys:
        return ""
    return ', '.join(missing_keys) + " not found in Env settings, please add to Account Settings -> Env and try again."