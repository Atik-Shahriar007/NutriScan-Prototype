# NutriScan — Outcome Checklist

## 1. Product discovery and category-aware scanning
- [x] The app uses NutriScan as its working name and offers camera barcode scanning on a supported device plus manual barcode entry. A code without a catalog match is shown as unmatched and can be taken to the local product-submission draft; the prototype does not invent a product record.
- [x] Product details show product/variant fields, ingredient labels and plain-language explanations. Food, personal-care/cosmetics and household examples use distinct result displays and criteria; only food examples use a number and non-food products do not receive a universal health score.

## 2. Discover and Bangladesh product catalog
- [x] A dedicated Discover destination opens with the food catalog available, lists the current catalog products and offers search and category filters for food, personal-care and household products.
- [x] Bangladesh-market demo products use local package imagery, bilingual product/brand text and image/identity sources recorded in `assets/images/products/SOURCES.md`; image reuse rights must be cleared before public/commercial release.

## 3. Existing product detail interactions
- [x] Product detail has no general “More from the catalog” block.
- [x] Food detail displays prototype score context and category-specific evidence/limits. Food, personal-care and household records do not share one universal health grade.
- [x] Every product detail has small bilingual like/dislike controls and visible starting totals. A user may like, dislike, switch or undo their choice; the choice persists on this device and changes only this device's displayed count. Starting numbers are identified as preview counts, not real or synchronized votes.

## 4. More, Community and local profile
- [x] More provides navigation to the contributor leaderboard, Support Us, locally saved favorites, My Profile and NutriFacts.
- [x] My Profile lets the user edit and save a display name and district. Save only on the current device; do not imply account sync or use a real account backend.
- [x] The contributor leaderboard displays Razin, Shaker, Atik and Abir in demo rows. Keep its demo status explicit; do not imply rankings, identities, submissions or points came from a live service.

## 5. NutriFacts education
- [x] NutriFacts is reachable from More and includes a date-selected daily general health tip, ingredient insight, Myth vs Fact cards and interesting food/nutrition facts.
- [x] Cards are available in Bangla and English, visibly attributed to credible sources and distinct from personalized medical or dietary advice. Source URLs are recorded in `assets/images/products/SOURCES.md`.

## 6. Light/dark appearance and bilingual UX
- [x] A compact, accessible light/dark toggle sits beside the language control in the shared header. Appearance is locally persisted and applied to tabs, nested screens, navigation, inputs, cards and status bar. Light remains the initial default.
- [x] The home headline is **“Know What You Eat”** in English and a natural Bangla equivalent; the old basket headline is removed.
- [x] Existing screens support Bangla and English using the bundled Noto Sans Bengali font and shared language switch.

## 7. Existing scan history and contribution flow
- [x] History lets users revisit previously scanned products and details; it is stored locally and can be cleared after an in-app confirmation.
- [x] Contribution captures/selects front and back/package-label photos plus product name, brand, category and optional barcode, then saves a local prototype submission.
- [x] Saved contributions are local drafts; they are not sent to a review team or automatically added as verified catalog records. The prototype does not award contribution points.

## 8. Support Us
- [x] Support Us explains voluntary operating support and possible uses. bKash/Nagad are clearly not configured; there is no real donation account, checkout or charge.

## 9. Existing product and visual integrity
- [x] The approved Delta Field Notes direction, generated NutriScan mark, portrait-first layouts and user-supplied reference screens guide the experience.
- [x] Product details, Profile, NutriFacts and existing controls retain coherent spacing, evidence indicators, typography and light/dark readability.

## 10. Same-family Better Alternatives
- [x] Rename the below-60 recommendations heading to **“Better Alternatives”** in Bangla and English.
- [x] When **PRAN Frooto Mango Drink** (score 52) is open, show exactly three products from other brands in the mango-drink family. Each alternative has a preview score **strictly above 60**.
- [x] When **PRAN Mr. Noodles Spicy Tomato** (score 46) is open, show exactly three products from other brands in the instant-noodle family. Each alternative has a preview score **strictly above 60**.
- [x] When **Bombay Sweets Potato Crackers** (score 52) is open, show exactly three products from other brands in the potato-snack family. Each alternative has a preview score **strictly above 60**.
- [x] Order each family's alternatives from highest to lowest score. Do not show unrelated high-scoring products. Products scoring 60 or more, or belonging to a non-food category, do not show this section.
- [x] Add the sourced alternative products, brand/variant details and pack images to Discover and product details; preserve product identity/image links in `assets/images/products/SOURCES.md`. Scores remain prototype comparisons rather than verified nutrition/medical advice.

## 11. Halal Mode
- [x] Add an accessible interactive Halal Mode on/off switch in More. Persist its state on this device and default it to off without clearing older saved history, favorites, language, appearance or profile data.
- [x] When on, show only products whose exact product record has a source-backed halal mark on its package or a product-specific certificate record. Products with missing/unclear evidence remain hidden. Do not infer eligibility from a brand, country, vegetarian status, ingredient list alone or an E-number.
- [x] Apply the filter consistently to Home counts/featured products, Discover search/category results, scanner product lists and matched barcodes, History, Favorites, direct product-detail routes and Better Alternatives. Preserve all hidden records so turning the mode off restores the normal catalog.
- [x] If a scan, route or empty list has no eligible product, show a clear bilingual Halal Mode message and a way to turn it off; do not reveal ineligible product details while the mode is active.
- [x] Show what evidence supports an eligible product's status without implying NutriScan itself issued a halal certification. Document product-level evidence and source URLs.

## 12. Animated scan-card illustration
- [x] Replace the mango package image in the Scan-first Home card with a barcode illustration and a continuously sweeping scan beam. Do not use a QR/barcode photo or unrelated product image in that card.
- [x] Keep the existing bilingual scan text and the button that opens camera/manual barcode search; make the illustration accessible and maintain contrast in both light and dark themes. The animation is a visual cue, not a claim that the Home card is reading the camera.

## Existing prototype boundary
- Catalog grades, ingredient quantities, recommendation scores and starting reaction totals are local preview content, not official safety, nutrition or certification determinations.
- Profile, votes, theme, language, history, favorites, contribution drafts and Halal Mode preference remain local; no live product database, moderation/review queue, account sync, online votes or payment connection is part of this prototype.
- The Expo Web Preview uses manual barcode/demo lookup; native camera behavior has not been verified on a physical device.
- Package photographs are product-recognition references, not evidence of every product fact or commercial image rights. Clear reuse rights before distribution.
- NutriScan is a working name; trademark, domain and app-store clearance have not been performed.
