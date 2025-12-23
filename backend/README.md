# Sunday Brunch Backend API

Backend API for Sunday Brunch With Giselle - Recipe and podcast episode management.

## Tech Stack

- Node.js + Express
- PostgreSQL database
- ES Modules

## Setup Instructions

### 1. Install PostgreSQL

If you don't have PostgreSQL installed:

**Windows:**
```bash
# Download and install from: https://www.postgresql.org/download/windows/
# Or use chocolatey:
choco install postgresql
```

**Mac:**
```bash
brew install postgresql
brew services start postgresql
```

### 2. Create Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE sunday_brunch;

# Exit psql
\q
```

### 3. Configure Environment

```bash
# Copy example env file
cp .env.example .env

# Edit .env and update with your database credentials
# DATABASE_URL=postgresql://username:password@localhost:5432/sunday_brunch
```

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Migrations

```bash
npm run db:migrate
```

### 6. Seed Database

```bash
npm run db:seed
```

### 7. Start Server

```bash
# Development mode (auto-restart on changes)
npm run dev

# Production mode
npm start
```

Server will run on http://localhost:3001

## API Endpoints

### Health Check
- `GET /health` - Check if API is running

### Recipes
- `GET /api/recipes` - Get all recipes
- `GET /api/recipes/:slug` - Get single recipe by slug

### Episodes
- `GET /api/episodes` - Get all episodes
- `GET /api/episodes/:slug` - Get single episode by slug

### Featured Content
- `GET /api/featured` - Get featured recipe and episode

## Database Schema

### Tables
- `recipes` - Recipe content with ingredients, steps, times
- `episodes` - Podcast episodes with audio, transcripts
- `tools` - Recipe tools/equipment (linked to recipes)
- `related_content` - Polymorphic relationships between content

### Sample Recipe Response
```json
{
  "slug": "french-silk-pie",
  "title": "French Silk Pie",
  "story": ["..."],
  "times": {
    "prep": "30 min",
    "cook": "10 min",
    "total": "40 min"
  },
  "yield": "1 pie (8 slices)",
  "ingredients": ["..."],
  "steps": ["..."],
  "tools": [
    { "name": "9\" pie pan", "link": "#", "category": "baking" }
  ],
  "related": [
    { "title": "...", "slug": "...", "type": "episode" }
  ],
  "seasonal": [
    { "title": "...", "slug": "...", "type": "collection" }
  ],
  "meta": {
    "description": "...",
    "ogImage": "/images/..."
  }
}
```

## Troubleshooting

### Database Connection Issues

**Error: "password authentication failed"**
- Check DATABASE_URL in .env
- Verify PostgreSQL user credentials

**Error: "database does not exist"**
- Run: `createdb sunday_brunch`
- Or use psql to create manually

### Migration Issues

**Error: "permission denied"**
- Grant permissions: `GRANT ALL PRIVILEGES ON DATABASE sunday_brunch TO your_user;`

**Reset database:**
```bash
# Drop and recreate
psql -U postgres -c "DROP DATABASE sunday_brunch;"
psql -U postgres -c "CREATE DATABASE sunday_brunch;"

# Re-run migrations and seed
npm run db:migrate
npm run db:seed
```

## Development

### Project Structure
```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # Database connection
│   ├── controllers/
│   │   ├── recipeController.js
│   │   ├── episodeController.js
│   │   └── contentController.js
│   ├── models/
│   │   ├── Recipe.js          # Recipe data access
│   │   └── Episode.js         # Episode data access
│   ├── routes/
│   │   ├── recipeRoutes.js
│   │   ├── episodeRoutes.js
│   │   └── contentRoutes.js
│   ├── db/
│   │   ├── schema.sql         # Database schema
│   │   ├── migrate.js         # Migration runner
│   │   └── seed.js            # Seed data
│   └── server.js              # Express app
├── .env                       # Environment config (not in git)
├── .env.example              # Example env file
├── package.json
└── README.md
```

### Adding New Endpoints

1. Create model in `src/models/`
2. Create controller in `src/controllers/`
3. Create routes in `src/routes/`
4. Register routes in `src/server.js`

### Database Changes

1. Update `src/db/schema.sql`
2. Run `npm run db:migrate`
3. Update models and controllers as needed

## Next Steps

- [ ] Add CRUD operations for admin panel
- [ ] Add image upload for recipes/episodes
- [ ] Add search functionality
- [ ] Add pagination for lists
- [ ] Add caching layer (Redis)
- [ ] Add authentication for admin routes
