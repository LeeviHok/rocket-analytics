FROM postgres:15.2

# Install dependencies for database initialization script
RUN apt-get -y update && apt-get -y install awscli curl jq

# Copy database initialization script
RUN mkdir -p /docker-entrypoint-initdb.d
COPY --chown=postgres:postgres \
    ./backend/postgres/create_db_user.sh \
    /docker-entrypoint-initdb.d/create_db_user.sh

# Copy authentication/access settings
COPY --chown=postgres:postgres ./backend/postgres/pg_hba.conf /etc/postgresql/pg_hba.conf

CMD [ "postgres", "-c", "hba_file=/etc/postgresql/pg_hba.conf" ]
