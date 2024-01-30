from datetime import date
from enum import Enum
from typing import List, Optional

from bson import ObjectId
from pydantic import BaseModel, validator
from pymongo.results import UpdateResult

from api.concerns import Pagination
from api.database import Database
from api.exceptions import NotFoundError
from api.models import Bed, Ground
from api.utilities.mapper import (id_to_str, many_model_from_mongo,
                                  model_from_mongo, order_by_to_mongo)


class BedUpdate(BaseModel):
    active: Optional[bool]
    free: Optional[bool]
    seed_id: Optional[str]
    bed_schedules_id: Optional[str]
    responsible_user_id: Optional[str]
    end_at: Optional[date] = None
    seed_id__none: Optional[bool] = False
    bed_schedules_id__none: Optional[bool] = False
    responsible_user_id__none: Optional[bool] = False
    end_at__none: Optional[bool] = False

    @validator('seed_id', 'bed_schedules_id', pre=True)
    def mongo_id(cls, value):
        return id_to_str(value)


class GroundStore(BaseModel):
    width: int
    length: int
    address: str
    description: str
    beds_count: int
    owner_id: Optional[str]


class GroundUpdate(BaseModel):
    width: Optional[int]
    length: Optional[int]
    address: Optional[str]
    description: Optional[str]
    owner_id: Optional[str]


class GroundOrderBy(str, Enum):
    NONE = ''
    ADDRESS_UP = 'address_up'
    ADDRESS_DOWN = 'address_down'


def ground_show(ground_id: str, db: Database) -> Ground:
    entity = db.grounds.find_one({"_id": ObjectId(ground_id)})
    if entity is not None:
        return model_from_mongo(Ground, entity)
    raise NotFoundError('Ground not found')


def ground_index(page: int, page_size: int, order_by: List[GroundOrderBy], search: Optional[str],
                 db: Database) -> Pagination[Ground]:
    query = {}
    if search:
        query["$text"] = {"$search": search}
    entities = many_model_from_mongo(Ground, db.grounds.aggregate([
        {"$match": query},
        {"$addFields": {"beds_count": {"$size": "$beds"}}},
        # {"$addFields": {"beds": []}},
        {"$sort": dict(order_by_to_mongo(order_by))}
        if len(order_by) > 0 and order_by != [GroundOrderBy.NONE]
        else {"$skip": 0},  # noop
        {"$skip": (page - 1) * page_size},
        {"$limit": page_size}
    ]))
    row_count = db.grounds.count_documents(query)
    return Pagination(entities=entities, row_count=row_count)


def ground_store(ground: GroundStore, db: Database) -> Ground:
    data = ground.dict()
    del data["beds_count"]
    data["beds"] = [{"label": str(i + 1)} for i in range(ground.beds_count)]
    result = db.grounds.insert_one(data)
    return model_from_mongo(
        Ground, db.grounds.find_one({"_id": result.inserted_id}))


def ground_update(
    ground_id: str,
    update: GroundUpdate,
    db: Database
) -> Ground:
    data = update.dict(exclude_unset=True)
    entity = db.grounds.find_one_and_update(
        {"_id": ObjectId(ground_id)},
        {"$set": data},
    )
    if entity is not None:
        return model_from_mongo(
            Ground, db.grounds.find_one({"_id": entity["_id"]}))
    raise NotFoundError('Ground not found')


def ground_delete(ground_id: str, db: Database) -> None:
    result = db.grounds.delete_one({"_id": ObjectId(ground_id)})
    db.bed_schedules.delete_many({"ground_id": ground_id})
    if result.deleted_count == 0:
        raise NotFoundError('Ground not found')


def ground_find_bed(ground: Ground, bed_label: str) -> Bed:
    bed = next((it for it in ground.beds if it.label == bed_label), None)
    if bed is None:
        raise NotFoundError('Bed not found')
    return bed


def ground_update_bed(
    ground_id: str,
    bed_label: str,
    update: BedUpdate,
    db: Database
) -> UpdateResult:
    # TODO: test exclude_unset instead of exclude_none
    data = update.dict(exclude_none=True)
    for key in list(data.keys()):
        if key.endswith('__none') and data[key] is True:
            del data[key]
            data[key[:-6]] = None
    if data.get('end_at') is not None:
        data['end_at'] = data['end_at'].isoformat()
    data = {f"beds.$[bed].{k}": v for k, v in data.items()}
    return db.grounds.update_one(
        {"_id": ObjectId(ground_id)},
        {"$set": data},
        array_filters=[{"bed.label": bed_label}]
    )
