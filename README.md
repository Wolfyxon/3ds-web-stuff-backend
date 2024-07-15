# 3DS Web Stuff backend
Server side API functions for [3DS Web Stuff](https://wolfyxon.github.io/3ds-web-stuff/)

## Environment variables
- `CONFIG`: Path to the config JSON file
- `CONFIG_STRING`: JSON config string. `CONFIG` is ignored when this value is specified
### PostgreSQL Database
All of these variables are required for the database to work
- `POSTGRES_URL`
- `POSTGRES_URL_NON_POOLING`
- `POSTGRES_URL_NO_SSL`
- `POSTGRES_PRISMA_URL`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_DATABASE`
