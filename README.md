# StateGuard — marketing site

Single-page marketing site for StateGuard, an open-source runtime contract
reliability SDK for AI systems. Implemented from the `StateGuard.dc.html`
design prototype.

## Stack

React 19 + Vite. Plain CSS with custom properties — no CSS framework, no
component library, no external images or icon files (the logo mark is inline
SVG in `Logo.jsx`; the sun/moon icons and card glyphs are pure CSS/Unicode; the
grain texture and hero watermark mask are inline SVG data URIs).

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview
```

## Layout

```
index.html              Google Fonts + pre-paint theme script
src/
  main.jsx              entry
  App.jsx               theme state, route switch, nav/footer shell
  router.jsx            ~40-line client-side router
  constants.js          GitHub URL, docs path
  context.jsx           reduced-motion, clipboard and interval helpers
  data/content.js       feature + repair-strategy copy
  pages/
    Landing.jsx         the marketing sections
    Suggest.jsx         /suggest — embedded Google Form
    Docs.jsx            /docs placeholder
  components/           one file per section, plus Logo/InstallBox/Reveal
  styles/
    tokens.css          design tokens (dark base, light override)
    base.css            reset, shared primitives, keyframes
    <section>.css       one per section, imported by index.css
```

## Routing

Three routes — `/`, `/suggest` and `/docs` — declared in the `PAGES` table in
`App.jsx` and resolved by `src/router.jsx` rather than a routing dependency.
Unknown paths fall back to the landing page. `RouteLink` navigates client-side but keeps a real `href`,
so middle-click, ctrl-click and "copy link address" behave normally.

In-page anchors (`#how`, `#install`) only resolve on the landing page, so
`useAnchor()` rewrites them to `/#how` when rendered anywhere else.

**Deploying:** `/docs` needs a history fallback to `index.html`. Vite's dev
server and `npm run preview` do this already; a static host does not. This is
configured — `vercel.json` (rewrite + cache + security headers) and
`public/_redirects` (Netlify, Cloudflare Pages). See [DEPLOY.md](DEPLOY.md) for
the full plan, including the Nginx equivalent.

## Links

Every off-site URL lives in `src/constants.js` and is rendered through
`ExternalLink` / `GitHubLink` in `router.jsx`, so they all open in a new tab with
`rel="noopener noreferrer"`. Alongside the repo root, the footer links Changelog,
Issues and License straight into the repo. There are no `#` placeholder links.

Docs links (nav, final CTA, footer) route to `/docs`, which is a styled
"coming soon" placeholder — replace `src/pages/Docs.jsx` when real docs exist.

## Theming

`data-theme` (`light` | `dark`) lives on `<html>`. The page loads in **light**
by default; the choice persists to `localStorage` and is applied by an inline
script before first paint so a dark session never flashes light.

`data-accent="violet"` is wired in `tokens.css` as an optional gradient
variant. It is not exposed in the UI.

**Code surfaces stay dark in both themes.** Anything rendered on `--code-bg`
must use the code-scoped tokens (`--code-fg`, `--code-fg-2`, `--code-border`,
`--code-border-2`), never the theme-flipping `--fg-2` / `--border` — those
land at 2.44:1 on the dark code background in light theme.

`--green` and `--red` are reserved strictly for repair-success and
error/before states. They are not general-purpose accents.

The logo mark's bar reads `--accent` / `--accent-2` directly, so changing either
token restyles the logo along with everything else. `public/favicon.svg` is a
standalone file that cannot see the tokens — it inlines both palettes and flips
them with `prefers-color-scheme`, so **a token change has to be mirrored there
by hand.**

## Motion

`prefers-reduced-motion: reduce` is honored two ways: CSS kills every
animation, and `MotionProvider` short-circuits the JS-driven behavior — the
scroll reveals and hero load-in render visible immediately, the hero terminal
renders directly in its `SUCCESS` state, and the repair-strategy cycler and
repair loop never start.

## Suggestion form

`/suggest` embeds a Google Form. Everything outside the iframe is ours; the form
itself is cross-origin, so **no CSS of ours reaches inside it** — it renders in
Google's font and colors in both themes. Rather than half-fight that, the frame is
presented as a deliberate light card (`.sg-suggestpage__frame`), so it reads as an
inset document instead of a surface that failed to theme. The `#ffffff` there is
intentional and must not become a theme token.

Three constraints worth knowing before touching it:

- **`SUGGEST_FORM_HEIGHT` is measured, not computed** — a cross-origin iframe
  cannot report its content height. Adding or removing a question changes the
  right value; per-width measurements are in `src/constants.js`. Get it wrong and
  you get an inner scrollbar or a white gap.
- **`.sg-suggestpage__frame` is capped at 800px** because Google maxes the form's
  own content at 640px regardless of frame width. A full-width card would leave
  the form floating in whitespace.
- A future CSP must allow `frame-src https://docs.google.com`. See
  [DEPLOY.md](DEPLOY.md).

The landing page keeps a CTA band (`SuggestionCTA.jsx`) that routes here, and holds
the `#suggest` id so existing `/#suggest` links still land.

## Not wired up

`https://stateguard.dev` is hardcoded as the site origin in `index.html`
(canonical, `og:url`), `public/robots.txt` and `public/sitemap.xml`. Change all
three if the domain differs.

No `og:image` — social cards are text-only until a 1200×630 `og.png` exists
(scrapers don't render the SVG favicon).
