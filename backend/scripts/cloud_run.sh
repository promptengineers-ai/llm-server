#!/bin/bash

set -a # automatically export all variables
source .env
set +a

if [ $(git log -n1 --pretty="format:%d" | sed "s/, /\n/g" | grep tag: | sed "s/tag: \|)//g" | wc -l) -gt 0 ]; then
  export API_VERSION=$(git log -n1 --pretty="format:%d" | sed "s/, /\n/g" | grep tag: | sed "s/tag: \|)//g" | head -n1)
  echo "Tag exists: $API_VERSION"
else
  export API_VERSION=$(git rev-parse --short HEAD)
  echo "SHA exists: $API_VERSION"
fi

echo "Starting Cloud Run Server"
# Define environment variables in an array
declare -a ENV_VARS=(
    ## App
    "APP_ENV=$APP_ENV"
    "APP_VERSION=$API_VERSION"
    "APP_SECRET=$APP_SECRET"
    "APP_ADMIN_EMAIL=$APP_ADMIN_EMAIL"
    "APP_ADMIN_PASS=$APP_ADMIN_PASS"
    "APP_WORKERS=$APP_WORKERS"

    ## Database
    "DATABASE_URL=$DATABASE_URL"
    "PINECONE_API_KEY=$PINECONE_API_KEY"
    "PINECONE_ENV=$PINECONE_ENV"
    "PINECONE_INDEX=$PINECONE_INDEX"
    "REDIS_URL=$REDIS_URL"

    ## LLM
    "OPENAI_API_KEY=$OPENAI_API_KEY"
    "GROQ_API_KEY=$GROQ_API_KEY"
    "ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY"
    "AZURE_OPENAI_API_KEY=$AZURE_OPENAI_API_KEY"
    "AZURE_OPENAI_ENDPOINT=$AZURE_OPENAI_ENDPOINT"
    # "OLLAMA_BASE_URL=$OLLAMA_BASE_URL" # Commented out if not using Ollama (Requires GPU server)

    ## Storage
    "BUCKET=$BUCKET"
    "S3_REGION=$S3_REGION"
    "ACCESS_KEY_ID=$ACCESS_KEY_ID"
    "ACCESS_SECRET_KEY=$ACCESS_SECRET_KEY"
    # "MINIO_HOST=$MINIO_HOST"           # Commented out if not using Minio (Requires Minio server)
)
# Join array elements into a comma-separated string
VARS=$(IFS=,; echo "${ENV_VARS[*]}")

gcloud run deploy llm-server \
    --image docker.io/promptengineers/llm-server:$API_VERSION \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars $VARS