from enum import Enum
from typing import List, Optional

from bson import ObjectId
from pydantic import BaseModel, validator

from api.concerns import Pagination
from api.database import Database
from api.exceptions import AlreadyExistsError, NotFoundError
from api.models import Seed, SeedType
from api.utilities.mapper import (many_model_from_mongo, model_from_mongo,
                                  order_by_to_mongo)
from api.utilities.validators import must_be_positive


class SeedStore(BaseModel):
    name: str
    amount: int
    description: str
    seed_type: SeedType

    @validator('amount')
    def amount_must_be_positive(cls, v):
        return must_be_positive('amount', v)


class SeedUpdate(BaseModel):
    name: Optional[str]
    amount: Optional[int]
    description: Optional[str]
    seed_type: Optional[SeedType]

    @validator('amount')
    def amount_must_be_positive(cls, v):
        if v is None:
            return v
        return must_be_positive('amount', v)


class SeedOrderBy(str, Enum):
    NONE = ''
    NAME_UP = 'name_up'
    NAME_DOWN = 'name_down'


def seed_show(seed_id: str, db: Database) -> Seed:
    entity = db.seeds.find_one({"_id": ObjectId(seed_id)})
    if entity is not None:
        return model_from_mongo(Seed, entity)
    raise NotFoundError('Seed not found')


def seed_index(page: int, page_size: int,
               order_by: List[SeedOrderBy], search: Optional[str],
               db: Database) -> Pagination[Seed]:
    query = {}
    if search:
        query["$text"] = {"$search": search}
    entities = many_model_from_mongo(Seed, db.seeds.find(
        query, limit=page_size, skip=(page - 1) * page_size, sort=order_by_to_mongo(order_by)))
    if len(entities) == 0 and search:
        query = {}
        query["name"] = {"$regex": search, "$options": "i"}
        entities = many_model_from_mongo(Seed, db.seeds.find(
            query, limit=page_size, skip=(page - 1) * page_size, sort=order_by_to_mongo(order_by)))
    row_count = db.seeds.count_documents(query)
    return Pagination(entities=entities, row_count=row_count)


def seed_store(seed: SeedStore, db: Database) -> Seed:
    data = seed.dict()
    seed_must_not_exists(db, name=data['name'])
    result = db.seeds.insert_one(data)
    return model_from_mongo(
        Seed, db.seeds.find_one({"_id": result.inserted_id}))


def seed_update(
    seed_id: str,
    update: SeedUpdate,
    db: Database
) -> Seed:
    data = update.dict(exclude_unset=True)
    if 'name' in data:
        seed_must_not_exists(db, name=data['name'])
    entity = db.seeds.find_one_and_update(
        {"_id": ObjectId(seed_id)},
        {"$set": data},
    )
    if entity is not None:
        return model_from_mongo(
            Seed, db.seeds.find_one({"_id": entity["_id"]}))
    raise NotFoundError('Seed not found')


def seed_delete(seed_id: str, db: Database) -> None:
    result = db.seeds.delete_one({"_id": ObjectId(seed_id)})
    if result.deleted_count == 0:
        raise NotFoundError('Seed not found')


def seed_must_not_exists(db: Database, *, name: str) -> None:
    entity = db.seeds.find_one({"name": name})
    if entity is not None:
        raise AlreadyExistsError('Seed already exists')
