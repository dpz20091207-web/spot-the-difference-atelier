// Entry point: hands the game in. Copies game/ and screenshots/ into the
// output directory, then writes /output/dossier.json with buildDossier from
// the kit's vendor/makefun-game.ts. Outside the grader, MAKEFUN_OUTPUT_DIR
// stands in for /output. Runs in well under the 10 second budget and is
// deterministic: the same repository always writes the same bytes.

import { chmodSync, cpSync, mkdirSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-game.ts";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

function copyTree(src: string, dst: string): void {
  mkdirSync(dst, { recursive: true, mode: 0o755 });
  cpSync(src, dst, { recursive: true, force: true });
  const fixModes = (dir: string): void => {
    chmodSync(dir, 0o755);
    for (const entry of readdirSync(dir)) {
      const p = join(dir, entry);
      if (statSync(p).isDirectory()) fixModes(p);
      else chmodSync(p, 0o644);
    }
  };
  fixModes(dst);
}

copyTree(join(repoRoot, "game"), join(outDir, "game"));
copyTree(join(repoRoot, "screenshots"), join(outDir, "screenshots"));

const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  game_max_files: 993,
  game_max_bytes: 48 * 1024 * 1024,
  game_path_max_bytes: 1000,
});
writeFileSync(join(outDir, "dossier.json"), dossier, { mode: 0o644 });
