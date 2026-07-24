# Deploying the StateGuard site

Static SPA: `npm run build` → `dist/` (index.html + hashed `assets/`). No server,
no API, no secrets, no runtime env vars. Any static host works. This plan assumes
**Vercel**; Netlify and Cloudflare Pages equivalents are in [Appendix A](#appendix-a--other-hosts).

Ordering below is gated on the code review — the Phase 0 items are things that are
wrong *in public* once the site is live, so they land before the first deploy, not after.

---

## Phase 0 — blockers (must land before first public deploy)

| # | Item | Status |
|---|------|--------|
| 0.1 | **Suggestion form discards input** — `SuggestionBox.jsx` sets local state and renders "Thanks — suggestion dropped. We read every one." The text is never sent anywhere. | ⏸️ **Deferred by decision.** Still ships a false statement to users. See [Open blocker](#open-blocker--the-suggestion-form) below — this must be resolved before public traffic. |
| 0.2 | **Four dead `#` links** — Benchmarks (nav + footer), Changelog, Issues, License. | ✅ Done. Changelog → `/blob/main/CHANGELOG.md`, Issues → `/issues`, License → `/blob/main/LICENSE` (all three verified to exist on `main`). Benchmarks removed from both nav and footer — no benchmarks exist to link to. Nav slot reused for "How it works". |
| 0.3 | **Verify `GITHUB_URL`** resolves and is public. | ✅ Verified. `github.com/dood1ebyte/stateguard` is public, Apache-2.0, has `LICENSE` and `CHANGELOG.md` on `main`. |
| 0.4 | **SPA history fallback** for `/docs`. | ✅ Done. `vercel.json` rewrite + `public/_redirects` for Netlify/Cloudflare. Verified: `/docs` returns 200 on a direct hit against `npm run preview`. |
| 0.5 | **Favicon + social card.** | 🟡 Partial. `public/favicon.svg` added (same hexagonal shield as the wordmark, keeps the project's no-binary-assets property) plus canonical, full `og:` set and `twitter:card`. **Still needed: a 1200×630 `og.png`** — social scrapers don't render SVG, so the card is `summary` (text-only) until that image exists. Marked with a TODO in `index.html`. |

### Open blocker — the suggestion form

Deferred, not fixed. The form at `#suggest` still tells users their text "goes
straight to the maintainers" and confirms receipt, while discarding it. Pick one
before the site takes public traffic:

- **Prefilled GitHub issue** — on submit, open `<repo>/issues/new?body=<text>` in a
  new tab. No backend, keeps the section, and the claim becomes true.
- **Replace with a link** — drop the textarea, keep the pitch, button to Issues.
- **Real endpoint** — serverless function + a destination for submissions. Adds
  scope and a spam surface.

## Phase 1 — host configuration

**1.1 Repo → Vercel.** Import the GitHub repo. Framework preset: Vite.
Build command `npm run build`, output `dist`, install `npm ci`.

**1.2 History fallback.** ✅ `vercel.json` is committed at the repo root with the
rewrite, the cache policy and baseline security headers. `public/_redirects` covers
Netlify and Cloudflare Pages; Vercel ignores it, so both can coexist.

Filenames in `assets/` are content-hashed by Vite, so the year-long immutable
caching is safe; `index.html` is `max-age=0, must-revalidate` or users get pinned
to a stale bundle.

**1.3 Node version.** Pin so CI and local agree — add to `package.json`:

```json
"engines": { "node": ">=20.19" }
```

Vite 7 requires Node 20.19+ / 22.12+. *(Not done — outside Phase 0.)*

**1.4 Domain + TLS.** Point the apex and `www` at Vercel, redirect `www` → apex
(or the reverse — pick one and 301 the other). TLS is automatic. Verify HSTS is on.

⚠️ `robots.txt`, `sitemap.xml`, `canonical`, `og:url` and `SITE_URL` in
`src/constants.js` all hardcode **`https://stateguard.dev`**. If the real domain
differs, change it in those five places before deploying.

**1.5 `robots.txt` + `sitemap.xml`.** ✅ Both in `public/`, listing `/` and `/docs`.

## Phase 2 — pre-deploy verification

Run against a preview deployment, not localhost.

- [ ] `npm ci && npm run build` clean from a fresh clone (no stale `node_modules`).
- [ ] Direct-load `/docs`, then hard-refresh it. Both must render, not 404.
      (Confirmed working under `npm run preview`; re-confirm on the host, since
      the rewrite there comes from `vercel.json` rather than Vite's dev server.)
- [ ] Favicon renders in the tab, and the OG card previews correctly in Slack —
      expect a text-only card until `og.png` exists.
- [ ] Back/forward between `/` and `/docs` — the router listens on `popstate`, so
      this is the path most likely to break under a host's rewrite rules.
- [ ] `/#install` and `/#how` from the docs page scroll to the right section.
- [ ] Theme toggle persists across reload with no light-flash on a dark session
      (the pre-paint script in `index.html`).
- [ ] Copy buttons work over HTTPS. `navigator.clipboard` is unavailable on
      insecure origins — the preview URL is HTTPS, so this is the first real test.
- [ ] Mobile (375px) and tablet. Layout is intrinsically responsive — `clamp()`,
      `auto-fit` grids, `flex-wrap`, zero media queries — so check the two spots
      that don't participate: the `1fr 1fr` strategy-chip grid in `how.css:78`,
      and horizontal scroll on the `<pre>` code blocks.
- [ ] Lighthouse ≥ 95 performance / ≥ 95 a11y. Expect the a11y score to flag the
      Phase 3 items.
- [ ] Reduced-motion: enable it at the OS level and confirm the hero terminal
      renders in `SUCCESS` and nothing animates.
- [ ] 219 kB JS / 67 kB gzip is the React 19 baseline for a 2-page site. Acceptable,
      but confirm the Google Fonts request isn't blocking first paint (four families,
      render-blocking `<link>` in `<head>`, no `font-display` control beyond `&display=swap`).

## Phase 3 — post-deploy (first week)

These are real defects but none of them break the page, so they don't gate launch.

- **`aria-live` announcement spam.** The hero status (`Hero.jsx:63`) flips every
  2.8s and the strategy caption (`HowItWorks.jsx:68`) every 1.7s, both inside
  `aria-live="polite"`. A screen reader announces them forever. Drop `aria-live`
  from both — they're decorative loops, not status updates.
- **Showcase tabs are keyboard-inaccessible.** `Showcase.jsx:198` implements roving
  `tabIndex` (`-1` on inactive tabs) without the arrow-key handler that makes roving
  tabindex navigable. Keyboard users can reach the active tab and no others. Add
  Left/Right/Home/End handling, or drop the roving tabindex and let all three tabs
  be tabbable.
- **No skip-to-content link.** Keyboard users tab through the whole nav on every page.
- **First-visit theme ignores `prefers-color-scheme`.** The site is dark-first by
  design but loads light for everyone. Consider defaulting to the system preference
  when nothing is stored.
- **Analytics.** None wired. If you want launch numbers, add a cookieless option
  (Plausible/Fathom/Vercel Analytics) so no consent banner is needed.
- **Self-host the fonts.** Removes a third-party request from the critical path and
  the GDPR question that comes with Google Fonts serving EU visitors.
- **CI.** No lint, no tests, no pipeline. Minimum viable: a GitHub Action running
  `npm ci && npm run build` on PRs so a broken build can't reach `main`.
- **CSP.** `X-Content-Type-Options`, `Referrer-Policy` and `X-Frame-Options` are
  already in `vercel.json`. A `Content-Security-Policy` still needs adding — it
  requires `'unsafe-inline'` for the pre-paint theme script in `index.html` unless
  you move that to a hashed inline script, and must allowlist
  `fonts.googleapis.com` / `fonts.gstatic.com` (or self-host the fonts, above,
  and drop them from the policy entirely).

## Rollback

Vercel keeps every deployment immutable. Rollback is promoting the previous
deployment in the dashboard — seconds, no rebuild. Trigger a rollback if `/docs`
404s, the GitHub CTA breaks, or the suggestion form starts erroring after 0.1
is wired to a real endpoint.

---

## Appendix A — other hosts

**Netlify** — `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

**Cloudflare Pages** — build `npm run build`, output `dist`. SPA fallback is
automatic when no matching file exists. Add `_headers` for the cache policy.

**Nginx** (self-hosted) — serve `dist/`:

```nginx
location / {
  try_files $uri /index.html;
}
location /assets/ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}
```
