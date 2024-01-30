from datetime import date
from typing import Optional

from bson import ObjectId
from pydantic import BaseModel

import api.services.crypt_service as crypt_service
from api.concerns import Pagination
from api.database import Database
from api.exceptions import AlreadyExistsError, NotFoundError
from api.models import User
from api.utilities.mapper import many_model_from_mongo, model_from_mongo


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    cellphone: str


class UserStore(BaseModel):
    name: str
    email: str
    password: str
    cellphone: str


class UserUpdate(BaseModel):
    name: Optional[str]
    email: Optional[str]
    password: Optional[str]
    cellphone: Optional[str]


def user_show(user_id: str, db: Database) -> UserResponse:
    entity = db.users.find_one({"_id": ObjectId(user_id)})
    if entity is not None:
        return model_from_mongo(UserResponse, entity)
    raise NotFoundError('User not found')


def user_auth(db: Database, *,
              email: Optional[str] = None, user_id: Optional[str] = None) -> User:
    if email is not None:
        query = {"email": email}
    elif user_id is not None:
        query = {"_id": ObjectId(user_id)}
    else:
        raise ValueError('email or user_id must be set')
    entity = db.users.find_one(query)
    if entity is not None:
        return model_from_mongo(User, entity)
    raise NotFoundError('User not found')


def user_index(page: int, page_size: int,
               db: Database) -> Pagination[UserResponse]:
    entities = many_model_from_mongo(UserResponse, db.users.find(
        limit=page_size, skip=(page - 1) * page_size))
    row_count = db.users.count_documents({})
    return Pagination(entities=entities, row_count=row_count)


def user_store(user: UserStore, db: Database) -> UserResponse:
    data = user.dict()
    user_must_not_exists(db, email=data['email'])
    data['manager'] = {'start_at': date.today().isoformat()}
    data['password'] = crypt_service.hash_password(data['password'])
    entity = db.users.insert_one(data)
    entity = db.users.find_one({"_id": ObjectId(entity.inserted_id)})
    return model_from_mongo(UserResponse, entity)


def user_update(
    user_id: str,
    update: UserUpdate,
    db: Database
) -> User:
    user = user_show(user_id, db)
    data = update.dict(exclude_unset=True)
    if 'password' in data:
        data['password'] = crypt_service.hash_password(data['password'])
    if 'email' in data:
        user_must_not_exists(db, email=data['email'])
    data['version'] = user.version + 1
    entity = db.users.find_one_and_update(
        {"_id": ObjectId(user_id)},
        {"$set": data},
    )
    if entity is not None:
        return model_from_mongo(
            User, db.users.find_one({"_id": entity["_id"]}))
    raise NotFoundError('User not found')


def user_delete(user_id: str, db: Database) -> None:
    result = db.users.delete_one({"_id": ObjectId(user_id)})
    if result.deleted_count == 0:
        raise NotFoundError('User not found')


def user_must_not_exists(db: Database, *, email: str) -> None:
    entity = db.users.find_one({"email": email})
    if entity is not None:
        raise AlreadyExistsError('User already exists')
