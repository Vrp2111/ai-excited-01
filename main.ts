// The Hand from the Wall
import { mkdir, copyFile, stat, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const source = join(dirname(fileURLToPath(import.meta.url)), "entry.png");
const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const destination = join(outputDir, "entry.png");

const sourceStat = await stat(source);
if (!sourceStat.isFile() || sourceStat.size === 0) {
  throw new Error("Source image entry.png is missing or empty");
}

await mkdir(outputDir, { recursive: true });
await copyFile(source, destination);

const destinationStat = await stat(destination);
// Compare the actual bytes as well as sizes to verify an identical copy.
if (destinationStat.size !== sourceStat.size) {
  throw new Error(`Copied file size differs from source: ${destinationStat.size} !== ${sourceStat.size}`);
}
const [sourceBytes, outputBytes] = await Promise.all([readFile(source), readFile(destination)]);
if (!sourceBytes.equals(outputBytes)) {
  throw new Error("Copied output is not byte-identical to source");
}
console.log(`Wrote ${destination} (${destinationStat.size} bytes)`);
