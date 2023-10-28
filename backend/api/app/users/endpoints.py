from fastapi import APIRouter, Depends, HTTPException, Request, Response
from sqlalchemy.orm import Session

from . import crud, user, schemas
from ..common.database import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post('/users', status_code=204)
def register(
    credentials: schemas.UserCredentials,
    db: Session = Depends(get_db),
):
    try:
        user.register(credentials.email, credentials.password, db)
    except user.EmailReserved:
        raise HTTPException(
            status_code=409,
            detail='Email address is already in use.',
        )

@router.post('/users/sessions', status_code=204)
def log_in(
    credentials: schemas.UserCredentials,
    response: Response,
    db: Session = Depends(get_db),
):
    try:
        session_id = user.log_in(credentials.email, credentials.password, db)
    except user.InvalidCredentials:
        raise HTTPException(
            status_code=401,
            detail='Invalid email or password.',
        )

    # Remember to set this cookie to secure before deployment
    response.set_cookie(key='id', value=session_id, httponly=True)

@router.delete('/users/me', status_code=204)
def delete_user(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    session_id = request.cookies.get('id')
    try:
        user.delete_user(session_id, db)
    except user.UserDoesNotExist:
        raise HTTPException(
            status_code=404,
            detail='User does not exist for given session.',
        )

    # Remember to set this cookie to secure before deployment
    response.delete_cookie('id', httponly=True)

@router.delete('/users/sessions/me', status_code=204)
def log_out(
    request: Request,
    response: Response,
    db: Session = Depends(get_db),
):
    session_id = request.cookies.get('id')
    crud.delete_session(db, session_id)

    # Remember to set this cookie to secure before deployment
    response.delete_cookie('id', httponly=True)
