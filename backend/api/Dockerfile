# Base image to build subsequent images off of
FROM python:3.11 AS base

ENV PIP_DISABLE_PIP_VERSION_CHECK=on
ENV PIP_ROOT_USER_ACTION=ignore
ENV PYTHONFAULTHANDLER=1
ENV PYTHONUNBUFFERED=1


# Temporary image to install Python dependencies. The dependencies are
# installed into a virtual environment, which is copied later on into runtime
# image. This way the build tools do not end up into the final runtime image.
FROM base AS dep-installer

# Install pipenv
RUN pip install pipenv

# Install Python dependencies in virtual environment
COPY backend/api/Pipfile .
COPY backend/api/Pipfile.lock .
ENV PIPENV_VENV_IN_PROJECT=1
RUN pipenv install --deploy


# Final runtime image which contains everyting to run the API
FROM base AS runtime

# Copy virtual environment and activate it
COPY --from=dep-installer /.venv /.venv
ENV VIRTUAL_ENV="/.venv"
ENV PATH="/.venv/bin:$PATH"

# Create and switch to a new user
RUN useradd --create-home appuser
WORKDIR /home/appuser
USER appuser

# Copy the application software
COPY ./backend/api/api ./api

# Start the application
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "8000"]
