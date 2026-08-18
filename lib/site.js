// ============================================================================
// Canonical description of every piece of editable site copy.
//
// This file is the single source of truth shared by three places:
//   1. the storefront, which reads DEFAULT_CONTENT when Supabase has no row;
//   2. the admin panel, which renders its forms from CONTENT_BLOCKS;
//   3. supabase/seed.sql, which loads the same defaults into the database.
//
// Add a field here and it appears in the studio automatically — the editor is
// generated from the schema, so the two can never drift apart.
// ============================================================================

export const DEFAULT_CONTENT = {
  hero: {
    eyebrow: "",
    headingTop: "Created by us,",
    headingBottom: "curated for you.",
    subtext:
      "Handmade charms, bracelets and necklaces — gathered from the shoreline of Malé, Maldives.",
    ctaLabel: "Shop the New Drop",
    ctaHref: "/shop",
    secondaryLabel: "Build your charms",
    secondaryHref: "/builder",
    imageUrl: null,
    imageAlt: "Neut jewelry on driftwood in warm island light",
    tone: ["#5A6642", "#B79B75"],
    overlay: 35,
    showLogo: true,
  },
  announcement: {
    enabled: true,
    text: "Island-wide delivery · orders confirmed by Instagram DM",
    href: "/shop",
  },
  marquee: {
    enabled: true,
    items: [
      "Handmade in Malé",
      "Small batch",
      "Island-wide delivery",
      "Created by us, curated for you",
      "Layer it your way",
    ],
  },
  drop_rail: {
    eyebrow: "Latest Drop",
    title: "Low Tide",
    linkLabel: "View all",
    linkHref: "/shop",
  },
  quote_break: {
    quote: "Layer the charms you love. Rebuild your story, season to season.",
    ctaLabel: "Build your charms",
    ctaHref: "/builder",
    imageUrl: null,
    imageAlt: "Charm locket resting on a palm frond",
    tone: ["#3F4A2E", "#B79B75"],
  },
  featured: {
    eyebrow: "The collection",
    title: "Quietly worn favourites",
  },
  story_strip: {
    enabled: true,
    eyebrow: "Why Neut",
    title: "Small things, made slowly",
    items: [
      {
        title: "Gathered by hand",
        body: "Cowrie, driftwood and stone picked up on morning walks along the reef.",
      },
      {
        title: "Made in small batches",
        body: "Every drop is finished at our bench in Malé — never mass produced.",
      },
      {
        title: "Built to be layered",
        body: "Start with one chain, add a charm each season. Your piece keeps growing.",
      },
    ],
  },
  about: {
    heroTitle: "Our story",
    heroImageUrl: null,
    heroAlt: "Hands making jewelry by the sea",
    eyebrow: "Malé, Maldives",
    lede: "Neut began the way most quiet things do — with our hands, a length of chain, and the shoreline for a workbench.",
    body1:
      "We make in small batches, close to the sea. A cowrie found on a morning walk. A piece of driftwood worn smooth by the tide. We set what the island gives us, and we make it to be worn every day — layered, lived in, added to over time.",
    body2:
      "Nothing here is mass-made. Each drop is a season of small things, gathered and finished by us — then curated for you.",
    contactTitle: "Come say hello",
    contactBody:
      "We take orders and answer questions on Instagram, and confirm every piece personally. Payment is by bank transfer, with island-wide delivery.",
  },
  footer: {
    tagline: "Created by us, curated for you. Handmade in Malé, Maldives.",
    instagram: "neut.co",
    notes: [
      "Orders & questions via Instagram DM",
      "Payment by bank transfer",
      "Island-wide delivery",
    ],
  },
  shop: {
    eyebrow: "Shop",
    emptyText: "Nothing here yet — try another filter.",
    charmsTitle: "Charms are made to be layered.",
    charmsBody: "Pick a chain and stack the charms you love.",
  },
  journal: {
    eyebrow: "Journal & Drops",
    title: "From the shoreline",
  },
  checkout: {
    thanksTitle: "Thank you",
    thanksBody:
      "Your order is noted. We'll confirm availability and share our bank transfer details over Instagram DM — usually within a day.",
    bankNote: "Delivery arranged after we confirm. Payment by bank transfer.",
  },
};

// ---------------------------------------------------------------------------
// Editor schema. `type` drives which control the studio renders:
//   text · textarea · url · image · toggle · number · tone · lines · cards
// ---------------------------------------------------------------------------
export const CONTENT_BLOCKS = [
  {
    key: "hero",
    label: "Hero",
    group: "Home",
    hint: "The first thing anyone sees. Picture, headline, subtext and buttons.",
    fields: [
      { key: "imageUrl", label: "Hero picture", type: "image" },
      { key: "imageAlt", label: "Picture description (alt text)", type: "text" },
      { key: "tone", label: "Fallback wash (used until a picture is set)", type: "tone" },
      { key: "overlay", label: "Dark overlay strength", type: "number", min: 0, max: 80, suffix: "%" },
      { key: "eyebrow", label: "Eyebrow (small caps line)", type: "text" },
      { key: "headingTop", label: "Headline — line one", type: "text" },
      { key: "headingBottom", label: "Headline — line two", type: "text" },
      { key: "subtext", label: "Subtext", type: "textarea" },
      { key: "ctaLabel", label: "Primary button", type: "text" },
      { key: "ctaHref", label: "Primary button link", type: "url" },
      { key: "secondaryLabel", label: "Secondary button", type: "text" },
      { key: "secondaryHref", label: "Secondary button link", type: "url" },
      { key: "showLogo", label: "Show the logo badge", type: "toggle" },
    ],
  },
  {
    key: "announcement",
    label: "Announcement bar",
    group: "Home",
    hint: "Thin line above the navigation.",
    fields: [
      { key: "enabled", label: "Show the bar", type: "toggle" },
      { key: "text", label: "Message", type: "text" },
      { key: "href", label: "Link", type: "url" },
    ],
  },
  {
    key: "marquee",
    label: "Scrolling strip",
    group: "Home",
    hint: "Slow horizontal marquee under the hero.",
    fields: [
      { key: "enabled", label: "Show the strip", type: "toggle" },
      { key: "items", label: "Phrases (one per line)", type: "lines" },
    ],
  },
  {
    key: "drop_rail",
    label: "Latest drop rail",
    group: "Home",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Drop title", type: "text" },
      { key: "linkLabel", label: "Link label", type: "text" },
      { key: "linkHref", label: "Link", type: "url" },
    ],
  },
  {
    key: "story_strip",
    label: "Why Neut",
    group: "Home",
    hint: "Three short reasons, shown between the rail and the photo break.",
    fields: [
      { key: "enabled", label: "Show this section", type: "toggle" },
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
      { key: "items", label: "Reasons", type: "cards", itemFields: ["title", "body"], max: 4 },
    ],
  },
  {
    key: "quote_break",
    label: "Photo break & quote",
    group: "Home",
    fields: [
      { key: "imageUrl", label: "Picture", type: "image" },
      { key: "imageAlt", label: "Picture description", type: "text" },
      { key: "tone", label: "Fallback wash", type: "tone" },
      { key: "quote", label: "Quote", type: "textarea" },
      { key: "ctaLabel", label: "Button", type: "text" },
      { key: "ctaHref", label: "Button link", type: "url" },
    ],
  },
  {
    key: "featured",
    label: "Featured grid heading",
    group: "Home",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
    ],
  },
  {
    key: "about",
    label: "About page",
    group: "Pages",
    fields: [
      { key: "heroImageUrl", label: "Hero picture", type: "image" },
      { key: "heroAlt", label: "Picture description", type: "text" },
      { key: "heroTitle", label: "Hero title", type: "text" },
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "lede", label: "Opening line", type: "textarea" },
      { key: "body1", label: "Paragraph one", type: "textarea" },
      { key: "body2", label: "Paragraph two", type: "textarea" },
      { key: "contactTitle", label: "Contact title", type: "text" },
      { key: "contactBody", label: "Contact copy", type: "textarea" },
    ],
  },
  {
    key: "shop",
    label: "Shop page",
    group: "Pages",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "emptyText", label: "Empty-filter message", type: "text" },
      { key: "charmsTitle", label: "Charms banner title", type: "text" },
      { key: "charmsBody", label: "Charms banner copy", type: "text" },
    ],
  },
  {
    key: "journal",
    label: "Journal page",
    group: "Pages",
    fields: [
      { key: "eyebrow", label: "Eyebrow", type: "text" },
      { key: "title", label: "Title", type: "text" },
    ],
  },
  {
    key: "checkout",
    label: "Cart & checkout",
    group: "Pages",
    fields: [
      { key: "thanksTitle", label: "Confirmation title", type: "text" },
      { key: "thanksBody", label: "Confirmation copy", type: "textarea" },
      { key: "bankNote", label: "Payment note", type: "text" },
    ],
  },
  {
    key: "footer",
    label: "Footer",
    group: "Global",
    fields: [
      { key: "tagline", label: "Tagline", type: "textarea" },
      { key: "instagram", label: "Instagram handle (without @)", type: "text" },
      { key: "notes", label: "Reach-us lines (one per line)", type: "lines" },
    ],
  },
];

export const BLOCK_GROUPS = ["Home", "Pages", "Global"];

/** Merge a stored block over its defaults so missing fields never break a render. */
export function withDefaults(key, value) {
  const base = DEFAULT_CONTENT[key] || {};
  if (!value || typeof value !== "object") return { ...base };
  return { ...base, ...value };
}
