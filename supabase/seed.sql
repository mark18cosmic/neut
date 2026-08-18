-- ============================================================================
-- Neut — seed data. Run after schema.sql.
--
-- Mirrors the original hard-coded catalog and copy so a fresh Supabase project
-- renders exactly the site that existed before the admin panel. Safe to re-run:
-- every statement is an upsert.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Editable site content
-- ---------------------------------------------------------------------------
insert into public.site_content (key, value) values
('hero', jsonb_build_object(
  'eyebrow',      '',
  'headingTop',   'Created by us,',
  'headingBottom','curated for you.',
  'subtext',      'Handmade charms, bracelets and necklaces — gathered from the shoreline of Malé, Maldives.',
  'ctaLabel',     'Shop the New Drop',
  'ctaHref',      '/shop',
  'secondaryLabel','Build your charms',
  'secondaryHref','/builder',
  'imageUrl',     null,
  'imageAlt',     'Neut jewelry on driftwood in warm island light',
  'tone',         jsonb_build_array('#5A6642', '#B79B75'),
  'overlay',      35,
  'showLogo',     true
)),
('announcement', jsonb_build_object(
  'enabled', true,
  'text',    'Island-wide delivery · orders confirmed by Instagram DM',
  'href',    '/shop'
)),
('drop_rail', jsonb_build_object(
  'eyebrow', 'Latest Drop',
  'title',   'Low Tide',
  'linkLabel','View all',
  'linkHref','/shop'
)),
('marquee', jsonb_build_object(
  'enabled', true,
  'items', jsonb_build_array('Handmade in Malé', 'Small batch', 'Island-wide delivery', 'Created by us, curated for you', 'Layer it your way')
)),
('quote_break', jsonb_build_object(
  'quote',    'Layer the charms you love. Rebuild your story, season to season.',
  'ctaLabel', 'Build your charms',
  'ctaHref',  '/builder',
  'imageUrl', null,
  'imageAlt', 'Charm locket resting on a palm frond',
  'tone',     jsonb_build_array('#3F4A2E', '#B79B75')
)),
('featured', jsonb_build_object(
  'eyebrow', 'The collection',
  'title',   'Quietly worn favourites'
)),
('story_strip', jsonb_build_object(
  'enabled', true,
  'eyebrow', 'Why Neut',
  'title',   'Small things, made slowly',
  'items', jsonb_build_array(
    jsonb_build_object('title', 'Gathered by hand', 'body', 'Cowrie, driftwood and stone picked up on morning walks along the reef.'),
    jsonb_build_object('title', 'Made in small batches', 'body', 'Every drop is finished at our bench in Malé — never mass produced.'),
    jsonb_build_object('title', 'Built to be layered', 'body', 'Start with one chain, add a charm each season. Your piece keeps growing.')
  )
)),
('about', jsonb_build_object(
  'heroTitle',   'Our story',
  'heroImageUrl', null,
  'heroAlt',     'Hands making jewelry by the sea',
  'eyebrow',     'Malé, Maldives',
  'lede',        'Neut began the way most quiet things do — with our hands, a length of chain, and the shoreline for a workbench.',
  'body1',       'We make in small batches, close to the sea. A cowrie found on a morning walk. A piece of driftwood worn smooth by the tide. We set what the island gives us, and we make it to be worn every day — layered, lived in, added to over time.',
  'body2',       'Nothing here is mass-made. Each drop is a season of small things, gathered and finished by us — then curated for you.',
  'contactTitle','Come say hello',
  'contactBody', 'We take orders and answer questions on Instagram, and confirm every piece personally. Payment is by bank transfer, with island-wide delivery.'
)),
('footer', jsonb_build_object(
  'tagline',   'Created by us, curated for you. Handmade in Malé, Maldives.',
  'instagram', 'neut.co',
  'notes', jsonb_build_array('Orders & questions via Instagram DM', 'Payment by bank transfer', 'Island-wide delivery')
)),
('shop', jsonb_build_object(
  'eyebrow',    'Shop',
  'emptyText',  'Nothing here yet — try another filter.',
  'charmsTitle','Charms are made to be layered.',
  'charmsBody', 'Pick a chain and stack the charms you love.'
)),
('journal', jsonb_build_object(
  'eyebrow', 'Journal & Drops',
  'title',   'From the shoreline'
)),
('checkout', jsonb_build_object(
  'thanksTitle', 'Thank you',
  'thanksBody',  'Your order is noted. We''ll confirm availability and share our bank transfer details over Instagram DM — usually within a day.',
  'bankNote',    'Delivery arranged after we confirm. Payment by bank transfer.'
))
on conflict (key) do nothing;

-- ---------------------------------------------------------------------------
-- Catalog
-- ---------------------------------------------------------------------------
insert into public.products
  (slug, name, category, price, metals, materials, drop_name, sold_out, stock, charm_ready, featured, position, blurb, description, care, tone)
values
('tide-locket', 'Tide Locket', 'necklaces', 890, '{gold,silver}', '{locket}', 'Low Tide', false, 6, true, true, 10,
 'A small ocean you can carry.',
 'A hand-finished oval locket that opens to hold what the tide leaves behind — a photo, a note, a grain of sand from a shore you loved. Worn on a fine cable chain.',
 'Keep dry when swimming. Wipe with a soft cloth. Store flat, away from light.',
 '{#5A6642,#B79B75}'),
('driftwood-charm', 'Driftwood Charm', 'charms', 220, '{gold,silver}', '{wood,engraved}', 'Low Tide', false, 12, false, true, 20,
 'Weathered, warm, one of a kind.',
 'A single charm cast from a piece of driftwood found along Malé''s shoreline, then set in your chosen metal. No two are quite alike. Meant to be layered.',
 'Avoid prolonged water contact. Store separately to prevent scratching.',
 '{#B79B75,#8a7350}'),
('cowrie-charm', 'Cowrie Charm', 'charms', 240, '{gold,silver}', '{shell}', 'Low Tide', false, 15, false, true, 30,
 'The island''s oldest currency.',
 'A real cowrie shell, rimmed and hung by hand. Once traded across these islands, now worn close. Clip it onto any Neut chain or locket.',
 'Natural shell — handle gently. Keep from harsh sun and chlorine.',
 '{#E3D5BF,#B79B75}'),
('pearl-drop-charm', 'Pearl Drop Charm', 'charms', 320, '{gold,silver}', '{pearl}', null, false, 8, false, true, 40,
 'A single freshwater pearl.',
 'One freshwater pearl on a fine hoop, catching light the way water does at dusk. Layer it beside a shell or wear it alone.',
 'Pearls are soft — last on, first off. Wipe after wear.',
 '{#F3EDE2,#E3D5BF}'),
('reef-chain', 'Reef Chain', 'necklaces', 760, '{gold,silver}', '{engraved}', null, false, 9, true, true, 50,
 'The chain your charms come home to.',
 'A supple, hand-linked chain designed as the base of your Neut story — clasp on the charms you love and rebuild it season to season.',
 'Polish with a dry cloth. Remove before the shower.',
 '{#3F4A2E,#5A6642}'),
('shoreline-cuff', 'Shoreline Cuff', 'bracelets', 640, '{gold,silver}', '{engraved}', null, false, 5, false, true, 60,
 'One clean line, like the horizon.',
 'An open cuff hammered by hand to a soft matte finish. It sits like the horizon — one quiet, unbroken line.',
 'Reshape gently with both hands. Avoid bending repeatedly.',
 '{#B79B75,#5A6642}'),
('knot-bracelet', 'Knot Bracelet', 'bracelets', 480, '{gold,silver}', '{wood,stone}', 'Low Tide', true, 0, false, false, 70,
 'Tied by hand in Malé.',
 'A woven cord finished with a small metal knot and a single stone bead. Adjustable, easy, everyday.',
 'Cord is water-friendly; dry fully after the sea.',
 '{#8a7350,#3F4A2E}'),
('moonstone-charm', 'Moonstone Charm', 'charms', 360, '{silver}', '{stone}', null, false, 4, false, true, 80,
 'Milky light, like the shallows.',
 'A cabochon moonstone that glows the pale blue of the lagoon at first light. Silver only.',
 'Soft stone — store apart. Clean with a damp cloth, no chemicals.',
 '{#E3D5BF,#5A6642}')
on conflict (slug) do nothing;

-- ---------------------------------------------------------------------------
-- Journal
-- ---------------------------------------------------------------------------
insert into public.journal_posts (slug, title, tag, dateline, body, tone, position) values
('low-tide', 'Low Tide', 'New Drop', 'July 2026',
 'Our warm-season drop — lockets, cowrie and driftwood charms gathered along the reef. Small batch, as always.',
 '{#5A6642,#B79B75}', 10),
('how-to-layer', 'How to layer', 'Charm', 'June 2026',
 'Start with one chain you''ll never take off. Add a charm that means something. Leave room for the next season.',
 '{#B79B75,#3F4A2E}', 20),
('a-morning-walk', 'A morning walk', 'Behind the scenes', 'May 2026',
 'Every piece starts on the sand. Here''s what a gathering morning looks like before anything reaches the bench.',
 '{#E3D5BF,#5A6642}', 30),
('a-short-break', 'A short break', 'Note', 'April 2026',
 'We''re pausing new orders for a little while to restock. Back soon — thank you for waiting with us.',
 '{#3F4A2E,#B79B75}', 40)
on conflict (slug) do nothing;
