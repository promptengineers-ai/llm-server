#!/bin/bash

echo "Connect to prod? (yes/no)"
read answer
if [ "$answer" == "yes" ]; then
    echo "Start Prod Env locally"
    echo ""
    echo ""
    ENV_FILE=.env.production
elif [ "$answer" == "no" ]; then
    ENV_FILE=.env.local
    echo "Starting Dev Server.."
else
    echo "Invalid input. Please enter 'yes' or 'no'."
fi

### Set Environment Variables
set -a # automatically export all variables
source $ENV_FILE
set +a

if [ $(git log -n1 --pretty="format:%d" | sed "s/, /\n/g" | grep tag: | sed "s/tag: \|)//g" | wc -l) -gt 0 ]; then
  export API_VERSION=$(git log -n1 --pretty="format:%d" | sed "s/, /\n/g" | grep tag: | sed "s/tag: \|)//g" | head -n1)
  echo "Tag exists: $API_VERSION"
else
  export API_VERSION=$(git rev-parse --short HEAD)
  echo "SHA exists: $API_VERSION"
fi

# Start the server with logging debug mode
uvicorn src.api:app \
--port 8080 \
--log-level debug \
--reload
