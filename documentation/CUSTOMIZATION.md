# Customization

Change semantic colors and shared type scales in `assets/css/style.css`; dark surfaces belong in `dark-mode.css`. Logical-direction adjustments are in `rtl.css`. Auth and dashboard have dedicated stylesheets and layouts.

Public navigation/footer and brand markup live in `assets/js/main.js`. Home has two destinations; Services is a direct link. Preserve the accessible drawer focus handling and tested sticky-header mount.

Edit physical HTML directly, or edit `scripts/build-pages.mjs` / `workspace-pages.mjs` and regenerate all pages using Node. Format the resulting physical HTML before committing. There is no runtime generation requirement for hosting.

Keep each real photo unique across the content pages and preserve its natural ratio. Update ATTRIBUTION.md when replacing a photo. Use the genuine source image, not an AI reconstruction.

Replace reference data only with approved business information. Changes to routes, themes or responsive components require the relevant browser checks again.
