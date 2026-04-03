# AGENTS.md

## Cursor Cloud specific instructions

### Overview

This repository is the **Akasha_app** static marketing website — a purely static site (HTML, CSS, vanilla JS, JSON data files) served via GitHub Pages. There is no build step, no package.json, and no bundler.

### Running the dev server

Serve the repo root with any static HTTP server. The `fetch()` calls in JS (for `api/latest.json`, `data/releases.json`, `data/skills.json`) require HTTP — `file://` protocol will fail due to CORS.

```bash
npx serve . -p 3000
```

Alternatively: `python3 -m http.server 3000`

### Linting

There is no configured linter in the repo. To validate:

- **JavaScript syntax**: `node --check js/main.js && node --check js/plugins-page.js`
- **JSON data files**: `node -e "JSON.parse(require('fs').readFileSync('data/releases.json','utf8'))"`
- **HTML**: `npx htmlhint index.html docs.html skills.html releases.html plugins.html compare.html 404.html`

Note: `index.html` has a pre-existing unclosed `<div>` tag (line ~225) that htmlhint reports.

### Testing

There are no automated test suites. Validation is manual — open the site in a browser and verify pages load, JSON data renders (skills, releases), navigation works, and the terminal animation plays on the homepage.

### Key pages

| Page | What it renders |
|------|----------------|
| `index.html` | Homepage with terminal animation, features, stats |
| `skills.html` | Skills library (loaded from `data/skills.json`) |
| `plugins.html` | Plugin catalog (fetched from external jsDelivr CDN — needs internet) |
| `docs.html` | Documentation with tabbed sidebar navigation |
| `releases.html` | Release timeline (loaded from `data/releases.json`) |
| `compare.html` | Feature comparison table |
| `404.html` | Custom 404 page |

### Gotchas

- `plugins.html` fetches plugin data from an external CDN (`cdn.jsdelivr.net`). Without internet access it shows an error state — this is expected.
- Google Fonts are loaded externally; the site degrades gracefully to system fonts when offline.
- The `scripts/` directory contains installer scripts (`get-akasha.sh`, `get-akasha.ps1`) for the Akasha product itself, not for this website.
