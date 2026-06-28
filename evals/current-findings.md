# Current Research Findings

Latest local run inspected: `2026-06-28T06-47-30-371Z`.

Generated screenshots and the full report live under `evals/runs/` locally and are ignored by git.

## Score Summary

| Task | Baseline | Candidate | Delta |
| --- | ---: | ---: | ---: |
| Dijkstra lab | 36 | 82 | +46 |
| Rubric inspection | 15 | 68 | +53 |
| OAuth request path | 26 | 82 | +56 |
| Gradient descent surface | 28 | 83 | +55 |
| React render debugging | 23 | 81 | +58 |
| Photosynthesis mechanism | 25 | 85 | +60 |

## What Improved

- Open-canvas layouts sharply outperform box-in-box dashboards on box discipline.
- Attached annotations outperform detached right-side explanation cards.
- Artifact inspection works better than abstract metaphors for evaluation/rubric explanations.
- Controls are useful only when they visibly change the primary object, not just a text panel.
- New box-surface metrics make framed chart cards, high box-area layouts, and rounded-label overuse visible in the report.
- Label-collision metrics catch annotations and SVG labels that physically overlap before they become a polished-output problem.
- Graph and math candidates score best when the native surface becomes the page and state changes happen directly on paths, points, and inline values.
- Code/debugging candidates score best when code, runtime state, output, and trace are connected in one workspace rather than split into lifecycle cards.
- Science mechanism candidates score best when hidden structure becomes the surface and matter/energy flows are attached to where they enter, transform, and exit.

## Remaining Pressure

- Distance and state labels can still overuse rounded pills; prefer ticks, inline numerals, strokes, and ghost paths.
- Callouts need physical attachment to evidence. Floating tags still read as UI decoration.
- Labels and callouts must avoid covering the node, curve, path, document text, or moving object they explain.
- The React trace still has interaction as its weakest score; future fixtures should make the visual state transition more dramatic without becoming noisy.
- Science candidates can still improve by making interactions teach more than a two-state highlight; staged scrubbing through inputs, transformation, and output would be stronger.
- More benchmark tasks are needed for timelines, architecture tradeoffs, and data/analytics explanations.
- The harness is heuristic and should eventually be paired with comprehension/transfer questions.
