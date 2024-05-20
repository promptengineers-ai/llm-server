#!/bin/bash
set -e

# Run migrations
alembic upgrade head

# Start the API
uvicorn src.api:app --host 0.0.0.0