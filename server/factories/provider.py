
from server.repos.user import UserRepo
from server.utils.validation import Validator
from server.strategies.vectorstores import PineconeStrategy, RedisStrategy

validator = Validator()
user_repo = UserRepo()

class VectorSearchProviderFactory:
	@staticmethod
	def choose(
		provider: ('redis', 'pinecone'),
		user_id: str,
		index_name: str,
	):
		if provider == 'pinecone':
			required_keys = ['OPENAI_API_KEY', 'PINECONE_KEY', 'PINECONE_ENV', 'PINECONE_INDEX']
			tokens = user_repo.find_token(user_id, [*required_keys, 'PROMPTLAYER_API_KEY'])
			validator.validate_api_keys(tokens, required_keys)
			vectorstore_strategy = PineconeStrategy(
				openai_api_key=tokens.get(required_keys[0]),
				api_key=tokens.get(required_keys[1]),
				env=tokens.get(required_keys[2]),
				index_name=tokens.get(required_keys[3]),
				namespace=index_name,
			)

		if provider == 'redis':
			required_keys = ['OPENAI_API_KEY', 'REDIS_URL']
			tokens = user_repo.find_token(user_id, [*required_keys, 'PROMPTLAYER_API_KEY'])
			validator.validate_api_keys(tokens, required_keys)
			vectorstore_strategy = RedisStrategy(
				openai_api_key=tokens.get(required_keys[0]),
				redis_url=tokens.get(required_keys[1]),
				index_name=index_name,
			)
		return vectorstore_strategy