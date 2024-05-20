#!/bin/bash
set -e

# Run migrations
alembic upgrade head

# # Seed the database
# python3 -m src.seeds.users 3

# Start the API
uvicorn src.api:app --host 0.0.0.0