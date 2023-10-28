from sqlalchemy import (
    Column,
    ForeignKey,
    Integer,
    LargeBinary,
    String,
)
from sqlalchemy.orm import relationship

from ..common.database import Base


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
