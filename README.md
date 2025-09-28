# 🏆 Sport Archive

<div align="center">

![NestJS](https://img.shields.io/badge/NestJS-10.0+-red?style=for-the-badge&logo=nestjs)
![Angular](https://img.shields.io/badge/Angular-20.2.0-red?style=for-the-badge&logo=angular)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-blue?style=for-the-badge&logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=for-the-badge&logo=docker)

**Automated Croatian Sports News Aggregation Platform**

</div>

## 📖 Overview

Automated platform that scrapes Croatian sports portals every 5 minutes, aggregates content, and tracks engagement metrics.

**Sources**: Index.hr • 24sata.hr • Sportnet.hr • Gol.hr • Germanijak.hr

## 🚀 Quick Start

```bash
# Setup environment
cp .env.example .env.local

# Start services
docker-compose -f docker.compose.local.yml up -d

# Setup database
cd backend
npx prisma migrate dev --name init
npx prisma generate

# Install dependencies
npm install
cd ../frontend && npm install

# Start development
npm run start:dev  # Backend :3000
ng serve          # Frontend :4200
```

## 🐳 Services

| Service         | URL                     | Credentials                      |
| --------------- | ----------------------- | -------------------------------- |
| **PostgreSQL**  | `:5432`                 | From `.env.local`                |
| **pgAdmin**     | `http://localhost:5050` | `PGADMIN_DEFAULT_EMAIL/PASSWORD` |
| **Backend API** | `http://localhost:3000` | -                                |
| **Frontend**    | `http://localhost:4200` | -                                |

## 🔧 Commands

```bash
# Docker management
docker-compose -f docker-compose.local.yml up -d     # Start
docker-compose -f docker-compose.local.yml down      # Stop
docker-compose -f docker-compose.local.yml down -v   # Stop + delete data

# Database operations
npx prisma migrate dev    # Run migrations
npx prisma studio        # Database browser
npx prisma generate      # Update client

# Development
npm run start:dev        # Backend with hot reload
ng serve                # Frontend development server
npm test                # Run tests
```

## 🛠️ pgAdmin Setup

1. Access `http://localhost:5050`
2. Login with credentials from `.env.local`
3. Server should auto-appear as "Local Postgres"
4. **Manual setup** (if needed):
   - Host: `postgres`
   - Port: `5432`
   - Username/Password: from `.env.local`

## 📊 Features

- 🤖 **Auto-scraping** every 5 minutes
- 📊 **Engagement tracking** (likes, shares, comments)
- 🏃‍♂️ **Sports management** (athletes, clubs, competitions)
- 🔍 **Search & filtering**
- 📱 **Responsive UI**

## 🐛 Troubleshooting

```bash
# Check container status
docker ps

# View logs
docker-compose -f docker-compose.local.yml logs -f

# Reset database
npx prisma migrate reset

# Rebuild containers
docker-compose -f docker-compose.local.yml build --no-cache
```

---

<div align="center">

**Built with ❤️ for Croatian Sports**

</div>
