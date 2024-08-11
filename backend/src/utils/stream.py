import json
from src.infrastructure.logger import logger as logging

def token_stream(
    token: str or dict = None,  # type: ignore
    action_type: str = None, 
    tool: str = None,
    redactions: list[str] = [],
):
    if redactions:
        for redaction in redactions:
            if redaction in token:
                token = token.replace(redaction, 'REDACTED')
    
    """ Use server-sent-events to stream the response"""
    if not token and not action_type:
        data = {
            'sender': 'assistant',
            'message': "",
            'type': 'end'
        }
        logging.debug(f'[utils.stream.token_stream] End: {str(data)}')
    elif action_type == 'tool':
        data = {
            'sender': 'assistant',
            'message': token,
            'type': 'tool'
        }
        logging.debug(f'[utils.stream.token_stream] Action: {str(data)}')
    elif action_type == 'input':
        data = {
            'sender': 'assistant',
            'message': token,
            'type': 'input',
            'tool': tool,
        }
        logging.debug(f'[utils.stream.token_stream] Input: {str(data)}')
    elif action_type == 'output':
        data = {
            'sender': 'assistant',
            'message': token,
            'type': 'output',
            'tool': tool,
        }
        logging.debug(f'[utils.stream.token_stream] Output: {str(data)}')
    elif action_type == 'doc':
        data = {
            'sender': 'assistant',
            'message': token,
            'type': 'doc'
        }
        logging.debug(f'[utils.stream.token_stream] Document: {str(data)}')
    elif action_type == 'log':
        data = {
            'sender': 'assistant',
            'message': token,
            'type': 'log'
        }
        logging.debug(f'[utils.stream.token_stream] Log: {str(data)}')
    else:
        data = {
            'sender': 'assistant',
            'message': token,
            'type': 'stream'
        }
        logging.debug(f'[utils.stream.token_stream] Token: {str(data)}')
    return f"data: {json.dumps(data)}\n\n"