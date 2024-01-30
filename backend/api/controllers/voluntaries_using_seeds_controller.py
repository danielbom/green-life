from typing import Optional

from fastapi import APIRouter, Depends, Path, Query

import api.services.jwt_service as jwt_service
import api.services.voluntaries_using_seeds_service as voluntaries_using_seeds_service
from api.concerns import Page, PageSize, Pagination
from api.database import Database, get_db
from api.services.voluntaries_using_seeds_service import (
    VoluntaryUsingSeed, VoluntaryUsingSeedStart)

router = APIRouter(
    prefix="/voluntaries-using-seeds",
    tags=["Voluntaries Using Seed"],
    dependencies=[Depends(jwt_service.decode_token)]
)


@router.get("/{voluntary_using_seed_id}")
def voluntary_using_seed_show(
        voluntary_using_seed_id: str = Path(...),
        db: Database = Depends(get_db)) -> VoluntaryUsingSeed:
    return voluntaries_using_seeds_service.voluntary_using_seed_show(
        voluntary_using_seed_id, db)


@router.get("/")
def voluntary_using_seed_index(
    page: int = Page(),
    page_size: int = PageSize(),
    voluntary_id: Optional[str] = Query(None),
    seed_id: Optional[str] = Query(None),
    ground_id: Optional[str] = Query(None),
    bed_label: Optional[str] = Query(None),
    db: Database = Depends(get_db)
) -> Pagination[VoluntaryUsingSeed]:
    return voluntaries_using_seeds_service.voluntary_using_seed_index(
        page, page_size, db,
        voluntary_id=voluntary_id,
        seed_id=seed_id,
        ground_id=ground_id,
        bed_label=bed_label)


@router.post("/start")
def voluntary_using_seed_start(
        voluntary_using_seed: VoluntaryUsingSeedStart,
        db: Database = Depends(get_db)) -> VoluntaryUsingSeed:
    return voluntaries_using_seeds_service.voluntary_using_seed_start(
        voluntary_using_seed, db)


@router.put("/end/{voluntary_using_seed_id}")
def voluntary_using_seed_end(
        voluntary_using_seed_id: str = Path(...),
        db: Database = Depends(get_db)) -> VoluntaryUsingSeed:
    return voluntaries_using_seeds_service.voluntary_using_seed_end(
        voluntary_using_seed_id, db)


@router.delete("/{voluntary_using_seed_id}", status_code=204)
def voluntary_using_seed_delete(
        voluntary_using_seed_id: str = Path(...),
        db: Database = Depends(get_db)) -> None:
    return voluntaries_using_seeds_service.voluntary_using_seed_delete(
        voluntary_using_seed_id, db)
