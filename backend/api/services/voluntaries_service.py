from datetime import date
from typing import List, Optional

from bson import ObjectId
from pydantic import BaseModel

import api.services.grounds_service as ground_service
import api.services.peoples_service as people_service
from api.concerns import Pagination
from api.database import Database
from api.exceptions import AlreadyExistsError, DomainError, NotFoundError
from api.models import Voluntary
from api.utilities.mapper import (dict_date_fields, many_model_from_mongo,
                                  model_from_mongo)


class VoluntaryStore(BaseModel):
    people_id: str
    ground_id: str
    bed_label: str
    start_at: date
    is_responsible: bool

    def dict(self, *args, **kwargs):
        # Normalize dict to be an acceptable json
        data = super().dict(*args, **kwargs)
        dict_date_fields(data, 'start_at')
        return data


class VoluntaryUpdate(BaseModel):
    start_at: Optional[date]
    end_at: Optional[date]
    is_responsible: Optional[bool]

    def dict(self, *args, **kwargs):
        # Normalize dict to be an acceptable json
        data = super().dict(*args, **kwargs)
        dict_date_fields(data, 'start_at', 'end_at')
        return data


class VoluntaryOrError(BaseModel):
    voluntary: Optional[Voluntary]
    error: Optional[str]


class VoluntaryStoreManyResponse(BaseModel):
    results: List[VoluntaryOrError]


def voluntary_show(voluntary_id: str, db: Database) -> Voluntary:
    entity = db.voluntaries.find_one({"_id": ObjectId(voluntary_id)})
    if entity is not None:
        return model_from_mongo(Voluntary, entity)
    raise NotFoundError('Voluntary not found')


def voluntary_index(
    page: int,
    page_size: int,
    ground_id: Optional[str],
    people_id: Optional[str],
    bed_label: Optional[str],
    db: Database
) -> Pagination[Voluntary]:
    query = {}
    if ground_id is not None:
        query['ground_id'] = ground_id
    if people_id is not None:
        query['people_id'] = people_id
    if bed_label is not None:
        query['bed_label'] = bed_label
    entities = many_model_from_mongo(Voluntary, db.voluntaries.find(
        query, limit=page_size, skip=(page - 1) * page_size))
    row_count = db.voluntaries.count_documents(query)
    return Pagination(entities=entities, row_count=row_count)


def voluntary_store(voluntary: VoluntaryStore, db: Database) -> Voluntary:
    people = people_service.people_show(voluntary.people_id, db)
    ground = ground_service.ground_show(voluntary.ground_id, db)
    voluntary_must_not_exists(db,
                              bed_label=voluntary.bed_label,
                              ground_id=ground.id,
                              people_id=people.id)
    data = voluntary.dict()
    data['people_name'] = people.name
    result = db.voluntaries.insert_one(data)
    return model_from_mongo(
        Voluntary, db.voluntaries.find_one({"_id": result.inserted_id}))


def voluntary_store_many(
        voluntaries: List[VoluntaryStore], db: Database) -> VoluntaryStoreManyResponse:
    response = VoluntaryStoreManyResponse(results=[])
    for voluntary in voluntaries:
        try:
            entity = voluntary_store(voluntary, db)
            response.voluntaries.append(VoluntaryOrError(voluntary=entity))
        except DomainError as e:
            response.errors.append(VoluntaryOrError(error=str(e)))
    return response


def voluntary_update(
    voluntary_id: str,
    update: VoluntaryUpdate,
    db: Database
) -> Voluntary:
    data = update.dict(exclude_unset=True)
    entity = voluntary_show(voluntary_id, db)
    if data.get('end_at') is not None:
        entity.end_at = data['end_at']
    if data.get('start_at') is not None:
        entity.start_at = data['start_at']
    if entity.end_at is not None:
        if entity.end_at < entity.start_at:
            raise ValueError('End date must be greater than start date')
    entity = db.voluntaries.find_one_and_update(
        {"_id": ObjectId(voluntary_id)},
        {"$set": data},
    )
    if entity is not None:
        return model_from_mongo(
            Voluntary, db.voluntaries.find_one({"_id": entity["_id"]}))
    raise NotFoundError('Voluntary not found')


def voluntary_delete(voluntary_id: str, db: Database) -> None:
    result = db.voluntaries.delete_one({"_id": ObjectId(voluntary_id)})
    if result.deleted_count == 0:
        raise NotFoundError('Voluntary not found')


def voluntary_must_not_exists(
        db: Database, *, people_id: str, ground_id: str, bed_label: str) -> None:
    entity = db.voluntaries.find_one({
        "people_id": people_id,
        "ground_id": ground_id,
        "bed_label": bed_label,
    })
    if entity is not None:
        raise AlreadyExistsError('Voluntary already exists')
