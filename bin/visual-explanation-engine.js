#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const readline = require("node:readline");

const root = path.resolve(__dirname, "..");
const skillName = "visual-explanation-engine";
const sourceSkill = path.join(root, "skill", skillName);

function codexHome() {
  return process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
}

function claudeHome() {
  return process.env.CLAUDE_HOME || path.join(os.homedir(), ".claude");
}

function installTargets() {
  return [
    {
      id: "codex",
      label: "Codex global",
      detail: "${CODEX_HOME:-~/.codex}/skills",
      defaultSelected: true,
      target: () => path.join(codexHome(), "skills", skillName),
    },
    {
      id: "claude",
      label: "Claude Code global",
      detail: "${CLAUDE_HOME:-~/.claude}/skills",
      defaultSelected: true,
      target: () => path.join(claudeHome(), "skills", skillName),
    },
    {
      id: "project-codex",
      label: "Project Codex",
      detail: "./.codex/skills",
      defaultSelected: false,
      target: () => path.join(process.cwd(), ".codex", "skills", skillName),
    },
    {
      id: "project-claude",
      label: "Project Claude Code",
      detail: "./.claude/skills",
      defaultSelected: false,
      target: () => path.join(process.cwd(), ".claude", "skills", skillName),
    },
  ];
}

function hasFlag(name) {
  return process.argv.includes(name);
}

function optionValue(name) {
  const index = process.argv.indexOf(name);
  if (index === -1) {
    return null;
  }
  return process.argv[index + 1] || null;
}

function log(message, quiet = false) {
  if (!quiet) {
    console.log(message);
  }
}

function ensureSource() {
  const required = [
    "SKILL.md",
    path.join("agents", "openai.yaml"),
    path.join("references", "modality-playbook.md"),
  ];
  for (const file of required) {
    const fullPath = path.join(sourceSkill, file);
    if (!fs.existsSync(fullPath)) {
      throw new Error(`Packaged skill is missing ${file}`);
    }
  }
}

function copySkill(target, options = {}) {
  const force = Boolean(options.force);
  const quiet = Boolean(options.quiet);
  const skipExisting = Boolean(options.skipExisting);
  const dryRun = Boolean(options.dryRun);

  if (fs.existsSync(target)) {
    if (force) {
      if (dryRun) {
        log(`[dry-run] Replace ${target}`, quiet);
        return target;
      }
      fs.rmSync(target, { recursive: true, force: true });
    } else {
      log(`Already installed at ${target}`, quiet);
      if (!skipExisting) {
        log("Use `visual-explanation-engine install --force` to replace it.", quiet);
      }
      return target;
    }
  }

  if (dryRun) {
    log(`[dry-run] Install to ${target}`, quiet);
    return target;
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(sourceSkill, target, { recursive: true });
  log(`Installed to ${target}`, quiet);
  return target;
}

function expandTargetIds(rawTargets) {
  const ids = new Set();
  const known = installTargets().map((target) => target.id);
  for (const raw of rawTargets) {
    if (!raw) {
      continue;
    }
    const parts = raw.split(",").map((item) => item.trim()).filter(Boolean);
    for (const part of parts) {
      if (part === "all") {
        known.forEach((id) => ids.add(id));
      } else if (part === "global" || part === "defaults") {
        ids.add("codex");
        ids.add("claude");
      } else if (part === "project") {
        ids.add("project-codex");
        ids.add("project-claude");
      } else if (known.includes(part)) {
        ids.add(part);
      } else {
        throw new Error(`Unknown install target: ${part}`);
      }
    }
  }
  return [...ids];
}

function installSelected(targetIds, options = {}) {
  ensureSource();
  const targets = installTargets();
  const selected = targetIds.length
    ? targetIds
    : targets.filter((target) => target.defaultSelected).map((target) => target.id);

  if (!selected.length) {
    throw new Error("No install targets selected.");
  }

  const targetById = new Map(targets.map((target) => [target.id, target]));
  for (const id of selected) {
    const target = targetById.get(id);
    if (!target) {
      throw new Error(`Unknown install target: ${id}`);
    }
    log(`\n${target.label}`, options.quiet);
    copySkill(target.target(), options);
  }
}

async function promptForTargets() {
  const targets = installTargets();
  if (!process.stdin.isTTY || !process.stdout.isTTY) {
    return targets.filter((target) => target.defaultSelected).map((target) => target.id);
  }

  readline.emitKeypressEvents(process.stdin);
  const selected = new Set(targets.filter((target) => target.defaultSelected).map((target) => target.id));
  let cursor = 0;
  let renderedLines = 0;
  const stdinWasRaw = process.stdin.isRaw;

  function render() {
    if (renderedLines > 0) {
      process.stdout.write(`\x1b[${renderedLines}A`);
      process.stdout.write("\x1b[J");
    }
    const lines = [
      "Select AI targets. Space toggles, arrows move, A toggles all, Enter installs.",
      "",
      ...targets.map((target, index) => {
        const pointer = index === cursor ? ">" : " ";
        const mark = selected.has(target.id) ? "[x]" : "[ ]";
        return `${pointer} ${mark} ${target.label}  (${target.detail})`;
      }),
      "",
    ];
    renderedLines = lines.length;
    process.stdout.write(lines.join("\n"));
  }

  function cleanup() {
    if (process.stdin.isTTY) {
      process.stdin.setRawMode(stdinWasRaw);
    }
    process.stdin.pause();
    process.stdout.write("\n");
  }

  return new Promise((resolve, reject) => {
    process.stdin.setRawMode(true);
    process.stdin.resume();
    render();

    process.stdin.on("keypress", (_str, key) => {
      if (key.ctrl && key.name === "c") {
        cleanup();
        process.exit(130);
      }
      if (key.name === "up") {
        cursor = (cursor - 1 + targets.length) % targets.length;
        render();
      } else if (key.name === "down") {
        cursor = (cursor + 1) % targets.length;
        render();
      } else if (key.name === "space") {
        const id = targets[cursor].id;
        if (selected.has(id)) {
          selected.delete(id);
        } else {
          selected.add(id);
        }
        render();
      } else if (key.name === "a") {
        if (selected.size === targets.length) {
          selected.clear();
        } else {
          targets.forEach((target) => selected.add(target.id));
        }
        render();
      } else if (key.name === "return") {
        cleanup();
        resolve([...selected]);
      } else if (key.name === "escape" || key.name === "q") {
        cleanup();
        reject(new Error("Install cancelled."));
      }
    });
  });
}

async function installCommand() {
  const force = hasFlag("--force");
  const quiet = hasFlag("--quiet");
  const skipExisting = hasFlag("--skip-existing");
  const dryRun = hasFlag("--dry-run");
  const customPath = optionValue("--path");

  const rawTargets = process.argv.slice(3).filter((arg) => !arg.startsWith("--"));
  ensureSource();

  if (customPath) {
    copySkill(path.resolve(customPath), { force, quiet, skipExisting, dryRun });
    return;
  }

  const targetIds = rawTargets.length ? expandTargetIds(rawTargets) : await promptForTargets();
  installSelected(targetIds, { force, quiet, skipExisting, dryRun });
}

function doctor() {
  ensureSource();
  console.log(`Package root: ${root}`);
  console.log(`Packaged skill: ${sourceSkill}`);
  for (const target of installTargets()) {
    const targetPath = target.target();
    console.log(`${target.label}: ${fs.existsSync(targetPath) ? "installed" : "missing"} (${targetPath})`);
  }
  console.log("Required packaged files: ok");
}

function showHelp() {
  console.log(`Visual Explanation Engine

Usage:
  visual-explanation-engine install
  visual-explanation-engine install codex
  visual-explanation-engine install claude
  visual-explanation-engine install all
  visual-explanation-engine install --path /custom/skills/visual-explanation-engine
  visual-explanation-engine doctor
  visual-explanation-engine path

Install targets:
  codex          Install to \${CODEX_HOME:-~/.codex}/skills
  claude         Install to \${CLAUDE_HOME:-~/.claude}/skills
  global         Install codex + claude
  project-codex  Install to ./.codex/skills
  project-claude Install to ./.claude/skills
  project        Install project-codex + project-claude
  all            Install every target

Options:
  --force          Replace an existing installed skill
  --skip-existing  Do nothing when a target skill already exists
  --dry-run        Print planned install actions without copying files
  --path <path>    Install to a custom visual-explanation-engine skill folder

Run without a target for an interactive multi-select installer.
`);
}

async function main() {
  const command = process.argv[2] || "help";
  try {
    if (command === "install") {
      await installCommand();
      return;
    }
    if (command === "doctor") {
      doctor();
      return;
    }
    if (command === "path") {
      console.log(sourceSkill);
      return;
    }
    if (command === "help" || command === "--help" || command === "-h") {
      showHelp();
      return;
    }
    console.error(`Unknown command: ${command}`);
    showHelp();
    process.exit(1);
  } catch (error) {
    console.error(`visual-explanation-engine: ${error.message}`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { installSelected, installTargets, sourceSkill };
