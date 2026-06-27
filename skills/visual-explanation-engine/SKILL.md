---
name: visual-explanation-engine
description: Create clear visual, interactive, and multimodal explanations for concepts, systems, processes, algorithms, workflows, data relationships, architecture, scientific or mathematical ideas, and code. Use when the user asks to explain, teach, visualize, diagram, make an explainer, build an interactive lesson, create an infographic, compare ideas, show a timeline, map decisions, or when understanding would benefit from visuals, progressive disclosure, examples, generated educational assets, or concise explanatory UI.
---

# Visual Explanation Engine

## Overview

Maximize human understanding by choosing the clearest mix of concise text, diagrams, illustrations, interaction, examples, charts, animations, code, and generated educational assets. Do not default to HTML; use HTML only when interaction or layout materially improves learning.

## Core Question

Before producing anything, answer internally:

> What is the fastest and clearest way for this learner to truly understand this?

Let that answer determine the output format.

## Workflow

1. Identify the topic, learner level, desired outcome, complexity, and likely misconceptions.
2. Extract the explanation structures: process, workflow, timeline, comparison, hierarchy, cause and effect, architecture, lifecycle, decision flow, algorithm, relationship network, data flow, story, business logic, math, science, physical mechanism, or technical design.
3. Select the smallest useful set of modalities. Read `references/modality-playbook.md` when the structure is mixed, the output will be substantial, or the best format is not obvious.
4. Design progressive disclosure: one-sentence summary, high-level visual, guided steps, examples, implementation details, then references or formulas only if useful.
5. Produce the artifact using the right medium: Mermaid, SVG, chart, table, generated image, interactive HTML, frontend app, animation, code example, or a compact written answer.
6. Check that every visual or interaction teaches something. Remove decorative visuals, repeated text, and interactions that do not improve comprehension.

## Modality Rules

- Use text-only answers when text is genuinely the fastest explanation.
- Use diagrams for relationships, architecture, processes, decisions, and cause-and-effect.
- Use timelines for chronological change, phases, releases, histories, and lifecycle sequencing.
- Use tables or side-by-side layouts for comparisons, tradeoffs, and decision criteria.
- Use charts for quantitative claims, trends, proportions, and distributions.
- Use generated images only for educational illustrations, labeled figures, cross-sections, concept scenes, exploded views, or before/after explanations that improve understanding.
- Use interactive HTML or a frontend app when the learner benefits from exploration: stepping through an algorithm, toggling perspectives, selecting concepts, animating state changes, filtering examples, or manipulating parameters.
- Use code examples when implementation is part of understanding; pair code with flow, state, or data visuals when helpful.

## Interactive Explanation Requirements

When creating an interactive explainer:

- Make major concepts selectable, expandable, or step-addressable.
- For selected concepts, show a concise explanation, related concepts, practical example, and deeper detail.
- Prefer guided exploration over long scrolls of prose.
- Keep controls obvious, responsive, accessible, and mobile-friendly.
- Avoid hiding essential understanding behind hover-only behavior.

## Adaptive Learning

Match the explanation to the audience:

- Beginner: simple language, analogy, labeled illustration, minimal jargon.
- Student: concept relationships, examples, common misconceptions, guided steps.
- Engineer: architecture, mechanisms, tradeoffs, failure modes, implementation.
- Expert: edge cases, performance, constraints, formulas, references.

If the audience is unknown, start at an informed beginner level and include optional deeper layers.

## Quality Bar

Before finalizing, verify:

- The first screen or first section gives the learner orientation immediately.
- Visual structure matches the concept structure.
- Examples sit near the abstract ideas they explain.
- Common misconceptions are corrected when relevant.
- Text is concise: one idea per section, no filler paragraphs.
- Any HTML is self-contained when appropriate, responsive, accessible, fast-loading, and dark-mode aware unless the project context dictates otherwise.
