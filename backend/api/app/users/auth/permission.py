from enum import StrEnum, auto


class Permission(StrEnum):
    CREATE_FLIGHTS = auto()
    CREATE_USER = auto()

    VIEW_PERMISSIONS = auto()
    VIEW_ROLES = auto()
    VIEW_SESSIONS = auto()
    VIEW_USERS = auto()

    DELETE_USERS = auto()
    DELETE_SESSIONS = auto()
