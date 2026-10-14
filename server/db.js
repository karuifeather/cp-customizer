import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function ensureSchema() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS custom_items (
      id SERIAL PRIMARY KEY,
      name VARCHAR(80) NOT NULL,
      upper_color VARCHAR(30) NOT NULL,
      sole VARCHAR(30) NOT NULL,
      laces VARCHAR(30) NOT NULL,
      size VARCHAR(10) NOT NULL,
      total_price NUMERIC(8, 2) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}
