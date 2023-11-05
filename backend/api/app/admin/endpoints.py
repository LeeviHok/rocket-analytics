from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from . import crud, schemas
from ..common.database import SessionLocal
from ..users.auth.decorators import authenticate
from ..users.auth.permission import Permission
from ..users import crud as users_crud

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get('/users', response_model=list[schemas.User])
@authenticate(permissions=[Permission.VIEW_USERS])
def get_users(db: Session = Depends(get_db)):
    return [user for user in crud.get_users(db)]

@router.get('/permissions', response_model=list[schemas.Permission])
@authenticate(permissions=[Permission.VIEW_PERMISSIONS])
def get_permissions(db: Session = Depends(get_db)):
    return [permission for permission in crud.get_permissions(db)]

@router.get('/roles', response_model=list[schemas.Role])
@authenticate(permissions=[Permission.VIEW_ROLES])
def get_roles(db: Session = Depends(get_db)):
    return [role for role in crud.get_roles(db)]

@router.get('/sessions', response_model=list[schemas.Session])
@authenticate(permissions=[Permission.VIEW_SESSIONS])
def get_sessions(db: Session = Depends(get_db)):
    return [
        {'email': session.user.email, 'session_id': session.session_id}
        for session in crud.get_sessions(db)
    ]

@router.delete('/sessions', status_code=204)
@authenticate(permissions=[Permission.DELETE_SESSIONS])
def delete_session(session_id: str, db: Session = Depends(get_db)):
    session = users_crud.get_session(db, session_id)
    if not session:
        raise HTTPException(
            status_code=404,
            detail='Session does not exist.',
        )

    users_crud.delete_session(db, session_id)

@router.delete('/users/{user_id}', status_code=204)
@authenticate(permissions=[Permission.DELETE_USERS])
def delete_user(user_id: int, db: Session = Depends(get_db)):
    user = crud.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=404,
            detail='User does not exist.',
        )

    users_crud.delete_user(db, user.email)
