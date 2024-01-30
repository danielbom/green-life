from typing import List, Optional

from fastapi import APIRouter, Body, Depends, Path, Query

import api.services.jwt_service as jwt_service
import api.services.seeds_service as seeds_service
from api.concerns import OrderBy, Page, PageSize, Pagination
from api.database import Database, get_db
from api.services.seeds_service import Seed, SeedOrderBy, SeedStore, SeedUpdate

router = APIRouter(
    prefix="/seeds",
    tags=["Seeds"],
    dependencies=[Depends(jwt_service.decode_token)]
)


@router.get("/{seed_id}")
def seed_show(seed_id: str = Path(...),
              db: Database = Depends(get_db)) -> Seed:
    return seeds_service.seed_show(seed_id, db)


@router.get("/")
def seed_index(page: int = Page(),
               page_size: int = PageSize(),
               order_by: List[SeedOrderBy] = OrderBy(),
               search: Optional[str] = Query(None),
               db: Database = Depends(get_db)) -> Pagination[Seed]:
    return seeds_service.seed_index(page, page_size, order_by, search, db)


@router.post("/", status_code=201)
def seed_store(seed: SeedStore,
               db: Database = Depends(get_db)) -> Seed:
    return seeds_service.seed_store(seed, db)


@router.put("/{seed_id}", status_code=200)
def seed_update(seed_id: str = Path(...),
                update: SeedUpdate = Body(...),
                db: Database = Depends(get_db)) -> Seed:
    return seeds_service.seed_update(seed_id, update, db)


@router.delete("/{seed_id}", status_code=204)
def seed_delete(seed_id: str = Path(...),
                db: Database = Depends(get_db)) -> None:
    return seeds_service.seed_delete(seed_id, db)
