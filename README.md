# Akasha_app

Public website and **release mirror** for Akasha — downloads, docs, and changelog on GitHub Pages.

## Release pipeline (sanity checklist)

1. A release is published on the **private** Akasha repo (binaries attached to the GitHub Release).
2. That repo’s workflow sends `repository_dispatch` (`new_release`) to **Akasha_app**.
3. **`.github/workflows/update-releases.yml`** runs with secret **`AKASHA_RELEASE_READ_TOKEN`** (read access to Akasha releases):
   - Downloads all release assets (`gh release download`).
   - Creates a **matching tag + release on Akasha_app** with the same zip files.
   - Updates `data/releases.json` and `api/latest.json`, then commits (if changed).
4. **Pages** deploys the static site; download buttons on [releases.html](releases.html) use  
   `https://github.com/azerothl/Akasha_app/releases/download/<tag>/...`.

**If users see 404 on downloads:** confirm the Akasha_app release exists for that tag and contains `akasha-full-*.zip` (etc.). Re-run **Update Release Notes** manually if the dispatch failed or the token was missing.

## Local preview

Open `index.html` in a browser from a local server (fetch for `api/latest.json` / `data/` may be blocked on `file://`).

```bash
npx serve .
```

## License

MIT (site content and scripts).
