from typing import Union

from promptengineers.config.test import TEST_USER_ID
from promptengineers.config import (OPENAI_API_KEY, ACCESS_KEY_ID, ACCESS_SECRET_KEY, BUCKET,
                            PINECONE_ENV, PINECONE_INDEX, PINECONE_KEY, ALCHEMY_API_KEY,
                            APP_SECRET, MONGO_CONNECTION, REDIS_URL, OLLAMA_BASE_URL, DB_NAME)
from promptengineers.utils.security import decrypt

LEGACY_KEY_NAME = 'keys'
NEW_KEY_NAME = 'env'

class UserRepo:
    def __init__(self) -> None:
        pass

    def find(self, user_id: str = None):
        if user_id == TEST_USER_ID:
            return {
                'data': {
                    'env': {
                        'OPENAI_API_KEY': OPENAI_API_KEY,
                        'ACCESS_KEY_ID': ACCESS_KEY_ID,
                        'ACCESS_SECRET_KEY': ACCESS_SECRET_KEY,
                        'BUCKET': BUCKET,
                        'PINECONE_KEY': PINECONE_KEY,
                        'PINECONE_ENV': PINECONE_ENV,
                        'PINECONE_INDEX': PINECONE_INDEX,
                        'ALCHEMY_API_KEY': ALCHEMY_API_KEY,
                        'MONGO_CONNECTION': MONGO_CONNECTION,
                        'DB_NAME': DB_NAME,
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
        legacy: bool = False,
    ):
        user = self.find(user_id)

        # Use the first set of conditions if datagrid is None
        if not legacy:
            keys = user.get('data', {}).get(NEW_KEY_NAME, {})

            if isinstance(token_names, str):
                token_value = keys.get(token_names)
                should_decrypt = True if APP_SECRET else False
                return decrypt(token_value) if should_decrypt else token_value
            else:
                return {
                    token_name: (decrypt(keys[token_name]) if APP_SECRET else keys[token_name])
                    for token_name in token_names if token_name in keys
                }

        # Use the second set of conditions if datagrid is provided
        else:
            keys = user.get('data').get(LEGACY_KEY_NAME)
            data = list(filter(lambda x: x != {}, keys))

            if isinstance(token_names, str):
                for item in data:
                    if token_names == item.get('key'):
                        return decrypt(item.get('value'))
            else:
                tokens = {}
                for item in data:
                    key = item.get('key')
                    if key in token_names:
                        tokens[key] = decrypt(item.get('value'))
                return tokens
