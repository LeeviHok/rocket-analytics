FROM postgres:15.2

# Install dependencies for database initialization script
RUN apt-get -y update && apt-get -y install awscli curl jq

# Copy database initialization script
RUN mkdir -p /docker-entrypoint-initdb.d
COPY --chown=postgres:postgres \
    ./backend/postgres/create_db_user.sh \
    /docker-entrypoint-initdb.d/create_db_user.sh
