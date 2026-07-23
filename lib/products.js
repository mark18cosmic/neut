// Neut catalog. In production this would come from the admin/CMS + a database.
// Prices are in MVR (Maldivian Rufiyaa); USD is derived at a fixed display rate.

export const USD_RATE = 15.42; // 1 USD ≈ 15.42 MVR (display only)

export const CATEGORIES = [
  { slug: "necklaces", label: "Necklaces" },
  { slug: "bracelets", label: "Bracelets" },
  { slug: "charms", label: "Charms" },
];

export const METALS = ["gold", "silver"];
export const MATERIALS = ["shell", "wood", "engraved", "locket", "pearl", "stone"];

export const PRODUCTS = [
  {
    slug: "tide-locket",
    name: "Tide Locket",
    category: "necklaces",
    price: 890,
    metals: ["gold", "silver"],
    materials: ["locket"],
    drop: "Low Tide",
    soldOut: false,
    tone: ["#5A6642", "#B79B75"],
    blurb: "A small ocean you can carry.",
    description:
      "A hand-finished oval locket that opens to hold what the tide leaves behind — a photo, a note, a grain of sand from a shore you loved. Worn on a fine cable chain.",
    care: "Keep dry when swimming. Wipe with a soft cloth. Store flat, away from light.",
    charmReady: true,
  },
  {
    slug: "driftwood-charm",
    name: "Driftwood Charm",
    category: "charms",
    price: 220,
    metals: ["gold", "silver"],
    materials: ["wood", "engraved"],
    drop: "Low Tide",
    soldOut: false,
    tone: ["#B79B75", "#8a7350"],
    blurb: "Weathered, warm, one of a kind.",
    description:
      "A single charm cast from a piece of driftwood found along Malé's shoreline, then set in your chosen metal. No two are quite alike. Meant to be layered.",
    care: "Avoid prolonged water contact. Store separately to prevent scratching.",
    charmReady: false,
  },
  {
    slug: "cowrie-charm",
    name: "Cowrie Charm",
    category: "charms",
    price: 240,
    metals: ["gold", "silver"],
    materials: ["shell"],
    drop: "Low Tide",
    soldOut: false,
    tone: ["#E3D5BF", "#B79B75"],
    blurb: "The island's oldest currency.",
    description:
      "A real cowrie shell, rimmed and hung by hand. Once traded across these islands, now worn close. Clip it onto any Neut chain or locket.",
    care: "Natural shell — handle gently. Keep from harsh sun and chlorine.",
    charmReady: false,
  },
  {
    slug: "pearl-drop-charm",
    name: "Pearl Drop Charm",
    category: "charms",
    price: 320,
    metals: ["gold", "silver"],
    materials: ["pearl"],
    drop: null,
    soldOut: false,
    tone: ["#F3EDE2", "#E3D5BF"],
    blurb: "A single freshwater pearl.",
    description:
      "One freshwater pearl on a fine hoop, catching light the way water does at dusk. Layer it beside a shell or wear it alone.",
    care: "Pearls are soft — last on, first off. Wipe after wear.",
    charmReady: false,
  },
  {
    slug: "reef-chain",
    name: "Reef Chain",
    category: "necklaces",
    price: 760,
    metals: ["gold", "silver"],
    materials: ["engraved"],
    drop: null,
    soldOut: false,
    tone: ["#3F4A2E", "#5A6642"],
    blurb: "The chain your charms come home to.",
    description:
      "A supple, hand-linked chain designed as the base of your Neut story — clasp on the charms you love and rebuild it season to season.",
    care: "Polish with a dry cloth. Remove before the shower.",
    charmReady: true,
  },
  {
    slug: "shoreline-cuff",
    name: "Shoreline Cuff",
    category: "bracelets",
    price: 640,
    metals: ["gold", "silver"],
    materials: ["engraved"],
    drop: null,
    soldOut: false,
    tone: ["#B79B75", "#5A6642"],
    blurb: "One clean line, like the horizon.",
    description:
      "An open cuff hammered by hand to a soft matte finish. It sits like the horizon — one quiet, unbroken line.",
    care: "Reshape gently with both hands. Avoid bending repeatedly.",
    charmReady: false,
  },
  {
    slug: "knot-bracelet",
    name: "Knot Bracelet",
    category: "bracelets",
    price: 480,
    metals: ["gold", "silver"],
    materials: ["wood", "stone"],
    drop: "Low Tide",
    soldOut: true,
    tone: ["#8a7350", "#3F4A2E"],
    blurb: "Tied by hand in Malé.",
    description:
      "A woven cord finished with a small metal knot and a single stone bead. Adjustable, easy, everyday.",
    care: "Cord is water-friendly; dry fully after the sea.",
    charmReady: false,
  },
  {
    slug: "moonstone-charm",
    name: "Moonstone Charm",
    category: "charms",
    price: 360,
    metals: ["silver"],
    materials: ["stone"],
    drop: null,
    soldOut: false,
    tone: ["#E3D5BF", "#5A6642"],
    blurb: "Milky light, like the shallows.",
    description:
      "A cabochon moonstone that glows the pale blue of the lagoon at first light. Silver only.",
    care: "Soft stone — store apart. Clean with a damp cloth, no chemicals.",
    charmReady: false,
  },
];

export function currency(mvr, mode = "MVR") {
  if (mode === "USD") {
    return `$${(mvr / USD_RATE).toFixed(0)}`;
  }
  return `MVR ${mvr.toLocaleString()}`;
}

export function getProduct(slug) {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function byCategory(slug) {
  return PRODUCTS.filter((p) => p.category === slug);
}

export const CHARMS = PRODUCTS.filter((p) => p.category === "charms");
export const CHAINS = PRODUCTS.filter((p) => p.charmReady);
