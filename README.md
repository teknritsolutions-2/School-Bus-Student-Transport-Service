# KinderRide Transit - School Bus & Student Transport Service

A responsive static website built with HTML, CSS, and vanilla JavaScript. It includes two distinct homepages, route and safety information, subscription comparison, support content, and a nine-view parent dashboard with local route playback and an example PDF receipt.

## Run locally

No installation or build step is required.

```sh
python3 -m http.server 8080
```

Open `http://localhost:8080/`.

## Project structure

- `assets/brand/` — light, dark-background, and favicon SVG brand assets
- `assets/css/` — global responsive, dark-mode, and RTL styles
- `assets/images/` — optimized local WebP photography
- `assets/js/` — shared shell, forms, data, dashboard, tracking, and receipt modules
- `assets/js/plugins/` — vendored Leaflet and jsPDF distributions
- `pages/` — standalone customer and dashboard pages
- `documentation/` — installation, deployment, customization, content, form, attribution, and launch notes
- `tests/` — structural and content regression checks

## Important operating boundary

Routes, people, schools, prices, schedules, notices, and journey events are illustrative. The frontend does not provide secure authentication, send form submissions, collect payment information, or report a live vehicle. Connect approved production services and replace all illustrative content before operating a real transport service.

## Published site

The repository is configured for GitHub Pages at:

`https://teknritsolutions-2.github.io/School-Bus-Student-Transport-Service/`
