from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from . import models, schemas
from .standard_atmosphere import StandardAtmosphere as SA

def create_flight(db: Session, data: schemas.FlightCreate):
    flight = models.Flight(**data.dict())

    # Calculate and add derived data
    flight.altitude_asl = []
    flight.altitude_agl = []
    pressure_ground = flight.pressure[0]
    for pressure in flight.pressure:
        altitude_asl = SA.get_altitude_asl(pressure)
        altitude_agl = SA.get_altitude_agl(pressure, pressure_ground)
        flight.altitude_asl.append(altitude_asl)
        flight.altitude_agl.append(altitude_agl)

    db.add(flight)
    db.commit()

    db.refresh(flight)
    return flight

def get_flight(db: Session, flight_id: int):
    flight = db.get(models.Flight, flight_id)
    if not flight:
        raise HTTPException(
            status_code=404,
            detail='Flight record with given ID does not exist.'
        )
    return flight

def get_flight_metadata_list(db: Session):
    return db.execute(
        select(
            models.Flight.id,
            models.Flight.flight_datetime,
            models.Flight.rocket_name,
        ).order_by(models.Flight.flight_datetime)
    ).all()
