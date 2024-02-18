import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

try:
    PSQL_USER = os.environ['POSTGRES_USERNAME']
    PSQL_PWD = os.environ['POSTGRES_PASSWORD']
    PSQL_DOMAIN = os.environ['POSTGRES_DOMAIN']
    PSQL_DB = os.environ['POSTGRES_DATABASE']
except KeyError as e:
    raise KeyError(f'Environment variable is not set: {e}. It is required to '
                    'connect to the database.') from e

PSQL_DATABASE_URL =(
    f'postgresql://{PSQL_USER}:{PSQL_PWD}@{PSQL_DOMAIN}/{PSQL_DB}'
)

engine = create_engine(PSQL_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass
