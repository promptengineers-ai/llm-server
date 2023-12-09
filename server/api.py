"App Entrypoint"
from fastapi import FastAPI, Request, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.templating import Jinja2Templates
from promptengineers.config import APP_NAME, APP_VERSION, APP_ORIGINS
from promptengineers.fastapi import history_router, retrieval_router, storage_router
from promptengineers.models.response import ResponseStatus
from promptengineers.utils import logger

from server.middleware.auth import AuthMiddleware
from server.routes.chat import router as chat_router

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

V1_CHAT_PREFIX = '/api/v1'
auth_middleware = AuthMiddleware()
app.include_router(
    chat_router,
    prefix=V1_CHAT_PREFIX,
    dependencies=[Depends(auth_middleware.check_auth)],
)
app.include_router(
    history_router,
    dependencies=[Depends(auth_middleware.check_auth)],
    prefix=V1_CHAT_PREFIX
)
app.include_router(
    retrieval_router,
    dependencies=[Depends(auth_middleware.check_auth)],
    prefix=V1_CHAT_PREFIX
)
app.include_router(
    storage_router,
    dependencies=[Depends(auth_middleware.check_auth)],
    prefix=V1_CHAT_PREFIX
)
