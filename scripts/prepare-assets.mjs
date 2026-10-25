import sharp from "sharp";
import { mkdir } from "node:fs/promises";
await mkdir("public/images", { recursive: true });
for (const [name, width, quality] of [
  ["1920", 1920, 85],
  ["960", 960, 82],
]) {
  const result = await sharp("assets/source/saad-landscape-original.png")
    .resize({ width, withoutEnlargement: true })
    .webp({ quality })
    .toFile(`public/images/saad-landscape-${name}.webp`);
  console.log(
    `${name}: ${result.width}x${result.height}, ${Math.round(result.size / 1024)} KB`,
  );
}
for (const [name, source, widths, quality] of [
  ["floating-island", "floating-island-generated-2026-10-23.png", [640, 960, 1280, 1536], 90],
  ["soft-cloud", "soft-cloud-generated-2026-10-23.png", [720, 1200, 1600], 87],
]) {
  for (const width of widths) {
    const suffix = width === widths.at(-1) ? "" : `-${width}`;
    const output = await sharp(`assets/source/${source}`)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality, alphaQuality: 100, effort: 6 })
      .toFile(`public/images/${name}${suffix}.webp`);
    console.log(`${name}${suffix}: ${output.width}x${output.height}, ${Math.round(output.size / 1024)} KB`);
  }
}
