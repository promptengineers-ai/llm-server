from fastapi import FastAPI, Depends, HTTPException, status, Request
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from server.config.test import TEST_USER_ID

app = FastAPI()
security = HTTPBasic()

# Simple in-memory user database
users_db = {
    "admin": "password",
    "user": "password"
}

def get_current_user(request: Request, credentials: HTTPBasicCredentials = Depends(security)):
    user = users_db.get(credentials.username)
    if user is None or user != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials",
            headers={"WWW-Authenticate": "Basic"},
        )
    else:
        request.state.user_id = TEST_USER_ID
        return request
