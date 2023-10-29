from sqlalchemy import (
    Column,
    Enum,
    ForeignKey,
    Integer,
    LargeBinary,
    String,
    Table,
)
from sqlalchemy.orm import relationship

from .auth.permission import Permission as RolePermission
from ..common.database import Base

user_to_role = Table(
    'user_to_role',
    Base.metadata,

    Column('user_id', ForeignKey('users.id'), primary_key=True),
    Column('role_id', ForeignKey('roles.id'), primary_key=True),
)

role_to_permission = Table(
    'role_to_permission',
    Base.metadata,

    Column('role_id', ForeignKey('roles.id'), primary_key=True),
    Column('permission_id', ForeignKey('permissions.id'), primary_key=True),
)


class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String, nullable=False, unique=True)
    password_hash = Column(LargeBinary, nullable=False, unique=True)
    password_salt = Column(LargeBinary, nullable=False, unique=True)

    session = relationship(
        'Session',
        back_populates='user',
        cascade='all, delete',
        passive_deletes=True,
        uselist=False,
    )
    roles = relationship(
        'Role',
        secondary=user_to_role,
        back_populates='users',
    )

    def __repr__(self):
        return f'User ({self.id}) {self.email}'


class Session(Base):
    __tablename__ = 'sessions'

    id = Column(Integer, primary_key=True)
    session_id = Column(String, unique=True)

    user_id = Column(
        Integer,
        ForeignKey('users.id', ondelete='CASCADE'),
        unique=True,
    )
    user = relationship('User', back_populates='session')

    def __repr__(self):
        return f'Session ({self.session_id}) : {self.user}'


class Role(Base):
    __tablename__ = 'roles'

    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False, unique=True)

    users = relationship(
        'User',
        secondary=user_to_role,
        back_populates='roles',
    )
    permissions = relationship(
        'Permission',
        secondary=role_to_permission,
        back_populates='roles',
    )


class Permission(Base):
    __tablename__ = 'permissions'

    id = Column(Integer, primary_key=True)
    permission = Column(Enum(RolePermission), nullable=False, unique=True)

    roles = relationship(
        'Role',
        secondary=role_to_permission,
        back_populates='permissions',
    )
