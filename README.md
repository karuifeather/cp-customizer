# Form & Function — Custom Sneaker Studio

A React + Express + PostgreSQL CRUD app for designing, saving, editing, and deleting custom sneakers. The preview changes when the upper, sole, and laces change, and the total updates as options are selected.

## Run locally

1. Create a PostgreSQL database and copy `.env.example` to `.env`.
2. Set `DATABASE_URL` to your local connection string.
3. Install dependencies: `npm install`
4. Start the API: `npm run server`
5. In another terminal, start Vite: `npm run dev`
6. Open `http://localhost:5173`.

The API creates the `custom_items` table automatically on startup. The schema is also available in `schema.sql`.

## Render deployment

`render.yaml` defines a Node web service and a Render PostgreSQL database. In Render, create a new Blueprint from this repository or sync the existing Blueprint after pushing changes. Render will provision the database, inject its internal `DATABASE_URL`, build the React app, and start the Express server. The production server serves the built Vite frontend and the `/api` routes from the same service.

Vite and its React plugin are regular dependencies so the existing `npm install && npm run build` command works even when the service sets `NODE_ENV=production`. The Blueprint uses `npm ci --include=dev` for a clean, reproducible install. If the web service was created manually instead of from the Blueprint, set its start command to `npm start` and `DATABASE_URL` to the database's internal URL. Check that `/api/items` returns a JSON array after deployment; an empty array is expected before the first sneaker is saved.

The Blueprint uses Render's Free PostgreSQL plan, which expires after 30 days. Upgrade the database plan before its expiration if saved sneakers must remain available long term.

## API routes

- `GET /api/items` — list saved sneakers
- `POST /api/items` — create a sneaker
- `PATCH /api/items/:id` — update a sneaker
- `DELETE /api/items/:id` — remove a sneaker
