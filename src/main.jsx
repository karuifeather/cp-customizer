import { StrictMode, useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import OptionGroup from "./components/OptionGroup";
import SneakerArt from "./components/SneakerArt";
import SneakerPreview from "./components/SneakerPreview";
import { EMPTY, money, OPTIONS, totalFor } from "./data/customizer";
import "./styles.css";

function App() {
  const [form, setForm] = useState(EMPTY);
  const [items, setItems] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  const total = useMemo(() => totalFor(form), [form]);
  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));

  useEffect(() => {
    fetch("/api/items")
      .then((response) => response.json())
      .then(setItems)
      .catch(() =>
        setStatus({
          type: "error",
          message: "Connect your database to load saved sneakers.",
        }),
      )
      .finally(() => setLoading(false));
  }, []);

  async function saveItem(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });
    const response = await fetch(
      editingId ? `/api/items/${editingId}` : "/api/items",
      {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      },
    );
    const data = response.status === 204 ? null : await response.json();
    if (!response.ok) return setStatus({ type: "error", message: data.error });
    setItems((current) =>
      editingId
        ? current.map((item) => (item.id === editingId ? data : item))
        : [data, ...current],
    );
    setForm(EMPTY);
    setEditingId(null);
    setStatus({
      type: "success",
      message: editingId
        ? "Your sneaker was updated."
        : "Your sneaker was saved to the collection.",
    });
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
    const response = await fetch(`/api/items/${id}`, { method: "DELETE" });
    if (response.ok) {
      setItems((current) => current.filter((item) => item.id !== id));
      setStatus({ type: "success", message: "Sneaker removed." });
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
