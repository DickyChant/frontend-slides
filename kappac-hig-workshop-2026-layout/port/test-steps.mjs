// Headless check of the step system. Playwright sets navigator.webdriver, which
// makes step-system.js exit on purpose (PDF mode) — so spoof it back to undefined.
// Every animation bug we shipped had a clean exit code and was only visible in a
// render or in this walk: never trust the export's exit status.
//   cd <dir with node_modules/playwright>   (export-pdf.sh installs it)
//   node test-steps.mjs /abs/path/deck_bundle.html
import { chromium } from 'playwright';
const file = process.argv[2];
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
page.on('pageerror', e => console.log('PAGEERROR', e.message));
await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => undefined }));
await page.goto('file://' + file);
await page.waitForTimeout(2000);
const probe = () => page.evaluate(() => {
  const sc = document.querySelector('.slides-scroller');
  const i = Math.round(sc.scrollTop / 1080);
  const sl = document.querySelectorAll('.slide')[i];
  return { i, on: sl.querySelectorAll('.st.on').length, tot: sl.querySelectorAll('.st').length };
});
let last = -1, presses = 0;
for (let k = 0; k < 400; k++) {
  await page.keyboard.press('ArrowRight');      // one key must traverse the whole deck
  await page.waitForTimeout(520);               // presenter pace; smooth scroll must settle
  const r = await probe();
  if (r.i !== last) { if (last >= 0 && presses > 1) console.log(`slide ${last}: ${presses - 1} steps`); last = r.i; presses = 0; }
  presses++;
  if (r.i >= (await page.evaluate(() => document.querySelectorAll('.slide').length)) - 1) break;
}
console.log('reached last slide:', last);
await browser.close();
