from datetime import datetime, timedelta

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel

import api.services.users_service as users_service
from api.database import Database, get_db
from api.env import settings
from api.models import User


class TokenData(BaseModel):
    user_id: str
    type: str
    user: User


JWT_ALGORITHM = 'HS256'
JWT_SECRET_KEY = settings.jwt_secret
JWT_EXPIRES_IN = settings.jwt_expires_in
JWT_REFRESH_EXPIRES_IN = settings.jwt_refresh_expires_in

oauth2_schema = OAuth2PasswordBearer(tokenUrl='/api/auth/login')


def _create_token(data: dict, milliseconds: int, typ: str) -> str:
    data['exp'] = datetime.now() + timedelta(milliseconds=milliseconds)
    data['typ'] = typ
    token = jwt.encode(data, JWT_SECRET_KEY, algorithm=JWT_ALGORITHM)
    return token


def create_access_token(data: dict) -> str:
    return _create_token(data, JWT_EXPIRES_IN, 'access_token')


def create_refresh_token(data: dict) -> str:
    return _create_token(data, JWT_REFRESH_EXPIRES_IN, 'refresh_token')


def decode_token(token: str = Depends(oauth2_schema),
                 db: Database = Depends(get_db)) -> TokenData:
    try:
        data = jwt.decode(token, JWT_SECRET_KEY, algorithms=JWT_ALGORITHM)
        user_id = data['sub']
        user = users_service.user_auth(db, user_id=user_id)
        if user.version != data.get('version'):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail='Token expired',
                headers={"WWW-Authenticate": "Bearer"},
            )
        return TokenData(user_id=user_id, user=user,
                         type=data.get('typ', 'access_token'))
    except JWTError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e),
            headers={"WWW-Authenticate": "Bearer"},
        )
