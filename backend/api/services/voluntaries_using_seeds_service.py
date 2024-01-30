from datetime import date
from typing import Optional

from bson import ObjectId
from pydantic import BaseModel

import api.services.seeds_service as seeds_service
import api.services.voluntaries_service as voluntaries_service
from api.concerns import Pagination
from api.database import Database
from api.exceptions import AlreadyExistsError, NotFoundError
from api.models import Voluntary, VoluntaryUsingSeed
from api.utilities.mapper import many_model_from_mongo, model_from_mongo


class VoluntaryUsingSeedStart(BaseModel):
    voluntary_id: str
    seed_id: str


def voluntary_using_seed_index(
        page: int,
        page_size: int,
        db: Database,
        *,
        voluntary_id: Optional[str] = None,
        seed_id: Optional[str] = None,
        ground_id: Optional[str] = None,
        bed_label: Optional[str] = None,
) -> Pagination[VoluntaryUsingSeed]:
    query = {}
    if voluntary_id is not None:
        query["voluntary_id"] = voluntary_id
    if seed_id is not None:
        query["seed_id"] = seed_id
    if ground_id is not None:
        query["ground_id"] = ground_id
    if bed_label is not None:
        query["bed_label"] = bed_label
    entities = many_model_from_mongo(VoluntaryUsingSeed, db.voluntaries_using_seeds.find(
        query, limit=page_size, skip=(page - 1) * page_size))
    row_count = db.voluntaries_using_seeds.count_documents(query)
    return Pagination(entities=entities, row_count=row_count)


def voluntary_using_seed_show(
        voluntary_using_seed_id: str, db: Database) -> VoluntaryUsingSeed:
    entity = db.voluntaries_using_seeds.find_one(
        {"_id": ObjectId(voluntary_using_seed_id)})
    if entity is not None:
        return model_from_mongo(VoluntaryUsingSeed, entity)
    raise NotFoundError('VoluntaryUsingSeed not found')


def voluntary_using_seed_start(
        data: VoluntaryUsingSeedStart, db: Database) -> VoluntaryUsingSeed:
    voluntary = voluntaries_service.voluntary_show(data.voluntary_id, db)
    seed = seeds_service.seed_show(data.seed_id, db)
    voluntary_using_seed_must_not_exists(
        db, voluntary=voluntary, seed_id=seed.id)
    result = db.voluntaries_using_seeds.insert_one({
        "voluntary_id": ObjectId(voluntary.id),
        "ground_id": ObjectId(voluntary.ground_id),
        "bed_label": voluntary.bed_label,
        "seed_id": ObjectId(seed.id),
        "start_at": date.today().isoformat(),
    })
    if result.inserted_id is not None:
        return model_from_mongo(
            VoluntaryUsingSeed, db.voluntaries_using_seeds.find_one({"_id": result.inserted_id}))
    raise NotFoundError('VoluntaryUsingSeed not found')


def voluntary_using_seed_end(
        voluntary_using_seed_id: str, db: Database) -> VoluntaryUsingSeed:
    entity = db.voluntaries_using_seeds.find_one_and_update(
        {"_id": ObjectId(voluntary_using_seed_id)},
        {"$set": {"end_at": date.today().isoformat()}}
    )
    if entity is not None:
        return model_from_mongo(
            VoluntaryUsingSeed, db.voluntaries_using_seeds.find_one({"_id": entity["_id"]}))
    raise NotFoundError('VoluntaryUsingSeed not found')


def voluntary_using_seed_delete(
        voluntary_using_seed_id: str, db: Database) -> None:
    result = db.voluntaries_using_seeds.delete_one(
        {"_id": ObjectId(voluntary_using_seed_id)})
    if result.deleted_count == 0:
        raise NotFoundError('VoluntaryUsingSeed not found')


def voluntary_using_seed_must_not_exists(
        db: Database, *, voluntary: Voluntary, seed_id: str) -> None:
    entity = db.voluntaries_using_seeds.find_one({
        "voluntary_id": ObjectId(voluntary.id),
        "ground_id": ObjectId(voluntary.ground_id),
        "bed_label": voluntary.bed_label,
        "seed_id": ObjectId(seed_id),
    })
    if entity is not None and entity.get('end_at') is None:
        raise AlreadyExistsError('VoluntaryUsingSeed already exists')
