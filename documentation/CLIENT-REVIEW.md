# Wayfinder rebuild review — 13 November 2026

## Implementation

All 23 physical pages and the nine-view dashboard have new layouts and styling. The revised design uses one orange-yellow primary color, neutral light/charcoal surfaces, Lexend and Source Sans 3. Home 1 is brand-led; Home 2 follows the school-day stages. Services and Transport Details have distinct scopes.

The route/stop model, journey directions, plan categories, URL resolution, browser preferences and jsPDF concept informed the replacement. The old accumulated CSS, service overrides, bus-logo artwork and unused Leaflet runtime were removed. The previous commit remains recoverable on the archive branch.

Route filtering no longer falls back to an unrelated route. Root contact links resolve inside `pages/`. Local form validation never impersonates authentication. Playback keeps its events in memory and cannot write history or notices. Old browser-local logs are excluded by the new storage namespace.

## Browser QA

Local verification passed: 21 functional groups, all 23 physical routes and 24 unique genuine photographs, with no failed asset requests or browser exceptions. The responsive matrix passed 1,584 states (23 pages plus two additional service selections and eight additional dashboard views × 12 widths × two themes × two directions). Axe-core WCAG A/AA automated checks reported no violations across the public pages and dashboard views in both themes after the progress and notice labels were corrected. This does not claim manual screen-reader certification or cross-browser coverage; the real-browser run used Chromium through Brave.

The committed `scripts/browser-qa.cjs` can run against an HTTP preview or published subpath with a development Playwright installation:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright BROWSER_PATH=/path/to/browser node scripts/browser-qa.cjs https://teknritsolutions-2.github.io/School-Bus-Student-Transport-Service/ matrix
```

Functional checks cover physical routes/assets/internal destinations, unique images, Home dropdown, direct Services link, combined route filters and no-results, return stop times, sticky navigation, back-to-top, theme/RTL persistence, drawer focus/Escape, Home 2 keyboard tabs, FAQ/journal filtering, estimates, login/register validation and honest provider/recovery behavior, enquiry preview/download, all dashboard views, student selection, isolated playback pause/reset, history preservation, read notices, local plan/settings/reset and a real downloaded PDF with a draft watermark.

Responsive checks use 320, 360, 390, 425, 430, 768, 820, 960, 1024, 1180, 1280 and 1440 pixels in both themes and directions. Representative desktop, tablet and mobile screenshots were visually inspected, including dark RTL, authentication, services, routes, pricing and dashboard tracking. Refinements included larger landscape introductions, balanced tablet portrait rows, pricing reflow, service-panel padding and contrasting active stop/check markers.

## Remaining services

Authentication project/provider activation (see AUTH-SETUP.md), secure student records, approved routes/rates, live fleet telemetry, enquiry delivery, dispatch/alerts, payments and official receipts need real backend integrations. Business and policy content needs operator approval. No real student information is exposed in this reference frontend.

## Color, Services and image correction

Orange-yellow (#F5AD2B) is the single UI primary in both themes. Dark mode uses warm neutral #141312 canvas, #1F1D1B panels and #292623 secondary surfaces. Readable amber text uses a darker shade on light surfaces. Services now has three accessible service selections, each with its own uncropped landscape photo, planning details and detail-page link. Selection supports keyboard navigation and direct hash access. Alternating service-photo rows were removed.

Photo layouts follow actual source orientation. Portrait columns use their own narrower grid tracks; landscape photos fill their frames. Height caps and mismatched wrapper dimensions were removed, and mobile portrait/landscape sizing is handled separately. No AI images or repeated content photographs were introduced.

## Reference comparison pass

Courier and Yoga were inspected as published websites at desktop and mobile sizes. KinderRide still repeated generic introductions and placed tools too far down the page. The next pass introduces compact home route search, an editorial service directory, distinct About composition, a search-first Routes page with initial reference results, a form-first Contact page, and an estimate-focused Subscriptions page without a repeated pricing grid. Five genuine photos replace weak or tightly cropped source compositions. See DESIGN-COMPARISON.md.

## Account, spacing and amber refinement — 14 November 2026

Branding is inside both standalone account cards, over different genuine exterior school-bus photographs. The previous footer disclaimer and dashboard exploration link were removed. Official Supabase email/password, signup, Google/Apple PKCE, recovery and Exit wiring is prepared, with empty public configuration because the owner has no identity project yet. Provider URL and server-error checks use intercepted endpoints; they do not certify real provider sign-in.

The homepage journey directory now uses a compact heading and three balanced service columns. Section spacing is tighter; the About principles photograph is landscape and matches the content column. Contact has a shorter heading, clearer form grouping and a small unsent-draft explanation next to its action. Login is an amber navbar button, Dashboard has no arrow, and the workspace exit reads Exit.

At 1180px and below, home and standard side-photo introductions use their photograph as a background with a readable dark overlay. Desktop editorial photographs retain natural source proportions. Home 2 and group service photographs now show complete modern transport vehicles. No AI imagery was used.

The original client requests remain covered through a direct Services destination, transport detail anchors, Routes, Safety & Fleet, Parent Portal & Registration, Pricing & Policies and Case Studies. Door pickups, clubs, school trips, stop finding, GPS/camera questions, driver preparation, digital passes, registration, alerts, sibling savings, payment guidance and collection rules remain in their relevant pages. Unverified operator contacts, response targets, prices and live integrations are not invented. No extra page families were added.

Final local verification for this refinement: 21 functional groups and 1,584 responsive states passed, with 24 distinct real photographs and no failed asset requests or browser errors. Axe-core reported zero automated A/AA violations across 31 destinations in both themes. Four additional auth wiring checks passed (Google PKCE URL, Apple PKCE URL, server-rejected email login and Exit/navigation); real provider account completion remains pending configuration.

## Pricing, Home 2 and responsive dashboard refinement

Pricing's introductory container now matches the shared content gutters and uses a naturally wide, complete bus photograph in a balanced two-column composition. Home 2 uses a full-width horizontal stage selector above a compact summary/checklist panel; the duplicate lower timeline and empty side column were removed. Tab labels, selected state and keyboard navigation remain accessible.

At 1180px and below, the dashboard header places branding at the left and its hamburger at the far right, in both text directions. Theme and RTL controls are available inside the side panel, while desktop retains its header controls. The responsive drawer still traps focus, supports Escape and closes after section navigation.

Twenty-four genuine photo subjects remain unique across page placements. Full-size existing assets were recompressed (7,924,220 → 4,192,774 bytes in the compression pass), followed by the final Pricing/signup source replacements. Responsive 640px/960px versions let browsers request smaller files. The Pricing photo chosen at a standard desktop density is 67,478 bytes, compared with the previous 737,922-byte portrait. Banner/first-section images load eagerly with high priority; lower editorial images stay lazy, and explicit dimensions prevent layout shifts.

Verification: all 21 functional groups and 1,584 responsive states passed with no browser errors, failed assets or image distortion. Automated A/AA checks passed across 31 destinations in both themes. `scripts/refinement-qa.cjs` additionally verifies Pricing gutter alignment, Home 2 density, menu/branding positions at five phone/tablet widths in both directions, actual drawer preferences, exterior account backgrounds and phone source selection. These are local browser results; actual transfer time depends on the visitor's connection and browser cache.
