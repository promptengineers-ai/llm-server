import uvicorn
import asyncio

from src.config import APP_ENV, APP_WORKERS

if __name__ == "__main__":
	uvicorn.run("src.api:app", port=8080, reload=APP_ENV == "local", workers=APP_WORKERS)
