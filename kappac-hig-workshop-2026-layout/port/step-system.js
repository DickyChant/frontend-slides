/* ==========================================================================
   step-system.js — fragment-aware navigation for frontend-slides-PKU decks
   --------------------------------------------------------------------------
   Drop this in a <script> anywhere in the deck (it is safe INSIDE a slide:
   the slide list is queried at every keypress, never cached — an inline
   script runs mid-parse and would otherwise only ever see the slides that
   precede it, silently breaking every forward jump past its own slide).

   KEYS
     → / PageDown   next step; when the slide's steps are exhausted (or it
                    has none) the same key moves to the next slide
     ← / PageUp     previous step; at step 0, the previous slide, fully shown
     ↓ / ↑          whole slides only, landing fully revealed (Q&A skimming)
     B              reveal every step on the current slide
     R              collapse the current slide to step 0
     Space          left to the template (next slide, no stepping)
   Presenter clickers send PageDown/PageUp, so the clicker drives the build.

   MARKUP  (styles in kappac-paper-override.css)
     class="st" data-st="N"                 appears at step N
     class="st pop" data-st="N"             rise-and-scale entrance
     class="st" data-st="N" data-until="M"  transient, gone after step M
   Works on any element, including SVG <g> and <span> inside <td>.

   RULES THAT CAME FROM BUGS
     - Registered in the capture phase and stops propagation, so it beats the
       template's own ArrowUp/Down handler; Space is left untouched.
     - e.repeat is dropped: a leaned-on clicker must not blast through slides.
     - Slide changes use the template's own scrollTo(±1 slide, smooth). Never
       scrollTo more than one slide at a time under scroll-snap-type mandatory.
     - Entering a slide forward starts at step 0; entering backward or by ↑/↓
       lands fully revealed, so a slide already presented never comes back empty.
     - Under navigator.webdriver (the PDF export) the script only adds
       html.rv-instant and exits; the CSS then shows every step.
   ========================================================================== */
(function () {
  if (navigator.webdriver) { document.documentElement.classList.add('rv-instant'); return; }
  var sc = document.querySelector('.slides-scroller');
  if (!sc) return;
  function all() { return Array.prototype.slice.call(document.querySelectorAll('.slide')); }
  var state = new Map();
  function sts(sl) { return Array.prototype.slice.call(sl.querySelectorAll('.st')); }
  function mx(st) { return st.reduce(function (m, el) { return Math.max(m, +el.dataset.st); }, 0); }
  function apply(sl) {
    var c = state.get(sl) || 0;
    sts(sl).forEach(function (el) {
      var u = el.dataset.until;
      el.classList.toggle('on', +el.dataset.st <= c && (u === undefined || c <= +u));
    });
  }
  function idx(n) { return Math.max(0, Math.min(n - 1, Math.round(sc.scrollTop / 1080))); }
  // mode 'fwd' -> arrive at step 0 (presentation flow); 'full' -> fully revealed
  function jump(slides, target, mode) {
    if (target < 0 || target >= slides.length) return;
    var sl = slides[target], st = sts(sl);
    if (st.length) { state.set(sl, mode === 'fwd' ? 0 : mx(st)); apply(sl); }
    sc.scrollTo({ top: target * 1080, behavior: 'smooth' });
  }
  document.addEventListener('keydown', function (e) {
    var a = document.activeElement;
    if (a && (a.tagName === 'INPUT' || a.tagName === 'TEXTAREA' || a.isContentEditable)) return;
    var slides = all(), i = idx(slides.length), sl = slides[i], st = sts(sl);
    if (e.key === 'b' || e.key === 'B') { if (st.length) { state.set(sl, mx(st)); apply(sl); } return; }
    if (e.key === 'r' || e.key === 'R') { if (st.length) { state.set(sl, 0); apply(sl); } return; }
    var K = e.key;
    if (K === 'PageDown') K = 'ArrowRight';
    if (K === 'PageUp') K = 'ArrowLeft';
    if (K !== 'ArrowUp' && K !== 'ArrowDown' && K !== 'ArrowLeft' && K !== 'ArrowRight') return;
    e.preventDefault(); e.stopImmediatePropagation();
    if (e.repeat) return;
    if (K === 'ArrowUp') { jump(slides, i - 1, 'full'); return; }
    if (K === 'ArrowDown') { jump(slides, i + 1, 'full'); return; }
    var c = state.get(sl) || 0, m = mx(st);
    if (K === 'ArrowRight') {
      if (st.length && c < m) { state.set(sl, c + 1); apply(sl); } else jump(slides, i + 1, 'fwd');
    } else {
      if (st.length && c > 0) { state.set(sl, c - 1); apply(sl); } else jump(slides, i - 1, 'full');
    }
  }, true);
})();
