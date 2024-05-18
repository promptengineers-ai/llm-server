import json
import logging

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
        logging.debug('[utils.stream.token_stream] End: %s', str(data))
    elif action_type == 'tool':
        data = {
            'sender': 'assistant',
            'message': token,
            'type': 'tool'
        }
        logging.debug('[utils.stream.token_stream] Action: %s', str(data))
    elif action_type == 'input':
        data = {
            'sender': 'assistant',
            'message': token,
            'type': 'input',
            'tool': tool,
        }
        logging.debug('[utils.stream.token_stream] Input: %s', str(data))
    elif action_type == 'output':
        data = {
            'sender': 'assistant',
            'message': token,
            'type': 'output',
            'tool': tool,
        }
        logging.debug('[utils.stream.token_stream] Output: %s', str(data))
    elif action_type == 'doc':
        data = {
            'sender': 'assistant',
            'message': token,
            'type': 'doc'
        }
        logging.debug('[utils.stream.token_stream] Document: %s', str(data))
    elif action_type == 'log':
        data = {
            'sender': 'assistant',
            'message': token,
            'type': 'log'
        }
        logging.debug('[utils.stream.token_stream] Log: %s', str(data))
    else:
        data = {
            'sender': 'assistant',
            'message': token,
            'type': 'stream'
        }
        logging.debug('[utils.stream.token_stream] Token: %s', str(data))
    return f"data: {json.dumps(data)}\n\n"