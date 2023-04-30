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

@prefix_router.post('/flights', response_model=schemas.FlightMetadata)
def create_flight(data: schemas.FlightCreate, db: Session = Depends(get_db)):
    return crud.create_flight(db, data)

@prefix_router.get('/flights', response_model=list[schemas.FlightMetadata])
def get_flight_metadata_list(db: Session = Depends(get_db)):
    return crud.get_flight_metadata_list(db)

@prefix_router.get('/flights/{flight_id}', response_model=schemas.Flight)
def get_flight(flight_id: int, db: Session = Depends(get_db)):
    return crud.get_flight(db, flight_id)

app.include_router(prefix_router)
