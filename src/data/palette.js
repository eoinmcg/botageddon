// from the wonderful:
// https://lospec.com/palette-list/arne-32
const arne32 = [
  // --- Core 16 (from the original Arne-16) ---
  { name: "void", hex: "#000000" }, // pure black
  { name: "darkbrown", hex: "#493c2b" }, // dark earthy brown
  { name: "red", hex: "#be2633" }, // classic red
  { name: "pink", hex: "#e06f8b" }, // pinkish skin / meat
  { name: "brown", hex: "#a46422" }, // mid warm brown
  { name: "orange", hex: "#eb8931" }, // bright orange
  { name: "yellow", hex: "#f7e26b" }, // pale yellow
  { name: "white", hex: "#ffffff" }, // pure white
  { name: "gray", hex: "#9d9d9d" }, // mid gray
  { name: "darkgreen", hex: "#2f484e" }, // dark teal-green
  { name: "nightblue", hex: "#1b2632" }, // very dark navy
  { name: "green", hex: "#44891a" }, // mid green
  { name: "slime", hex: "#a3ce27" }, // bright lime green
  { name: "seablue", hex: "#005784" }, // deep ocean blue
  { name: "skyblue", hex: "#31a2f2" }, // bright sky blue
  { name: "cloudblue", hex: "#b2dcef" }, // pale icy blue

  // --- Extended 16 (Arne-32 additions) ---
  { name: "indigo", hex: "#342a97" }, // deep blue-purple
  { name: "steel", hex: "#656d71" }, // cool blue-gray
  { name: "lightgray", hex: "#cccccc" }, // light gray
  { name: "darkred", hex: "#732930" }, // deep crimson
  { name: "purple", hex: "#cb43a7" }, // vivid magenta-purple
  { name: "darkkhaki", hex: "#524f40" }, // dark olive/khaki
  { name: "gold", hex: "#ad9d33" }, // muted gold
  { name: "scarlet", hex: "#ec4700" }, // vivid red-orange
  { name: "amber", hex: "#fab40b" }, // warm amber yellow
  { name: "forestgreen", hex: "#115e33" }, // deep forest green
  { name: "teal", hex: "#14807e" }, // mid teal
  { name: "aqua", hex: "#15c2a5" }, // bright aqua/cyan
  { name: "blue", hex: "#225af6" }, // vivid pure blue
  { name: "violet", hex: "#9964f9" }, // soft violet
  { name: "pink", hex: "#f78ed6" }, // light bubblegum pink
  { name: "peach", hex: "#f4b990" }, // warm skin peach
];

// convert into object for easy use
const palette = {}
for (let n in arne32) {
  let col = arne32[n]
  let hex = col.hex.replace(/^#/, '');

  // Parse the hex parts into littlejs friendly format
  const r = parseInt(hex.substring(0, 2), 16) / 255;
  const g = parseInt(hex.substring(2, 4), 16) / 255;
  const b = parseInt(hex.substring(4, 6), 16) / 255;

  palette[col.name] = {
    col: new Color(r, g, b, 1),
    hex: col.hex,
    r, g, b
  }
  let p = palette[col.name];

  palette[col.name].mk = (o = 1) => {
    return new Color(p.r, p.g, p.b, o);
  }

}

export default palette;
