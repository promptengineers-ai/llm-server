"App Entrypoint"
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates

from server.config import APP_VERSION, APP_NAME, APP_ORIGINS
from server.models.response import ResponseStatus
from server.routes.chat import router as chat_router
from server.routes.chat.history import router as history_router
from server.routes.vectorstores import router as vectorstore_router
from server.routes.files import router as file_router
from server.utils import logger

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION or "v0.0.0",
)
templates = Jinja2Templates(directory="static")
app.add_middleware(
    CORSMiddleware,
    allow_origins=APP_ORIGINS.split(','),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

#######################################################################
###  Pages
#######################################################################
@app.get("/", tags=["Pages"], include_in_schema=False)
async def home(request: Request):
    """Serves the index page."""
    return templates.TemplateResponse(
        "pages/index.html",
        {"request": request, "current_page": "home"}
    )

#######################################################################
###  Status Endpoints
#######################################################################
@app.get("/status", tags=["Status"], response_model=ResponseStatus)
async def get_application_version():
    """Check the application status."""
    try:
        return {"version": APP_VERSION}
    except Exception as err:
        logger.exception(err)
        raise HTTPException(
            status_code=500,
            detail="Internal Server Error"
        ) from err

app.include_router(chat_router)
app.include_router(history_router)
app.include_router(vectorstore_router)
app.include_router(file_router)
