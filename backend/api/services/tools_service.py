from enum import Enum
from typing import List, Optional

from bson import ObjectId
from pydantic import BaseModel, validator

from api.concerns import Pagination
from api.database import Database
from api.exceptions import AlreadyExistsError, NotFoundError
from api.models import Tool
from api.utilities.mapper import (many_model_from_mongo, model_from_mongo,
                                  order_by_to_mongo)
from api.utilities.validators import must_be_positive


class ToolStore(BaseModel):
    name: str
    amount: int
    description: str

    @validator('amount')
    def amount_must_be_positive(cls, v):
        return must_be_positive('amount', v)


class ToolUpdate(BaseModel):
    name: Optional[str]
    amount: Optional[int]
    description: Optional[str]

    @validator('amount')
    def amount_must_be_positive(cls, v):
        if v is None:
            return v
        return must_be_positive('amount', v)


class ToolOrderBy(str, Enum):
    NONE = ''
    NAME_UP = 'name_up'
    NAME_DOWN = 'name_down'


def tool_show(tool_id: str, db: Database) -> Tool:
    entity = db.tools.find_one({"_id": ObjectId(tool_id)})
    if entity is not None:
        return model_from_mongo(Tool, entity)
    raise NotFoundError('Tool not found')


def tool_index(page: int, page_size: int,
               order_by: List[ToolOrderBy], search: Optional[str],
               db: Database) -> Pagination[Tool]:
    query = {}
    if search:
        query["$text"] = {"$search": search}
    entities = many_model_from_mongo(Tool, db.tools.find(
        query, limit=page_size, skip=(page - 1) * page_size, sort=order_by_to_mongo(order_by)))
    if len(entities) == 0 and search:
        query = {}
        query["name"] = {"$regex": search, "$options": "i"}
        entities = many_model_from_mongo(Tool, db.tools.find(
            query, limit=page_size, skip=(page - 1) * page_size, sort=order_by_to_mongo(order_by)))
    row_count = db.tools.count_documents(query)
    return Pagination(entities=entities, row_count=row_count)


def tool_store(tool: ToolStore, db: Database) -> Tool:
    data = tool.dict()
    tool_must_not_exists(db, name=data["name"])
    result = db.tools.insert_one(data)
    return model_from_mongo(
        Tool, db.tools.find_one({"_id": result.inserted_id}))


def tool_update(
    tool_id: str,
    update: ToolUpdate,
    db: Database
) -> Tool:
    data = update.dict(exclude_unset=True)
    if "name" in data:
        tool_must_not_exists(db, name=data["name"])
    entity = db.tools.find_one_and_update(
        {"_id": ObjectId(tool_id)},
        {"$set": data},
    )
    if entity is not None:
        return model_from_mongo(
            Tool, db.tools.find_one({"_id": entity["_id"]}))
    raise NotFoundError('Tool not found')


def tool_delete(tool_id: str, db: Database) -> None:
    result = db.tools.delete_one({"_id": ObjectId(tool_id)})
    if result.deleted_count == 0:
        raise NotFoundError('Tool not found')


def tool_must_not_exists(db: Database, *, name: str) -> None:
    entity = db.tools.find_one({"name": name})
    if entity is not None:
        raise AlreadyExistsError('Tool already exists')
