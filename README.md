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

### pgAdmin (Database UI)

Access: http://localhost:5050

Login credentials come from `.env.local`:

- Email: value of `PGADMIN_DEFAULT_EMAIL`
- Password: value of `PGADMIN_DEFAULT_PASSWORD`

Preconfigured server: A connection named "Local Postgres" should appear automatically (loaded from `pgadmin-servers.json`).

If it does not appear, add it manually:

1. Right‑click "Servers" → Register → Server.
2. General tab → Name: Local Postgres (any name you like).
3. Connection tab:

- Host: `postgres` (container hostname on the Docker network)
- Port: `5432`
- Maintenance DB: `postgres` (or your DB name)
- Username: value of `POSTGRES_USER`
- Password: value of `POSTGRES_PASSWORD` (tick "Save password").

4. Save.

Troubleshooting:

- Wrong login: verify `.env.local` values and recreate pgAdmin container (`docker compose down pgadmin && docker compose up -d pgadmin`).
- Connection refused: ensure the Postgres container is running: `docker ps` should list it as Up.
- Env vars not applied: ensure `env_file: - .env.local` exists for the pgAdmin service and you did not override them with empty `${VAR}` entries.
- Inspect container env: `docker exec sport-archive-pgadmin-1 env | findstr PGADMIN`.
