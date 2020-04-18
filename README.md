# PI_2020
Projekt Inżynierski 
## Run the app in Containers
git clone https://github.com/majka7244/PI_2020.git
cd PI_2020
docker-compose run 
## Test components
### nodejs 
$ curl -i localhost:49160
### httpd
http://localhost:8080/
### postgres 
$ psql --host=localhost --port=5432 --username=postgres

## Architektura
..* web_server_httpd - httpd zapewnia certyfikaty ssl oraz proxy dla aplikacji 
..* runtime_environment_nodejs - silnik nodejs generuje stronę aplikacji oraz zapewnia komunikacje z bazą postgresql
..* db_postgresql - baza danych 
