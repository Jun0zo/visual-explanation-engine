#!/usr/bin/env node
"use strict";

const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const root = path.resolve(__dirname, "..");
const skillName = "visual-explanation-engine";
const sourceSkill = path.join(root, "skill", skillName);

function codexHome() {
  return process.env.CODEX_HOME || path.join(os.homedir(), ".codex");
}

function targetSkill() {
  return path.join(codexHome(), "skills", skillName);
}

function hasFlag(name) {
  return process.argv.includes(name);
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

function installSkill(options = {}) {
  const force = Boolean(options.force);
  const quiet = Boolean(options.quiet);
  const skipExisting = Boolean(options.skipExisting);
  ensureSource();

  const target = targetSkill();
  if (fs.existsSync(target)) {
    if (force) {
      fs.rmSync(target, { recursive: true, force: true });
    } else {
      log(`Visual Explanation Engine is already installed at ${target}`, quiet);
      if (!skipExisting) {
        log("Use `visual-explanation-engine install --force` to replace it.", quiet);
      }
      return target;
    }
  }

  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.cpSync(sourceSkill, target, { recursive: true });
  log(`Installed Visual Explanation Engine skill to ${target}`, quiet);
  return target;
}

function doctor() {
  ensureSource();
  const target = targetSkill();
  console.log(`Package root: ${root}`);
  console.log(`Packaged skill: ${sourceSkill}`);
  console.log(`Codex target: ${target}`);
  console.log(`Installed: ${fs.existsSync(target) ? "yes" : "no"}`);
  console.log("Required packaged files: ok");
}

function showHelp() {
  console.log(`Visual Explanation Engine

Usage:
  visual-explanation-engine install [--force]
  visual-explanation-engine doctor
  visual-explanation-engine path

Commands:
  install   Copy the packaged Codex skill into \${CODEX_HOME:-~/.codex}/skills
  doctor    Check packaged files and installation status
  path      Print the packaged skill path

Options:
  --force          Replace an existing installed skill
  --skip-existing  Do nothing when the target skill already exists
`);
}

function main() {
  const command = process.argv[2] || "help";
  try {
    if (command === "install") {
      installSkill({
        force: hasFlag("--force"),
        quiet: hasFlag("--quiet"),
        skipExisting: hasFlag("--skip-existing"),
      });
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

module.exports = { installSkill, targetSkill, sourceSkill };
