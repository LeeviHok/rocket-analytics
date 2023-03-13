FROM postgres:15.2

ARG PSQL_USER
ARG PSQL_PWD
ARG PSQL_DB

# Secrets are provided as arguments. Verify that those have non-empty value.
RUN if [ -z ${PSQL_USER} ]; then echo "'PSQL_USER' is empty."; exit 1; fi
RUN if [ -z ${PSQL_PWD}  ]; then echo "'PSQL_PWD' is empty.";  exit 1; fi
RUN if [ -z ${PSQL_DB}   ]; then echo "'PSQL_DB' is empty.";   exit 1; fi

# Store secrets to environment variables
ENV POSTGRES_USER=${PSQL_USER}
ENV POSTGRES_PASSWORD=${PSQL_PWD}
ENV POSTGRES_DB=${PSQL_DB}
