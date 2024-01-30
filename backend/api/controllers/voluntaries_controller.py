from typing import List, Optional

from fastapi import APIRouter, Body, Depends, Path, Query

import api.services.jwt_service as jwt_service
import api.services.voluntaries_service as voluntaries_service
from api.concerns import Page, PageSize, Pagination
from api.database import Database, get_db
from api.services.voluntaries_service import (Voluntary, VoluntaryStore,
                                              VoluntaryStoreManyResponse,
                                              VoluntaryUpdate)

router = APIRouter(
    prefix="/voluntaries",
    tags=["Voluntaries"],
    dependencies=[Depends(jwt_service.decode_token)]
)


@router.get("/{voluntary_id}")
def voluntary_show(
        voluntary_id: str = Path(...),
        db: Database = Depends(get_db)) -> Voluntary:
    return voluntaries_service.voluntary_show(voluntary_id, db)


@router.get("/")
def voluntary_index(
    page: int = Page(),
    page_size: int = PageSize(),
    ground_id: Optional[str] = Query(None),
    people_id: Optional[str] = Query(None),
    bed_label: Optional[str] = Query(None),
    db: Database = Depends(get_db)
) -> Pagination[Voluntary]:
    return voluntaries_service.voluntary_index(
        page, page_size, ground_id, people_id, bed_label, db)


@router.post("/", status_code=201)
def voluntary_store(voluntary: VoluntaryStore,
                    db: Database = Depends(get_db)) -> Voluntary:
    return voluntaries_service.voluntary_store(voluntary, db)


@router.post("/many", status_code=201)
def voluntary_store_many(voluntaries: List[VoluntaryStore],
                         db: Database = Depends(get_db)) -> VoluntaryStoreManyResponse:
    return voluntaries_service.voluntary_store_many(voluntaries, db)


@router.put("/{voluntary_id}", status_code=200)
def voluntary_update(voluntary_id: str = Path(...),
                     update: VoluntaryUpdate = Body(...),
                     db: Database = Depends(get_db)) -> Voluntary:
    return voluntaries_service.voluntary_update(voluntary_id, update, db)


@router.delete("/{voluntary_id}", status_code=204)
def voluntary_delete(voluntary_id: str = Path(...),
                     db: Database = Depends(get_db)) -> None:
    return voluntaries_service.voluntary_delete(voluntary_id, db)
