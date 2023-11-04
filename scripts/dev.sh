#!/bin/bash

# Check if .env.local exists; if it does, default to it, otherwise default to .env
if [ -e .env.local ]; then
    ENV_FILE=.env.local
else
    ENV_FILE=.env
fi

echo "Connect to prod? (yes/no)"
read answer
if [ "$answer" == "yes" ]; then
    echo "Start Prod Env locally"
    echo ""
    echo ""
    ENV_FILE=.env.production
elif [ "$answer" == "no" ]; then
    echo "Starting Dev Server.."
else
    echo "Invalid input. Please enter 'yes' or 'no'."
    echo "Starting with default Dev Server.."
fi

### Set Environment Variables
set -a # automatically export all variables
source $ENV_FILE
set +a

# Start the server with logging debug mode
uvicorn server.api:app \
--log-level debug \
--reload
