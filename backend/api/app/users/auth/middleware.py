from sqlalchemy import select
from starlette.middleware.base import BaseHTTPMiddleware

from ..models import Session
from ...common.database import SessionLocal


class AuthorizationMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request, call_next):
        with SessionLocal() as db:
            session_id = request.cookies.get('id')
            session_query = select(Session).where(Session.session_id == session_id)
            session = db.scalar(session_query)

            request.state.authenticated = bool(session)
            request.state.permissions = self._get_permissions(session)
            request.state.user = session.user if session else None

            return await call_next(request)

    def _get_permissions(self, session):
        permissions = set()

        if not session:
            return permissions

        for role in session.user.roles:
            for permission in role.permissions:
                permissions.add(permission.permission)

        return permissions
