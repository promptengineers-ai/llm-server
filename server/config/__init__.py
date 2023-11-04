"""Configuration files for the project."""
import os

# Path to the vector store
APP_ENV = os.getenv("APP_ENV", 'development')
APP_NAME = os.getenv("APP_NAME", 'Prompt Engineers AI - API Server')
APP_SECRET = os.getenv("APP_SECRET", '')
APP_VERSION = os.getenv("APP_VERSION", '')
APP_ORIGINS = os.getenv("APP_ORIGINS", '*')

# OpenAI API Key
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", '')

# Database Connections
MONGO_CONNECTION = os.getenv("MONGO_CONNECTION", 'mongodb://localhost:27017/test')
REDIS_URL = os.getenv("REDIS_URL", 'redis://localhost:6379/0')

# S3 Bucket Credentials
S3_ACCESS_KEY = os.getenv("S3_ACCESS_KEY", '')
S3_SECRET_KEY = os.getenv("S3_SECRET_KEY", '')
S3_BUCKET_NAME = os.getenv("S3_BUCKET_NAME", 'precision-x')

# Pinecone Credentials
PINECONE_KEY = os.getenv("PINECONE_KEY", '')
PINECONE_ENV = os.getenv("PINECONE_ENV", '')
PINECONE_INDEX = os.getenv("PINECONE_INDEX", '')

# Blockchain Credentials
ALCHEMY_API_KEY = os.getenv("ALCHEMY_API_KEY", '')
