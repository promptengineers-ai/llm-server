#!/bin/bash
set -e

SERVICE="api"

# Build the service
docker-compose build $SERVICE

# Stop the service if it is running
docker-compose stop $SERVICE

# Start the service without its dependencies
docker-compose up -d --no-deps $SERVICE
