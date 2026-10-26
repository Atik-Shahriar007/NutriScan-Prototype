

## App-wide UX refinement plan

The audit covers Home, Discover, History, More, Scanner, Product Detail, Profile, Contribute, Community, Support and NutriFacts. Preserve the Delta Field Notes identity, supplied NutriScan mark, bilingual English/Bangla behavior, local prototype boundaries and existing light/dark palette while improving the system-level experience.

### Chosen refinement direction

Use a **quiet field-guide refinement**: keep the warm paper surfaces, deep field green, amber evidence cues, rounded cards and compact editorial density, but make interaction states more explicit and readable. The app should feel calm and trustworthy rather than busier.

- **Core principles:** one obvious next action per screen; 44px minimum effective touch targets; no false empty/loading/saved states; Bengali copy gets room to wrap; prototype limitations remain visible but never overpower the task.
- **Layout paradigm:** vertical scan-first flows with a clear primary action, grouped secondary actions, and generous recovery states. Use shared primitives before screen-local styling.
- **Interaction and animation:** pressed/focused states on every actionable row, explicit hydration gate before persisted-state screens render, restrained motion that repeats predictably and respects the existing calm visual language.
- **Typography:** retain Noto Sans Bengali; raise essential supporting copy toward 12–14px and remove unnecessary one-line constraints on localized content.

### Implementation decisions

- Gate the root navigator behind the provider's local AsyncStorage hydration, using the NutriScan mark and a localized loading state to prevent flashes of the wrong language, theme, catalog filter or saved data.
- Upgrade shared header, section actions and button accessibility semantics with effective 44px touch areas, localized labels, disabled states and pressed feedback.
- Improve Discover with larger filter/clear targets and a clear-search recovery action; improve History with a first-use scan CTA; improve Scanner with empty-input feedback, retry/rescan actions and clearer manual lookup semantics.
- Improve Contribute with explicit requirements feedback, larger category controls, localized field labels and selected-photo semantics.
- Improve Product Detail and education/utility screens through clearer action hierarchy and accessible disclosure/source controls where changes remain within current prototype capabilities.
- Validate all routes in Expo Web, TypeScript, tests and lint; keep the managed ports, native identifiers and existing storage model unchanged.
