import os

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, sessionmaker

from .aws import SecretsManager

try:
    os.environ['APP_ENV']
except KeyError as e:
    raise KeyError('Environment variable is not set: APP_ENV. It is required '
                   'to differentiate between prod and dev.')

# Get secrets from environment variables in dev
if os.getenv('APP_ENV') == 'dev':
    try:
        PSQL_USER = os.environ['POSTGRES_USERNAME']
        PSQL_PWD = os.environ['POSTGRES_PASSWORD']
    except KeyError as e:
        raise KeyError(f'Environment variable is not set: {e}. It is required '
                        'to connect to the database.') from e

# Get secrets from secrets manager in prod
elif os.getenv('APP_ENV') == 'prod':
    secrets_manager = SecretsManager()
    postgres_credentials = secrets_manager.get_secret('PostgresUser')
    PSQL_USER = postgres_credentials['username']
    PSQL_PWD = postgres_credentials['password']

else:
    raise KeyError('APP_ENV environment variable has invalid value: '
        f'{os.environ["APP_ENV"]}. Valid values are "dev" or "prod".')

# Get other non-sensitive data from environment variables
try:
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
