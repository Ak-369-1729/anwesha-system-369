import sharp from 'sharp';
import { fileURLToPath } from 'node:url';
const asset = (name) => fileURLToPath(new URL(`../public/${name}`, import.meta.url));
await sharp(asset('og.svg')).png().toFile(asset('og.png'));
console.log('Generated 1200 × 630 social preview.');
