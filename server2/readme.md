
TODO:
  - init admin psw
  - migrations
  - upgrade markdown (use recommended from nextjs)
  - separate mutatios
  - ...
  - timeline package from ycombinator
  - google analytics
  - image upload / download
  - image converter api
  - document converter api
  - document storage



Creating migration
  
## Migrations

Migration scripts are inside `src/scripts`

### Migration:up

To run migrations up, use the npm cli to run the `package.json` script: `npm run migration:up -- --step=2`

### Migrations::down

To run migrations down, use the npm cli to run the `package.json` script: `npm run migration:down -- --step=2 --step=batch|number`

### Psql

Use psql from the Postgresql docker container

```sh
# docker exec -it postgres_container_name psql your_connection_string
docker exec -it fg4jvsa psql -h localhost -p 5432 -U soj -W soj
```