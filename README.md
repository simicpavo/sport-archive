## Running Postgres with Docker Compose (Local Development)

### Startup

Run the following command to start the Postgres container:

```bash
docker-compose -f docker-compose.local.yml up -d

### Shutdown
-To stop and remove containers (without deleting data):

docker-compose -f docker-compose.local.yml down


-To also remove the database volume (delete all data):

docker-compose -f docker-compose.local.yml down -v
```

## Environment Variables

- Copy `.env.example` to `.env.local`:

  ```bash
  cp .env.example .env.local

  Update .env.local with your local credentials (or leave defaults).
  ```

Run:

docker-compose -f docker-compose.local.yml up -d

# Run migrations

npx prisma migrate dev --name init

# Generate Prisma client

npx prisma generate
