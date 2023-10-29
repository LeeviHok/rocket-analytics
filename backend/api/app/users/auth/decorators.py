import functools
import inspect

from fastapi import HTTPException, Request

def authenticate(permissions=[]):
    def decorator(func):
        @functools.wraps(func)
        def decorated(*args,**kwargs):
            request = kwargs[request_parameter_name]
            if not request['state']['authenticated']:
                raise HTTPException(
                    status_code=401,
                    detail='Authentication required.',
                )

            for permission in permissions:
                if permission not in request['state']['permissions']:
                    raise HTTPException(
                        status_code=403,
                        detail='Permission required.',
                    )

            # Delete request parameter if it isn't in the original function
            # signature.
            if delete_request_parameter:
                del kwargs[request_parameter_name]

            return func(*args, **kwargs)

        # This decorator needs Starlette's Request object to perform
        # authentication and authorization. If it is already in function
        # signature, we will use that parameter. Otherwise we will add it to
        # the signature, so that FastAPI will inject it to the decorator.
        request_parameter_name = None
        delete_request_parameter = False
        signature = inspect.signature(func)
        parameters = list(signature.parameters.values())
        for parameter in parameters:
            if issubclass(parameter.annotation, Request):
                request_parameter_name = parameter.name
                break

        if not request_parameter_name:
            request_parameter_name = 'request'
            delete_request_parameter = True
            request_parameter = inspect.Parameter(
                name='request',
                kind=inspect.Parameter.KEYWORD_ONLY,
                default=inspect.Parameter.empty,
                annotation=Request,
            )
            parameters.append(request_parameter)
            decorated.__signature__ = signature.replace(parameters=parameters)

        return decorated
    return decorator
