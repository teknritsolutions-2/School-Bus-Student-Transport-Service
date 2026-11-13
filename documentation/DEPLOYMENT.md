# Deployment

GitHub Pages publishes the repository root from `main`. There is no build step. Preserve the physical HTML pages and the assets directory. Shared URLs resolve from `assets/js/site-config.js`, so direct navigation and refresh work under `/School-Bus-Student-Transport-Service/`.

The previous working baseline is preserved in `archive/pre-wayfinder-f07c110`. Avoid force-pushing either branch.

Before publishing, run the browser QA script against an HTTP preview, inspect representative desktop/tablet/mobile screenshots, and check real downloads. After publishing, repeat direct page access, refresh and critical interactions on the actual GitHub Pages URL. A local check alone does not verify deployment.

If the hosting origin changes, update canonical URLs in the HTML authoring helper, `sitemap.xml` and `robots.txt`. The utility page is `pages/404.html`; no automatic root-level custom-404 routing is configured.

No backend integrations are implied by deployment. See FORM-INTEGRATION.md for remaining services and approved operating data.
