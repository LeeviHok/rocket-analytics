from fastapi import APIRouter, Depends, FastAPI
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

# Prefix for all endpoints and documentation
API_PREFIX = '/api'
DOCS_URL = f'{API_PREFIX}/docs'
REDOC_URL = f'{API_PREFIX}/redoc'
OPENAPI_URL = f'{API_PREFIX}/openapi.json'

app = FastAPI(docs_url=DOCS_URL, redoc_url=REDOC_URL, openapi_url=OPENAPI_URL)
prefix_router = APIRouter(prefix=API_PREFIX)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@prefix_router.get('/records', response_model=list[schemas.FlightRecord])
def get_flight_records(db: Session = Depends(get_db)):
    return crud.get_flight_records(db)

@prefix_router.post('/records', response_model=schemas.FlightRecord)
def create_flight_record(
    record: schemas.FlightRecordCreate,
    db: Session = Depends(get_db),
):
    return crud.create_flight_record(db, record)

@prefix_router.get('/records/{record_id}', response_model=schemas.FlightRecord)
def get_flight_record(record_id: int, db: Session = Depends(get_db)):
    return crud.get_flight_record(db, record_id)

@prefix_router.get('/records/{record_id}/data', response_model=schemas.FlightData)
def get_flight_data(record_id: int, db: Session = Depends(get_db)):
    return crud.get_flight_data(db, record_id)

@prefix_router.post('/records/{record_id}/data', response_model=schemas.FlightData)
def create_flight_data(
    record_id: int,
    data: schemas.FlightDataCreate,
    db: Session = Depends(get_db)
):
    return crud.create_flight_data(db, record_id, data)

app.include_router(prefix_router)
