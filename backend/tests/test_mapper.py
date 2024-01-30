from datetime import date, datetime

import pytest

from api.utilities.mapper import dict_date_fields


@pytest.mark.parametrize("item", [
    {},
    {"start_at": None, "end_at": None},
    {"start_at": date.today(), "end_at": date.today()},
    {"start_at": datetime.today(), "end_at": datetime.today()},
])
def test_dict_date_fields(item):
    fields = ['start_at', 'end_at']
    dict_date_fields(item, *fields)
    for field in fields:
        assert item.get(field) is None or isinstance(item[field], str)
