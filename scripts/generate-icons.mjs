// Generates favicons and the header logo from assets/logo.webp.
// Run with: npm run icons
import sharp from 'sharp';
import { writeFile } from 'node:fs/promises';

const SOURCE = 'assets/logo.webp';
const OUT = 'public';
const BACKGROUND = '#f8f3ea'; // keep in sync with --bg in src/styles/global.css

// Pixel columns of glyphs in the 1024×1024 source (top 340 → bottom 655)
const TOP = 340;
const HEIGHT = 316;
const LEFT_BRACE = { left: 101, width: 128 };
const HI = { left: 101, width: 330 }; // "{hi" including the left brace

// Builds "{hi}" by mirroring the left brace onto the right
async function buildMark() {
  const hi = await sharp(SOURCE)
    .extract({ left: HI.left, top: TOP, width: HI.width, height: HEIGHT })
    .png()
    .toBuffer();
  const rightBrace = await sharp(SOURCE)
    .extract({ left: LEFT_BRACE.left, top: TOP, width: LEFT_BRACE.width, height: HEIGHT })
    .flop()
    .png()
    .toBuffer();

  return sharp({
    create: {
      width: HI.width + LEFT_BRACE.width,
      height: HEIGHT,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([
      { input: hi, left: 0, top: 0 },
      { input: rightBrace, left: HI.width, top: 0 },
    ])
    .png()
    .toBuffer();
}

// Square icon: mark centred on a cream tile, optionally with rounded corners
async function icon(mark, size, { padding = 0.14, radius = 0.22 } = {}) {
  const inner = Math.round(size * (1 - padding * 2));
  const art = await sharp(mark).resize({ width: inner, height: inner, fit: 'inside' }).toBuffer();
  const r = Math.round(size * radius);
  const tile = Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="100%" height="100%" rx="${r}" fill="${BACKGROUND}"/></svg>`,
  );
  return sharp(tile).composite([{ input: art, gravity: 'center' }]).png().toBuffer();
}

// ICO file holding PNG images (supported by every current browser)
function ico(images) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(images.length, 4);
  let offset = 6 + images.length * 16;
  const entries = images.map(({ size, data }) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(size >= 256 ? 0 : size, 0);
    entry.writeUInt8(size >= 256 ? 0 : size, 1);
    entry.writeUInt16LE(1, 4);
    entry.writeUInt16LE(32, 6);
    entry.writeUInt32LE(data.length, 8);
    entry.writeUInt32LE(offset, 12);
    offset += data.length;
    return entry;
  });
  return Buffer.concat([header, ...entries, ...images.map((i) => i.data)]);
}

const mark = await buildMark();

const icoSizes = [16, 32, 48];
const icoImages = await Promise.all(
  icoSizes.map(async (size) => ({ size, data: await icon(mark, size, { padding: 0.06, radius: 0.2 }) })),
);
await writeFile(`${OUT}/favicon.ico`, ico(icoImages));
await writeFile(`${OUT}/favicon-32.png`, icoImages[1].data);

// iOS applies its own rounded mask, so the touch icon is a full square
await writeFile(`${OUT}/apple-touch-icon.png`, await icon(mark, 180, { radius: 0 }));
await writeFile(`${OUT}/icon-192.png`, await icon(mark, 192, { radius: 0 }));
await writeFile(`${OUT}/icon-512.png`, await icon(mark, 512, { radius: 0 }));

// Header logo: trimmed full wordmark
await sharp(SOURCE).trim().webp({ quality: 90 }).toFile(`${OUT}/logo.webp`);

console.log('Icons written to public/');
