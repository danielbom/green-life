
from typing import List, Optional

from fastapi import APIRouter, Body, Depends, Path, Query

import api.services.grounds_service as grounds_service
import api.services.jwt_service as jwt_service
from api.concerns import OrderBy, Page, PageSize, Pagination
from api.database import Database, get_db
from api.services.grounds_service import (Ground, GroundOrderBy, GroundStore,
                                          GroundUpdate)

router = APIRouter(
    prefix="/grounds",
    tags=["Grounds"],
    dependencies=[Depends(jwt_service.decode_token)]
)


@router.get("/{ground_id}")
def ground_show(
        ground_id: str = Path(...),
        db: Database = Depends(get_db)) -> Ground:
    return grounds_service.ground_show(ground_id, db)


@router.get("/")
def ground_index(
    page: int = Page(),
    page_size: int = PageSize(),
    order_by: List[GroundOrderBy] = OrderBy(),
    search: Optional[str] = Query(None),
    db: Database = Depends(get_db)
) -> Pagination[Ground]:
    return grounds_service.ground_index(page, page_size, order_by, search, db)


@router.post("/", status_code=201)
def ground_store(ground: GroundStore,
                 db: Database = Depends(get_db)) -> Ground:
    return grounds_service.ground_store(ground, db)


@router.put("/{ground_id}", status_code=200)
def ground_update(ground_id: str = Path(...),
                  update: GroundUpdate = Body(...),
                  db: Database = Depends(get_db)) -> Ground:
    return grounds_service.ground_update(ground_id, update, db)


@router.delete("/{ground_id}", status_code=204)
def ground_delete(ground_id: str = Path(...),
                  db: Database = Depends(get_db)) -> None:
    return grounds_service.ground_delete(ground_id, db)
