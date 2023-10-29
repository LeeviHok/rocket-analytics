from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel


class FlightMetadataBase(BaseModel):
    flight_datetime: datetime
    rocket_name: str


class FlightMetadata(FlightMetadataBase):
    id: int

    class Config:
        from_attributes = True


class FlightBase(FlightMetadataBase, BaseModel):
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


class FlightCreate(FlightBase):
    pass


class Flight(FlightMetadata, FlightBase):
    altitude_asl: list[Decimal]
    altitude_agl: list[Decimal]

    class Config:
        from_attributes = True
