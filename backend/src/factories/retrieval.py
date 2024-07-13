from typing import Dict

from src.db.strategies import PineconeStrategy, PostgresStrategy, RedisStrategy, VectorStoreStrategy

class RetrievalFactory:
    def __init__(
        self,
        provider: str,
        embeddings,
        provider_keys: Dict[str, str]
    ):
        """
        A factory for creating vector store strategies based on the given provider.

        :param provider: The name of the provider ('pinecone' or 'redis').
        :param embeddings: The embeddings to be used in the strategy.
        :param provider_keys: A dictionary containing the keys for the provider configuration.
        """
        self.provider = provider
        self.embeddings = embeddings
        self.provider_keys = provider_keys
        self._validate_provider_keys()

    def create_strategy(self) -> VectorStoreStrategy:
        """
        Creates and returns the appropriate strategy object based on the provider.

        :return: An instance of PineconeStrategy or RedisStrategy.
        :raises ValueError: If the provider is not supported.
        """
        if self.provider == 'pinecone':
            return self._create_pinecone_strategy()
        elif self.provider == 'redis':
            return self._create_redis_strategy()
        elif self.provider == 'postgres':
            return self._create_postgres_strategy()
        else:
            raise ValueError(f"Invalid index provider: {self.provider}")

    def _create_pinecone_strategy(self) -> PineconeStrategy:
        """ Creates a PineconeStrategy with the appropriate configuration. """
        return PineconeStrategy(
            embeddings=self.embeddings,
            api_key=self.provider_keys['api_key'],
            env=self.provider_keys['env'],
            index_name=self.provider_keys['index_name'],
            namespace=self.provider_keys['namespace'],
        )

    def _create_redis_strategy(self) -> RedisStrategy:
        """ Creates a RedisStrategy with the appropriate configuration. """
        return RedisStrategy(
            redis_url=self.provider_keys.get('redis_url', 'redis://redis:6379/0'),
            index_name=self.provider_keys['index_name'],
            embeddings=self.embeddings,
        )
        
    def _create_postgres_strategy(self) -> RedisStrategy:
        """ Creates a PostgresStrategy with the appropriate configuration. """
        return PostgresStrategy(
            connection=self.provider_keys.get('connection'),
            collection_name=self.provider_keys.get('collection_name'),
            embeddings=self.embeddings,
        )

    def _validate_provider_keys(self):
        """
        Validates that all required keys are present for the configured provider.
        :raises KeyError: If any required key is missing.
        """
        required_keys = {
            'pinecone': ['api_key', 'env', 'index_name', 'namespace'],
            'redis': ['redis_url', 'index_name'],
            'postgres': ['connection', 'collection_name'],
        }

        if self.provider not in required_keys:
            raise ValueError(f"Unsupported provider: {self.provider}")

        missing_keys = [
            key for key in required_keys[self.provider] 
            if key not in self.provider_keys
        ]

        if missing_keys:
            raise KeyError(
                f"Missing keys for provider '{self.provider}': {', '.join(missing_keys)}"
            )