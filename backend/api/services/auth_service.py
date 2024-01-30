from pydantic import BaseModel, Extra

import api.services.crypt_service as crypt_service
import api.services.jwt_service as jwt_service
import api.services.users_service as users_service
from api.database import Database
from api.exceptions import UnauthorizedError
from api.services.users_service import UserResponse


class AuthLogin(BaseModel):
    username: str
    password: str


class AuthLoginResponse(BaseModel):
    # https://fastapi.tiangolo.com/tutorial/security/simple-oauth2/
    # Required
    refresh_token: str
    access_token: str
    token_type: str = 'bearer'


class AuthRegister(BaseModel):
    name: str
    email: str
    password: str
    cellphone: str

    class Config:
        extra = Extra.forbid


def auth_login(body: AuthLogin, db: Database) -> AuthLoginResponse:
    user = users_service.user_auth(db, email=body.username)
    if not crypt_service.check_password(body.password, user.password):
        raise UnauthorizedError('Invalid credentials')
    data = {'sub': user.id, 'version': user.version}
    access_token = jwt_service.create_access_token(data)
    refresh_token = jwt_service.create_refresh_token(data)
    return AuthLoginResponse(access_token=access_token,
                             refresh_token=refresh_token)


def auth_me(db: Database, token_data: jwt_service.TokenData) -> UserResponse:
    return users_service.user_show(token_data.user_id, db)


def auth_refresh(token_data: jwt_service.TokenData) -> AuthLoginResponse:
    if token_data.type != 'refresh_token':
        raise UnauthorizedError('Invalid token type')
    user = token_data.user
    data = {'sub': user.id, 'version': user.version}
    access_token = jwt_service.create_access_token(data)
    return AuthLoginResponse(access_token=access_token,
                             refresh_token=token_data.refresh_token)
