import express from "express";
import cors from "cors";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { ensureSchema, pool } from "./db.js";

const app = express();
const port = process.env.PORT || 3001;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distPath = path.join(__dirname, "..", "dist");

app.use(cors());
app.use(express.json());

const prices = {
  upper: { Ink: 0, Clay: 6, Moss: 8, Tomato: 10 },
  sole: { Classic: 0, Cloud: 14, Gum: 8 },
  laces: { Bone: 0, Ink: 3, Tomato: 3 },
  size: { 7: 0, 8: 0, 9: 0, 10: 0, 11: 2, 12: 2 },
};

function getTotal({ upper_color, sole, laces, size }) {
  return (
    120 +
    prices.upper[upper_color] +
    prices.sole[sole] +
    prices.laces[laces] +
    prices.size[size]
  );
}

function validateItem(item) {
  const required = ["name", "upper_color", "sole", "laces", "size"];
  const missing = required.find((field) => !item[field]);
  if (missing) return "Please complete every sneaker option.";
  if (prices.upper[item.upper_color] === undefined)
    return "That upper color is not available.";
  if (
    prices.sole[item.sole] === undefined ||
    prices.laces[item.laces] === undefined ||
    prices.size[item.size] === undefined
  )
    return "One of those options is not available.";
  if (item.upper_color === "Tomato" && item.sole === "Cloud")
    return "Cloud soles are currently unavailable with a Tomato upper. Try Classic or Gum.";
  if (item.name.trim().length < 2)
    return "Give your sneaker a name with at least two characters.";
  return null;
}

function toItem(row) {
  return { ...row, total_price: Number(row.total_price) };
}

app.get("/api/items", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM custom_items ORDER BY created_at DESC",
    );
    res.json(result.rows.map(toItem));
  } catch (error) {
    res.status(500).json({ error: "Could not load saved sneakers." });
  }
});

app.post("/api/items", async (req, res) => {
  const error = validateItem(req.body);
  if (error) return res.status(400).json({ error });
  const { name, upper_color, sole, laces, size } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO custom_items (name, upper_color, sole, laces, size, total_price)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name.trim(), upper_color, sole, laces, size, getTotal(req.body)],
    );
    res.status(201).json(toItem(result.rows[0]));
  } catch (error) {
    res.status(500).json({ error: "Could not save this sneaker." });
  }
});

app.patch("/api/items/:id", async (req, res) => {
  const error = validateItem(req.body);
  if (error) return res.status(400).json({ error });
  const { name, upper_color, sole, laces, size } = req.body;
  try {
    const result = await pool.query(
      `UPDATE custom_items
       SET name = $1, upper_color = $2, sole = $3, laces = $4, size = $5, total_price = $6, updated_at = NOW()
       WHERE id = $7 RETURNING *`,
      [
        name.trim(),
        upper_color,
        sole,
        laces,
        size,
        getTotal(req.body),
        req.params.id,
      ],
    );
    if (!result.rowCount)
      return res.status(404).json({ error: "That sneaker no longer exists." });
    res.json(toItem(result.rows[0]));
  } catch (error) {
    res.status(500).json({ error: "Could not update this sneaker." });
  }
});

app.delete("/api/items/:id", async (req, res) => {
  try {
    const result = await pool.query("DELETE FROM custom_items WHERE id = $1", [
      req.params.id,
    ]);
    if (!result.rowCount)
      return res.status(404).json({ error: "That sneaker no longer exists." });
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: "Could not delete this sneaker." });
  }
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static(distPath));
  app.get(/.*/, (_req, res) => res.sendFile(path.join(distPath, "index.html")));
}

ensureSchema()
  .then(() =>
    app.listen(port, () => console.log(`Server listening on port ${port}`)),
  )
  .catch((error) => {
    console.error("Database setup failed:", error.message);
    process.exit(1);
  });
