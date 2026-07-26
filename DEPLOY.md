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
| 0.1 | **Suggestion form discards input** — the old `SuggestionBox.jsx` set local state and rendered "Thanks — suggestion dropped" without sending anything. | ✅ **Resolved.** The form is now a Google Form embedded on `/suggest`, with Name and Email required. Submissions land in the maintainers' Google account, so "It goes straight to the maintainers" is now literally true. The landing page keeps a CTA band linking to the page. |
| 0.2 | **Four dead `#` links** — Benchmarks (nav + footer), Changelog, Issues, License. | ✅ Done. Changelog → `/blob/main/CHANGELOG.md`, Issues → `/issues`, License → `/blob/main/LICENSE` (all three verified to exist on `main`). Benchmarks removed from both nav and footer — no benchmarks exist to link to. Nav slot reused for "How it works". |
| 0.3 | **Verify `GITHUB_URL`** resolves and is public. | ✅ Verified. `github.com/dood1ebyte/stateguard` is public, Apache-2.0, has `LICENSE` and `CHANGELOG.md` on `main`. |
| 0.4 | **SPA history fallback** for `/docs`. | ✅ Done. `vercel.json` rewrite + `public/_redirects` for Netlify/Cloudflare. Verified: `/docs` returns 200 on a direct hit against `npm run preview`. |
| 0.5 | **Favicon + social card.** | 🟡 Partial. `public/favicon.svg` added (same hexagonal shield as the wordmark, keeps the project's no-binary-assets property) plus canonical, full `og:` set and `twitter:card`. **Still needed: a 1200×630 `og.png`** — social scrapers don't render SVG, so the card is `summary` (text-only) until that image exists. Marked with a TODO in `index.html`. |

### Notes on the suggestion form

Resolved via a Google Form embed rather than a custom form posting to Google's
`formResponse` endpoint. That alternative was rejected deliberately: it has to POST
cross-origin with `mode: 'no-cors'`, which returns an opaque response, so the page
could not distinguish success from a rejected request — a narrower version of the
exact bug being fixed, with a silent failure mode.

Two things to know operationally:

- **The form is open with no sign-in and therefore has no spam protection.** Google
  Forms exposes no CAPTCHA. This is the accepted cost of not gating submissions
  behind a Google account.
- **`SUGGEST_FORM_HEIGHT` is measured, not computed.** A cross-origin iframe cannot
  report its content height. It is currently 1271px, sized for the narrowest
  reflow; see the comment in `src/constants.js` for the per-width measurements.
  **Adding or removing a form question changes this and will produce either an
  inner scrollbar or a white gap.** Re-measure when the form changes.

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

⚠️ `public/robots.txt`, `public/sitemap.xml`, and `canonical` + `og:url` in
`index.html` all hardcode **`https://stateguard.dev`**. If the real domain differs,
change it in those three files before deploying.

**1.5 `robots.txt` + `sitemap.xml`.** ✅ Both in `public/`, listing `/` and `/docs`.

## Phase 2 — pre-deploy verification

Run against a preview deployment, not localhost.

- [ ] `npm ci && npm run build` clean from a fresh clone (no stale `node_modules`).
- [ ] Direct-load `/docs` and `/suggest`, then hard-refresh each. All must render,
      not 404. (Confirmed working under `npm run preview`; re-confirm on the host,
      since the rewrite there comes from `vercel.json` rather than Vite's dev server.)
- [ ] **Submit the suggestion form end to end** and confirm the response lands in
      the linked Google Sheet. This is the blocker from 0.1 — verify it for real
      rather than trusting that the iframe rendered.
- [ ] `/suggest` with a tracking blocker enabled (uBlock, Firefox strict mode).
      The embed will be blocked; confirm the "open it in a new tab" fallback is
      visible and works.
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

**Fixed since this list was written:** the `aria-live` announcement spam on the hero
status and strategy caption (both cycled forever inside a live region); the Showcase
tab keyboard trap (roving `tabIndex` with no arrow-key handler, leaving two of three
panels unreachable); the missing skip-to-content link; and a `setTimeout` in `Reveal`
that outlived its own cleanup.

- **`--fg-3` fails WCAG AA as body text, in both themes.** Measured 3.45:1 on the
  light background and 3.66:1 on the dark one; AA wants 4.5:1 at these sizes. It is
  currently used for real copy in `footer.css` (tagline, column titles, bottom bar),
  `hero.css`, `how.css` and `problem.css`. Fixing it means either darkening/lightening
  the token in `tokens.css` — a design-system change with site-wide effect — or moving
  the affected text to `--fg-2` (7.4:1 / 7.65:1). Left alone here because it is
  pre-existing and wider than this review; the two `/suggest` usages were moved to
  `--fg-2` because one is the PII disclosure and the other is the iframe-blocked
  recovery path.
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

  ⚠️ **It must also include `frame-src https://docs.google.com`, or the suggestion
  form on `/suggest` goes blank the moment the header ships.** (`X-Frame-Options:
  DENY` is not a problem here — it governs who may frame *us*, not who we may
  frame.)

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
