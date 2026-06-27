"use strict";

const { spawnSync } = require("node:child_process");
const path = require("node:path");

if (process.env.VEE_SKIP_CODEX_INSTALL === "1") {
  console.log("[visual-explanation-engine] Skipping Codex skill install because VEE_SKIP_CODEX_INSTALL=1.");
  process.exit(0);
}

const root = path.resolve(__dirname, "..");
const cli = path.join(root, "bin", "visual-explanation-engine.js");
const result = spawnSync(process.execPath, [cli, "install", "codex", "--skip-existing", "--quiet"], {
  cwd: root,
  stdio: "inherit",
  env: process.env,
});

if (result.error) {
  console.warn(`[visual-explanation-engine] Could not run postinstall: ${result.error.message}`);
  process.exit(0);
}

if (result.status !== 0) {
  console.warn("[visual-explanation-engine] Automatic Codex skill install did not complete. Run `visual-explanation-engine install --force` manually.");
}

process.exit(0);
