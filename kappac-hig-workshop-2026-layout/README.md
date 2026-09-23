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
- `docs/PORTING.md` — **what it took to port this into frontend-slides**:
  the intent-to-engine mapping, layout and export lessons, the step system's
  five rewrites, choreography rules, and writing rules for an expert room

The port itself is now built into the engine on this branch, not kept here:

- `assets/skins/paper.css` — the theme as a first-class skin: `--skin paper`
- `assets/templates/Empty_template.html` — fragment-aware keys (→/PgDn step
  then spill, ←/PgUp mirror, ↑↓/Space whole slides, B reveal, R reset),
  `.st` step markup, `rv-instant` export mode, and **comment mode** (C: drop
  numbered pins, side panel, Markdown/JSON export, baked into W-saved files)
- `scripts/init-slides.py` — `--lang` (default `en`), plain-text `<title>`
- `scripts/test-steps.mjs` — headless walk that proves steps and spills work
- `../claudish-to-english/` — git submodule: the prose de-slop pass used on
  slide copy (`git submodule update --init` after cloning; run it with
  `CLAUDISH_PROVIDER=anthropic CLAUDISH_ANTHROPIC_AUTH=oauth`, cherry-pick
  its output, never apply it wholesale — it flattens physics vocabulary)

## Quick start for a new deck

```bash
python3 scripts/init-slides.py … --skin paper --out deck.html
# gates:  <section class="slide transition-slide" style="--act: 'Part 1';">
# steps:  class="st" data-st="1", "2", …   transients: data-until="M"   pop-in: class="st pop"
python3 scripts/bundle-html.py deck.html && bash scripts/export-pdf.sh deck_bundle.html out.pdf --dpr 1
node scripts/test-steps.mjs "$PWD/deck_bundle.html"     # needs node_modules/playwright next to it
```

Keys in the deck: → / PgDn step then next slide · ← / PgUp back · ↑ ↓ Space
whole slides · B reveal all · R reset · C comment mode · E edit · W save · G
go to · F fullscreen.

## Framework (short)

Custom JavaScript scene engine (not Reveal.js / Slidev), modeled on
danielmurnane.com-style decks. Scenes live in an inline `SCENES` table and
render into `#stage` / `.scene`. URL fragments: `#scene-id` or `#scene-id/step`.
Data asset referenced by the live site: `/assets/talk_data.js`.

## License / provenance

Layout notes derived from a public-facing workshop presentation UI. Figures and
logos remain with their owners; do not redistribute CERN-gated binaries from here.
