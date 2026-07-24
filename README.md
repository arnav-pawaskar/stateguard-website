# StateGuard — marketing site

Single-page marketing site for StateGuard, an open-source runtime contract
reliability SDK for AI systems. Implemented from the `StateGuard.dc.html`
design prototype.

## Stack

React 19 + Vite. Plain CSS with custom properties — no CSS framework, no
component library, no external images or icon files (the shield, sun/moon
icons and card glyphs are pure CSS/Unicode; the grain texture is an inline
SVG `feTurbulence` data URI).

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
  App.jsx               theme state, section composition
  context.jsx           reduced-motion, clipboard and interval helpers
  data/content.js       feature + repair-strategy copy
  components/           one file per section, plus Shield/InstallBox/Reveal
  styles/
    tokens.css          design tokens (dark base, light override)
    base.css            reset, shared primitives, keyframes
    <section>.css       one per section, imported by index.css
```

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

## Motion

`prefers-reduced-motion: reduce` is honored two ways: CSS kills every
animation, and `MotionProvider` short-circuits the JS-driven behavior — the
scroll reveals and hero load-in render visible immediately, the hero terminal
renders directly in its `SUCCESS` state, and the repair-strategy cycler and
repair loop never start.

## Not wired up

The suggestion form is local state only — it does not POST anywhere. Wire
`SuggestionBox.jsx`'s `submit` to a real endpoint. Nav/footer links to Docs,
GitHub, Benchmarks, Changelog, Issues and License are `#` placeholders.
