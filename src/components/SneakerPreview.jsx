import SneakerArt from "./SneakerArt";
import { money, totalFor } from "../data/customizer";

export default function SneakerPreview({ form }) {
  return (
    <div className="preview-card">
      <div className="preview-topline">
        <span>01 / 04</span>
        <span>Studio view</span>
      </div>
      <div className="sneaker-stage">
        <div className="sun"></div>
        <SneakerArt
          upperColor={form.upper_color}
          sole={form.sole}
          laces={form.laces}
        />
      </div>
      <div className="preview-caption">
        <div>
          <span className="eyebrow">Your composition</span>
          <h2>{form.name || "Untitled classic"}</h2>
        </div>
        <span className="price-tag">{money(totalFor(form))}</span>
      </div>
    </div>
  );
}
