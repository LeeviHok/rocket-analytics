from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import models, schemas
from .standard_atmosphere import StandardAtmosphere as SA

def create_flight(db: Session, data: schemas.FlightCreate):
    metadata_fields = {'rocket_name', 'flight_datetime'}
    flight_metadata = models.FlightRecord(**data.dict(include=metadata_fields))
    flight_data = models.FlightData(**data.dict(exclude=metadata_fields))

    # Calculate and add derived data
    flight_data.altitude_asl = []
    flight_data.altitude_agl = []
    pressure_ground = flight_data.pressure[0]
    for pressure in flight_data.pressure:
        altitude_asl = SA.get_altitude_asl(pressure)
        altitude_agl = SA.get_altitude_agl(pressure, pressure_ground)
        flight_data.altitude_asl.append(altitude_asl)
        flight_data.altitude_agl.append(altitude_agl)

    db.add(flight_metadata)
    try:
        db.commit()
        flight_data.flight_record_id = flight_metadata.id
        db.add(flight_data)
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=400, detail='Failed to create flight record.'
        )

    db.refresh(flight_metadata)
    return flight_metadata

def get_flight(db: Session, flight_id: int):
    flight_metadata = get_flight_metadata(db, flight_id)
    flight_data = flight_metadata.flight_data
    if not flight_data:
        raise HTTPException(
            status_code=404,
            detail='Flight data does not exist for given flight record.'
        )

    flight = {}
    flight['id'] = flight_metadata.id
    flight['rocket_name'] = flight_metadata.rocket_name
    flight['flight_datetime'] = flight_metadata.flight_datetime
    flight['time'] = flight_data.time
    flight['accel_axial'] = flight_data.accel_axial
    flight['accel_lateral'] = flight_data.accel_lateral
    flight['pressure'] = flight_data.pressure
    flight['current'] = flight_data.current
    flight['temperature'] = flight_data.temperature
    flight['velocity'] = flight_data.velocity
    flight['voltage_battery'] = flight_data.voltage_battery
    flight['voltage_pyro_apogee'] = flight_data.voltage_pyro_apogee
    flight['voltage_pyro_main'] = flight_data.voltage_pyro_main
    flight['voltage_pyro_3'] = flight_data.voltage_pyro_3
    flight['voltage_pyro_4'] = flight_data.voltage_pyro_4
    flight['altitude_asl'] = flight_data.altitude_asl
    flight['altitude_agl'] = flight_data.altitude_agl

    return flight

def get_flight_metadata_list(db: Session):
    return db.scalars(
        select(models.FlightRecord).order_by(models.FlightRecord.id)
    ).all()

def get_flight_metadata(db: Session, flight_id):
    flight_metadata = db.get(models.FlightRecord, flight_id)
    if not flight_metadata:
        raise HTTPException(
            status_code=404,
            detail='Flight record with given ID does not exist.'
        )
    return flight_metadata
