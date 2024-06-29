import json
from src.infrastructure.logger import logger as logging
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from typing import Union, Literal, Set
from langchain.text_splitter import (
	CharacterTextSplitter, RecursiveCharacterTextSplitter, SpacyTextSplitter,
	PythonCodeTextSplitter, MarkdownTextSplitter, NLTKTextSplitter,
	LatexTextSplitter, TokenTextSplitter, SentenceTransformersTokenTextSplitter
)

from src.config import REDIS_URL
from src.services.cache import CacheService


# Initialize a session outside of the function to use across multiple calls
session = requests.Session()

cache = CacheService(REDIS_URL) if REDIS_URL else None

async def split_docs(
	pages,
	chunk_size: int = 1000,
	chunk_overlap: int = 100,
	splitter: Union[Literal['', 'recursive', 'spacy', 'nltk', 'python', 'latex', 'markdown', 'token', 'sentence']] = 'spacy',
	task_id: str = None,
):
	## Text Spliter
	if splitter == 'recursive':
		text_splitter = RecursiveCharacterTextSplitter(
			chunk_size=chunk_size,
			chunk_overlap=chunk_overlap
		)
	elif splitter == 'spacy':
		text_splitter = SpacyTextSplitter(
			chunk_size=chunk_size,
			chunk_overlap=chunk_overlap
		)
	elif splitter == 'nltk':
		text_splitter = NLTKTextSplitter(
			chunk_size=chunk_size,
			chunk_overlap=chunk_overlap
		)
	elif splitter == 'python':
		text_splitter = PythonCodeTextSplitter(
			chunk_size=chunk_size,
			chunk_overlap=chunk_overlap
		)
	elif splitter == 'markdown':
		text_splitter = MarkdownTextSplitter(
			chunk_size=chunk_size,
			chunk_overlap=chunk_overlap
		)
	elif splitter == 'latex':
		text_splitter = LatexTextSplitter(
			chunk_size=chunk_size,
			chunk_overlap=chunk_overlap
		)
	elif splitter == 'token':
		text_splitter = TokenTextSplitter(
			chunk_size=chunk_size,
			chunk_overlap=chunk_overlap
		)
	elif splitter == 'sentence': ## Install sentence-transformers (1gb+)
		text_splitter = SentenceTransformersTokenTextSplitter(
			chunk_size=chunk_size,
			chunk_overlap=chunk_overlap
		)
	elif splitter == 'character':
		text_splitter = CharacterTextSplitter(
			chunk_size=chunk_size,
			chunk_overlap=chunk_overlap
		)
	else:
		raise ValueError(f"Invalid splitter type: {splitter}")
	
	chunks = []
	for i, page in enumerate(pages):
		docs = text_splitter.split_documents([page])
		for index, doc in enumerate(docs):
			doc.metadata['section'] = index + 1
			doc.metadata['word_count'] = len(doc.page_content.split())
			doc.metadata['character_count'] = len(doc.page_content)
			# doc.metadata['splitter'] = {
			# 	'type': splitter,
			# 	'chunk_size': chunk_size,
			# 	'chunk_overlap': chunk_overlap
			# }
			chunks.append(doc)
		# Calculate progress percentage
		progress_percentage = (i + 1) / len(pages) * 100
		logging.debug(f'[utils.retrieval.split_docs] Progress: {progress_percentage:.2f}%')
		if cache:
			await cache.publish(
				task_id, 
				json.dumps({
					'step': 'end' if i+1 == len(pages) else 'split',
					'message': f'Created {len(chunks)} chunks from {len(pages)} pages.' if i+1 == len(pages) else f'Spliting page {i+1} into chunks',
					'progress': round(progress_percentage, 2), 
					'page_number': i + 1,
					'page_count': len(pages),
					'chunk_count': len(chunks)
				})
			)
	return chunks



def fetch_links(url, depth) -> Set[str]:
    """
    Fetch links recursively up to a specified depth using a session for HTTP requests.

    :param url: The starting URL to fetch links from.
    :param depth: The depth to fetch links. Depth of 0 means only the starting URL, 1 means the starting URL and its links, etc.
    :return: A set of unique URLs found within the specified depth.
    """
    found_urls = set()
    if depth < 0:
        return found_urls

    try:
        response = session.get(url)
        if response.status_code != 200:
            return found_urls
        soup = BeautifulSoup(response.content, 'html.parser')
        links = soup.find_all('a')
        valid_extensions = ('.html', '.htm', '/')  # Include more if needed

        for link in links:
            href = link.get('href')
            if href and not href.startswith('mailto:') and not href.startswith('javascript:'):
                full_url = urljoin(url, href)
                parsed_url = urlparse(full_url)

                # Exclude fragments and files, focus on same domain only
                if parsed_url.netloc == urlparse(url).netloc and not parsed_url.fragment:
                    if parsed_url.path.endswith(valid_extensions) or '.' not in parsed_url.path.split('/')[-1]:
                        if full_url not in found_urls:
                            found_urls.add(full_url)
                            # Recurse into found URL if depth allows
                            if depth > 0:
                                found_urls |= fetch_links(full_url, depth - 1)

    except requests.RequestException as e:
        print(f"Error fetching the page: {e}")

    return found_urls