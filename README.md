# portfolio

Tiago Duarte's personal site (CV themes + blog), built as a Next.js
static export and hosted on GitHub Pages.

- Live: <https://tiagoduartedf.github.io/portfolio/>
- Stack: Next.js 16 (app router, static export) · React 19 · TypeScript ·
  Tailwind v4 · Docker (dev only)

## Run in dev (port 3003)

Everything goes through Docker so `node_modules` and `.next` stay
isolated from the host. The first `up` builds the image; subsequent
runs are instant.

```bash
docker compose up -d
```

Open <http://localhost:3003>. Edits in `app/` hot-reload.

Always run npm-style commands inside the container so the deps and
cache stay consistent:

```bash
docker compose exec web npm run lint
docker compose exec web npm install <pkg>
```

## Preview the static export (port 4003)

This is what gets shipped to GitHub Pages. A second service behind the
`preview` profile builds `./out` and serves it in one shot. Dev keeps
running on 3003.

```bash
docker compose --profile preview up -d
```

The container builds before it serves, so port 4003 stays unreachable
for **~25s** while `next build` runs. Watch the logs to see when it's
ready:

```bash
docker compose logs -f preview
# wait for the line: ==> Build done. Serving at http://localhost:4003
```

To rebuild after a code change, re-execute the command on the same
container (also ~25s):

```bash
docker compose restart preview
```

The preview serves `./out/` (the static output) so it exercises
exactly the artifact the CI workflow uploads. Local preview runs
without the `/portfolio` URL prefix; the CI build adds it so
production lives under the project-page subpath.

## Deploy to production

`.github/workflows/deploy.yml` rebuilds and publishes on every push to
`master` (and on manual dispatch from the Actions tab). It runs
`next build` with `NEXT_PUBLIC_BASE_PATH=/portfolio`, uploads `./out/`
as a Pages artifact, and deploys it.

One-time GitHub setting: **Settings → Pages → Build and deployment →
Source = GitHub Actions**.

After a push, watch the run in the Actions tab; the deployed URL lands
in the run summary and updates the live link above.

## Project layout

```
app/
  layout.tsx, page.tsx     root + landing
  [theme]/                 CV themes (notion, terminal, dark, starwars)
  blog/                    blog index + [slug] article pages
  components/, themes/     UI
  data/                    cv.ts, articles.ts, navigation.ts
  lib/                     hooks + basePath helper
public/
  projects/                project screenshots used in the showcase
  articles/                markdown sources for blog posts
.github/workflows/         deploy pipeline
```

## Worth knowing

- **basePath**: prod URLs live under `/portfolio` (set by CI via
  `NEXT_PUBLIC_BASE_PATH`). `app/lib/basePath.ts` exports a `withBase()`
  helper that mirrors the prefix onto raw asset paths and `fetch()`
  calls. `next/link` and `next/router` pick the prefix up automatically.
- **No cookies on the server**: static export rules them out, so the
  blog theme mode is read client-side. `app/blog/layout.tsx` ships an
  inline script that paints the right surface before React hydrates so
  dark-mode users don't see a flash.
- **CV print is Legal-sized**: `app/globals.css`'s `@page` rule is set
  to US Legal (216×356mm) instead of A4 on purpose. See the rationale
  in `CLAUDE.md`. Don't normalize it back.
- **No em dashes** (`—`) in text written for this repo. See `CLAUDE.md`.

## Commands cheatsheet

```bash
# Dev
docker compose up -d                              # start (port 3003)
docker compose logs -f web                        # tail logs
docker compose exec web npm run lint              # lint
docker compose exec web npx tsc --noEmit          # type-check

# Static export + preview (builds ./out then serves it on 4003)
docker compose --profile preview up -d            # build + serve (port 4003)
docker compose restart preview                    # rebuild after code change

# Stop everything
docker compose down
```
