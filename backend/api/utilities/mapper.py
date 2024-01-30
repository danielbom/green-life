from typing import List, Optional

from bson import ObjectId


def model_from_mongo(Model, item):
    item_dict = dict(item)
    item_dict["id"] = str(item["_id"])
    del item_dict["_id"]
    return Model(**item_dict)


def many_model_from_mongo(Model, items):
    return [model_from_mongo(Model, item) for item in items]


def dict_date_fields(item: dict, *fields: List[str]) -> dict:
    for field in fields:
        if item.get(field):
            item[field] = item[field].isoformat()
    return item


def id_to_str(value):
    if isinstance(value, ObjectId):
        return str(value)
    return value


def order_by_to_mongo(order_by: Optional[List[str]]) -> List[tuple]:
    if not order_by:
        return []
    return [(field[:-3], 1) if field.endswith('_up') else (field[:-5], -1)
            for field in order_by if field]
