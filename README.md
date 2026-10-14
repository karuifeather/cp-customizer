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

`render.yaml` defines a Node web service and a Render PostgreSQL database. In Render, create a new Blueprint from this repository. Render will provision the database, inject `DATABASE_URL`, build the React app, and start the Express server. The production server serves the built Vite frontend and the `/api` routes from the same service.

## API routes

- `GET /api/items` — list saved sneakers
- `POST /api/items` — create a sneaker
- `PATCH /api/items/:id` — update a sneaker
- `DELETE /api/items/:id` — remove a sneaker
