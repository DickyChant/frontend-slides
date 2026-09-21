# H → cc̄ & κc Projections — slide layout capture

Local layout/animation notes scraped from the CERN-hosted workshop deck
(`kappac-hig-workshop-2026.docs.cern.ch`) via an authenticated browser session
and Chrome DevTools (2026-09-21, Europe/Paris).

This repo does **not** mirror private CERN assets or talk figures. It records
structure, themes, navigation, and recoverable CSS/JS animation behavior so the
deck can be restyled or rebuilt.

Source talk: Andrzej Novak · Phil Harris Lab @ MIT · CMS Higgs Workshop · 2 September 2026.

## Contents

- `docs/LAYOUT.md` — global chrome, themes, navigation, framework notes
- `docs/SCENES.md` — all 28 visible scenes (ids, steps, layout)
- `docs/ANIMATIONS.md` — timing / transition / fragment / SVG morph details

## Framework (short)

Custom JavaScript scene engine (not Reveal.js / Slidev), modeled on
danielmurnane.com-style decks. Scenes live in an inline `SCENES` table and
render into `#stage` / `.scene`. URL fragments: `#scene-id` or `#scene-id/step`.
Data asset referenced by the live site: `/assets/talk_data.js`.

## License / provenance

Layout notes derived from a public-facing workshop presentation UI. Figures and
logos remain with their owners; do not redistribute CERN-gated binaries from here.
