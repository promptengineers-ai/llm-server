from fastapi import APIRouter, Body, Depends, HTTPException, Response, status
from fastapi.responses import UJSONResponse

from src.middleware.auth import current_user
from src.models.tools import APITool
from src.repositories.tool import ToolRepository, tool_repo
from src.utils.exception import NotFoundException

TAG = "Tool"
router = APIRouter()

@router.get(
	"/tools", 
	tags=[TAG],
	dependencies=[Depends(current_user)], 
	responses={
		200: {
			"content": {
				"application/json": {
					"example": {
						"tools": [
							{
								"name": "Repl Tool",
								"value": "repl_tool",
								"description": "Interactive Python REPL tool.",
								"link": "/tools/repl_tool",
								"toolkit": "Basic"
							},
							{
								"name": "Csv Tool",
								"value": "csv_tool",
								"description": "Tool for processing CSV files.",
								"link": "/tools/csv_tool",
								"toolkit": "Basic"
							}
						]
					}
				}
			},
			"description": "Successful Response"
		}
	}
)
async def list_tools(repo: ToolRepository = Depends(tool_repo)):
	tools = await repo.list()
	return {"tools": tools}

@router.post(
	"/tools", 
	tags=[TAG],
	dependencies=[Depends(current_user)], 
	responses={
		200: {
			"description": "Successful Response",
			"content": {
				"application/json": {
					"example": {
						"tool": {
							"name": "Repl Tool",
							"value": "repl_tool",
							"description": "Interactive Python REPL tool.",
							"link": "/tools/repl_tool",
							"toolkit": "Basic"
						}
					}
				}
			},
		},
		409: {
			"description": "Tool already exists",
			"content": {
				"application/json": {
					"example": {
						"detail": "A tool with this name already exists for the user."
					}
				}
			}
		}
	}
)
async def create_tool( 
	tool: APITool = Body(..., example=APITool.__config__["json_schema_extra"]["example"]),
	repo: ToolRepository = Depends(tool_repo)
):
	tool = await repo.create(tool)
	return {"tool": tool}

@router.get(
	"/tools/{tool_value}", 
	tags=[TAG],
	dependencies=[Depends(current_user)],
	responses={
		200: {
			"description": "Successful Response",
			"content": {
				"application/json": {
					"example": APITool.__config__["json_schema_extra"]["examples"]['find_tool']
				}
			}
		},
		404: {
			"description": "Tool not found",
			"content": {
				"application/json": {
					"example": {
						"detail": "Tool with name {tool_value} not found."
					}
				}
			}
		}
	}
)
async def find_tool(
	tool_value: str, 
	repo: ToolRepository = Depends(tool_repo)
):
	try:
		tool = await repo.find(tool_value=tool_value)
		return UJSONResponse(content={"tool": tool}, status_code=200)
	except NotFoundException as e:
		raise HTTPException(status_code=404, detail=str(e))
	except Exception as e:
		raise HTTPException(status_code=500, detail="Internal Server Error") from e

@router.put(
	"/tools/{tool_value}", 
	tags=[TAG],
	dependencies=[Depends(current_user)],
	responses={
		200: {
			"description": "Successful Response",
			"content": {
				"application/json": {
					"example": APITool.__config__["json_schema_extra"]["examples"]['update_tool']
				}
			}
		},
		404: {
			"description": "Tool not found",
			"content": {
				"application/json": {
					"example": {
						"detail": "Tool with name {tool_value} not found."
					}
				}
			}
		}
	}
)
async def update_tool(
	tool_value: str, 
	tool: APITool = Body(..., example=APITool.__config__["json_schema_extra"]["example"]),
	repo: ToolRepository = Depends(tool_repo)
):
	try:
		tool = await repo.update(tool_value=tool_value, updates=tool)
		return {"tool": tool}
	except NotFoundException as e:
		raise HTTPException(status_code=404, detail=str(e))
	except Exception as e:
		raise HTTPException(status_code=500, detail="Internal Server Error") from e


@router.delete(
	"/tools/{tool_value}", 
	tags=[TAG], 
	dependencies=[Depends(current_user)], 
	responses={204: {"description": "Tool deleted"}}
)
async def delete_tool(tool_value: str, repo: ToolRepository = Depends(tool_repo)):
	await repo.delete(tool_value)
	return Response(status_code=status.HTTP_204_NO_CONTENT)