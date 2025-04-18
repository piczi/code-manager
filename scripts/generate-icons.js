import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [16, 32, 48, 128];
const inputFile = join(__dirname, '../public/icon.svg');
const outputDir = join(__dirname, '../public');

if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

for (const size of sizes) {
  try {
    await sharp(inputFile)
      .resize(size, size)
      .png()
      .toFile(join(outputDir, `icon-${size}.png`));
    console.log(`Generated icon-${size}.png`);
  } catch (err) {
    console.error(`Error generating icon-${size}.png:`, err);
  }
} 