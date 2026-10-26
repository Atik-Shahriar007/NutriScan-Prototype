# NutriScan — Same-Family Alternatives and Halal Mode Plan

## Scope

This revision makes three targeted changes to the existing Expo/React Native prototype: replace unrelated high-scoring food suggestions with same-family alternatives; add an opt-in Halal Mode that filters product surfaces using product-specific evidence; and replace the package photo in the Scan-first home card with a continuously animated barcode illustration. Preserve existing screens, local preferences, visual identity, bilingual copy and prototype limitations.

## Product-family alternatives

Add a catalog field for explicit comparison families, such as `mango-drink`, `instant-noodles` and `potato-snack`. Link each of the three lower-scoring products named by the user to its family. Add three researched products from other brands to each family, with local package art, product-identity source links and a prototype food score above 60. Where a proposed product cannot be sourced, select a verified same-family replacement rather than inventing a product identity.

Replace the current global selector with a strict rule: only a food product scoring below 60 may show an alternatives section, titled **Better Alternatives**. The section contains the three highest-scoring food products in that product's comparison family, from brands other than the source product, with every displayed score strictly greater than 60. It never recommends unrelated food types or non-food products. Existing and new preview-score caveats remain concise and category-specific; scores and label figures are not described as official health or safety determinations.

## Halal Mode

Persist a default-off `halalMode` boolean in the existing AsyncStorage state. Read older stored-state objects with a missing property as `false`; do not clear existing favorites, scan history or profile data when the mode changes.

Add a labelled, accessible on/off control to More. When enabled, filter every product surface consistently: Home category counts and featured products, Discover search/category results, scanner demo entries and barcode matches, History, Favorites and Better Alternatives. Gate direct product-detail routes as well, so opening an ineligible or unknown product does not reveal its details in this mode. Offer a clear message and a route to More to turn the mode off. An empty filtered list gets a dedicated empty state.

Catalog eligibility is based only on evidence tied to the exact product: a visible product-pack halal mark or a product-specific certificate record from a credible source. Store the evidence type and source link with the product. Unknown or unsupported items stay hidden while the mode is active. Do not infer eligibility from a brand name, country, vegetarian status, ingredient list alone or an E-number. Keep a halal marker distinct from a regulator's certification; do not present NutriScan as the certifying authority. Save provenance for all new records in `assets/images/products/SOURCES.md`.

## Animated Scan-first card

Replace the mango-pack image in the Scan-first Home card with a small custom barcode illustration built from native React Native views. Add a continuous, restrained laser-line sweep across the bars using `Animated.loop` and the existing Expo/React Native stack; keep the card layout, the bilingual “Scan a barcode” message and its button to the camera/manual scanner. The motion is decorative feedback, not a claim that the home card is reading the camera. Maintain contrast in both themes and give the illustration an accessible label.

## Implementation and project structure

- `lib/nutriscan-data.ts`: add comparison-family keys, sourced alternative catalog records, product-level halal-evidence fields and helpers for strict family matching and eligibility. Keep English/Bangla product names and labels paired.
- `lib/nutriscan-state.tsx`: add backward-compatible persisted `halalMode` state and its setter.
- `app/(tabs)/more.tsx`: add the accessible Halal Mode switch and explanatory status.
- `app/(tabs)/index.tsx`, `discover.tsx`, `history.tsx`, `more.tsx`, `app/scan.tsx` and `app/product/[id].tsx`: apply the same eligibility filter and safe route behavior at each existing product surface.
- `app/(tabs)/index.tsx`: add the looping barcode-scan illustration using native `Animated` values; add no new package solely for this animation.
- `assets/images/products/` and `SOURCES.md`: add selected package imagery and source/provenance notes, preserving the existing image-rights caution.
- `plan.md` and `TODO.md`: preserve the accepted design and existing completed outcomes while adding the complete requirements for this revision.

## Design direction

Retain **Delta Field Notes**: editorial Bangladesh product-shelf visuals, deep field green, warm paper/light surfaces, restrained amber, and Noto Sans Bengali. The alternatives section uses compact product rows and clear score chips, with a family descriptor that makes the product match obvious. Halal Mode uses a shield/label icon and a visible selected state; do not use a green badge alone as proof. The scanning illustration uses regular barcode bars, a subtle moving green beam and soft frame corners. Keep motion brief, calm and continuous, with no flashing or layout shifts. All new controls work in both existing light and dark themes and in Bangla/English.

## Material constraints

The existing product catalog, scores and votes remain local prototype data. Product identities, selected package images and halal evidence must be sourced and documented separately. A screenshot or package image alone does not prove nutrition facts, ingredients, health superiority or certification unless the relevant detail is explicitly legible and sourceable. The existing managed ports, Expo stack, local storage, app identifiers, generated branding and no-public-publish setting stay unchanged; no backend, payment integration or new dependency is needed for these features.
