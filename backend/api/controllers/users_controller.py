from fastapi import APIRouter, Body, Depends, Path

import api.services.jwt_service as jwt_service
import api.services.users_service as users_service
from api.concerns import Page, PageSize, Pagination
from api.database import Database, get_db
from api.services.users_service import UserResponse, UserStore, UserUpdate

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    dependencies=[Depends(jwt_service.decode_token)]
)


@router.get("/{user_id}")
def user_show(
        user_id: str = Path(...),
        db: Database = Depends(get_db)) -> UserResponse:
    return users_service.user_show(user_id, db)


@router.get("/")
def user_index(
    page: int = Page(),
    page_size: int = PageSize(),
    db: Database = Depends(get_db)
) -> Pagination[UserResponse]:
    return users_service.user_index(page, page_size, db)


@router.post("/", status_code=201)
def user_store(user: UserStore,
               db: Database = Depends(get_db)) -> UserResponse:
    return users_service.user_store(user, db)


@router.put("/{user_id}", status_code=200)
def user_update(user_id: str = Path(...),
                update: UserUpdate = Body(...),
                db: Database = Depends(get_db)) -> UserResponse:
    return users_service.user_update(user_id, update, db)


@router.delete("/{user_id}", status_code=204)
def user_delete(user_id: str = Path(...),
                db: Database = Depends(get_db)) -> None:
    return users_service.user_delete(user_id, db)
