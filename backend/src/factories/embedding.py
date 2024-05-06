
from typing import Any

from langchain_openai import OpenAIEmbeddings
from langchain_community.embeddings import OllamaEmbeddings

from src.config.llm import ACCEPTED_OLLAMA_MODELS, ACCEPTED_OPENAI_MODELS

class EmbeddingFactory:
    def __init__(self, llm: str, token: str = None, base_url: str = None):
        """
        Initializes the EmbeddingFactory with specified parameters.

        :param llm: The language model to use for embeddings.
        :param token: The API token for accessing the language model service.
        :param base_url: The base URL for the language model service.
        :raises ValueError: If the language model is not supported.
        """
        if llm not in ACCEPTED_OPENAI_MODELS and llm not in ACCEPTED_OLLAMA_MODELS:
            raise ValueError(f"Invalid embedding model {llm}")

        self.llm = llm
        self.token = token
        self.base_url = base_url

    def create_embedding(self) -> Any:
        """
        Creates and returns an embeddings instance based on the stored language model.

        :return: An instance of OpenAIEmbeddings or OllamaEmbeddings.
        """
        return self._create_embedding(self.llm, self.token, self.base_url)

    @staticmethod
    def _create_embedding(llm: str, token: str, base_url: str) -> Any:
        """
        Creates and returns an embeddings instance based on the specified language model.

        :param llm: The language model to use for embeddings.
        :param token: The API token for accessing the language model service.
        :param base_url: The base URL for the language model service.
        :return: An instance of OpenAIEmbeddings or OllamaEmbeddings.
        :raises ValueError: If the language model is not supported.
        """
        if llm in ACCEPTED_OPENAI_MODELS:
            return OpenAIEmbeddings(openai_api_key=token, disallowed_special=())
        elif llm in ACCEPTED_OLLAMA_MODELS:
            return OllamaEmbeddings(base_url=base_url or 'http://127.0.0.1:11434')
        else:
            raise ValueError(f"Invalid embedding model {llm}")

    @classmethod
    def create_for_model(cls, llm: str, token: str = None, base_url: str = None) -> Any:
        """
        Creates and returns an embeddings instance for a specified language model.

        :param llm: The language model to use for embeddings.
        :param token: The API token for accessing the language model service.
        :param base_url: The base URL for the language model service.
        :return: An instance of OpenAIEmbeddings or OllamaEmbeddings.
        :raises ValueError: If the language model is not supported.
        """
        return cls._create_embedding(llm, token, base_url)
					 