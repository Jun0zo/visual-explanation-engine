# Current Research Findings

Latest local run inspected: `2026-06-28T05-50-00-733Z`.

Generated screenshots and the full report live under `evals/runs/` locally and are ignored by git.

## Score Summary

| Task | Baseline | Candidate | Delta |
| --- | ---: | ---: | ---: |
| Dijkstra lab | 39 | 82 | +43 |
| Rubric inspection | 17 | 71 | +54 |

## What Improved

- Open-canvas layouts sharply outperform box-in-box dashboards on box discipline.
- Attached annotations outperform detached right-side explanation cards.
- Artifact inspection works better than abstract metaphors for evaluation/rubric explanations.
- Controls are useful only when they visibly change the primary object, not just a text panel.

## Remaining Pressure

- Distance and state labels can still overuse rounded pills; prefer ticks, inline numerals, strokes, and ghost paths.
- Callouts need physical attachment to evidence. Floating tags still read as UI decoration.
- More benchmark tasks are needed for timelines, systems, math, API flows, and scientific mechanisms.
- The harness is heuristic and should eventually be paired with comprehension/transfer questions.
