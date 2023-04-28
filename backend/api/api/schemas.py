from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class FlightDataBase(BaseModel):
    time: list[Decimal]
    accel_axial: list[Decimal]
    accel_lateral: list[Decimal]
    pressure: list[Decimal]
    current: list[Decimal]
    temperature: list[Decimal]
    velocity: list[Decimal]
    voltage_battery: list[Decimal]
    voltage_pyro_apogee: list[Decimal]
    voltage_pyro_main: list[Decimal]
    voltage_pyro_3: list[Decimal]
    voltage_pyro_4: list[Decimal]


class FlightDataCreate(FlightDataBase):
    pass


class FlightData(FlightDataBase):
    id: int
    altitude_asl: list[Decimal]
    altitude_agl: list[Decimal]

    class Config:
        orm_mode = True


class FlightRecordBase(BaseModel):
    rocket_name: str
    flight_datetime: datetime


class FlightRecordCreate(FlightRecordBase):
    pass


class FlightRecord(FlightRecordBase):
    id: int

    class Config:
        orm_mode = True
