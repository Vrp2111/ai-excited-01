// The Dragon in the Lantern — entry program for ai-excited-01.
// Copies the entry image (entry.png) that sits next to this file into the
// output directory, byte for byte. The copy is deterministic: running the
// program twice writes identical bytes.

import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
const here = dirname(fileURLToPath(import.meta.url));
const src = join(here, "entry.png");
const dest = join(outDir, "entry.png");

mkdirSync(outDir, { recursive: true });
copyFileSync(src, dest);
console.log(`wrote ${dest}`);
