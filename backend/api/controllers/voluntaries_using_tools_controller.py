from typing import Optional

from fastapi import APIRouter, Depends, Path, Query

import api.services.jwt_service as jwt_service
import api.services.voluntaries_using_tools_service as voluntaries_using_tools_service
from api.concerns import Page, PageSize, Pagination
from api.database import Database, get_db
from api.services.voluntaries_using_tools_service import (
    VoluntaryUsingTool, VoluntaryUsingToolStart)

router = APIRouter(
    prefix="/voluntaries-using-tools",
    tags=["Voluntaries Using Tool"],
    dependencies=[Depends(jwt_service.decode_token)]
)


@router.get("/{voluntary_using_tool_id}")
def voluntary_using_tool_show(
        voluntary_using_tool_id: str = Path(...),
        db: Database = Depends(get_db)) -> VoluntaryUsingTool:
    return voluntaries_using_tools_service.voluntary_using_tool_show(
        voluntary_using_tool_id, db)


@router.get("/")
def voluntary_using_tool_index(
    page: int = Page(),
    page_size: int = PageSize(),
    voluntary_id: Optional[str] = Query(None),
    tool_id: Optional[str] = Query(None),
    ground_id: Optional[str] = Query(None),
    bed_label: Optional[str] = Query(None),
    db: Database = Depends(get_db)
) -> Pagination[VoluntaryUsingTool]:
    return voluntaries_using_tools_service.voluntary_using_tool_index(
        page, page_size, db,
        voluntary_id=voluntary_id,
        tool_id=tool_id,
        ground_id=ground_id,
        bed_label=bed_label)


@router.post("/start")
def voluntary_using_tool_start(
        voluntary_using_tool: VoluntaryUsingToolStart,
        db: Database = Depends(get_db)) -> VoluntaryUsingTool:
    return voluntaries_using_tools_service.voluntary_using_tool_start(
        voluntary_using_tool, db)


@router.put("/end/{voluntary_using_tool_id}")
def voluntary_using_tool_end(
        voluntary_using_tool_id: str = Path(...),
        db: Database = Depends(get_db)) -> VoluntaryUsingTool:
    return voluntaries_using_tools_service.voluntary_using_tool_end(
        voluntary_using_tool_id, db)


@router.delete("/{voluntary_using_tool_id}", status_code=204)
def voluntary_using_tool_delete(
        voluntary_using_tool_id: str = Path(...),
        db: Database = Depends(get_db)) -> None:
    return voluntaries_using_tools_service.voluntary_using_tool_delete(
        voluntary_using_tool_id, db)
