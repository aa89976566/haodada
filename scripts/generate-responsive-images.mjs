import sharp from "sharp";
import fs from "fs";
import path from "path";

const jobs = [
  {
    src: "public/images/hero-factory-printer-front-v14-4k.png",
    destDir: "public/images",
    base: "hero-factory-printer-front-v14",
    widths: [828, 1242, 2160],
    webp: { quality: 78, effort: 5 },
    avif: { quality: 48, effort: 6 },
  },
  {
    src: "public/images/haodada/product-receipt-sectioned-red-white-v7.png",
    destDir: "public/images/haodada",
    base: "product-receipt-sectioned-red-white-v7",
    widths: [480, 941],
    webp: { quality: 80, effort: 5 },
    avif: { quality: 50, effort: 6 },
  },
  {
    src: "public/images/side-dog-left-v3.jpg",
    destDir: "public/images",
    base: "side-dog-left-v3",
    widths: [320, 634],
    webp: { quality: 82, effort: 5 },
    avif: { quality: 52, effort: 6 },
  },
  {
    src: "public/images/side-dog-right-v3.jpg",
    destDir: "public/images",
    base: "side-dog-right-v3",
    widths: [320, 627],
    webp: { quality: 82, effort: 5 },
    avif: { quality: 52, effort: 6 },
  },
];

const report = [];

for (const job of jobs) {
  const input = sharp(job.src, { failOn: "none" });
  const meta = await input.metadata();
  if (!meta.width || !meta.height) throw new Error(`No size: ${job.src}`);
  const srcBytes = fs.statSync(job.src).size;
  report.push({
    src: job.src,
    srcBytes,
    width: meta.width,
    height: meta.height,
    outputs: [],
  });

  for (const width of job.widths) {
    if (width > meta.width) continue;
    const height = Math.round((meta.height / meta.width) * width);
    for (const format of ["webp", "avif"]) {
      const out = path.join(job.destDir, `${job.base}-${width}.${format}`);
      const pipeline = sharp(job.src, { failOn: "none" }).resize(width, height, {
        fit: "fill",
        kernel: sharp.kernel.lanczos3,
      });
      if (format === "webp") pipeline.webp(job.webp);
      else pipeline.avif(job.avif);
      await pipeline.toFile(out);
      const bytes = fs.statSync(out).size;
      report.at(-1).outputs.push({ out, width, height, bytes });
      console.log(`${out} ${width}x${height} ${(bytes / 1024).toFixed(1)} KB`);
    }
  }
}

fs.mkdirSync("/opt/cursor/artifacts/image-opt", { recursive: true });
fs.writeFileSync(
  "/opt/cursor/artifacts/image-opt/generate-report.json",
  JSON.stringify(report, null, 2),
);
console.log("\nDONE");
