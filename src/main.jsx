import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import OptionGroup from "./components/OptionGroup";
import SneakerArt from "./components/SneakerArt";
import SneakerPreview from "./components/SneakerPreview";
import { EMPTY, money, OPTIONS, totalFor } from "./data/customizer";
import "./styles.css";

async function apiError(response, fallback) {
  try {
    const data = await response.json();
    return data.error || fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [form, setForm] = useState(EMPTY);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const total = useMemo(() => totalFor(form), [form]);
  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  async function loadItems() {
    setLoading(true);
    setLoadError(false);
    try {
      const response = await fetch("/api/items");
      if (!response.ok) throw new Error("Could not load saved sneakers.");
      const data = await response.json();
      if (!Array.isArray(data)) throw new Error("Invalid collection response.");
      setItems(data);
    } catch {
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadItems();
  }, []);

  async function saveItem(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    try {
      const wasEditing = editingId !== null;
      const response = await fetch(wasEditing ? `/api/items/${editingId}` : "/api/items", {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok)
        throw new Error(await apiError(response, "Could not save this sneaker."));
      const data = await response.json();
      setItems((current) =>
        wasEditing
          ? current.map((item) => (item.id === editingId ? data : item))
          : [data, ...current],
      );
      setLoadError(false);
      setForm(EMPTY);
      setEditingId(null);
      setStatus({
        type: "success",
        message: wasEditing
          ? "Your sneaker was updated."
          : "Your sneaker was saved to the collection.",
      });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Could not save this sneaker." });
    }
  }

  function editItem(item) {
    setForm({
      name: item.name,
      upper_color: item.upper_color,
      sole: item.sole,
      laces: item.laces,
      size: item.size,
    });
    setEditingId(item.id);
    setStatus({ type: "", message: "" });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteItem(id) {
    if (!window.confirm("Remove this sneaker from your collection?")) return;
    try {
      const response = await fetch(`/api/items/${id}`, { method: "DELETE" });
      if (!response.ok)
        throw new Error(await apiError(response, "Could not remove this sneaker."));
      setItems((current) => current.filter((item) => item.id !== id));
      setStatus({ type: "success", message: "Sneaker removed." });
    } catch (error) {
      setStatus({ type: "error", message: error.message || "Could not remove this sneaker." });
    }
  }

  return (
    <main>
      <nav className="nav">
        <div className="logo">
          <span>F</span>orm <em>&</em> Function
        </div>
        <a href="#collection">
          Saved collection{" "}
          <span>{items.length.toString().padStart(2, "0")}</span>
        </a>
      </nav>
      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">The everyday edition / 2025</span>
          <h1>
            Make it <i>yours.</i>
          </h1>
          <p>
            A considered canvas for your daily uniform. Tune every detail, then
            save a pair to your collection.
          </p>
        </div>
        <div className="hero-note">
          Designed in small batches
          <br />
          <strong>Built for your rotation</strong>
        </div>
      </section>
      <section className="studio-layout">
        <SneakerPreview form={form} />
        <form className="customizer" onSubmit={saveItem}>
          <div className="form-heading">
            <div>
              <span className="eyebrow">
                {editingId ? "Refine a pair" : "Build a pair"}
              </span>
              <h2>
                {editingId ? "Edit your composition" : "Start with a name"}
              </h2>
            </div>
            <span className="step">{editingId ? "EDIT" : "STEP 01"}</span>
          </div>
          <label className="name-field">
            <span>Give this pair a name</span>
            <input
              value={form.name}
              onChange={(event) => update("name", event.target.value)}
              placeholder="e.g. Sunday market"
              required
            />
          </label>
          <OptionGroup
            label="Upper color"
            hint="The foundation"
            options={OPTIONS.upper_color}
            value={form.upper_color}
            onChange={(value) => update("upper_color", value)}
            type="swatches"
          />
          <OptionGroup
            label="Sole profile"
            hint="Feel the difference"
            options={OPTIONS.sole}
            value={form.sole}
            onChange={(value) => update("sole", value)}
          />
          <div className="split-options">
            <OptionGroup
              label="Laces"
              hint="The finishing touch"
              options={OPTIONS.laces}
              value={form.laces}
              onChange={(value) => update("laces", value)}
              type="swatches"
            />
            <OptionGroup
              label="Size"
              hint="US / unisex"
              options={OPTIONS.size}
              value={form.size}
              onChange={(value) => update("size", value)}
              type="sizes"
            />
          </div>
          {status.message && (
            <div className={`status ${status.type}`}>{status.message}</div>
          )}
          <div className="form-footer">
            <div>
              <span className="eyebrow">Your total</span>
              <strong>{money(total)}</strong>
            </div>
            <button type="submit">
              {editingId ? "Update pair" : "Save this pair"} <span>↗</span>
            </button>
            {editingId && (
              <button
                type="button"
                className="text-button"
                onClick={() => {
                  setEditingId(null);
                  setForm(EMPTY);
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>
      <section className="collection" id="collection">
        <div className="section-heading">
          <div>
            <span className="eyebrow">The archive</span>
            <h2>Your saved collection</h2>
          </div>
          <span>
            {items.length} {items.length === 1 ? "pair" : "pairs"}
          </span>
        </div>
        {loading ? (
          <div className="empty-state">Loading your collection…</div>
        ) : loadError ? (
          <div className="empty-state">
            <p>Could not load your collection.</p>
            <button type="button" className="text-button" onClick={loadItems}>Try again</button>
          </div>
        ) : items.length === 0 ? (
          <div className="empty-state">
            <span>✳</span>
            <p>
              Your collection is waiting.
              <br />
              Save your first composition above.
            </p>
          </div>
        ) : (
          <div className="saved-grid">
            {items.map((item) => (
              <article className="saved-item" key={item.id}>
                <div className="mini-sneaker">
                  <SneakerArt
                    upperColor={item.upper_color}
                    sole={item.sole}
                    laces={item.laces}
                  />
                </div>
                <div className="saved-info">
                  <div>
                    <span className="eyebrow">
                      {item.upper_color} / {item.sole}
                    </span>
                    <h3>{item.name}</h3>
                  </div>
                  <strong>{money(item.total_price)}</strong>
                </div>
                <div className="saved-actions">
                  <span>
                    US {item.size} · {item.laces} laces
                  </span>
                  <div>
                    <button onClick={() => editItem(item)}>Edit</button>
                    <button onClick={() => deleteItem(item.id)}>Delete</button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
      <footer>
        <span>F&F / made for your rotation</span>
        <span>Custom items studio</span>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
