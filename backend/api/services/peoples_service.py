from datetime import date
from enum import Enum
from typing import List, Optional

from bson import ObjectId
from pydantic import BaseModel, validator

from api.concerns import Pagination
from api.database import Database
from api.exceptions import AlreadyExistsError, NotFoundError
from api.models import People
from api.utilities.mapper import (many_model_from_mongo, model_from_mongo,
                                  order_by_to_mongo)
from api.utilities.validators import must_represent_an_adult


class PeopleStore(BaseModel):
    name: str
    email: str
    cellphone: str
    birth_date: date
    address: str

    @validator('birth_date', pre=True)
    def must_be_adult(cls, v: date) -> date:
        return must_represent_an_adult('birth_date', v)


class PeopleUpdate(BaseModel):
    name: Optional[str]
    email: Optional[str]
    cellphone: Optional[str]
    birth_date: Optional[date]
    address: Optional[str]

    @validator('birth_date', pre=True)
    def must_be_adult(cls, v: Optional[date]) -> Optional[date]:
        if v is None:
            return v
        return must_represent_an_adult("birth_date", v)


class PeopleOrderBy(str, Enum):
    NONE = ''
    NAME_UP = 'name_up'
    NAME_DOWN = 'name_down'
    BIRTH_DATE_UP = 'birth_date_up'
    BIRTH_DATE_DOWN = 'birth_date_down'
    ADDRESS_UP = 'address_up'
    ADDRESS_DOWN = 'address_down'


def people_show(people_id: str, db: Database) -> People:
    entity = db.peoples.find_one({"_id": ObjectId(people_id)})
    if entity is not None:
        return model_from_mongo(People, entity)
    raise NotFoundError('People not found')


def people_index(page: int, page_size: int, order_by: List[PeopleOrderBy], search: Optional[str],
                 db: Database) -> Pagination[People]:
    query = {}
    if search:
        query["$text"] = {"$search": search}
    entities = many_model_from_mongo(People, db.peoples.find(
        query, limit=page_size, skip=(page - 1) * page_size, sort=order_by_to_mongo(order_by)))
    row_count = db.peoples.count_documents(query)
    return Pagination(entities=entities, row_count=row_count)


def people_store(people: PeopleStore, db: Database) -> People:
    data = people.dict()
    people_must_not_exists(db, email=data["email"])
    data["birth_date"] = data["birth_date"].isoformat()
    result = db.peoples.insert_one(data)
    return model_from_mongo(
        People, db.peoples.find_one({"_id": result.inserted_id}))


def people_update(
    people_id: str,
    update: PeopleUpdate,
    db: Database
) -> People:
    data = update.dict(exclude_unset=True)
    if "email" in data:
        people_must_not_exists(db, email=data["email"])
    if "birth_date" in data:
        data["birth_date"] = data["birth_date"].isoformat()
    entity = db.peoples.find_one_and_update(
        {"_id": ObjectId(people_id)},
        {"$set": data},
    )
    if entity is not None:
        return model_from_mongo(
            People, db.peoples.find_one({"_id": entity["_id"]}))
    raise NotFoundError('People not found')


def people_delete(people_id: str, db: Database) -> None:
    result = db.peoples.delete_one({"_id": ObjectId(people_id)})
    if result.deleted_count == 0:
        raise NotFoundError('People not found')


def people_must_not_exists(db: Database, *, email: str) -> None:
    entity = db.peoples.find_one({"email": email})
    if entity is not None:
        raise AlreadyExistsError('People already exists')
