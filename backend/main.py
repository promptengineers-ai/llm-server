import uvicorn
import asyncio

from src.config import APP_ENV

if __name__ == "__main__":
	uvicorn.run("src.api:app", host="0.0.0.0", port=8080, reload=APP_ENV == "local")
