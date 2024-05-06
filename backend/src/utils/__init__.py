import logging
from .stream import token_stream
from .message import retrieve_system_message, retrieve_chat_messages
from .format import format_agent_actions

async def chain_stream(chain, messages):
        runnable = chain.astream_events(messages, version='v1')
        async for event in runnable:
            kind = event["event"]
            if kind == "on_chain_start":    
                print(event)
            elif kind == "on_chain_end":
                print(event)
            
            elif kind == "on_chat_model_start":
                print(event)
            
            elif kind == "on_chat_model_stream":
                content = event["data"]["chunk"].content
                if content:
                    yield token_stream(token=content)
            elif kind == "on_tool_start":
                key = 'input'
                yield token_stream(token=event['data'].get(key), 
                                   action_type=key,
                                   tool=event['name'])
            elif kind == "on_tool_end":
                key = 'output'
                yield token_stream(token=event['data'].get(key), 
                                   action_type=key,
                                   tool=event['name'])
            else:
                yield token_stream()

    
__all__ = [
    'token_stream',
    'retrieve_system_message',
    'retrieve_chat_messages',
    'format_agent_actions',
]