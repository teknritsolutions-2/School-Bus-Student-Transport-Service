# Wayfinder rebuild review — 13 November 2026

## Implementation

All 23 physical pages and the nine-view dashboard have new layouts and styling. The design uses deep teal, transport yellow, mint, Lexend and Source Sans 3. Home 1 is brand-led; Home 2 follows the school-day stages. Services and Transport Details have distinct scopes.

The route/stop model, journey directions, plan categories, URL resolution, browser preferences and jsPDF concept informed the replacement. The old accumulated CSS, service overrides, bus-logo artwork and unused Leaflet runtime were removed. The previous commit remains recoverable on the archive branch.

Route filtering no longer falls back to an unrelated route. Root contact links resolve inside `pages/`. Local form validation never impersonates authentication. Playback keeps its events in memory and cannot write history or notices. Old browser-local logs are excluded by the new storage namespace.

## Browser QA

Local verification passed: 19 functional groups, all 23 physical routes and 24 unique genuine photographs, with no failed asset requests or browser exceptions. The responsive matrix passed 1,488 states (23 pages plus eight additional dashboard views × 12 widths × two themes × two directions). Axe-core WCAG A/AA automated checks reported no violations across the 31 page/view destinations in both themes after the progress and notice labels were corrected. This does not claim manual screen-reader certification or cross-browser coverage; the real-browser run used Chromium through Brave.

The committed `scripts/browser-qa.cjs` can run against an HTTP preview or published subpath with a development Playwright installation:

```sh
PLAYWRIGHT_MODULE=/path/to/playwright BROWSER_PATH=/path/to/browser node scripts/browser-qa.cjs https://teknritsolutions-2.github.io/School-Bus-Student-Transport-Service/ matrix
```

Functional checks cover physical routes/assets/internal destinations, unique images, Home dropdown, direct Services link, combined route filters and no-results, return stop times, sticky navigation, back-to-top, theme/RTL persistence, drawer focus/Escape, Home 2 keyboard tabs, FAQ/journal filtering, estimates, login/register validation and honest provider/recovery behavior, enquiry preview/download, all dashboard views, student selection, isolated playback pause/reset, history preservation, read notices, local plan/settings/reset and a real downloaded PDF with a draft watermark.

Responsive checks use 320, 360, 390, 425, 430, 768, 820, 960, 1024, 1180, 1280 and 1440 pixels in both themes and directions. Representative desktop, tablet and mobile screenshots were visually inspected, including dark RTL, authentication, services, routes, pricing and dashboard tracking. Refinements included larger landscape introductions, balanced tablet portrait rows, pricing reflow, service-panel padding and contrasting active stop/check markers.

## Remaining services

Authentication/OAuth/recovery, secure student records, approved routes/rates, live fleet telemetry, enquiry delivery, dispatch/alerts, payments and official receipts need real backend integrations. Business and policy content needs operator approval. No real student information is exposed in this reference frontend.
