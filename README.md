# KinderRide Transit — The School-day Wayfinder

A complete static frontend rebuild with 23 physical HTML pages, two distinct homepages, a combined-filter Route Finder and a nine-view parent workspace. A single orange-yellow primary color sits on warm light or neutral charcoal dark surfaces. Lexend and Source Sans 3 are self-hosted.

## Preview

No install or build is required. Serve this folder with `python3 -m http.server 8080` and open `http://localhost:8080/`. JavaScript modules require HTTP rather than file URLs.

## Source structure

- `index.html` and `pages/`: physical page content, metadata and shared-shell mounts; all previous page URLs retained. Services uses an accessible three-option selector with distinct photos and detail links.
- `assets/css/`: fonts, shared components, semantic dark theme, logical RTL rules, standalone authentication and dashboard styles.
- `assets/js/site-config.js`: subpath-safe URLs, storage and formatting.
- `transport-data.js`: explicitly fictional reference routes, students, history and coverage categories.
- `main.js`: shared navigation/footer, preferences, drawers, journey tabs and search.
- `route-finder.js`: combined filters and accessible stop sequences; no unrelated fallback.
- `forms.js`: validation, unsent enquiry drafts and illustrative estimates.
- `auth.js` and `auth-config.js`: Supabase email/password, Google/Apple PKCE redirects, recovery and sign-out; activation steps in [AUTH-SETUP](documentation/AUTH-SETUP.md).
- `dashboard.js`: nine views, selection, local preferences and draft PDF generation.
- `tracking.js`: isolated in-memory playback; never writes history or notifications.
- `assets/js/plugins/jspdf.umd.min.js`: retained PDF library. No mapping runtime is loaded.
- `scripts/build-pages.mjs` and `workspace-pages.mjs`: optional authoring helpers for physical HTML. They are not required to serve or deploy. Edit these when regenerating content, then format output.
- `scripts/browser-qa.cjs`: development-only real-browser checks; see `documentation/CLIENT-REVIEW.md`.

## Published site

https://teknritsolutions-2.github.io/School-Bus-Student-Transport-Service/

The pre-rebuild baseline is preserved on `archive/pre-wayfinder-f07c110` at `f07c110950399b9bc2db43aab7fe8cf17dc18ea3`.

## Operating boundary

No identity provider, student database, live fleet feed, messaging or payment gateway is connected. Routes and students are fictional; prices are illustrative at the estimate point. Account controls use a prepared Supabase integration, awaiting a configured project. They report unavailability until configured; passwords are never stored by application code. Enquiries stay local, and PDFs are visibly drafts. After activation, the official SDK manages account sessions; real student records still require a protected backend. Production integration requirements are in `documentation/FORM-INTEGRATION.md`.
