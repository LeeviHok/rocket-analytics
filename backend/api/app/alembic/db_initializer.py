import logging
import os

from sqlalchemy import select

from ..common.aws import SecretsManager
from ..common.database import SessionLocal
from ..users.auth.permission import Permission as RolePermission
from ..users.auth.default_role import DefaultRole
from ..users.models import Permission, Role
from ..users import user

uvicorn_logger = logging.getLogger('uvicorn')
logger = logging.getLogger(__name__)
logger.setLevel(uvicorn_logger.level)

def insert_initial_data():
    db = SessionLocal()

    # Database is initialized already if it contains permissions
    permission_query = select(Permission)
    if db.scalars(permission_query).first():
        logger.info('Database is already initialized.')
        return
    logger.info('Initializing the database.')

    if os.getenv('APP_ENV') == 'dev':
        try:
            admin_email = os.environ['ADMIN_USER_EMAIL']
            admin_password = os.environ['ADMIN_USER_PASSWORD']
        except KeyError as e:
            raise KeyError(f'Environment variable is not set: {e}. It is '
                            'required to setup website admin user.') from e

    elif os.getenv('APP_ENV') == 'prod':
        secrets_manager = SecretsManager()
        admin_credentials = secrets_manager.get_secret('AdminUser')
        admin_email = admin_credentials['email']
        admin_password = admin_credentials['password']

    else:
        raise KeyError('Environment variable is not set: APP_ENV. It is '
                       'required to differentiate between prod and dev.')

    permissions = [
        Permission(permission=permission) for permission in RolePermission
    ]
    db.add_all(permissions)
    db.commit()
    for permission in permissions:
        db.refresh(permission)

    admin_role = Role(name=DefaultRole.ADMIN.value, permissions=permissions)
    db.add(admin_role)
    db.commit()
    db.refresh(admin_role)

    admin_user = user.register(admin_email, admin_password, db)
    admin_user.roles = [admin_role]
    db.commit()

    db.close()
    logger.info('Database initialization completed.')
