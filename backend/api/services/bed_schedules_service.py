from datetime import date
from typing import List

from bson import ObjectId
from pydantic import BaseModel, validator

import api.services.grounds_service as grounds_service
import api.services.seeds_service as seeds_service
from api.concerns import Pagination
from api.database import Database
from api.exceptions import DomainError, NotFoundError
from api.models import BedSchedule, BedSchedules, Seed
from api.services.grounds_service import BedUpdate
from api.utilities.mapper import many_model_from_mongo, model_from_mongo


class BedScheduleStore(BaseModel):
    ground_id: str
    bed_label: str
    schedules: List[BedSchedule]

    @validator('schedules')
    def schedules_sequencial_and_valid(
            cls, value: List[BedSchedule]) -> List[BedSchedule]:
        if len(value) == 0:
            raise ValueError('Schedules cannot be empty')
        for index, schedule in enumerate(value):
            if schedule.start_at >= schedule.end_at:
                raise ValueError('Start date must be before end date')
            if index > 0:
                if value[index - 1].end_at <= schedule.start_at:
                    raise ValueError('Schedules must be sequencial')
        return value


class BedScheduleClose(BaseModel):
    amount: int
    unit: str
    date: date


class BedScheduleAdjust(BaseModel):
    end_at: date


class BedScheduleUpdate(BaseModel):
    # TODO: Make optional
    schedules: List[BedSchedule]
    current_schedule: int

    @validator('schedules')
    def schedules_sequencial_and_valid(
            cls, value: List[BedSchedule]) -> List[BedSchedule]:
        return BedScheduleStore.schedules_sequencial_and_valid(cls, value)

    @validator('current_schedule')
    def current_schedule_is_valid(cls, value: int, values: dict) -> int:
        if value < 0 or value >= len(values['schedules']):
            raise ValueError('Current schedule is invalid')
        return value


def bed_schedules_show(bed_schedule_id: str, db: Database) -> BedSchedules:
    entity = db.bed_schedules.find_one({"_id": ObjectId(bed_schedule_id)})
    if entity is not None:
        return model_from_mongo(BedSchedules, entity)
    raise NotFoundError('Bed schedules not found')


def bed_schedules_index(page: int, page_size: int, ground_id: str,
                        bed_label: str, db: Database) -> Pagination[BedSchedules]:
    query = {}
    query['ground_id'] = ground_id
    query['bed_label'] = bed_label
    entities = many_model_from_mongo(BedSchedules, db.bed_schedules.find(
        query, limit=page_size, skip=(page - 1) * page_size))
    row_count = db.bed_schedules.count_documents(query)
    return Pagination(entities=entities, row_count=row_count)


def bed_schedules_store(body: BedScheduleStore, db: Database) -> BedSchedules:
    # Validate if data exists in database
    ground = grounds_service.ground_show(body.ground_id, db)
    bed = grounds_service.ground_find_bed(ground, body.bed_label)
    for schedule in body.schedules:
        seeds_service.seed_show(schedule.seed_id, db)
    # Store bed schedules
    data = body.dict()
    data['current_schedule'] = 0
    bed_schedules = db.bed_schedules.insert_one(data)
    bed_schedules = model_from_mongo(BedSchedules, db.bed_schedules.find_one(
        {"_id": bed_schedules.inserted_id}))
    # Update bed
    bed_update = BedUpdate(
        bed_schedules_id=bed_schedules.id,
        seed_id=bed_schedules.schedules[0].seed_id,
        end_at=bed_schedules.schedules[0].end_at,
        free=False)
    result = grounds_service.ground_update_bed(
        ground.id, bed.label, bed_update, db)
    if result.modified_count == 0:
        db.bed_schedules.delete_one({"_id": bed_schedules.id})
        raise Exception('Bed schedules not updated')
    return bed_schedules


def bed_schedules_update(
    bed_schedules_id: str,
    update: BedScheduleUpdate,
    db: Database
) -> BedSchedules:
    # TODO: Validate if bed stay consistent
    for schedule in update.schedules:
        seeds_service.seed_show(schedule.seed_id, db)
    data = update.dict()
    result = db.bed_schedules.update_one(
        {"_id": ObjectId(bed_schedules_id)},
        {"$set": data}
    )
    if result.modified_count == 0:
        raise NotFoundError('Bed schedules not found')
    return bed_schedules_show(bed_schedules_id, db)


def bed_schedules_close(
    bed_schedules_id: str,
    close: BedScheduleClose,
    db: Database
) -> BedSchedules:
    bed_schedules = bed_schedules_show(bed_schedules_id, db)
    if bed_schedules.current_schedule is None:
        raise DomainError('Bed schedules without current schedule')
    next_schedule = None
    if bed_schedules.current_schedule < len(bed_schedules.schedules) - 1:
        next_schedule = bed_schedules.current_schedule + 1
    result = db.bed_schedules.update_one(
        {"_id": ObjectId(bed_schedules_id)},
        {
            "$set": {
                "current_schedule": next_schedule,
                f"schedules.{bed_schedules.current_schedule}.end_at": close.date.isoformat()
            }
        }
    )
    if result.modified_count == 0:
        raise Exception('Bed schedules not updated')
    # Update bed
    if next_schedule is None:
        bed_update = BedUpdate(
            bed_schedules_id__none=True,
            seed_id__none=True,
            end_at__none=True,
            free=True)
    else:
        bed_update = BedUpdate(
            bed_schedules_id=bed_schedules.id,
            seed_id=bed_schedules.schedules[next_schedule].seed_id,
            end_at=bed_schedules.schedules[next_schedule].end_at,
            free=False)
    result = grounds_service.ground_update_bed(
        bed_schedules.ground_id, bed_schedules.bed_label, bed_update, db)
    if result.modified_count == 0:
        raise Exception('Bed schedules not updated')
    return bed_schedules_show(bed_schedules_id, db)


def bed_schedules_adjust(
    bed_schedules_id: str,
    adjust: BedScheduleAdjust,
    db: Database
) -> BedSchedules:
    bed_schedules = bed_schedules_show(bed_schedules_id, db)
    if bed_schedules.current_schedule is None:
        raise DomainError('Bed schedules without current schedule')
    result = db.bed_schedules.update_one(
        {"_id": ObjectId(bed_schedules_id)},
        {
            "$set": {
                f"schedules.{bed_schedules.current_schedule}.end_at": adjust.end_at.isoformat()
            }
        }
    )
    if result.modified_count == 0:
        raise Exception('Bed schedules not updated')
    return bed_schedules_show(bed_schedules_id, db)


def bed_schedules_delete(bed_schedules_id: str, db: Database) -> None:
    bed_schedules = bed_schedules_show(bed_schedules_id, db)
    bed_update = BedUpdate(
        bed_schedules_id__none=True,
        seed_id__none=True,
        free=True)
    result = grounds_service.ground_update_bed(
        bed_schedules.ground_id, bed_schedules.bed_label, bed_update, db)
    if result.modified_count == 0:
        raise Exception('Bed schedules not updated in grounds')
    result = db.bed_schedules.delete_one({"_id": ObjectId(bed_schedules.id)})
    if result.deleted_count == 0:
        raise NotFoundError('Bed schedules not found')
