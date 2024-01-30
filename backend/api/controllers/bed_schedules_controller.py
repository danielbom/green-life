from fastapi import APIRouter, Depends, Path, Query

import api.services.bed_schedules_service as bed_schedules_service
import api.services.jwt_service as jwt_service
from api.concerns import Page, PageSize, Pagination
from api.database import Database, get_db
from api.services.bed_schedules_service import (BedScheduleAdjust,
                                                BedScheduleClose, BedSchedules,
                                                BedScheduleStore,
                                                BedScheduleUpdate)

router = APIRouter(
    prefix="/bed-schedules",
    tags=["Bed Schedules"],
    dependencies=[Depends(jwt_service.decode_token)]
)


@router.get("/{bed_schedule_id}")
def bed_schedules_show(
        bed_schedule_id: str = Path(...),
        db: Database = Depends(get_db)) -> BedSchedules:
    return bed_schedules_service.bed_schedules_show(bed_schedule_id, db)


@router.get("/")
def bed_schedules_index(
    page: int = Page(),
    page_size: int = PageSize(),
    ground_id: str = Query(...),
    bed_label: str = Query(...),
    db: Database = Depends(get_db)
) -> Pagination[BedSchedules]:
    return bed_schedules_service.bed_schedules_index(
        page, page_size, ground_id, bed_label, db)


@router.post("/", status_code=201)
def bed_schedules_store(
        body: BedScheduleStore,
        db: Database = Depends(get_db)) -> BedSchedules:
    return bed_schedules_service.bed_schedules_store(body, db)


@router.put("/{bed_schedule_id}", status_code=200)
def bed_schedules_update(
        update: BedScheduleUpdate,
        bed_schedule_id: str = Path(...),
        db: Database = Depends(get_db)) -> BedSchedules:
    return bed_schedules_service.bed_schedules_update(
        bed_schedule_id, update, db)


@router.patch("/{bed_schedule_id}/adjust", status_code=200)
def bed_schedules_adjust(
        update: BedScheduleAdjust,
        bed_schedule_id: str = Path(...),
        db: Database = Depends(get_db)) -> BedSchedules:
    return bed_schedules_service.bed_schedules_adjust(
        bed_schedule_id, update, db)


@router.patch("/{bed_schedule_id}/close", status_code=200)
def bed_schedules_close(
        update: BedScheduleClose,
        bed_schedule_id: str = Path(...),
        db: Database = Depends(get_db)) -> BedSchedules:
    return bed_schedules_service.bed_schedules_close(
        bed_schedule_id, update, db)


@router.delete("/{bed_schedule_id}", status_code=204)
def bed_schedules_delete(
        bed_schedule_id: str = Path(...),
        db: Database = Depends(get_db)) -> None:
    return bed_schedules_service.bed_schedules_delete(bed_schedule_id, db)
