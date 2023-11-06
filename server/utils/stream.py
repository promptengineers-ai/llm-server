"""Stream Utils"""
from typing import Awaitable
import asyncio
import ujson
import openai

from fastapi.responses import StreamingResponse

from server.utils import logger


async def wrap_done(fn_name: Awaitable, event: asyncio.Event):
    """Wrap an awaitable with a event to signal when it's done or an exception is raised."""
    try:
        await fn_name
    except asyncio.CancelledError:
        pass
    except openai.error.APIError as error:
        print(f"Caught API error: {error}")
    finally:
        # Signal the aiter to stop.
        event.set()

def token_stream(token: str):
    """ Use server-sent-events to stream the response"""
    data = {
		'sender': 'assistant',
		'message': token,
		'type': 'stream'
    }
    logger.debug('[utils.stream.token_stream] Stream: %s', str(data))
    return f"data: {ujson.dumps(data)}\n\n"

def end_stream():
    """Send the end of the stream"""
    end_content = {
		'sender': 'assistant',
		'message': "",
		'type': 'end'
    }
    logger.debug('[stream.utils.end_stream] End: %s', str(end_content))
    return f"data: {ujson.dumps(end_content)}\n\n"

async def handle_streaming_response(stream, stream_type):
    return StreamingResponse(
        stream,
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "Content-Type": stream_type,
        },
    )