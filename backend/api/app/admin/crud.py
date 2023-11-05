from sqlalchemy import select
from sqlalchemy.orm import Session

from ..users.models import Session as UserSession
from ..users.models import Permission, Role, User

def get_permissions(db: Session):
    permission_query = select(Permission)
    return db.scalars(permission_query)

def get_roles(db: Session):
    role_query = select(Role)
    return db.scalars(role_query)

def get_sessions(db: Session):
    session_query = select(UserSession)
    return db.scalars(session_query)

def get_user_by_id(db: Session, user_id: int):
    user_query = select(User).where(User.id == user_id)
    return db.scalar(user_query)

def get_users(db: Session):
    user_query = select(User)
    return db.scalars(user_query)
