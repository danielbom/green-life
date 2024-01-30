from fastapi import APIRouter, Depends
from fastapi.security import OAuth2PasswordRequestForm

import api.services.auth_service as auth_service
import api.services.jwt_service as jwt_service
from api.database import Database, get_db
from api.services.auth_service import AuthLoginResponse, UserResponse
from api.services.jwt_service import TokenData

router = APIRouter(prefix='/auth', tags=['Auth'])


@router.post('/login')
def auth_login(body: OAuth2PasswordRequestForm = Depends(),
               db: Database = Depends(get_db)) -> AuthLoginResponse:
    return auth_service.auth_login(body, db)


@router.get('/me')
def auth_me(db: Database = Depends(get_db),
            token_data: TokenData = Depends(jwt_service.decode_token)) -> UserResponse:
    return auth_service.auth_me(db, token_data)


@router.post('/refresh')
def auth_refresh(
    token_data: TokenData = Depends(jwt_service.decode_token)
) -> AuthLoginResponse:
    return auth_service.auth_refresh(token_data)
