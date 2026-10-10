# Installation

WAYBELL is a standalone static website. It has no package manager, build command, framework runtime, or server-side requirement.

## Preview locally

From the project folder, use any static web server. For example:

```sh
python3 -m http.server 8080
```

Then open `http://localhost:8080/`. The root `index.html` redirects to `pages/index.html`.

Do not open pages through an editor's private preview protocol. JavaScript modules are most reliable over `http://` or `https://`.

## Directory permissions

Upload the files without changing their relative structure. Typical web-host permissions are `644` for files and `755` for folders.

## Browser support

Use current versions of Chrome, Edge, Firefox, or Safari. The template uses JavaScript modules, CSS custom properties, `dialog`, localStorage, and modern DOM APIs.

## First-run checklist

1. Open the root URL and confirm it lands on `pages/index.html`.
2. Check desktop and mobile navigation.
3. Test dark mode and RTL mode, then reload to confirm persistence.
4. Register or log in with sample details.
5. Open all nine parent dashboard views.
6. Start, pause, reset, and switch the tracking simulation.
7. Select a plan and download the generated PDF receipt.
8. Replace all demonstration content described in `CONTENT-GUIDE.md`.
