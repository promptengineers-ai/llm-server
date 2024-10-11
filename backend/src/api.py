"""Application entry point."""
from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from pathlib import Path

from src.middleware.auth import current_user
from src.models import Harvest
from src.routes.status import router as status_router
from src.routes.user import router as user_router
from src.routes.tool import router as tool_router
from src.routes.chat import router as chat_router
from src.routes.index import router as index_router
from src.routes.retrieval import router as retrieval_router
from src.routes.storage import router as storage_router
from src.services import ClientService

app = FastAPI(
    title="Prompt Engineers AI - LLM server", 
    version="0.0.1", 
    description="<a href='https://github.com/promptengineers-ai/llm-server' target='_blank'>Github</a>",
)
app.add_middleware(
	CORSMiddleware,
	allow_origins=["*"],
	allow_credentials=True,
	allow_methods=["*"],
	allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(status_router)
app.include_router(prefix='/api/v1', dependencies=[Depends(current_user)], router=tool_router)
app.include_router(prefix='/api/v1', dependencies=[Depends(current_user)], router=chat_router)
app.include_router(prefix='/api/v1', dependencies=[Depends(current_user)], router=retrieval_router)
app.include_router(prefix='/api/v1', dependencies=[Depends(current_user)], router=index_router)
app.include_router(prefix='/api/v1', dependencies=[Depends(current_user)], router=storage_router)

# Define the path to the directory containing the HTML files
static_dir = Path(__file__).parent / "static"

# Mount the static directory
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# API Landing Page
@app.get("/", response_class=HTMLResponse, include_in_schema=False)
async def read_root():
    with open(static_dir / "pages/index.html") as f:
        html_content = f.read()
    return HTMLResponse(content=html_content, status_code=200)

############################################################################
## Define the endpoints for chat with csv
############################################################################
@app.post("/homes/search", status_code=status.HTTP_201_CREATED, tags=['Homes'], include_in_schema=False)
async def create_csv(body: Harvest):
	# Instantiate your ClientService
	client_service = ClientService()
	result = await client_service.fetch_csv_file(body)
	if result["success"]:
		return result
	else:
		raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=result["message"])