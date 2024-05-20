#!/bin/bash

echo "Starting Ollama server..."
ollama serve &

echo "Waiting for Ollama server to be active..."
while [ "$(ollama list | grep 'NAME')" == "" ]; do
  sleep 1
done

## LLaMA3
ollama pull llama3

## Embeddings
ollama pull mxbai-embed-large

# Keep the container running
touch /var/log/ollama.log
tail -f /var/log/ollama.log