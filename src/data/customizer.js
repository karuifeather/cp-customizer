export const OPTIONS = {
  upper_color: [
    { value: "Ink", label: "Ink", swatch: "#242326", price: 0 },
    { value: "Clay", label: "Clay", swatch: "#c48667", price: 6 },
    { value: "Moss", label: "Moss", swatch: "#71846f", price: 8 },
    { value: "Tomato", label: "Tomato", swatch: "#d95745", price: 10 },
  ],
  sole: [
    { value: "Classic", label: "Classic", detail: "Clean + light", price: 0 },
    { value: "Cloud", label: "Cloud", detail: "Extra cushion", price: 14 },
    { value: "Gum", label: "Gum", detail: "Warm + grippy", price: 8 },
  ],
  laces: [
    { value: "Bone", label: "Bone", swatch: "#eee5d4", price: 0 },
    { value: "Ink", label: "Ink", swatch: "#242326", price: 3 },
    { value: "Tomato", label: "Tomato", swatch: "#d95745", price: 3 },
  ],
  size: ["7", "8", "9", "10", "11", "12"].map((value) => ({
    value,
    label: value,
    price: Number(value) > 10 ? 2 : 0,
  })),
};

export const EMPTY = {
  name: "",
  upper_color: "Ink",
  sole: "Classic",
  laces: "Bone",
  size: "9",
};

export function money(value) {
  return `$${Number(value).toFixed(2)}`;
}

export function totalFor(form) {
  return (
    120 +
    ["upper_color", "sole", "laces", "size"].reduce(
      (sum, key) =>
        sum +
        (OPTIONS[key].find((option) => option.value === form[key])?.price || 0),
      0,
    )
  );
}
