# Current Research Findings

Latest local run inspected: `2026-06-28T14-54-10-487Z`.

Generated screenshots and the full report live under `evals/runs/` locally and are ignored by git.

## Score Summary

| Task | Baseline | Candidate | Delta |
| --- | ---: | ---: | ---: |
| Dijkstra lab | 35 | 76 | +41 |
| Rubric inspection | 24 | 71 | +47 |
| OAuth request path | 34 | 76 | +42 |
| Gradient descent surface | 35 | 85 | +50 |
| React render debugging | 30 | 83 | +53 |
| Photosynthesis mechanism | 32 | 79 | +47 |
| Incident timeline | 27 | 78 | +51 |
| Architecture tradeoff | 26 | 77 | +51 |
| Retention analysis | 34 | 77 | +43 |
| Dependency graph | 32 | 90 | +58 |

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
- Timeline candidates score best when time is a scaled surface with spans, overlaps, causal lag, metric traces, and before/after state changes in one view.
- Architecture tradeoff candidates score best when constraints become a decision surface and workload changes move the recommendation on the visual object.
- Data/analytics candidates score best when the cohort grid, chart, baseline, selected segment, and claim annotations stay on the same data surface.
- Library-backed graph candidates score best when layout, hit-testing, selection, and neighbor/path highlighting are handled by a maintained graph library rather than hand-positioned SVG.
- The harness now records `libraryVisualCount`, auto-flags large complex SVGs as `handRolledComplexVisualCount`, and includes a `libraryDiscipline` score so hand-built SVG debt affects overall results.

## Remaining Pressure

- Distance and state labels can still overuse rounded pills; prefer ticks, inline numerals, strokes, and ghost paths.
- Callouts need physical attachment to evidence. Floating tags still read as UI decoration.
- Labels and callouts must avoid covering the node, curve, path, document text, or moving object they explain.
- The React trace still has interaction as its weakest score; future fixtures should make the visual state transition more dramatic without becoming noisy.
- Science candidates can still improve by making interactions teach more than a two-state highlight; staged scrubbing through inputs, transformation, and output would be stronger.
- Several previously strong candidates now show `hand=1` and `libraryDiscipline=45`; timeline, architecture surface, photosynthesis, retention, Dijkstra, and OAuth examples should be rebuilt with chart/timeline/graph/canvas/simulation engines instead of large handcrafted SVG.
- More library-backed benchmarks are needed for chart brushing, timeline zooming, map inspection, code editors, rich tables, and 3D/physics explainers.
- Future benchmarks should stress multi-chart analytical stories, statistical uncertainty, and slide/narrative outputs.
- The harness is heuristic and should eventually be paired with comprehension/transfer questions.
