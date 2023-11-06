from datetime import datetime, timedelta

from langchain.chains import LLMMathChain
from langchain.agents import Tool, tool, OpenAIFunctionsAgent, AgentExecutor
from langchain.callbacks.streaming_stdout_final_only import FinalStreamingStdOutCallbackHandler

from server.config.test import TEST_USER_ID
from server.strategies.llms import ModelContext, OpenAIStrategy
from server.repos.user import UserRepo

api_key = UserRepo().find_token(TEST_USER_ID, 'OPENAI_API_KEY')
model_service = ModelContext(strategy=OpenAIStrategy(api_key=api_key))
llm = model_service.chat(
    model_name='gpt-3.5-turbo-16k',
    temperature=0.0,
    callbacks=[FinalStreamingStdOutCallbackHandler()]
)
llm_math = LLMMathChain(llm=llm)

math_tool = Tool(
    name='Calculator',
    func=llm_math.run,
    description='Useful for when you need to answer questions about math.'
)

@tool
def get_word_length(word: str) -> int:
    """Returns the length of a word."""
    return len(word)

@tool
def fetch_start_and_end(start: str = None, end: str = None) -> tuple:
    """
    Convert start and end datetime strings to Unix timestamps in milliseconds.

    Args:
        start (str, optional): Start datetime in the format "YYYY-MM-DD HH:MM:SS". Defaults to current time.
        end (str, optional): End datetime in the same format. Defaults to one hour after start.

    Returns:
        tuple: Unix timestamps for start and end in milliseconds.
    """
    # Get the current time
    current_time = datetime.now()

    # Convert start string to datetime object
    if not start:
        start_datetime = current_time
    else:
        start_datetime = datetime.strptime(start, "%Y-%m-%d %H:%M:%S")

    # If no end time is provided, set it to one hour after start
    if not end:
        end_datetime = start_datetime + timedelta(hours=1)
    else:
        end_datetime = datetime.strptime(end, "%Y-%m-%d %H:%M:%S")

    # Convert datetime objects to Unix timestamp in milliseconds
    start_unix = int(start_datetime.timestamp() * 1000)
    end_unix = int(end_datetime.timestamp() * 1000)

    return (start_unix, end_unix)


