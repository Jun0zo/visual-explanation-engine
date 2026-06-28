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
- **Interaction**: whether controls visibly change the rendered state.
- **Anti-slop**: penalties for hero-heavy, rounded-control-heavy, rounded-label-heavy, generic layouts.

## Current Benchmark Pairs

- `dijkstra-lab`: boxy dashboard baseline vs open-canvas graph explanation.
- `rubric-inspection`: generic ladder/card baseline vs artifact-centered rubric lens.
- `oauth-request-path`: step-card baseline vs request trace across browser, app, and provider lanes.
- `gradient-descent-surface`: definition-card baseline vs graph-first curve lab.

The goal is not to make the metric perfect. The goal is to create a repeatable pressure loop: generate examples, capture them, score regressions, inspect screenshots, then tighten the skill instructions.

Fixtures can mark legitimate domain boundaries with `data-domain-box`, lightweight inspectors with `data-light-inspector`, and compact floating controls with `data-floating-toolbar` so the box metric penalizes decorative containers rather than real explanatory objects.

Use `data-state-target` on the primary visual state container when an action should change the object itself. This keeps interaction scoring from over-rewarding large text-only panel changes.
