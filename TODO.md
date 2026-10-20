# NutriScan Prototype — Outcome Checklist

## 1. Product discovery and category-aware scanning
- [x] The app uses **NutriScan** as its working name and offers camera barcode scanning on a supported device plus manual barcode entry. A code without a verified demo-catalog match is clearly shown as unmatched and can be sent to the product-submission flow; the prototype does not invent a product record.
- [x] Product details show fictional package/variant fields, ingredient labels and short, plain-language explanations that disclose when quantities, compounds or sources are unknown.
- [x] Food, personal-care/cosmetics and household products have distinct result displays and criteria. Only the fictional food example has an illustrative number; personal-care and household examples receive no universal health score.

## 2. Explainable results and Bangladesh-relevant trust evidence
- [x] The food example exposes its illustrative grade, method, criteria, factor-level effects, evidence fields and limitations rather than presenting an unexplained score. Its weights and value are explicitly placeholders—not Yuka's scoring formula or a finalized NutriScan method.
- [x] The food detail includes clearly labelled prototype fields for nutrition values, allergens, halal evidence, source-dependent additive/E-number considerations and BSTI evidence, with sample/unknown status and visible uncertainty. No actual product verification, official certification or external evidence feed is connected.
- [x] Sample and unverified information is identified as such. No prototype score or label is represented as an official certification, laboratory result, medical judgment or real product-safety determination.

## 3. Bangla/English experience
- [x] Screens, key product explanations and the accessible language switch support Bangla and English; the switch carries through navigation, product detail, contribution, leaderboard and Support Us.

## 4. Scan history
- [x] A History view lets users revisit previously scanned products and reopen their product details.
- [x] History is saved locally on the device for the prototype and can be cleared; it is not synced to an account.

## 5. Community contribution and review
- [x] The contribution flow captures/selects front and back/package-label photos plus product name, brand, category and optional barcode, then saves a local prototype submission.
- [x] A submission is visibly marked as awaiting review and explicitly is not sent to a review team or automatically added as a verified catalog record.
- [x] A sample leaderboard and accepted-points panel demonstrate recognition for helpful contributors; example rankings are identified as samples, points are gated on review, and they do not affect product grades or verification.
- [x] Contribution photos and metadata can be submitted through a typed backend endpoint, stored through project storage when configured, and retained in a local preview fallback when storage/database services are unavailable.
- [x] Contributions have pending, accepted, rejected and clearer-photo-needed review states; accepted contributions award fixed review points and preserve review notes.
- [x] The leaderboard reads only accepted contributions whose submitter opted into public display; points do not affect product grades, verification or search ranking.

## 6. Support Us
- [x] Support Us describes voluntary operating support, what contributions could fund, and the potential Bangladesh payment methods.
- [x] bKash/Nagad are clearly shown as **not configured**. No real donation account, checkout or charge is connected.

## 7. Approved NutriScan visual direction
- [x] Apply the approved **Delta Field Notes** direction: documentary/editorial warmth, paper tones, deep green accents, restrained amber, Bengali-capable typography, clear evidence cards, and spacious one-handed portrait layouts. The generated mark is used for the app identity, launcher and splash assets.

## Prototype boundary
- The catalog, grade and evidence records remain fictional local sample data; contribution submission, image storage fallback, review states and accepted-points leaderboard endpoints are now connected, while the product catalog, live OCR, source-verification feed, account sync and payment integration remain unconnected.
- The Expo Web Preview uses manual barcode/demo lookup; the native camera path is implemented but has not been verified on a physical device. This is a previewable prototype, not an installed or store-ready iOS/Android release.
- **NutriScan** is a working name only; trademark, domain and app-store name clearance have not been performed.
