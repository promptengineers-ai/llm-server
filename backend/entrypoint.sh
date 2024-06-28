#!/bin/bash
set -e

# Run migrations
alembic upgrade head

# Start the API with multiple Uvicorn workers
exec uvicorn src.api:app --host 0.0.0.0 --port 8000