# Akasha_app

Public website and **release mirror** for Akasha — downloads, docs, and changelog on GitHub Pages.

**Hermes / parité produit :** la matrice vivante côté cœur Akasha est dans [`Akasha/docs/hermes-akasha-parity-matrix.md`](https://github.com/azerothl/Akasha/blob/main/docs/hermes-akasha-parity-matrix.md) ; synchroniser les pages publiques (`docs.html`, annonces) quand une ligne passe à « Existe ».

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

## Documentation site (`docs.html`)

The public docs page is **hand-written HTML** in English. When shipping a new Akasha version, follow the checklist in [docs/DOCUMENTATION_SYNC.md](docs/DOCUMENTATION_SYNC.md) so commands, ports, and UI tabs stay consistent with `Akasha/docs/user_guide_final.md` and the actual CLI/TUI.

## Plugins catalog (`plugins.html`)

The [plugins.html](plugins.html) page loads **`plugins.json` from the public [Akasha_plugins](https://github.com/azerothl/Akasha_plugins) repository** (via [jsDelivr](https://cdn.jsdelivr.net/gh/azerothl/Akasha_plugins@main/plugins.json), with a raw GitHub fallback). When a plugin is added or changed under `plugins/` on `main`, that repo’s CI rebuilds the JSON — the site list updates on the next page load without a commit to Akasha_app.

## Local preview

Open `index.html` in a browser from a local server (fetch for `api/latest.json` / `data/` may be blocked on `file://`).

```bash
npx serve .
```

Preview `plugins.html` the same way so the browser can fetch the catalog from jsDelivr (and `api/latest.json` locally).

## License

MIT (site content and scripts).
