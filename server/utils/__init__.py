"""Application utilities"""
import json
import logging
from bson import ObjectId
from urllib.parse import urljoin, urlparse
import requests

from bs4 import BeautifulSoup

logger = logging.getLogger("uvicorn.error")

class JSONEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, ObjectId):
            return str(o)
        return json.JSONEncoder.default(self, o)

def retrieve_system_message(messages):
    """Retrieve the system message"""
    try:
        filtered_messages = list(filter(lambda message: message['role'] == 'system', messages))
        return filtered_messages[0]['content']
    except IndexError:
        return None

def retrieve_chat_messages(messages):
    """Retrieve the chat messages"""
    return [
        (msg["content"]) for msg in messages if msg["role"] in ["user", "assistant"]
    ]

def match_strings(keys: list[str], functions):
    """Match the strings in the keys to the functions"""
    # Initialize array to store output
    output = []

    # Loop through the functions array
    for function in functions:
        # If name property of function matches one of the strings in keys
        if function['name'] in keys:
            # Append the function to the output array
            output.append(function)

    # Return the output array
    return output

def get_links(url: str):
	response = requests.get(url, timeout=5)
	soup = BeautifulSoup(response.text, 'html.parser')
	links = []
	for link in soup.find_all('a'):
		href = link.get('href')
		if href and urlparse(href).netloc == '':
			links.append(urljoin(url, href))
	return links
