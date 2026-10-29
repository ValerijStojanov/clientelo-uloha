// Vyrenderuje reklamné kreatívy z ads/*.html do PNG cez headless Chrome/Edge.
// node tools/render-ads.mjs
import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const ADS = join(ROOT, 'ads');
const BROWSERS = [
  process.env.CHROME,
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
].filter(Boolean);
const browser = BROWSERS.find((b) => existsSync(b));
if (!browser) throw new Error('Chrome/Edge nenájdený — nastav CHROME=/cesta/k/chrome');

// Rozmer je v názve súboru: reklama-a-feed.1080x1350.html
for (const file of readdirSync(ADS).filter((f) => /\.\d+x\d+\.html$/.test(f))) {
  const [, w, h] = file.match(/\.(\d+)x(\d+)\.html$/);
  const out = join(ADS, file.replace(/\.html$/, '.png'));
  execFileSync(browser, [
    '--headless=new', '--disable-gpu', '--hide-scrollbars', '--force-device-scale-factor=1',
    `--window-size=${w},${h}`, `--screenshot=${out}`, '--virtual-time-budget=4000',
    pathToFileURL(join(ADS, file)).href,
  ], { stdio: 'ignore' });
  console.log('✓', out);
}
