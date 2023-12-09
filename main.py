import uvicorn

from promptengineers.config import APP_ENV

if __name__ == "__main__":
	uvicorn.run("server.api:app", host="0.0.0.0", port=8000, reload=APP_ENV == "local")
