// Fetch real space images from Wikimedia Commons, keeping only files whose license allows reuse,
// and store small local copies in public/images with a credits manifest. Re-runnable.
//   node ops/fetch-images.mjs            (download)
//   node ops/fetch-images.mjs --check    (only report licenses)
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT } from './config.mjs';

// key -> Commons file title (without "File:")
const WANTED = {
  sun: "The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA's_Solar_Dynamics_Observatory_-_20100819.jpg",
  mercury: 'Mercury_in_color_-_Prockter07-edit1.jpg',
  venus: 'Venus-real_color.jpg',
  earth: 'The_Earth_seen_from_Apollo_17.jpg',
  moon: 'FullMoon2010.jpg',
  mars: 'OSIRIS_Mars_true_color.jpg',
  jupiter: 'Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
  saturn: 'Saturn_during_Equinox.jpg',
  uranus: 'Uranus2.jpg',
  neptune: 'Neptune_-_Voyager_2_(29347980845)_flatten_crop.jpg',
  pluto: 'Pluto_in_True_Color_-_High-Res.jpg',
  ceres: 'Ceres_-_RC3_-_Haulani_Crater_(22381131691)_(cropped).jpg',
  vesta: 'Vesta_in_natural_color.jpg',
  milkyway: 'ESO_-_Milky_Way.jpg',
  deepfield: 'Hubble_ultra_deep_field.jpg',
};
const ALLOWED = /^(public domain|pd|cc0|cc by(-sa)? [\d.]+( igo)?)/i;
const UA = 'YahliSpaceLab/1.0 (local, non-commercial educational app)';
const check = process.argv.includes('--check');
const outDir = join(ROOT, 'public/images');
const strip = (html) => String(html ?? '').replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#039;/g, "'").replace(/\s+/g, ' ').trim();
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
/** Polite fetch: Commons rate-limits bursts, so pause between requests and back off on refusal. */
async function politeFetch(url) {
  for (let attempt = 0; attempt < 4; attempt++) {
    await sleep(1500 * (attempt + 1));
    const r = await fetch(url, { headers: { 'User-Agent': UA } });
    if (r.status !== 429 && !(r.headers.get('content-type') ?? '').startsWith('text/html')) return r;
  }
  throw new Error('rate limited by Wikimedia; try again later');
}

const manifest = {};
let failed = 0;
for (const [key, title] of Object.entries(WANTED)) {
  const api = `https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=400&titles=${encodeURIComponent('File:' + title)}`;
  try {
    const r = await politeFetch(api);
    const page = Object.values((await r.json()).query.pages)[0];
    const info = page.imageinfo?.[0];
    if (!info) throw new Error('file not found on Commons');
    const m = info.extmetadata ?? {};
    const license = strip(m.LicenseShortName?.value);
    const ok = ALLOWED.test(license);
    const credit = { title, page: info.descriptionurl, author: strip(m.Artist?.value).slice(0, 160), credit: strip(m.Credit?.value).slice(0, 160), license, licenseUrl: m.LicenseUrl?.value ?? null };
    console.log(`${ok ? 'OK  ' : 'SKIP'} ${key.padEnd(9)} ${license.padEnd(22)} ${credit.author.slice(0, 60)}`);
    if (!ok) { failed++; continue; }
    if (check) continue;
    const img = await politeFetch(info.thumburl);
    if (!img.ok) throw new Error(`download HTTP ${img.status}`);
    mkdirSync(outDir, { recursive: true });
    const ext = info.thumburl.toLowerCase().endsWith('.png') ? 'png' : 'jpg';
    writeFileSync(join(outDir, `${key}.${ext}`), Buffer.from(await img.arrayBuffer()));
    manifest[key] = { file: `images/${key}.${ext}`, ...credit };
  } catch (e) {
    failed++;
    console.log(`FAIL ${key.padEnd(9)} ${e.message}`);
  }
}
if (!check) {
  writeFileSync(join(ROOT, 'src/content/image-credits.json'), JSON.stringify(manifest, null, 2) + '\n');
  console.log(`\nSaved ${Object.keys(manifest).length} images to public/images and credits to src/content/image-credits.json`);
}
process.exit(failed && !check ? 1 : 0);
