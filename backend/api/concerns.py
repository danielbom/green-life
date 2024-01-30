from typing import Generic, List, TypeVar

from fastapi import Query
from pydantic import BaseModel

T = TypeVar('T')


class Pagination(BaseModel, Generic[T]):
    entities: List[T]
    row_count: int


def Page():
    return Query(1, ge=1)


def PageSize(default=10):
    return Query(default, ge=1, le=100)


def OrderBy():
    return Query([])
