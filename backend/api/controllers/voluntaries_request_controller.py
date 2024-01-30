from fastapi import APIRouter, Body, Depends, Path

import api.services.jwt_service as jwt_service
import api.services.voluntaries_request_service as voluntaries_request_service
from api.concerns import Page, PageSize, Pagination
from api.database import Database, get_db
from api.services.voluntaries_request_service import (VoluntaryRequest,
                                                      VoluntaryRequestStore,
                                                      VoluntaryRequestUpdate)

router = APIRouter(
    prefix="/voluntaries-request",
    tags=["Voluntaries Request"]
)


@router.get("/{voluntary_request_id}",
            dependencies=[Depends(jwt_service.decode_token)])
def voluntary_request_show(
        voluntary_request_id: str = Path(...),
        db: Database = Depends(get_db)) -> VoluntaryRequest:
    return voluntaries_request_service.voluntary_request_show(
        voluntary_request_id, db)


@router.get("/", dependencies=[Depends(jwt_service.decode_token)])
def voluntary_request_index(
    page: int = Page(),
    page_size: int = PageSize(),
    db: Database = Depends(get_db)
) -> Pagination[VoluntaryRequest]:
    return voluntaries_request_service.voluntary_request_index(
        page, page_size, db)


@router.post("/", status_code=201)
def voluntary_request_store(voluntary: VoluntaryRequestStore,
                            db: Database = Depends(get_db)) -> VoluntaryRequest:
    return voluntaries_request_service.voluntary_request_store(voluntary, db)


@router.put("/{voluntary_request_id}", status_code=200,
            dependencies=[Depends(jwt_service.decode_token)])
def voluntary_request_update(voluntary_request_id: str = Path(...),
                             update: VoluntaryRequestUpdate = Body(...),
                             db: Database = Depends(get_db)) -> VoluntaryRequest:
    return voluntaries_request_service.voluntary_request_update(
        voluntary_request_id, update, db)


@router.delete("/{voluntary_request_id}", status_code=204,
               dependencies=[Depends(jwt_service.decode_token)])
def voluntary_request_delete(
        voluntary_request_id: str = Path(...),
        db: Database = Depends(get_db)) -> None:
    return voluntaries_request_service.voluntary_request_delete(
        voluntary_request_id, db)
