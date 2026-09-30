# Interface screenshots

Synced from the Akasha monorepo `docs/screenshots/` (Playwright E2E in `apps/akasha-ui`).

Regenerate upstream:

```bash
cargo build -p akasha-daemon
cd apps/akasha-ui && npm ci && npm run test:e2e:install && npm run test:e2e
```

Then copy `docs/screenshots/ui-*.png` here. Site lightbox: click any `.screenshot-trigger` image.
