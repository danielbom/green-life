'''
Database models
'''
from datetime import date
from enum import Enum
from typing import List, Literal, Optional

from pydantic import BaseModel, validator

from api.utilities.mapper import dict_date_fields, id_to_str


class Manager(BaseModel):
    start_at: date
    end_at: Optional[date] = None

    def dict(self, *args, **kwargs):
        # Normalize dict to be an acceptable json
        data = super().dict(*args, **kwargs)
        dict_date_fields(data, 'start_at', 'end_at')
        return data


class User(BaseModel):
    id: str
    name: str
    email: str
    password: str
    cellphone: str
    manager: Optional[Manager] = None
    version: int = 1


class BedStatus(str, Enum):
    FREE = 'free'
    OCCUPIED = 'occupied'
    COMPLETE = 'complete'


class Bed(BaseModel):
    label: str
    active: bool = True
    free: bool = True
    bed_schedules_id: Optional[str] = None
    # Sync with current BedSchedule
    seed_id: Optional[str] = None
    end_at: Optional[date] = None
    # Not persisted
    status: BedStatus = BedStatus.FREE

    @validator('bed_schedules_id', 'seed_id', pre=True)
    def mongo_id(cls, value):
        return id_to_str(value)

    def dict(self, *args, **kwargs):
        # Normalize dict to be an acceptable json
        data = super().dict(*args, **kwargs)
        dict_date_fields(data, 'end_at')
        # compute status
        if self.free:
            data['status'] = BedStatus.FREE
        elif self.end_at is not None and self.end_at < date.today():
            data['status'] = BedStatus.COMPLETE
        else:
            data['status'] = BedStatus.OCCUPIED
        return data


class Ground(BaseModel):
    id: str
    address: str
    width: int
    length: int
    description: str
    owner_id: Optional[str]
    manager_id: Optional[str]
    active: bool = True
    beds: List[Bed] = []
    beds_count: int = 0

    @validator('owner_id', 'manager_id', pre=True)
    def mongo_id(cls, value):
        return id_to_str(value)


class BedSchedule(BaseModel):
    seed_id: str
    start_at: date
    end_at: date

    @validator('seed_id', pre=True)
    def mongo_id(cls, value):
        return id_to_str(value)

    def dict(self, *args, **kwargs):
        # Normalize dict to be an acceptable json
        data = super().dict(*args, **kwargs)
        dict_date_fields(data, 'start_at', 'end_at')
        return data


class BedSchedules(BaseModel):
    id: str
    ground_id: str
    bed_label: str
    # TODO: Add created_at
    schedules: List[BedSchedule] = []
    current_schedule: Optional[int] = None

    @validator('ground_id', pre=True)
    def mongo_id(cls, value):
        return id_to_str(value)


class Tool(BaseModel):
    id: str
    name: str
    description: str
    amount: int


SeedType = Literal['vegetable', 'fruit', 'herb', 'other']


class Seed(BaseModel):
    id: str
    name: str
    description: str
    amount: int
    seed_type: SeedType


class Voluntary(BaseModel):
    id: str
    people_name: str
    people_id: str
    ground_id: str
    bed_label: str
    is_responsible: bool
    start_at: date
    end_at: Optional[date] = None

    @validator('people_id', 'ground_id', pre=True)
    def mongo_id(cls, value):
        return id_to_str(value)

    def dict(self, *args, **kwargs):
        # Normalize dict to be an acceptable json
        data = super().dict(*args, **kwargs)
        dict_date_fields(data, 'start_at', 'end_at')
        return data


class People(BaseModel):
    id: str
    name: str
    email: str
    cellphone: str
    birth_date: date
    address: str


class VoluntaryUsingTool(BaseModel):
    id: str
    voluntary_id: str
    tool_id: str
    start_at: date
    end_at: Optional[date] = None

    @validator('voluntary_id', 'tool_id', pre=True)
    def mongo_id(cls, value):
        return id_to_str(value)

    def dict(self, *args, **kwargs):
        # Normalize dict to be an acceptable json
        data = super().dict(*args, **kwargs)
        dict_date_fields(data, 'start_at', 'end_at')
        return data


class VoluntaryUsingSeed(BaseModel):
    id: str
    voluntary_id: str
    seed_id: str
    start_at: date
    end_at: Optional[date] = None

    @validator('voluntary_id', 'seed_id', pre=True)
    def mongo_id(cls, value):
        return id_to_str(value)

    def dict(self, *args, **kwargs):
        # Normalize dict to be an acceptable json
        data = super().dict(*args, **kwargs)
        dict_date_fields(data, 'start_at', 'end_at')
        return data


class GroundDonate(BaseModel):
    id: str
    name: str
    email: str
    cellphone: str
    birth_date: date
    address: str
    ground_address: str


class VoluntaryRequest(BaseModel):
    id: str
    name: str
    email: str
    cellphone: str
    birth_date: date
    address: str
