from fastapi import HTTPException
from sqlalchemy import insert
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from . import models, schemas
from .standard_atmosphere import StandardAtmosphere as SA

def get_flight_record(db: Session, record_id: int):
    flight_record = db.get(models.FlightRecord, record_id)
    if not flight_record:
        raise HTTPException(
            status_code=404,
            detail='Flight record with given ID does not exist.'
        )
    return flight_record

def get_flight_records(db: Session):
    return db.query(models.FlightRecord).all()

def create_flight_record(db: Session, record: schemas.FlightRecordCreate):
    flight_record = models.FlightRecord(**record.dict())

    db.add(flight_record)
    try:
        db.commit()
    except IntegrityError:
        # Rollback the session in case same session will be used later on.
        db.rollback()
        raise HTTPException(
            status_code=400, detail='Failed to create flight record.'
        )

    db.refresh(flight_record)
    return flight_record

def get_flight_data(db: Session, record_id: int):
    flight_data = get_flight_record(db, record_id).flight_data
    if not flight_data:
        raise HTTPException(
            status_code=404,
            detail='Flight record does not have any flight data.'
        )
    return flight_data

def create_flight_data(
    db: Session, record_id: int, data: schemas.FlightDataCreate
):
    get_flight_record(db, record_id)
    flight_data = models.FlightData(**data.dict())
    flight_data.flight_record_id = record_id

    # Calculate and add derived data.
    flight_data.altitude_asl = []
    flight_data.altitude_agl = []
    pressure_ground = flight_data.pressure[0]
    for pressure in flight_data.pressure:
        altitude_asl = SA.get_altitude_asl(pressure)
        altitude_agl = SA.get_altitude_agl(pressure, pressure_ground)
        flight_data.altitude_asl.append(altitude_asl)
        flight_data.altitude_agl.append(altitude_agl)

    db.add(flight_data)
    try:
        db.commit()
    except IntegrityError:
        # Rollback the session in case same session will be used later on.
        db.rollback()
        raise HTTPException(
            status_code=400,
            detail='Failed to create flight data for this record.'
        )

    db.refresh(flight_data)
    return flight_data
