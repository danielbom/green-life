from datetime import date
from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, validator

from api.concerns import Pagination
from api.database import Database
from api.exceptions import NotFoundError
from api.models import VoluntaryRequest
from api.utilities.mapper import many_model_from_mongo, model_from_mongo
from api.utilities.validators import must_represent_an_adult


class VoluntaryRequestStore(BaseModel):
    name: str
    email: str
    cellphone: str
    birth_date: date
    address: str

    @validator('birth_date', pre=True)
    def must_be_adult(cls, v: date) -> date:
        return must_represent_an_adult('birth_date', v)


class VoluntaryRequestUpdate(BaseModel):
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


def voluntary_request_show(voluntary_request_id: str,
                           db: Database) -> VoluntaryRequest:
    entity = db.voluntaries_request.find_one(
        {"_id": ObjectId(voluntary_request_id)})
    if entity is not None:
        return model_from_mongo(VoluntaryRequest, entity)
    raise NotFoundError('VoluntaryRequest not found')


def voluntary_request_index(
    page: int,
    page_size: int,
    db: Database
) -> Pagination[VoluntaryRequest]:
    entities = many_model_from_mongo(VoluntaryRequest, db.voluntaries_request.find(
        limit=page_size, skip=(page - 1) * page_size))
    row_count = db.voluntaries_request.count_documents({})
    return Pagination(entities=entities, row_count=row_count)


def voluntary_request_store(
        voluntary: VoluntaryRequestStore, db: Database) -> VoluntaryRequest:
    data = voluntary.dict()
    data["birth_date"] = data["birth_date"].isoformat()
    result = db.voluntaries_request.insert_one(data)
    return model_from_mongo(
        VoluntaryRequest, db.voluntaries_request.find_one({"_id": result.inserted_id}))


def voluntary_request_update(
    voluntary_request_id: str,
    update: VoluntaryRequestUpdate,
    db: Database
) -> VoluntaryRequest:
    data = update.dict(exclude_unset=True)
    if "birth_date" in data:
        data["birth_date"] = data["birth_date"].isoformat()
    entity = db.voluntaries_request.find_one_and_update(
        {"_id": ObjectId(voluntary_request_id)},
        {"$set": data},
    )
    if entity is not None:
        return model_from_mongo(
            VoluntaryRequest, db.voluntaries_request.find_one({"_id": entity["_id"]}))
    raise NotFoundError('VoluntaryRequest not found')


def voluntary_request_delete(voluntary_request_id: str, db: Database) -> None:
    result = db.voluntaries_request.delete_one(
        {"_id": ObjectId(voluntary_request_id)})
    if result.deleted_count == 0:
        raise NotFoundError('VoluntaryRequest not found')
