from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from .models import Session as UserSession
from .models import User

def get_user(db: Session, email: str):
    user_query = select(User).where(User.email == email)
    return db.scalar(user_query)

def get_session(db: Session, session_id: str):
    session_query = (
        select(UserSession)
        .where(UserSession.session_id == session_id)
    )
    return db.scalar(session_query)

def create_user(db: Session, email: str, pwd_hash: bytes, pwd_salt: bytes):
    user = User(
        email = email,
        password_hash = pwd_hash,
        password_salt = pwd_salt,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def create_session(db: Session, session_id: str, user_id: int):
    session = UserSession(session_id=session_id, user_id=user_id)
    db.add(session)
    db.commit()

def delete_user(db: Session, email: str):
    delete_query = delete(User).where(User.email == email)
    db.execute(delete_query)
    db.commit()

def delete_session(db: Session, session_id: str):
    delete_query = (
        delete(UserSession)
        .where(UserSession.session_id == session_id)
    )
    db.execute(delete_query)
    db.commit()
