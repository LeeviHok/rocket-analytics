from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from . import crud, schemas
from ..common.database import SessionLocal
from ..users.auth.decorators import authenticate
from ..users.auth.permission import Permission

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/flights', response_model=schemas.FlightMetadata)
@authenticate(permissions=[Permission.CREATE_FLIGHTS])
def create_flight(
    request: Request,
    data: schemas.FlightCreate,
    db: Session = Depends(get_db)
):
    return crud.create_flight(db, data, request.state.user.id)

@router.get('/flights', response_model=list[schemas.FlightMetadata])
@authenticate()
def get_flight_metadata_list(request: Request, db: Session = Depends(get_db)):
    return crud.get_flight_metadata_list(db, request.state.user.id)

@router.get('/flights/{flight_id}', response_model=schemas.Flight)
@authenticate()
def get_flight(
    request: Request,
    flight_id: int,
    db: Session = Depends(get_db)
):
    return crud.get_flight(db, flight_id, request.state.user.id)
