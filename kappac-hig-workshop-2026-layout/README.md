# H → cc̄ & κc Projections — slide layout capture, and the port that used it

Local layout/animation notes scraped from the CERN-hosted workshop deck
(`kappac-hig-workshop-2026.docs.cern.ch`) via an authenticated browser session
and Chrome DevTools (2026-09-21, Europe/Paris), plus the reusable pieces from
porting that layout into this repo's engine for a real talk (September 2026).

This directory does **not** mirror private CERN assets or talk figures. It
records structure, themes, navigation, and recoverable CSS/JS animation
behavior so the deck can be restyled or rebuilt.

Source talk: Andrzej Novak · Phil Harris Lab @ MIT · CMS Higgs Workshop · 2 September 2026.

## Contents

- `docs/LAYOUT.md` — global chrome, themes, navigation, framework notes
- `docs/SCENES.md` — all 28 visible scenes (ids, steps, layout)
- `docs/ANIMATIONS.md` — timing / transition / fragment / SVG morph details
- `docs/PORTING.md` — **what it took to port this into frontend-slides-PKU**:
  the intent-to-engine mapping, layout and export lessons, the step system's
  five rewrites, choreography rules, and writing rules for an expert room
- `port/kappac-paper-override.css` — the theme as one override layer (paste
  before `</head>`, after the skin; recolour via `:root` only)
- `port/step-system.js` — fragment-aware keys (→/PgDn step then spill,
  ←/PgUp mirror, ↑↓ whole slides, B reveal, R reset), safe to inline anywhere
- `port/test-steps.mjs` — headless Playwright walk that proves the steps and
  spills actually work (spoofs `navigator.webdriver`)

## Quick start for a new deck

```bash
python3 scripts/init-slides.py … --skin classic --out deck.html
sed -i 's|<html lang="zh-CN">|<html lang="en">|' deck.html
# 1. paste port/kappac-paper-override.css into <style id="kappac-paper-override"> before </head>
# 2. add the EB Garamond + IBM Plex Mono <link> (see the CSS header)
# 3. paste port/step-system.js into a <script> (end of body, or inside any slide)
# 4. mark steps: class="st" data-st="1", "2", …; transients: data-until="M"
# 5. gates: style="--act: 'Part 1'" on each transition slide
python3 scripts/bundle-html.py deck.html && bash scripts/export-pdf.sh deck_bundle.html out.pdf --dpr 1
node port/test-steps.mjs "$PWD/deck_bundle.html"
```

## Framework (short)

Custom JavaScript scene engine (not Reveal.js / Slidev), modeled on
danielmurnane.com-style decks. Scenes live in an inline `SCENES` table and
render into `#stage` / `.scene`. URL fragments: `#scene-id` or `#scene-id/step`.
Data asset referenced by the live site: `/assets/talk_data.js`.

## License / provenance

Layout notes derived from a public-facing workshop presentation UI. Figures and
logos remain with their owners; do not redistribute CERN-gated binaries from here.
