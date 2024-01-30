from datetime import date

from dateutil.relativedelta import relativedelta


def must_be_positive(name: str, v: int) -> int:
    if v <= 0:
        raise ValueError(f'{name} must be positive')
    return v


def must_represent_an_adult(name: str, v: date | str) -> date:
    if isinstance(v, str):
        v = date.fromisoformat(v)
    age = relativedelta(date.today(), v).years
    if age < 18:
        raise ValueError(f'{name} must represent an adult')
    return v
