# Global layout

## Engine

- Custom JS scene engine (not Reveal.js / Slidev).
- Large inline script defines `SCENES`; one `#stage` / `.scene` rendered at a time.
- Explicitly modeled on “danielmurnane.com decks.”
- 29 scene definitions; `ring` is `hidden:true` → **28 visible**.
- URL fragments: `#scene-id` or `#scene-id/step`.
- Data asset: `/assets/talk_data.js`.

## Fonts

- Headings: EB Garamond (Google Fonts)
- Body / UI: system sans-serif
- Metadata / footer / plot labels: monospace

## Themes

### Paper (default)
- Background: `#f6f1e7` with `#efe8d9` radial gradient
- Ink: `#1c1712`
- Cards: `#fffdf8`
- Accent: `#8a1f1f`

### Dark
- Background: `#07080a` / `#0c0e12`
- Ink: `#ece8e0`
- Accent (amber): `#e4a23c`

### Dragons
- Background: maroon `#120607` / `#1a090b`
- Accent (coral): `#e2493b`

## Persistent chrome

- Upper-left: act / section / scene label
- Upper-right: `n / 28`
- Bottom: thin red progress bar
- Bottom-left: step indicators
- Bottom-right: author/date, theme toggle, `?` help

## Navigation

| Input | Action |
|-------|--------|
| Space / ArrowRight / PgDn | next |
| ArrowLeft / PgUp | previous |
| Home / End | first / last |
| O | overview |
| H | HUD |
| D | theme |
| F | fullscreen |
| R | restart |
| Click | advance |
| Figure click | zoom / lightbox |
| E | layout editing |
