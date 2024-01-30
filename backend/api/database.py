from typing import Any, Generator

# alternatively to pymongo, use motor.motor_asyncio.AsyncIOMotorClient to
# use async/await
from pymongo import MongoClient
from pymongo.database import Database

from api.env import settings

mongo_client = MongoClient(settings.mongo_uri)


def get_db() -> Generator[Database, Any, None]:
    yield mongo_client.activity
