# Current Research Findings

Latest local run inspected: `2026-06-28T06-18-17-952Z`.

Generated screenshots and the full report live under `evals/runs/` locally and are ignored by git.

## Score Summary

| Task | Baseline | Candidate | Delta |
| --- | ---: | ---: | ---: |
| Dijkstra lab | 36 | 82 | +46 |
| Rubric inspection | 15 | 68 | +53 |
| OAuth request path | 26 | 82 | +56 |
| Gradient descent surface | 28 | 83 | +55 |

## What Improved

- Open-canvas layouts sharply outperform box-in-box dashboards on box discipline.
- Attached annotations outperform detached right-side explanation cards.
- Artifact inspection works better than abstract metaphors for evaluation/rubric explanations.
- Controls are useful only when they visibly change the primary object, not just a text panel.
- New box-surface metrics make framed chart cards, high box-area layouts, and rounded-label overuse visible in the report.
- Graph and math candidates score best when the native surface becomes the page and state changes happen directly on paths, points, and inline values.

## Remaining Pressure

- Distance and state labels can still overuse rounded pills; prefer ticks, inline numerals, strokes, and ghost paths.
- Callouts need physical attachment to evidence. Floating tags still read as UI decoration.
- Labels and callouts must avoid covering the node, curve, path, document text, or moving object they explain.
- More benchmark tasks are needed for timelines, scientific mechanisms, architecture tradeoffs, and code/debugging flows.
- The harness is heuristic and should eventually be paired with comprehension/transfer questions.
