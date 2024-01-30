
from fastapi import APIRouter, Body, Depends, Path

import api.services.grounds_donate_service as grounds_donate_service
import api.services.jwt_service as jwt_service
from api.concerns import Page, PageSize, Pagination
from api.database import Database, get_db
from api.services.grounds_donate_service import (GroundDonate,
                                                 GroundDonateStore,
                                                 GroundDonateUpdate)

router = APIRouter(
    prefix="/grounds-donate",
    tags=["Grounds Donate"],
)


@router.get("/{grounds_donate_id}",
            dependencies=[Depends(jwt_service.decode_token)])
def grounds_donate_show(
        grounds_donate_id: str = Path(...),
        db: Database = Depends(get_db)) -> GroundDonate:
    return grounds_donate_service.grounds_donate_show(grounds_donate_id, db)


@router.get("/",
            dependencies=[Depends(jwt_service.decode_token)])
def grounds_donate_index(
    page: int = Page(),
    page_size: int = PageSize(),
    db: Database = Depends(get_db)
) -> Pagination[GroundDonate]:
    return grounds_donate_service.grounds_donate_index(page, page_size, db)


@router.post("/", status_code=201)
def grounds_donate_store(ground: GroundDonateStore,
                         db: Database = Depends(get_db)) -> GroundDonate:
    return grounds_donate_service.grounds_donate_store(ground, db)


@router.put("/{grounds_donate_id}", status_code=200,
            dependencies=[Depends(jwt_service.decode_token)])
def grounds_donate_update(grounds_donate_id: str = Path(...),
                          update: GroundDonateUpdate = Body(...),
                          db: Database = Depends(get_db)) -> GroundDonate:
    return grounds_donate_service.grounds_donate_update(
        grounds_donate_id, update, db)


@router.delete("/{grounds_donate_id}", status_code=204,
               dependencies=[Depends(jwt_service.decode_token)])
def grounds_donate_delete(grounds_donate_id: str = Path(...),
                          db: Database = Depends(get_db)) -> None:
    return grounds_donate_service.grounds_donate_delete(grounds_donate_id, db)
