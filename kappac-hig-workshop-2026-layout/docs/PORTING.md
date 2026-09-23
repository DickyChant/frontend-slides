# Porting the κc layout into frontend-slides-PKU — what actually worked

Field notes from building a 37-slide, in-person CMS status-update deck
(HGCal generative fast simulation, Phase-2 Software Days, September 2026) on
the PKU engine, styled by intent after the κc workshop deck documented in
this directory. Everything below was learned by shipping a version that was
wrong first. The reusable pieces are built into the engine on this branch:
`assets/skins/paper.css`, the step system and comment mode in
`assets/templates/Empty_template.html`, and `scripts/test-steps.mjs`.

## 1. Port intent, not markup

The κc deck is a custom scene engine (`#scene/step` URLs, inline `SCENES`
table). The PKU engine is a fixed 1920×1080 scroll-snap scroller of
`<section class="slide">`. These do not map one-to-one, so port the *effects*:

| κc intent (docs/) | PKU realisation |
|---|---|
| paper theme, serif headings, mono chrome | `assets/skins/paper.css` (`--skin paper`) |
| 650 ms scene-in, 14 px rise | `--duration-normal: 0.65s`, `.reveal { transform: translateY(14px) }` |
| fragments (`#scene/1..5`) | the template's step system + `class="st" data-st="N"` |
| act / section eyebrow on gates | inline `--act: 'Part 3'` on the transition slide, rendered by `::before` |
| `n / 28` counter | the engine's footer already numbers slides; keep it |
| backup gate | a transition slide with `--act: 'Appendix'` |
| persistent figure morphing across scenes | not ported; the scroller re-renders per slide |

Palette: the κc cream/maroon was tried and rejected by the audience-facing
reviewer within one look ("colour scheme is bad"). White/navy with one
secondary (purple) stuck. Ship the variables, not the opinion.

## 2. Theme via the skin; fine-tuning via one override block

`--skin paper` gives the whole look. Deck-specific tweaks go in ONE
`<style id="…-override">` block before `</head>`, never by re-running
`init-slides.py` on a finished deck (it emits a fresh one). Three scaffold
defects the branch fixes in the engine (`--lang`, `<title>`, logo cap); on
the upstream `main` you still fix them by hand:

1. `<html lang="zh-CN">` — Chrome offers to translate an English deck. `sed` it to `en`.
2. `.logo-img { height: 130% }` lets a 7:1 wordmark squash a square logo. Cap wordmarks inline (`max-width: 250px; height: 78%`).
3. `--highlight` spans are copied verbatim into `<title>`, so the browser tab shows literal `<span class="highlight-accent">`. Strip the tags from `<title>`.

Also: `--author "Name:1,2"` splits on the comma into two authors.

## 3. Layout lessons (each cost a render cycle)

- **`--w` on a multi-cell `.fig` grid caps each image inside its own cell**, not the grid inside the slide. `--w:56%` on a `fig-2x2` halves every panel: the classic "plots are pretty small". Leave `--w:100%` and size with `--h`.
- **`vh` is viewport-relative, not canvas-relative.** The `--compact` (1280×720) export renders 1 vh at 7.2 canvas px vs 10.8 at 1080p, so compact PDFs understate every vh-sized figure by a third. Verify layout with `--dpr 1` and no `--compact`, and look at the pages.
- **Vertical budget at 1080p is ~930 px** (header 60, footer 48). A `fig-2x2` fits at `--h` 26–33 vh once card padding and captions are counted. The paper's in-plot titles make HTML captions redundant: drop captions before shrinking figures.
- **CSS counters break in the headless export** (hidden siblings don't increment): every gate printed "Part 1". Inline `--act` labels instead.
- Multi-line arithmetic (feature counts) reads better as two aligned mono lines than one long one; 22 px mono fits ~40 characters in a 36 %-wide card.
- `.bullet-list.dense` (12 px / 6 px margins) exists for figure-heavy slides.

## 4. Figures and slide bookkeeping

- Browsers do not render a PDF in `<img>`, and `bundle-html.py` will happily base64 one into a broken image. Rasterise everything first: `pdftoppm -png -r 200 -singlefile`.
- Figures live in `attachment_<deck>_html/Figures/S{N}/` with relative `src`.
- `renumber-slides.py` renames `Figures/S*/` directories but **not** the `src` paths, and it corrupts the deck when two `[Slide N]` markers coincide (any swap or insert). Renumber the markers yourself with a sequential regex pass, `mv` the directories in descending order, then remap the `src` strings.
- Every regex edit of the deck: all-or-nothing, with an assert on the anchor, followed by a tag-balance check per slide (`ul div section svg g table tr span li`). A non-greedy `.*?</div>` across nested cards split two groups across each other once; regenerate a block from scratch rather than surgically swap nested markup.
- Only bundle on an explicit "deliver"; `bundle-html.py` passes inline SVG and `<script>` through untouched, so schematics and animations survive.

## 5. Steps: the design and the bugs

The template's step system is the survivor of five rewrites. What the rewrites were for:

1. **The script lived inside a slide, so it ran mid-parse.** `document.querySelectorAll('.slide')` cached at that moment held only the slides before it, and every forward jump past that slide failed a bounds check silently. Symptom: "slide 23 → 24 is broken", while backward worked and every scroll experiment (snap off, smooth off, `scrollIntoView`, deferring to rAF/`setTimeout`) changed nothing. Query the slide list at keypress time.
2. **`scroll-snap-type: y mandatory` plus a smooth `scrollTo` more than one slide away lands on the wrong slide** (asked for 23, got 9). Only ever scroll ±1, exactly as the template does.
3. **Up/Down are fragment-aware, not animation-only.** One key must traverse the whole talk: step, then spill to the next slide when steps run out; mirror on the way back. The first version swallowed Up/Down unconditionally and broke navigation at the end of every sequence.
4. **Entry state is directional.** Forward → step 0; backward or Q&A jump → fully revealed. Otherwise you arrow back to answer a question and land on an empty slide you already presented. Give the presenter B (reveal all) and R (collapse) anyway.
5. **Hidden-by-opacity elements keep their box.** A "transient" panel that fades out must not sit in normal flow above the thing that replaces it, or the card doubles in height and overflows the slide. Put the transient in an absolute overlay (`position:absolute; inset:…; background: var(--card)`) over the element it precedes; the fade-out becomes a cross-fade. In the PDF, `data-until` transients are `display:none`.
6. Drop `e.repeat`; presenters lean on clickers. Presenter clickers send PageUp/PageDown: alias them to the step keys.
7. A mono hint line on one stepped slide (`→ / PgDn step · ← / PgUp back · ↕ slides · B all · R reset`) — nobody remembers three key behaviours cold in front of a room.
8. **Make the outline a one-step slide.** One click reveals it, two move on: a silent clicker test that reads as a deliberate reveal.

Test it headlessly (`scripts/test-steps.mjs`): Playwright sets `navigator.webdriver`,
which is exactly the flag the script uses to switch into PDF mode, so spoof it
back to `undefined` in an init script. Walk the deck with one key and print the
steps per slide. Every animation bug above passed with a clean exit code.

## 6. Choreography rules the reviewer kept repeating

- **The words arrive with the visual.** A slide's bullets are stepped to the same beats as its schematic; nothing is narrated before it can be seen.
- **Evidence before schematic.** Show the measured distribution (here: the deposited-energy spread) first, then the drawing that abstracts it, then the numbers.
- **One species per beat, distinct styles.** Photon: thin, solid, navy. Pion: wide, dashed, purple. The visual difference *is* the physics (the pion window really is ~8× wider).
- **The punch line pops last, at the bottom** ("and all of it will be public").
- **A timeline grows with its text**: the public era visible on entry, "what is new" appearing as the "now" node lights up.
- Fixed-energy evaluation sets, held out from training, are said where the datasets are defined, not only where the results appear.

## 7. Export

- `html.rv-instant` under `navigator.webdriver` kills every transition, so screenshots never capture a mid-fade. The step system adds the class itself.
- Regenerate the PDF after every redeploy (`--dpr 2` for the archive, `--dpr 1` to send: the 30 MiB attachment limit bites at dpr 2).
- Look at the rendered pages. A clean exit code proved nothing, six times.

## 8. Writing for a room of experts

- Don't state the obvious to a CMS-internal audience; motivation is one slide with sourced numbers and units the field uses (fb⁻¹, not "years").
- Spoken-style bullets at 1.4–1.7 em; 18 px is the floor for anything, captions included; weight-700 serif headings survive projection, 600 does not.
- Scope chips per point, not per slide, when a slide mixes what is public and what is new. Say which note a number comes from.
- Say "and", not "&", in headings. No emoji on CERN-hosted pages (tofu). MathJax `$` must pair inside one element.
- LLM de-slop passes (claudish-to-english) flatten physics vocabulary; cherry-pick from their output, never apply it as a patch.
- Take every number from the note's LaTeX tables, not from older talk PDFs: the CHEP/ML4Jets decks were two versions stale.

## 9. Comment mode (from the other agent's deck)

`C` toggles review mode: a click drops a numbered pin at that point and opens
an editor; pins and a side panel render only while the mode is on, so the
deck and the PDF stay clean by construction. Records are percentages of the
slide's own bounding rect (scale-invariant under the 1920×1080 wrapper), kept
in `localStorage['slide-comments:<path>']` with a baked
`<script id="baked-comments">` fallback written by the W-save hook, so a
saved file carries its comments. Export Markdown (grouped by slide, resolved
struck through) or JSON; import JSON. Guards that matter: never act on keys
while an input is focused; ignore clicks on the panel, popup, pins and links;
NaN-guard the rect before layout. Strip `#baked-comments` before you
circulate a bundle.

## 10. Ask the other agent

A peer session that has shipped a deck answers concrete questions fast and
well ("which pitfalls with click-stepping?") — two rounds of that shaped §5.
Ask before implementing, not after.
