from enum import Enum
from pydantic import BaseModel, Field, field_validator
from typing import Optional, Any, Union, Literal, List, Annotated

from src.config.llm import ACCEPTED_EMBEDDING_MODELS, Embedding, ModelType

class ListingType(str, Enum):
	FOR_SALE = 'for_sale'
	FOR_RENT = 'for_rent'
	PENDING = 'pending'
	SOLD = 'sold'

class Harvest(BaseModel):
	location: str
	listing_type: str = ListingType.FOR_SALE
	mls_only: Optional[bool] = True
	past_days: Optional[int] = 30
	radius: Optional[int] = 20
	
class MemoryType(str, Enum):
	CONVERSATION_KG = 'conversation_kg'
	AGENT_TOKEN_BUFFER = 'agent_token_buffer'
	
class SearchProvider(str, Enum):
	PINECONE = 'pinecone'
	REDIS = 'redis'
	MONGO = 'mongo'
	POSTGRES = 'postgres'
	FAISS = 'faiss'
	
class Splitter(BaseModel):
	type: Union[str, None] = None
	chunk_size: int = 1000
	chunk_overlap: int = 100
 
class Metadata(BaseModel):
	source: str
	page: int
	section: int
	word_count: int
	character_count: int

class Document(BaseModel):
	page_content: str
	metadata: Any
	type: str = Field(default="Document", alias="type")
	
class UrlLoaderType(str, Enum):
	GITBOOK = 'gitbook'
	WEB_PAGE = 'web_base'
	WEBSITE = 'website'
	YOUTUBE = 'yt'
	SITEMAP = 'sitemap'
	URLS = 'urls'
	COPY = 'copy'
	ETHEREUM = 'ethereum'
	POLYGON = 'polygon'


class FileLoaderType(str, Enum):
	TEXT = 'txt'
	HTML = 'html'
	MARKDOWN = 'md'
	CSV = 'csv'
	PDF = 'pdf'

class FetchDocuments(BaseModel):
	task_id: str
	loaders: List[Any]
	splitter: Splitter
 
class UpsertDocuments(BaseModel):
	task_id: str
	provider: Union[Literal['pinecone', 'redis', 'postgres']] = Field(...)
	index_name: str = Field(...)
	embedding: Annotated[str, Field(...)]
	documents: List[Document] = Field(...)
	batch_size: int = 32
	parallel: bool = False
	workers: int = 4
 
	@field_validator('embedding')
	def check_embedding_model(cls, v):
		if v not in ACCEPTED_EMBEDDING_MODELS:
			raise ValueError(f"Embedding model must be one of {ACCEPTED_EMBEDDING_MODELS}")
		return v
	
class SearchType(str, Enum):
	SIMILARITY = 'similarity'
	SIMILARITY_SCORE_THRESHOLD = 'similarity_score_threshold'
	MMR = 'mmr'

class SearchKwargs(BaseModel):
	k: Optional[int] = 5
	fetch_k: Optional[int] = None
	score_threshold: Optional[float] = None
	lambda_mult: Optional[float] = None
	filter: Optional[dict] = None
	
class RetrievalTool(BaseModel):
	vectorstore: Any
	search_type: SearchType = SearchType.SIMILARITY
	search_kwargs: SearchKwargs
	
class RetrievalParams(BaseModel):
	provider: SearchProvider = SearchProvider.POSTGRES
	embedding: Embedding = Embedding.TEXT_EMBED_3_SMALL
	index_name: str
	search_type: SearchType
	search_kwargs: SearchKwargs
	
class Chat(BaseModel):
	streaming: bool = False
	memory: str = MemoryType.CONVERSATION_KG
	model: str = ModelType.OPENAI_GPT_3_5_TURBO_16K
	system: str = None
	messages: list
	
	__config__ = {
		"json_schema_extra": {
			"example": {
				"streaming": False,
				"memory": MemoryType.CONVERSATION_KG,
				"model": ModelType.OPENAI_GPT_3_5_TURBO_16K,
				"system": None,
				"messages": [
					{"role": "system", "content": "You are a helpful assistant."},
					{"role": "user", "content": 'Who won the 2001 world series?'},
					{"role": "assistant", "content": 'The arizona diamondbacks won the 2001 world series.'},
					{
						"role": "user", 
						"content": 'Who were the pitchers?',
						"images": [
							"https://raw.githubusercontent.com/langchain-ai/langchain/master/docs/static/img/langchain_stack.png"
						]
					},
				]
			}
		}
	}
	
class Retrieval(Chat):
	retrieval: RetrievalParams
	
	__config__ = {
		"json_schema_extra": {
			"example": {
				"streaming": False,
				"memory": MemoryType.CONVERSATION_KG,
				"model": ModelType.OPENAI_GPT_3_5_TURBO_16K,
				"messages": [
					{"role": "system", "content": "You are a helpful assistant."},
					{"role": "user", "content": 'Who won the 2001 world series?'},
					{"role": "assistant", "content": 'The arizona diamondbacks won the 2001 world series.'},
					{
						"role": "user", 
						"content": 'Who were the pitchers?',
						"images": [
							"https://raw.githubusercontent.com/langchain-ai/langchain/master/docs/static/img/langchain_stack.png"
						]
					},
				],
				"retrieval": {
					"provider": SearchProvider.PINECONE,
					"embedding": Embedding.TEXT_EMBED_3_SMALL,
					"index_name": "",
					"search_type": SearchType.SIMILARITY,
					"search_kwargs": {
						"k": 10,
						"fetch_k": 20,
						"score_threshold": 0.9,
						"lambda_mult": 0.25,
						"filter": {'paper_title':'GPT-4 Technical Report'}
					}
				}
			}
		}
	}
	
class Agent(Chat):
	tools: Optional[List[str]] = None
	retrieval: Optional[RetrievalParams] = None
	
	__config__ = {
		"json_schema_extra": {
			"example": {
				"streaming": False,
				"memory": MemoryType.CONVERSATION_KG,
				"model": ModelType.OPENAI_GPT_3_5_TURBO_16K,
				"messages": [
					{"role": "system", "content": "You are a helpful assistant."},
					{"role": "user", "content": 'Who won the 2001 world series?'},
					{"role": "assistant", "content": 'The arizona diamondbacks won the 2001 world series.'},
					{
						"role": "user", 
						"content": 'Who were the pitchers?',
						"images": [
							"https://raw.githubusercontent.com/langchain-ai/langchain/master/docs/static/img/langchain_stack.png"
						]
					},
				],
				"tools": ["repl_tool", "csv_tool"],
				"retrieval": {
					"provider": SearchProvider.REDIS,
					"embedding": Embedding.TEXT_EMBED_3_SMALL,
					"index_name": "",
					"search_type": SearchType.SIMILARITY,
					"search_kwargs": {
						"k": 10,
						"fetch_k": 20,
						"score_threshold": 0.9,
						"lambda_mult": 0.25,
						"filter": {'paper_title':'GPT-4 Technical Report'}
					}
				}
			}
		}
	}
 
 
class PostgresPut(BaseModel):
	index_name: str
	new_index_name: str
 
	__config__ = {
		"json_schema_extra": {
			"example": {
				"index_name": "6901622865",
				"new_index_name": "my-new-index-name"
			}
   		}
  	}
 
class PostgresDelete(BaseModel):
	index_name: str
 
	__config__ = {
		"json_schema_extra": {
			"example": {
				"index_name": "my-new-index-name"
			}
   		}
  	}