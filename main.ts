// Spot the Difference — Atelier Edition (Node 22, standard library only):
// the game is this directory's game/ folder, plain static files a desktop
// browser loads offline (game/index.html, inline CSS + JS, inline SVG art,
// no library and no network request). The program copies game/ and
// screenshots/ from beside this file to /output and writes
// /output/dossier.json, the summary the judge reads, with the vendored
// make.fun library. Outside the grader, MAKEFUN_OUTPUT_DIR stands in for
// /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
//
// Play it locally: serve game/ with any static server, then open
// game/index.html in desktop Chrome. Three levels, seven differences each.

import { cpSync, chmodSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function copyDir(src: string, dst: string) {
  mkdirSync(dst, { recursive: true, mode: 0o755 });
  cpSync(src, dst, { recursive: true });
  // Ensure world-readable permissions for grader collection.
  const walk = (dir: string) => {
    chmodSync(dir, 0o755);
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) walk(p);
      else chmodSync(p, 0o644);
    }
  };
  walk(dst);
}

mkdirSync(out, { recursive: true });
copyDir(join(here, "game"), join(out, "game"));
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  copyDir(join(here, "screenshots"), join(out, "screenshots"));
}

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the bytes; the others refuse an entry the
// scorer would refuse (more than 4 screenshots or one over 256 KiB; more than 993 files in game/ or 48 MiB of game
// files, in all, or a path under game/ over 1000 bytes).
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    game_max_files: 993,
    game_max_bytes: 50331648,
    game_path_max_bytes: 1000,
  }),
);
