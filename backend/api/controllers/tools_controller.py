from typing import List, Optional

from fastapi import APIRouter, Body, Depends, Path, Query

import api.services.jwt_service as jwt_service
import api.services.tools_service as tools_service
from api.concerns import OrderBy, Page, PageSize, Pagination
from api.database import Database, get_db
from api.services.tools_service import Tool, ToolOrderBy, ToolStore, ToolUpdate

router = APIRouter(
    prefix="/tools",
    tags=["Tools"],
    dependencies=[Depends(jwt_service.decode_token)]
)


@router.get("/{tool_id}")
def tool_show(
        tool_id: str = Path(...),
        db: Database = Depends(get_db)) -> Tool:
    return tools_service.tool_show(tool_id, db)


@router.get("/")
def tool_index(
    page: int = Page(),
    page_size: int = PageSize(),
    order_by: List[ToolOrderBy] = OrderBy(),
    search: Optional[str] = Query(None),
    db: Database = Depends(get_db)
) -> Pagination[Tool]:
    return tools_service.tool_index(page, page_size, order_by, search, db)


@router.post("/", status_code=201)
def tool_store(tool: ToolStore,
               db: Database = Depends(get_db)) -> Tool:
    return tools_service.tool_store(tool, db)


@router.put("/{tool_id}", status_code=200)
def tool_update(tool_id: str = Path(...),
                update: ToolUpdate = Body(...),
                db: Database = Depends(get_db)) -> Tool:
    return tools_service.tool_update(tool_id, update, db)


@router.delete("/{tool_id}", status_code=204)
def tool_delete(tool_id: str = Path(...),
                db: Database = Depends(get_db)) -> None:
    return tools_service.tool_delete(tool_id, db)
