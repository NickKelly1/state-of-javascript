
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

To run migrations up, use the npm cli to run the `package.json` script: `npm run migrate:up -- --step=2`

### MIgrations::down

To run migrations down, use the npm cli to run the `package.json` script: `npm run migrate:down -- --step=2`

To run migrations up, use the npm cli to run the `package.json` script: `npm run migrate:up -- --step=2`
