---
name: visual-explanation-engine
description: Create clear visual, interactive, and multimodal explanations for concepts, systems, processes, algorithms, workflows, data relationships, architecture, scientific or mathematical ideas, and code. Use when the user asks to explain, teach, visualize, diagram, make an explainer, build an interactive lesson, create an infographic, compare ideas, show a timeline, map decisions, or when understanding would benefit from visuals, progressive disclosure, examples, generated educational assets, or concise explanatory UI.
---

# Visual Explanation Engine

## Overview

Maximize human understanding by choosing the clearest mix of concise text, diagrams, illustrations, interaction, examples, charts, animations, code, and generated educational assets. Do not default to HTML; use HTML only when interaction or layout materially improves learning.

## Core Questions

Before producing anything, answer internally:

> What is the fastest and clearest way for this learner to truly understand this?

> What visual object, action, or example would make the idea understandable if most prose were removed?

Let those answers determine the output format.

## Workflow

1. Identify the topic, learner level, desired outcome, complexity, and likely misconceptions.
2. Extract the explanation structures: process, workflow, timeline, comparison, hierarchy, cause and effect, architecture, lifecycle, decision flow, algorithm, relationship network, data flow, story, business logic, math, science, physical mechanism, or technical design.
3. Choose the primary explanatory object before layout: map, trace, specimen, simulator, timeline, graph, rubric, state machine, request path, comparison board, or annotated artifact.
4. Select the smallest useful set of modalities. Read `references/modality-playbook.md` when the structure is mixed, the output will be substantial, or the best format is not obvious.
5. Design progressive disclosure around actions: inspect, scrub, compare, toggle layers, run an example, follow evidence, adjust a parameter, or reveal a failure path.
6. Produce the artifact using the right medium: Mermaid, SVG, chart, table, generated image, interactive HTML, frontend app, animation, code example, or a compact written answer.
7. Check that every visual or interaction teaches something. Remove decorative visuals, repeated text, and interactions that do not improve comprehension.

## Visual-First Contract

For nontrivial explainers, make the visual or interactive model carry the understanding:

- Put a concrete visual object in the first view; do not lead with a large marketing-style headline and paragraphs.
- Use text as labels, annotations, captions, and short guidance. Avoid long explanatory blocks inside cards.
- Encode relationships with position, grouping, motion, color, scale, sequence, or direct manipulation, not just with written descriptions.
- Use real or realistic examples from the user's topic. If the task involves evaluation, writing, code, data, or a workflow, show a sample artifact being inspected instead of only describing the rules.
- Make interactions change the visual state. A tab or button that only swaps paragraphs is not enough.
- For code explanations, make the code, runtime state, call stack, data flow, or trace the inspected object. Highlight the exact line or state transition being explained.
- For science or physical mechanisms, make the structure, cross-section, scale view, transformation, or material/energy flow the inspected object. Attach labels to where the mechanism happens.
- For timelines, make time the organizing surface. Show duration, gaps, overlap, causal lag, and state changes on the axis instead of turning events into cards.
- For architecture and tradeoff explanations, make constraints, request paths, budgets, failure boundaries, or decision surfaces the inspected object. Show where the recommendation changes.
- For data and analytics explanations, make the chart, table, distribution, cohort, segment, or query result the inspected object. Attach claims to marks, baselines, and comparisons.

## Anti-Template Rules

Avoid outputs that feel like generic AI slideware:

- Do not use a giant hero headline, vague subtitle, and grid of cards unless the user explicitly asks for a landing page.
- Do not turn every concept into a ladder, journey, tree, factory, pipeline, or metaphor. Use metaphors only when they clarify the user's actual domain.
- Do not make "important premise", "current confusion", "key insight", or similar prose panels the main content.
- Do not use dark dashboard cards as the default visual language. Choose a form that fits the subject: worksheet, lab bench, map, timeline, circuit, courtroom evidence board, microscope, editor, graph, cockpit, rubric, or simulator.
- Do not create box-in-box layouts: card grids inside panels, sidebars full of explanation cards, or framed canvases surrounded by more framed cards.
- Do not compose explainers as header band + framed chart/card + right-column explanation cards unless those rectangles are real domain objects.
- Do not pad the artifact with repeated summaries. If a sentence does not help the learner act, inspect, compare, or decide, remove it.

## Layout Discipline

Design the surface around the explanatory object, not around containers:

- Prefer an open canvas, board, lab table, graph paper, timeline, editor, map, or simulation stage as the main surface.
- If the main object already has a native surface such as graph paper, a map, an editor, a timeline, or a document, let that surface be the page instead of placing it inside another panel.
- Use at most one framing container around the primary object. Avoid nested borders, stacked panels, and repeated rounded rectangles.
- Replace side explanation cards with direct annotations, labels, callout lines, overlays, tooltips, legends, scrubbers, or inline evidence markers near the relevant visual element.
- Keep controls compact and spatially attached to what they affect. Use a toolbar, floating controls, edge rail, or inline handles instead of a separate card column when possible.
- Avoid making every small label a pill or rounded rectangle. Prefer typography, tick marks, leader lines, direct labels, ghost paths, strokes, fills, and axis marks.
- For algorithm and graph explainers, show state as marks on the graph: colored edges, pointer movement, inline distance values, struck/replaced values, and ghost paths. Avoid distance badges under every node unless the badge itself changes in a meaningful way.
- For code and debugging explainers, connect code lines to runtime events: input, handler, state update, render, network request, cache read, error boundary, log, or output. Avoid standalone lifecycle cards when a trace would show the mechanism.
- For science explainers, connect inputs, outputs, forces, reactions, energy, matter, layers, and hidden internals to the exact region where they occur. Avoid definition cards when a cross-section, exploded view, or simulation would show the mechanism.
- For timeline explainers, encode actual timing: positions, spans, parallel lanes, before/after state, and cause-effect delays. Avoid equal-width event cards unless time intervals are genuinely equal.
- For architecture tradeoffs, encode constraints as axes, thresholds, lanes, flow capacity, failure zones, or budget lines. Avoid detached pros/cons cards when the choice depends on workload or constraints.
- For data explainers, encode comparisons with axes, scales, cohorts, distributions, baselines, deltas, uncertainty, and segment filters. Avoid KPI cards unless the underlying marks are visible nearby.
- Make callouts physically touch or point to the evidence they describe. Floating labels in empty space are weak explanations.
- Keep labels and callouts out of the object's path. They may touch, underline, bracket, or point to evidence, but should not cover the node, curve, document text, or moving object being explained.
- Let whitespace, alignment, scale, and motion organize the page before adding borders.
- When a secondary explanation is necessary, use one lightweight inspector or drawer, not several independent cards.
- Run a box audit before finalizing: if the eye notices container outlines before the concept, remove borders, backgrounds, or side panels until the explanatory object dominates.

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
- Keep the primary visual persistent while controls change it.
- Put controls next to the thing they affect.
- Limit prose in interactive views: one or two short sentences per selected state is usually enough.
- Keep explanatory side panels subordinate. The main object should occupy most of the screen and remain the obvious focus.
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
- The artifact would still mostly make sense if paragraphs were removed.
- The main interaction changes a diagram, example, state, chart, or specimen rather than only replacing text.
- Code explanations show what line runs, what state changes, and where the output changes.
- Science explanations show what enters, moves, transforms, exits, and where hidden structure matters.
- Timeline explanations show when things happen, how long they last, what overlaps, and what changes before and after.
- Architecture tradeoffs show how constraints, workload, failure modes, or budgets move the recommendation.
- Data explanations show what changed, where it changed, compared with what baseline, and whether the claim is observation or interpretation.
- The design does not look like a generic AI-generated dark card dashboard.
- The layout avoids nested boxes, card stacks, and framed panels around framed panels.
- The main visual is not trapped inside a decorative chart card when it could be the page surface.
- Labels and annotations sit close to the visual evidence they describe.
- Labels, callouts, legends, and controls do not overlap the marks, words, paths, or objects the learner needs to inspect.
- Repeated pills, badges, and rounded labels are not carrying the visual language.
- Leader lines and callouts terminate on real evidence, not empty space.
- Examples sit near the abstract ideas they explain.
- Common misconceptions are corrected when relevant.
- Text is concise: one idea per section, no filler paragraphs.
- Any HTML is self-contained when appropriate, responsive, accessible, fast-loading, and dark-mode aware unless the project context dictates otherwise.
