from typing import List, Optional

from fastapi import APIRouter, Body, Depends, Path, Query

import api.services.jwt_service as jwt_service
import api.services.peoples_service as peoples_service
from api.concerns import OrderBy, Page, PageSize, Pagination
from api.database import Database, get_db
from api.services.peoples_service import (People, PeopleOrderBy, PeopleStore,
                                          PeopleUpdate)

router = APIRouter(
    prefix="/peoples",
    tags=["Peoples"],
    dependencies=[Depends(jwt_service.decode_token)]
)


@router.get("/{people_id}")
def people_show(
        people_id: str = Path(...),
        db: Database = Depends(get_db)) -> People:
    return peoples_service.people_show(people_id, db)


@router.get("/")
def people_index(
    page: int = Page(),
    page_size: int = PageSize(),
    order_by: List[PeopleOrderBy] = OrderBy(),
    search: Optional[str] = Query(None),
    db: Database = Depends(get_db)
) -> Pagination[People]:
    return peoples_service.people_index(page, page_size, order_by, search, db)


@router.post("/", status_code=201)
def people_store(people: PeopleStore,
                 db: Database = Depends(get_db)) -> People:
    return peoples_service.people_store(people, db)


@router.put("/{people_id}", status_code=200)
def people_update(people_id: str = Path(...),
                  update: PeopleUpdate = Body(...),
                  db: Database = Depends(get_db)) -> People:
    return peoples_service.people_update(people_id, update, db)


@router.delete("/{people_id}", status_code=204)
def people_delete(people_id: str = Path(...),
                  db: Database = Depends(get_db)) -> None:
    return peoples_service.people_delete(people_id, db)
