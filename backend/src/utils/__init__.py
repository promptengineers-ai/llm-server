from .stream import token_stream
from .message import retrieve_system_message, retrieve_chat_messages
from .format import format_agent_actions
from langchain_core.runnables import Runnable

async def chain_stream(chain: Runnable, query, config: dict = {}):
    if isinstance(query, dict):
        runnable = chain.astream(query, config=config)
        async for event in runnable:
            if event.get('context', []):
                documents = list(map(lambda x: dict(x), event['context']))
                yield token_stream(token=documents, action_type='doc')
            if event.get('answer', None):
                content = event.get('answer', None)
                if content:
                    yield token_stream(token=content)
        yield token_stream()
    else:
        runnable = chain.astream_events(query, config=config, version='v1')
        async for event in runnable:
            kind = event["event"]
            # print(kind)
            if kind == "on_chat_model_start":
                print(event)
            elif kind == "on_chat_model_stream":
                content = event["data"]["chunk"].content
                if content:
                    yield token_stream(token=content)
            elif kind == "on_chat_model_end":
            #     print(event)
                pass
            elif kind == "on_chain_start":    
                # print(event)
                pass
            elif kind == "on_chain_stream":
                # print(event)
                pass
            elif kind == "on_chain_end":
                yield token_stream()
            elif kind == "on_retriever_start":
                # print(event)
                pass
            elif kind == "on_prompt_start":
                # print(event)
                pass
            elif kind == "on_prompt_end":
                # print(event)
                pass
            elif kind == "on_parser_start":
                # print(event)
                pass
            elif kind == "on_parser_stream":
                # print(event)
                pass
            elif kind == "on_parser_end":
                # print(event)
                pass
            elif kind == "on_retriever_end":
                # print(event)
                pass
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