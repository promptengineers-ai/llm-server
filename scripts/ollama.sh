#!/bin/bash

docker compose -f docker-compose.ollama.yml up --build

# curl -X POST http://localhost:11434/api/pull -d '{
#   "name": "llama2"
# }'