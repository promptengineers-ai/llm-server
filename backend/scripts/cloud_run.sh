#!/bin/bash

set -a # automatically export all variables
source .env
set +a


echo "Starting Cloud Run Server"
VARS="REDIS_URL=$REDIS_URL,DATABASE_URL=$DATABASE_URL,OPENAI_API_KEY=$OPENAI_API_KEY,GROQ_API_KEY=$GROQ_API_KEY,ANTHROPIC_API_KEY=$ANTHROPIC_API_KEY"

gcloud run deploy llm-server \
    --image docker.io/promptengineers/llm-server:5526505 \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --set-env-vars $VARS