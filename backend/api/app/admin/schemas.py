from pydantic import BaseModel

from ..users.auth.permission import Permission as RolePermission


class Permission(BaseModel):
    id: int
    permission: RolePermission

    class Config:
        from_attributes = True


class Role(BaseModel):
    id: int
    name: str
    permissions: list[Permission]

    class Config:
        from_attributes = True


class User(BaseModel):
    id: int
    email: str

    class Config:
        from_attributes = True


class Session(BaseModel):
    email: str
    session_id: str

    class Config:
        from_attributes = True
