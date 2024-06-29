import logging
from fastapi import HTTPException, Security, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError

from src.config import APP_SECRET, APP_ALGORITHM

auth_scheme = HTTPBearer()

def current_user(
    request: Request,  # Add the request parameter
    token: HTTPAuthorizationCredentials = Security(auth_scheme)
):
    try:
        # Decode the received token
        if not APP_SECRET:
            raise HTTPException(status_code=500, detail="env variable APP_SECRET is not set")
        
        payload = jwt.decode(token.credentials, APP_SECRET, algorithms=[APP_ALGORITHM])
        user_id = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=403, detail="Invalid JWT token")
        
        request.state.user_id = user_id
        request.state.user = payload
    except JWTError as e:
        logging.error("JWT Error: %s", e)
        raise HTTPException(status_code=403, detail="Invalid JWT token")

