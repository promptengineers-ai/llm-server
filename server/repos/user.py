from typing import Union

from server.config.test import TEST_USER_ID
from server.config import (OPENAI_API_KEY, ACCESS_KEY_ID, ACCESS_SECRET_KEY, BUCKET,
                            PINECONE_ENV, PINECONE_INDEX, PINECONE_KEY, ALCHEMY_API_KEY,
                            APP_SECRET, MONGO_CONNECTION, REDIS_URL, OLLAMA_BASE_URL)
from server.utils.security import decrypt

class UserRepo:
    def __init__(self) -> None:
        pass

    def find(self, user_id: str = None):
        if user_id == TEST_USER_ID:
            return {
                'data': {
                    'keys': {
                        'OPENAI_API_KEY': OPENAI_API_KEY,
                        'ACCESS_KEY_ID': ACCESS_KEY_ID,
                        'ACCESS_SECRET_KEY': ACCESS_SECRET_KEY,
                        'BUCKET': BUCKET,
                        'PINECONE_KEY': PINECONE_KEY,
                        'PINECONE_ENV': PINECONE_ENV,
                        'PINECONE_INDEX': PINECONE_INDEX,
                        'ALCHEMY_API_KEY': ALCHEMY_API_KEY,
                        'MONGO_CONNECTION': MONGO_CONNECTION,
                        'REDIS_URL': REDIS_URL,
                        'OLLAMA_BASE_URL': OLLAMA_BASE_URL,
                    },
                },
            }

    ##################################################
    ## Find API Token
    ##################################################
    def find_token(
        self,
        user_id: str,
        token_names: Union[str, list],
        should_decrypt: bool = True if APP_SECRET else False
    ):
        user = self.find(user_id)
        keys = user.get('data', {}).get('keys', {})

        if isinstance(token_names, str):
            token_value = keys.get(token_names)
            return decrypt(token_value) if should_decrypt else token_value
        else:
            return {
                token_name: (decrypt(keys[token_name]) if should_decrypt else keys[token_name])
                for token_name in token_names if token_name in keys
            }
