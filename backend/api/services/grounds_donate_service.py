from datetime import date
from typing import Optional

from bson import ObjectId
from pydantic import BaseModel, validator

from api.concerns import Pagination
from api.database import Database
from api.exceptions import NotFoundError
from api.models import GroundDonate
from api.utilities.mapper import many_model_from_mongo, model_from_mongo
from api.utilities.validators import must_represent_an_adult


class GroundDonateStore(BaseModel):
    name: str
    email: str
    cellphone: str
    birth_date: date
    address: str
    ground_address: str

    @validator('birth_date', pre=True)
    def must_be_adult(cls, v: date) -> date:
        return must_represent_an_adult('birth_date', v)


class GroundDonateUpdate(BaseModel):
    name: Optional[str]
    email: Optional[str]
    cellphone: Optional[str]
    birth_date: Optional[date]
    address: Optional[str]
    ground_address: Optional[str]

    @validator('birth_date', pre=True)
    def must_be_adult(cls, v: Optional[date]) -> Optional[date]:
        if v is None:
            return v
        return must_represent_an_adult("birth_date", v)


def grounds_donate_show(ground_donate_id: str, db: Database) -> GroundDonate:
    entity = db.grounds_donate.find_one({"_id": ObjectId(ground_donate_id)})
    if entity is not None:
        return model_from_mongo(GroundDonate, entity)
    raise NotFoundError('GroundDonate not found')


def grounds_donate_index(page: int, page_size: int,
                         db: Database) -> Pagination[GroundDonate]:
    entities = many_model_from_mongo(GroundDonate, db.grounds_donate.find(
        limit=page_size, skip=(page - 1) * page_size))
    row_count = db.grounds_donate.count_documents({})
    return Pagination(entities=entities, row_count=row_count)


def grounds_donate_store(ground_donate: GroundDonateStore,
                         db: Database) -> GroundDonate:
    data = ground_donate.dict()
    data["birth_date"] = data["birth_date"].isoformat()
    result = db.grounds_donate.insert_one(data)
    return model_from_mongo(
        GroundDonate, db.grounds_donate.find_one({"_id": result.inserted_id}))


def grounds_donate_update(
    ground_donate_id: str,
    update: GroundDonateUpdate,
    db: Database
) -> GroundDonate:
    data = update.dict(exclude_unset=True)
    if "birth_date" in data:
        data["birth_date"] = data["birth_date"].isoformat()
    entity = db.grounds_donate.find_one_and_update(
        {"_id": ObjectId(ground_donate_id)},
        {"$set": data},
    )
    if entity is not None:
        return model_from_mongo(
            GroundDonate, db.grounds_donate.find_one({"_id": entity["_id"]}))
    raise NotFoundError('GroundDonate not found')


def grounds_donate_delete(ground_donate_id: str, db: Database) -> None:
    result = db.grounds_donate.delete_one({"_id": ObjectId(ground_donate_id)})
    if result.deleted_count == 0:
        raise NotFoundError('GroundDonate not found')
