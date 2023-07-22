from fastapi import APIRouter, FastAPI

from .common.database import Base, engine
from .flight_analytics.endpoints import router as flight_analytics_router

Base.metadata.create_all(bind=engine)

# Prefix for all endpoints and documentation
API_PREFIX = '/api'
DOCS_URL = f'{API_PREFIX}/docs'
REDOC_URL = f'{API_PREFIX}/redoc'
OPENAPI_URL = f'{API_PREFIX}/openapi.json'

app = FastAPI(docs_url=DOCS_URL, redoc_url=REDOC_URL, openapi_url=OPENAPI_URL)
prefix_router = APIRouter(prefix=API_PREFIX)

prefix_router.include_router(flight_analytics_router)

app.include_router(prefix_router)
