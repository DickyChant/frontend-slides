# Captured layout: H → cc̄ & κc Projections (CMS Higgs Workshop 2026)

Layout / animation notes scraped from a CERN-hosted workshop deck
(`kappac-hig-workshop-2026.docs.cern.ch`) via an authenticated browser session
and Chrome DevTools (2026-09-21). Source talk: Andrzej Novak · Phil Harris Lab
@ MIT · 2 September 2026. This directory mirrors **no** private assets or talk
figures; it records structure, themes, navigation and recoverable CSS/JS
behaviour so the look can be restyled or rebuilt.

| File | Contents |
|---|---|
| `LAYOUT.md` | global chrome, themes (paper / dark / dragons), navigation, framework notes |
| `SCENES.md` | all 28 visible scenes: ids, steps, layout — a good model for planning a deck slide by slide |
| `ANIMATIONS.md` | timing / transition / fragment / SVG morph details |

The deck runs a custom scene engine (`#scene-id/step` URLs, an inline `SCENES`
table), not this repo's fixed 1920×1080 scroller. What was ported from it —
by intent, not markup — is now part of the engine: the `paper` skin
(`assets/skins/paper.css`), the step system and review comments in
`assets/templates/Empty_template.html`, and automatic `--act` gate labels in
`scripts/init-slides.py`. The lessons from that port are in
`../../FIELD_NOTES.md`. Figures and logos remain with their owners.
