import hashlib
from base64 import b64encode
from secrets import compare_digest, SystemRandom

from . import crud


class EmailReserved(Exception):
    pass


class InvalidCredentials(Exception):
    pass


class UserDoesNotExist(Exception):
    pass


def log_in(email, password, db):
    # Check if this lookup could be made constant time
    user = crud.get_user(db, email)
    if not user:
        password_salt = bytes()
        password_hash = bytes()
    else:
        password_salt = user.password_salt
        password_hash = user.password_hash

    # Compute hash always for constant time authentication
    hash = _get_hash(password.encode(), password_salt)
    if not compare_digest(hash, password_hash):
        raise InvalidCredentials

    if user.session:
        crud.delete_session(db, user.session.session_id)

    session_id = _generate_session_id()
    crud.create_session(db, session_id, user.id)

    return session_id

def register(email, password, db):
    # New user with same email could be created after this check, but before
    # this one is stored into the database. This would result into failure in
    # the transaction.
    if crud.get_user(db, email):
        raise EmailReserved

    salt = _generate_salt()
    hash = _get_hash(password.encode(), salt)

    return crud.create_user(db, email, hash, salt)

def delete_user(session_id, db):
    session = crud.get_session(db, session_id)
    if not session:
        raise UserDoesNotExist

    crud.delete_user(db, session.user.email)

def _generate_session_id():
    return b64encode(SystemRandom().randbytes(64)).decode('ascii')

def _generate_salt():
    return SystemRandom().randbytes(64)

def _get_hash(password, salt):
    # Parameters according to the OWASP password storage cheat sheet
    n = 32768
    r = 8
    p = 10
    mem = 35 * 10**6
    return hashlib.scrypt(password, salt=salt, n=n, r=r, p=p, maxmem=mem)
