# Self-hosting estelaoferta.ro (VPS + Docker + Postgres)

Replaces Netlify (Netlify Blobs + `@netlify/plugin-nextjs`) with a Docker
Compose stack you run yourself: `app` (Next.js, standalone build),
`postgres` (orders/catalog/products/analytics/images), `caddy` (reverse
proxy + automatic HTTPS).

## 1. Provision the VPS

Any provider works; a small one is enough for this site's current traffic
(e.g. Hetzner Cloud CX22 — 2 vCPU / 4 GB RAM / 40 GB disk, ~€4.5/mo).
Install Docker + the Compose plugin:

```sh
curl -fsSL https://get.docker.com | sh
```

Point DNS for `estelaoferta.ro` and `www.estelaoferta.ro` at the VPS's IP
**only after** the checklist below is done and tested — see step 5.

## 2. First-time setup on the VPS

```sh
git clone <repo-url> lucent-commerce && cd lucent-commerce
cp .env.example .env   # fill in every value — see below
docker compose up -d postgres
./scripts/migrate.sh   # creates kv_store + product_images tables
```

Required env vars in `.env` (see `.env.example` for the full list with
comments): `DATABASE_URL`/`POSTGRES_*`, `STRIPE_SECRET_KEY`,
`STRIPE_WEBHOOK_SECRET`, `NEXT_PUBLIC_SITE_URL`, VAPID push keys,
`GEMINI_API_KEY`, `KV_REST_API_URL`/`KV_REST_API_TOKEN` (same Upstash
values as today — that store doesn't move).

## 3. Migrate existing data from Netlify Blobs

Run locally (needs a Netlify personal access token — Profile ->
Applications -> Personal access tokens — and the site ID from
`.netlify/state.json`):

```sh
NETLIFY_SITE_ID=<siteId> NETLIFY_AUTH_TOKEN=<token> node scripts/export-netlify-data.mjs
```

This writes everything to `.netlify-export/`. Copy that folder to the VPS
(`scp -r .netlify-export vps:/path/to/lucent-commerce/`), then on the VPS:

```sh
DATABASE_URL=<same as in .env> node scripts/import-to-postgres.mjs
```

Re-run both scripts right before the final DNS cutover (step 5) to pick up
any orders placed during testing.

## 4. GitHub Actions (CI/CD)

Add these repo secrets (Settings -> Secrets and variables -> Actions):
`VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (private key matching a public key in
the VPS's `~/.ssh/authorized_keys`), `VPS_APP_DIR` (e.g.
`/root/lucent-commerce`).

On the VPS, set `APP_IMAGE=ghcr.io/<owner>/<repo>:latest` in `.env` so
`docker compose up -d` runs the image the workflow pushes rather than
building locally. `.github/workflows/deploy.yml` builds and deploys on every
push to `main`.

## 5. Test before cutover, then go live

1. Bring the full stack up: `docker compose up -d`.
2. Test by IP or a temporary `/etc/hosts` override on your machine (point
   `estelaoferta.ro` at the VPS IP locally) — full checkout (COD + card),
   image upload/display, `/admin` order list, a push notification.
3. In the Stripe Dashboard, add a **second** webhook endpoint pointing at
   the new host (same event: `checkout.session.completed`) so you can
   verify it fires correctly before relying on it.
4. Re-run the data export/import (step 3) to catch anything created during
   testing.
5. Update DNS (A record) for `estelaoferta.ro`/`www` to the VPS IP. Caddy
   requests and renews the TLS certificate automatically once DNS resolves.
6. Once confirmed working on the real domain, remove the old Netlify
   webhook from Stripe and decommission the Netlify site.

## Known trade-off

Product images are stored as `bytea` in Postgres — simplest to operate (one
database to back up), but not ideal much past a few GB. If the image
library grows large, move `product_images` to an S3-compatible store
(e.g. MinIO) later; nothing else in the app needs to change for that.
