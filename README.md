# Visual Explanation Engine

![Visual Explanation Engine hero](docs/assets/hero.png)

**Visual Explanation Engine** is a Codex skill that helps an agent turn any explanation request into the clearest possible learning experience: concise text when text is enough, diagrams when structure matters, generated educational visuals when they improve understanding, and interactive UI when exploration teaches better than reading.

[English](README.md) | [한국어](README.ko.md) | [日本語](docs/i18n/README.ja.md) | [简体中文](docs/i18n/README.zh-CN.md) | [Español](docs/i18n/README.es.md)

> The goal is not to generate HTML. The goal is to maximize understanding.

## What It Does

- Chooses the right explanation format instead of defaulting to paragraphs.
- Detects the structure of a topic: process, timeline, comparison, hierarchy, architecture, algorithm, decision flow, data flow, lifecycle, math, science, business logic, or story.
- Designs progressive disclosure: summary, visual map, walkthrough, examples, details, and references only when needed.
- Encourages interactive learning with selectable concepts, step controls, timelines, diagrams, charts, examples, and misconception callouts.
- Guides when to use generated educational images, Mermaid diagrams, SVG, tables, charts, code examples, interactive HTML, or a frontend app.
- Packages the workflow as an installable skill that works with the standard `skills` CLI and npm.

## How It Works

![Visual Explanation Engine process](docs/assets/process.png)

1. **Understand the learner and topic**: identify audience level, complexity, desired outcome, and likely misconceptions.
2. **Extract explanation structure**: decide whether the topic is a process, timeline, comparison, algorithm, architecture, system, concept map, or mixed structure.
3. **Select modalities**: choose the smallest useful set of text, diagrams, images, charts, examples, animation, or interaction.
4. **Layer the explanation**: start with orientation, then reveal depth step by step.
5. **Build the artifact**: produce a chat answer, diagram, generated visual, interactive HTML, or app depending on what teaches best.
6. **Quality-check understanding**: remove decorative visuals, filler text, and interactions that do not teach anything.

## Why It Is Different

Most explanation prompts accidentally become long text or a generic web page. Visual Explanation Engine makes the agent ask a better first question:

> What is the fastest and clearest way for this learner to truly understand this?

That changes the output:

| Default explainer | Visual Explanation Engine |
| --- | --- |
| Starts writing immediately | Plans the learning shape first |
| Treats HTML as the goal | Treats understanding as the goal |
| Uses one layout for many topics | Matches format to structure |
| Adds images as decoration | Uses visuals only when they teach |
| Dumps all details at once | Uses progressive disclosure |
| Gives isolated definitions | Links concepts, examples, and misconceptions |

## Install

### Recommended: skills CLI

Install directly from GitHub with the standard selector:

```bash
npx --yes skills add Jun0zo/visual-explanation-engine
```

For a non-interactive Codex + Claude Code install:

```bash
npx --yes skills add Jun0zo/visual-explanation-engine --skill visual-explanation-engine --agent codex claude-code --yes
```

To confirm the repository is discoverable before installing:

```bash
npx --yes skills add Jun0zo/visual-explanation-engine --list
```

### npm fallback

Install from npm:

```bash
npm install -g visual-explanation-engine
```

The npm `postinstall` step quietly installs the packaged skill for Codex:

```text
${CODEX_HOME:-~/.codex}/skills/visual-explanation-engine
```

If the skill already exists, the installer leaves it untouched. To replace it:

```bash
visual-explanation-engine install --force
```

Run the npm installer without a target to install to Codex global and Claude Code global. Use the `skills` CLI above when you want the richer standard selector.

```bash
visual-explanation-engine install
```

You can also skip automatic Codex installation:

```bash
VEE_SKIP_CODEX_INSTALL=1 npm install -g visual-explanation-engine
```

### npx

```bash
npx --yes visual-explanation-engine install --force
```

### Manual

```bash
cp -R skills/visual-explanation-engine "${CODEX_HOME:-$HOME/.codex}/skills/"
```

## Usage

Invoke the skill explicitly in Codex:

```text
Use $visual-explanation-engine to explain how transformers handle attention for a beginner.
```

Other good prompts:

```text
Use $visual-explanation-engine to make an interactive lesson for OAuth login flow.
Use $visual-explanation-engine to visualize the difference between TCP and UDP.
Use $visual-explanation-engine to teach gradient descent with diagrams and examples.
Use $visual-explanation-engine to explain our backend architecture to a new engineer.
```

## CLI

The npm package includes a small installer CLI:

```bash
visual-explanation-engine install
visual-explanation-engine install codex
visual-explanation-engine install claude
visual-explanation-engine install all
visual-explanation-engine install --force
visual-explanation-engine doctor
visual-explanation-engine path
```

Install targets:

| Target | Destination |
| --- | --- |
| `codex` | `${CODEX_HOME:-~/.codex}/skills` |
| `claude` | `${CLAUDE_HOME:-~/.claude}/skills` |
| `project-codex` | `./.codex/skills` |
| `project-claude` | `./.claude/skills` |
| `all` | every target above |

Short alias:

```bash
vee doctor
```

## Included Skill Files

```text
skills/visual-explanation-engine/
├── SKILL.md
├── agents/openai.yaml
└── references/modality-playbook.md
```

The modality playbook maps explanation structures to the best formats: flow diagrams, timelines, comparison matrices, architecture diagrams, algorithm traces, relationship networks, decision trees, charts, mathematical visuals, scientific illustrations, and interactive lessons.

## Development

```bash
npm test
npm pack --dry-run
node bin/visual-explanation-engine.js doctor
```

## Generated README Images

The README visuals are real generated PNG assets saved under `docs/assets/`:

- `hero.png`: transformation from a question into a multimodal lesson.
- `process.png`: the six-stage visual explanation workflow.
