from src.db.redis import RedisDB
from src.db.pinecone import PineconeDB
from src.config import retrieve_defaults
from src.utils.validation import Validator

validator = Validator()

##############################################################
### Retrieve Pinecone Indexes
##############################################################
def retrieve_pinecone_vectorstores(user_id, tokens: dict = None):
		## Get Tokens
		keys = ['PINECONE_API_KEY', 'PINECONE_ENV', 'PINECONE_INDEX']
		if not tokens:
			tokens = retrieve_defaults(keys)
		## Check for token, else throw error
		validator.validate_api_keys(tokens, keys)
		## Get Vectorstores
		pinecone_service = PineconeDB(
			api_key=tokens.get('PINECONE_API_KEY'),
			env=tokens.get('PINECONE_ENV'),
			index_name=tokens.get('PINECONE_INDEX'),
		)
		index_stats = pinecone_service.describe_index_stats()
		namespaces = index_stats.get('namespaces')

		# String to be removed
		remove_str = f"{user_id}::"

		# Trimming and including only the keys that were trimmed
		trimmed_namespaces = {key.replace(remove_str, ''): value for key, value in namespaces.items() if remove_str in key}

		return {'indexes': list(trimmed_namespaces.keys())}
  
##############################################################
### Delete Pinecone Indexes
##############################################################
def delete_pinecone_index(user_id: str, prefix: str, tokens: dict = None):
	## Get Tokens
	keys = ['PINECONE_API_KEY', 'PINECONE_ENV', 'PINECONE_INDEX']
	if not tokens:
		tokens = retrieve_defaults(keys)
	## Check for token, else throw error
	validator.validate_api_keys(tokens, keys)
	## Delete Vectorstore
	pinecone_service = PineconeDB(
		api_key=tokens.get('PINECONE_API_KEY'),
		env=tokens.get('PINECONE_ENV'),
		index_name=tokens.get('PINECONE_INDEX'),
	)
	deleted = pinecone_service.delete(namespace=f"{user_id}::{prefix}")
	if deleted:
		return True
	else:
		return False
	
##############################################################
### Retrieve Redis Indexes
##############################################################
def retrieve_redis_indexes(user_id: str, tokens: dict = None):
    ## Get Tokens
    keys = ['REDIS_URL']
    if not tokens:
        tokens = retrieve_defaults(keys)
    ## Check for token, else throw error
    validator.validate_api_keys(tokens, keys)
    ## Get Vectorstores
    redis_service = RedisDB(redis_url=tokens.get('REDIS_URL'))
    index_stats = redis_service.list_indexes()
    
    # Prefix to be matched and removed
    match_str = f"{user_id}::"

    # Filter indexes that start with the user_id prefix and remove the prefix
    filtered_indexes = [index[len(match_str):] for index in index_stats if index.startswith(match_str)]
 
    return {'indexes': filtered_indexes}

##############################################################
### Delete Pinecone Vectorstore
##############################################################
def delete_redis_vectorstore(user_id: str, prefix: str, tokens: dict = None):
	## Get Tokens
	keys = ['REDIS_URL']
	if not tokens:
		tokens = retrieve_defaults(keys)
	## Check for token, else throw error
	validator.validate_api_keys(tokens, keys)
	## Delete Vectorstore
	redis_service = RedisDB(redis_url=tokens.get('REDIS_URL'))
	deleted = redis_service.delete(index_name=f"{user_id}::{prefix}")
	if deleted:
		return True
	else:
		return False	