import os

# Path to the vector store
APP_ENV = os.getenv("APP_ENV", 'development')
APP_NAME = os.getenv("APP_NAME", 'Prompt Engineers AI - API Server')
APP_SECRET = os.getenv("APP_SECRET", '')
APP_VERSION = os.getenv("APP_VERSION", '')
APP_ORIGINS = os.getenv("APP_ORIGINS", '*')

# OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", '')
## Ollama URL
OLLAMA_BASE_URL= os.getenv("OLLAMA_BASE_URL", 'http://localhost:11434')

# Database Connections
MONGO_CONNECTION = os.getenv("MONGO_CONNECTION")
REDIS_URL = os.getenv("REDIS_URL", 'redis://localhost:6379/0')

# S3 Bucket Credentials
BUCKET = os.getenv("BUCKET", 'precision-x')
S3_REGION = os.getenv("S3_REGION", 'us-east-1')
ACCESS_KEY_ID = os.getenv("ACCESS_KEY_ID", '')
ACCESS_SECRET_KEY = os.getenv("ACCESS_SECRET_KEY", '')
MINIO_SERVER = os.getenv("MINIO_SERVER", '')

# Pinecone Credentials
PINECONE_KEY = os.getenv("PINECONE_KEY", '')
PINECONE_ENV = os.getenv("PINECONE_ENV", '')
PINECONE_INDEX = os.getenv("PINECONE_INDEX", '')

# Blockchain Credentials
ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY", '')
MY_NEW_VAR = os.getenv("MY_NEW_VAR", '')
