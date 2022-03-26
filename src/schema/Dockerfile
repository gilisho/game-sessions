## Pull the mysql:5.7 image
FROM mysql:5.7

# database = game_sessions_db and password for root = password
ENV MYSQL_DATABASE=game_sessions_db \
    MYSQL_ROOT_PASSWORD=password \
    MYSQL_USER=admin \
    MYSQL_PASSWORD=password

# when container will be started, we'll have database created with the schema
COPY ./db.sql /docker-entrypoint-initdb.d/

