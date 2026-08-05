#!/usr/bin/env node
/**
 * Cut public/images/hero-drive.jpg into a seamless triptych.
 * Pure pixel crops at the blue/yellow seams — no paint, pad, or regenerate.
 *
 * Seams (0-based, exclusive end for left/center):
 *   left  [0, 634)
 *   center [634, 1767)
 *   right [1767, 2394)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const SRC = path.join(ROOT, "public/images/hero-drive.jpg");
const OUT = path.join(ROOT, "public/images");
const SEAM_L = 634;
const SEAM_R = 1767;

const panels = [
  { name: "side-dog-left-v2", left: 0, width: SEAM_L },
  { name: "hero-center-v2", left: SEAM_L, width: SEAM_R - SEAM_L },
  { name: "side-dog-right-v2", left: SEAM_R, width: null },
];

const meta = await sharp(SRC).metadata();
if (meta.width !== 2394 || meta.height !== 1360) {
  throw new Error(`Unexpected master size ${meta.width}x${meta.height}`);
}
const height = meta.height;
const width = meta.width;
panels[2].width = width - SEAM_R;

for (const p of panels) {
  const base = sharp(SRC).extract({
    left: p.left,
    top: 0,
    width: p.width,
    height,
  });
  const jpg = path.join(OUT, `${p.name}.jpg`);
  const webp = path.join(OUT, `${p.name}.webp`);
  await base
    .clone()
    .jpeg({ quality: 96, chromaSubsampling: "4:4:4", mozjpeg: true })
    .toFile(jpg);
  await base
    .clone()
    .webp({
      quality: 96,
      alphaQuality: 100,
      smartSubsample: false,
      effort: 6,
      nearLossless: true,
    })
    .toFile(webp);
  const jm = await sharp(jpg).metadata();
  const wm = await sharp(webp).metadata();
  console.log(
    p.name,
    `${jm.width}x${jm.height}`,
    `jpg=${fs.statSync(jpg).size}`,
    `webp=${fs.statSync(webp).size}`,
    wm.hasAlpha ? "HAS_ALPHA" : "opaque",
  );
}
