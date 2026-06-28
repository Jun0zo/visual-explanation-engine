# Visual Explanation Research Harness

This harness compares explanation artifacts with browser screenshots and heuristic metrics.

Run:

```bash
npm run eval:research
```

Each run writes a local report under:

```text
evals/runs/<timestamp>/report.md
```

Generated runs are intentionally ignored by git. They are evidence for local iteration, not stable source files.

## What It Measures

- **Visual ratio**: how much of the first viewport is occupied by actual visual objects.
- **Text economy**: whether the first viewport is dominated by prose.
- **Box discipline**: penalties for card-like containers, nested boxes, side-card stacks, high box-surface area, and decorative frames around primary visuals.
- **Annotation**: whether labels and callouts are attached to visual evidence.
- **Interaction**: whether controls visibly change the rendered state and marked visual state targets.
- **Anti-slop**: penalties for hero-heavy, rounded-control-heavy, rounded-label-heavy, label-collision-heavy, generic layouts.
- **Library discipline**: whether complex interactive visuals are library-backed, and whether hand-rolled SVG is being used where layout, scales, hit-testing, or exploration should come from a maintained library.

## Current Benchmark Pairs

- `dijkstra-lab`: boxy dashboard baseline vs open-canvas graph explanation.
- `rubric-inspection`: generic ladder/card baseline vs artifact-centered rubric lens.
- `oauth-request-path`: step-card baseline vs request trace across browser, app, and provider lanes.
- `gradient-descent-surface`: definition-card baseline vs graph-first curve lab.
- `react-render-debugging`: React lifecycle card baseline vs code-and-runtime trace workspace.
- `photosynthesis-mechanism`: definition-card baseline vs chloroplast cross-section mechanism lab.
- `incident-timeline`: card postmortem baseline vs scaled incident timeline axis.
- `architecture-tradeoff`: pros/cons card baseline vs constraint-driven decision surface.
- `retention-analysis`: KPI-card dashboard baseline vs annotated cohort heatmap and retention curve.
- `dependency-graph`: hand-positioned SVG dependency graph vs Cytoscape-backed graph explorer.

The goal is not to make the metric perfect. The goal is to create a repeatable pressure loop: generate examples, capture them, score regressions, inspect screenshots, then tighten the skill instructions.

Fixtures can mark legitimate domain boundaries with `data-domain-box`, lightweight inspectors with `data-light-inspector`, and compact floating controls with `data-floating-toolbar` so the box metric penalizes decorative containers rather than real explanatory objects.

Use `data-state-target` on the primary visual state container when an action should change the object itself. This keeps interaction scoring from over-rewarding large text-only panel changes.

Use `data-annotation`, `.callout`, `.annotation`, or `data-label` on labels that should remain legible. The harness counts label-to-label collisions so dense traces and diagrams do not pass just because they are visually busy.

Use `data-library-visual` on a maintained-library visual surface and `data-handrolled-complex` on intentionally hand-built complex fixtures. The harness also auto-flags large visible SVGs with many manually positioned marks as hand-rolled complex visuals. This lets the research loop reward real chart/graph/map/editor/simulation engines and penalize brittle static SVG approximations when a library should own layout or interaction.
