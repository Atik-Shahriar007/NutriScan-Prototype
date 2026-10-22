# NutriScan Prototype — Outcome Checklist

## 1. Product discovery and category-aware scanning
- [x] The app uses **NutriScan** as its working name and offers camera barcode scanning on a supported device plus manual barcode entry. A code without a verified demo-catalog match is clearly shown as unmatched and can be sent to the product-submission flow; the prototype does not invent a product record.
- [x] Product details show fictional package/variant fields, ingredient labels and short, plain-language explanations that disclose when quantities, compounds or sources are unknown.
- [x] Food, personal-care/cosmetics and household products have distinct result displays and criteria. Only the fictional food example has an illustrative number; personal-care and household examples receive no universal health score.

## 2. Explainable results and Bangladesh-relevant trust evidence
- [x] The food example exposes its illustrative grade, method, criteria, factor-level effects, evidence fields and limitations rather than presenting an unexplained score. Its weights and value are explicitly placeholders—not Yuka's scoring formula or a finalized NutriScan method.
- [x] The food detail includes clearly labelled prototype fields for nutrition values, allergens, halal evidence, source-dependent additive/E-number considerations and BSTI evidence, with sample/unknown status and visible uncertainty. No actual product verification, official certification or external evidence feed is connected.
- [x] Product records now have typed nutrition profiles and evidence statuses (`verified`, `demo`, `unknown`) with optional source notes; product details render structured nutrition rows and never infer missing quantities.
- [x] Sample and unverified information is identified as such. No prototype score or label is represented as an official certification, laboratory result, medical judgment or real product-safety determination.

## 3. Bangla/English experience
- [x] Screens, key product explanations and the accessible language switch support Bangla and English; the switch carries through navigation, product detail, contribution, leaderboard and Support Us.

## 4. Scan history
- [x] A History view lets users revisit previously scanned products and reopen their product details.
- [x] History is saved locally on the device for the prototype and can be cleared; it is not synced to an account.
- [x] Each scan history entry keeps a stable ID, latest scan time, repeat-scan count and a product snapshot so later catalog edits do not rewrite the record the user viewed.
- [x] The home screen shows recent scans, and opening a record routes to product details with a visible history timestamp and history-source indicator.

## 5. Community contribution and review
- [x] The contribution flow captures/selects front and back/package-label photos plus product name, brand, category and optional barcode, then saves a local prototype submission.
- [x] A submission is visibly marked as awaiting review and explicitly is not sent to a review team or automatically added as a verified catalog record.
- [x] A sample leaderboard and accepted-points panel demonstrate recognition for helpful contributors; example rankings are identified as samples, points are gated on review, and they do not affect product grades or verification.
- [x] Contribution photos and metadata can be submitted through a typed backend endpoint, stored through project storage when configured, and retained in a local preview fallback when storage/database services are unavailable.
- [x] Contributions have pending, accepted, rejected and clearer-photo-needed review states; accepted contributions award fixed review points and preserve review notes.
- [x] The leaderboard reads only accepted contributions whose submitter opted into public display; points do not affect product grades, verification or search ranking.
- [x] An admin-only moderation queue displays both package images and submission metadata, supports accept/reject/clearer-photo actions, and keeps accepted items out of the public catalog until enrichment and publication.
- [x] Accepting a contribution creates or links a draft catalog record and never auto-publishes an unverified product.

## 6. Support Us
- [x] Support Us describes voluntary operating support, what contributions could fund, and the potential Bangladesh payment methods.
- [x] bKash/Nagad are clearly shown as **not configured**. No real donation account, checkout or charge is connected.
- [x] Donation channels and an optional HTTPS donation page are environment-configurable; the UI never invents account numbers and keeps the no-charge state when values are absent.
- [x] Configured support details show explicit Send Money guidance and warn users never to share card PINs, OTPs or passwords; unconfigured details remain disabled.

## 7. Approved NutriScan visual direction
- [x] Apply the approved **Delta Field Notes** direction: documentary/editorial warmth, paper tones, deep green accents, restrained amber, Bengali-capable typography, clear evidence cards, and spacious one-handed portrait layouts. The generated mark is used for the app identity, launcher and splash assets.

## 8. Published product catalog layer
- [x] The backend has a versioned product-catalog table with barcode, category, localized summary fields, published/draft/archived status and a JSON detail record for the category-aware product view.
- [x] Public catalog list, ID lookup and barcode lookup procedures are available through tRPC and filter database records to published status.
- [x] Home catalog browsing, barcode lookup, scanner demo selection and product details use the catalog API when available and retain the local demo catalog as an offline/development fallback.
- [x] An admin catalog screen can enrich draft records with Bangla/English names, brands, size, description and bilingual ingredients before publishing them.
- [x] Publication validates required localized fields, increments the catalog version, changes status to published and refreshes public catalog reads; incomplete drafts remain out of public search.

## Prototype boundary
- The product catalog schema and read API are now connected, but the current bundled records remain fictional local sample data until real reviewed records are seeded; structured nutrition/evidence fields are ready, while live OCR, source-verification feed, account sync, cloud-synced history and payment integration remain unconnected.
- The Expo Web Preview uses manual barcode/demo lookup; the native camera path is implemented but has not been verified on a physical device. This is a previewable prototype, not an installed or store-ready iOS/Android release.
- **NutriScan** is a working name only; trademark, domain and app-store name clearance have not been performed.
