#!/bin/bash
set -e

# Ensure the SQLite database file has the correct permissions
chown -R appuser:appuser /app/data

# Run migrations
alembic upgrade head

# Start the API with multiple Uvicorn workers
exec uvicorn src.api:app --host 0.0.0.0 --workers 2