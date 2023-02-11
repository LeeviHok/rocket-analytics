from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from . import crud, models, schemas
from .database import engine, SessionLocal

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    'http://localhost:3000',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get('/records', response_model=list[schemas.FlightRecord])
def get_flight_records(db: Session = Depends(get_db)):
    return crud.get_flight_records(db)

@app.post('/records', response_model=schemas.FlightRecord)
def create_flight_record(
    record: schemas.FlightRecordCreate,
    db: Session = Depends(get_db),
):
    return crud.create_flight_record(db, record)

@app.get('/records/{record_id}', response_model=schemas.FlightRecord)
def get_flight_record(record_id: int, db: Session = Depends(get_db)):
    return crud.get_flight_record(db, record_id)

@app.get('/records/{record_id}/data', response_model=schemas.FlightData)
def get_flight_data(record_id: int, db: Session = Depends(get_db)):
    return crud.get_flight_data(db, record_id)

@app.post('/records/{record_id}/data', response_model=schemas.FlightData)
def create_flight_data(
    record_id: int,
    data: schemas.FlightDataCreate,
    db: Session = Depends(get_db)
):
    return crud.create_flight_data(db, record_id, data)
