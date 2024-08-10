#!/bin/bash

### Set Environment Variables
set -a # automatically export all variables
source .env
set +a

# Default action to 'up'
ACTION=${1:-up}

# Handle 'up' and 'down' actions
if [ "$ACTION" == "up" ]; then
  alembic upgrade head
elif [ "$ACTION" == "down" ]; then
  alembic downgrade -1
else
  echo "Unknown action: $ACTION"
  echo "Usage: ./migrate.sh [up|down]"
  exit 1
fi