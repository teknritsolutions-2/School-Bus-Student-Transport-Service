# Customization

## Brand

Replace the SVG files in `assets/brand/` while keeping their filenames: `logo.svg` for light backgrounds, `logo-white.svg` for dark backgrounds, and `favicon.svg` for the browser icon.

## Colors and layout

Edit the custom properties at the top of `assets/css/style.css`. Keep stylesheet order unchanged in every page: `style.css`, then `dark-mode.css`, then `rtl.css`.

## Shared navigation and footer

Edit `assets/js/main.js`. It creates the public header, dropdown navigation, mobile drawer, call-to-action band, footer, theme switch, RTL switch, canonical URL, and website structured data. Generated links resolve from the script URL, so the template works in a deployment subdirectory.

## Public pages

Each file in `pages/` is a real HTML document. Edit its content directly. Preserve one clear `<h1>` per page, unique title and description metadata, meaningful heading order, alternative text, and accessible labels.

## Dashboard

All nine dashboard views live in `pages/parent-dashboard.html`. `assets/js/dashboard.js` changes views in place and updates the URL hash. Route playback logic lives in `assets/js/tracking.js`; editable illustrative datasets live in `assets/js/data.js`.

## Maps and PDF receipts

Leaflet and jsPDF are vendored in `assets/js/plugins/`. OpenStreetMap tiles require network access, but the interactive route layer and controls are client-side.

## Dark mode and RTL

Theme and direction are stored as `schoolTransport:theme` and `schoolTransport:dir` in localStorage. Dark-specific rules belong in `dark-mode.css`; direction-specific rules belong in `rtl.css`.
