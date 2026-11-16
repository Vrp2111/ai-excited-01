// The Hand from the Wall
import { copyFile, mkdir, readFile, stat } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('./entry.png', import.meta.url));
const sourceStats = await stat(source);
if (!sourceStats.isFile() || sourceStats.size === 0) {
  throw new Error('Source image is missing, empty, or not a regular file.');
}

const output = resolve(process.env.MAKEFUN_OUTPUT_DIR ?? '/output', 'entry.png');
if (output === source) {
  throw new Error('Output must differ from the source image.');
}
await mkdir(dirname(output), { recursive: true });
await copyFile(source, output);
const outputStats = await stat(output);
if (outputStats.size !== sourceStats.size) {
  throw new Error('Copied image size differs from the source.');
}

// Compare every byte to ensure the copy preserves the original image exactly.
const [sourceBytes, outputBytes] = await Promise.all([
  readFile(source),
  readFile(output),
]);
if (!sourceBytes.equals(outputBytes)) {
  throw new Error('Copied image is not byte-identical to the source.');
}
console.log(`Wrote ${output} (${outputStats.size} bytes; byte-identical copy).`);
