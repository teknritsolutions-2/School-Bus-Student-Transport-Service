# Deployment

Deploy the project as static files. No build step is required.

## Generic static hosting

Upload the entire project root so `index.html`, `404.html`, `pages/`, `assets/`, `documentation/`, `robots.txt`, and `sitemap.xml` keep the same relationship.

## GitHub Pages

Publish from the repository root or copy the project to the configured Pages folder. Relative links and the JavaScript-calculated site base support repository subpaths. Configure the platform's custom 404 behavior to use the root `404.html` when available.

## Netlify

Set the publish directory to the project root and leave the build command empty. To activate Netlify Forms, follow `FORM-INTEGRATION.md`.

## Cloudflare Pages

Choose a static/no-framework preset, leave the build command empty, and publish the project root.

## Traditional hosting

Copy the directory by SFTP or a hosting file manager. Make sure `index.html` is the default document.

## Before production

- If the hosting origin changes, update the published GitHub Pages origin in `robots.txt` and `sitemap.xml`.
- Replace illustrative routes, schools, people, prices, schedules, safety statements, and legal text.
- Add verified contact and company information.
- Test every page at the final domain and deployment subpath.
- Configure authentication, payment, vehicle telemetry, and messaging services if those features are required.
- Review privacy, child-data, payment, and transport obligations with qualified professionals.
