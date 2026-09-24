# Animation / transition details

Recovered from CSS/JS via DevTools on the live deck.

## Scene entrance / exit

- Entering `.scene.on`: `scenein` **650 ms**
  - opacity `0 → 1`
  - `translateY(14px) → 0`
  - scale `.992 → 1`
- Leaving scenes: **300 ms** upward fade

## Fragments

- `[data-step]` start: opacity `0`, `translateY(12px)`
- Shown state: **550 ms** transition
- Newly shown fragments: **900 ms** red drop-shadow “pulse-in”

## Hero SVG (landscape → future)

- Points: **950 ms** eased transforms
- Opacity / layer changes: generally **600–700 ms**
- Hero scenes share **one** SVG and morph across scene boundaries
- Hero-to-hero transition deliberately disabled so the plot morphs in place

## Waterfall / interactive figures

- Staggered `--d` delays
- **750 ms** `growX` / `growY` transforms
- **550–600 ms** label fades
- Backward jumps and scene entry use `.notrans` to settle instantly

## Other

- Figures: zoom / lightbox; theme-swapped figures ship separate light/dark assets
- `#anatomy` embedded canvas (`charm-anatomy.html`):
  - `requestAnimationFrame`, **3 s** loop
  - progressive hadron flight / decay tracks
  - click / Space reveal beat
  - returns control to deck via `postMessage`
