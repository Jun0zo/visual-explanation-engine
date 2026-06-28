# Modality Playbook

Use this reference when choosing the right visual or interactive form for an explanation.

## Structure To Modality Map

| Explanation structure | Prefer | Add interaction when |
| --- | --- | --- |
| Process or workflow | Flow diagram, swimlane, numbered steps | The learner needs to inspect branches, responsibilities, or failure paths |
| Timeline | Timeline, phase bands, before/after states | Events have filters, dependencies, or multiple perspectives |
| Comparison | Matrix, side-by-side panels, scorecard | Tradeoffs change by user goal or constraints |
| Hierarchy | Tree, nested map, layered diagram | Nodes need expansion or multiple levels of detail |
| Cause and effect | Causal chain, loop diagram, system map | The learner should test "what if" changes |
| System architecture | Component diagram, data/control flow, deployment map | Users need to trace requests, state, permissions, or failure modes |
| Algorithm | Step animation, state table, pseudocode plus visual trace | Iteration, recursion, or state transitions are the hard part |
| Relationship network | Node-link graph, adjacency map, concept map | Selecting a node should reveal neighbors and examples |
| Decision flow | Decision tree, checklist, routing table | Answers change recommendations or next steps |
| Lifecycle | Circular flow, phase map, timeline hybrid | Stages repeat, branch, or include role-specific views |
| Quantitative data | Bar, line, area, scatter, heatmap, histogram | Users need to filter, compare, or inspect values |
| Mathematical concept | Formula plus graph, manipulable parameters, geometric diagram | Understanding depends on changing variables |
| Scientific or physical mechanism | Labeled illustration, cross-section, animation, simulation | Motion, scale, hidden internals, or transformations matter |
| Business logic | Rule table, state machine, scenario walkthrough, rubric simulator | Users need to test cases or edge conditions |
| Code or API behavior | Sequence diagram, state diagram, minimal runnable example | Control flow, async behavior, caching, or errors are central |
| Story or case study | Scroll narrative, scene sequence, annotated example | Revealing context gradually improves retention |
| Writing, speech, or evaluation language | Annotated specimen, rubric lens, score trace, before/after revision | The learner needs to see how criteria apply to real examples |

## Domain-Native Visual Patterns

Pick a form that feels native to the subject instead of defaulting to cards:

- **Rubrics and evaluation**: show the input artifact, highlight evidence, apply criteria, then reveal the judgment trace.
- **Writing or presentation coaching**: show annotated excerpts, timing, structure, audience reaction, and revision handles.
- **Algorithms**: show state, pointer movement, iterations, and before/after memory or data structures.
- **Systems**: show an object moving through components, permissions, queues, retries, and failure branches.
- **Mathematics**: show a graph, geometric construction, or manipulable parameter before definitions.
- **Scientific mechanisms**: show cross-sections, scale changes, transformations, and hidden internals.
- **Tradeoffs**: show a decision surface, sliders for constraints, and how the recommendation changes.
- **Timelines**: show time as the primary axis, not as a row of prose cards.

## Open Canvas Patterns

Use these patterns to avoid boxy AI layouts:

- **Annotated canvas**: one large visual field with labels attached directly to nodes, paths, specimens, or regions.
- **Floating inspector**: one compact inspector that updates from the selected object; avoid multiple stacked explanation panels.
- **Inline legend**: put color, symbol, and state explanations near the visual, not in a separate card.
- **Scrub bar**: use a timeline or stepper along the visual edge instead of a row of large step cards.
- **Ghost path or overlay**: show previous, current, and next states as overlays on the same object rather than separate boxes.
- **Object-attached controls**: put sliders, toggles, handles, or buttons on or beside the affected element.
- **Direct measurement marks**: show distances, scores, weights, durations, or confidence as ticks, strokes, axis marks, and inline numerals rather than pill labels.
- **Evidence-tethered callouts**: ensure each callout has a leader line, highlight, bracket, underline, or region that visibly attaches it to evidence.

Use boxes only when they represent real domain boundaries such as files, screens, components, documents, rooms, states, or data records. Decorative grouping boxes should be rare.

## Output Recipes

### Compact visual answer

Use for quick explanations inside chat:

1. One-sentence summary.
2. Mermaid or table.
3. Three to five guided bullets.
4. One concrete example.
5. Optional misconception correction.

### Interactive lesson

Use when exploration will teach better than static reading:

1. Define the learning goal and target learner.
2. Choose one dominant explanatory object: specimen, map, trace, simulator, graph, timeline, or workspace.
3. Put that object in the first view with minimal framing copy.
4. Add controls that change the object directly: scrub, select, compare, toggle layers, run an example, adjust parameters, or reveal evidence.
5. Pair each interaction with immediate visual feedback and short annotations.
6. Include examples and misconception callouts near the relevant visual evidence, preferably as attached labels or overlays rather than cards.
7. Verify responsiveness, accessible labels, keyboard usability, readable text, and non-overlapping controls.

### Technical explainer

Use for systems, code, algorithms, APIs, or architecture:

1. Start with the mental model.
2. Show the high-level architecture or data flow.
3. Walk one realistic request, state transition, or example.
4. Expose tradeoffs and failure modes.
5. Include minimal code only where it clarifies the mechanism.

### Educational illustration

Use generated or hand-built visuals only when they reveal something text cannot:

1. Choose the concept, hidden mechanism, or relationship to reveal.
2. Make labels explicit and sparse.
3. Avoid decorative scenes, stock-like atmosphere, or generic images.
4. Prefer before/after, cross-section, exploded view, or layered diagram when useful.

### Artifact inspection

Use when explaining judgment, quality, scoring, language, writing, presentation, or review systems:

1. Put a real or realistic sample artifact at the center.
2. Overlay highlights, tags, lenses, or measurement marks.
3. Show how each criterion reads the artifact.
4. Separate observed evidence from interpretation and final judgment.
5. Let users switch samples or criteria when possible.

## Misconception Handling

Include a misconception callout when the topic has common traps:

- State the mistaken belief plainly.
- Give the corrected model in one or two sentences.
- Show a visual contrast or example when possible.
- Avoid shaming phrasing; focus on the model shift.

## Progressive Disclosure Template

Use this depth order unless the user asks for a different format:

1. Summary: the core idea in one sentence.
2. Map: high-level diagram or visual overview.
3. Walkthrough: steps, phases, or relationships.
4. Examples: real-world, practical, and technical examples as relevant.
5. Details: implementation, formulas, references, edge cases.

## Slop Check

Revise before finalizing if any of these are true:

- The screen is mostly headline, paragraph, and cards.
- The layout has panels inside panels or a large visual trapped inside a bordered card.
- A right sidebar contains several explanation cards that could be direct annotations.
- Most controls and labels are rounded rectangles with text inside.
- Callouts float in empty space or point vaguely near the target.
- Values that should be spatial or quantitative are shown as detached badges.
- The visual metaphor is unrelated to the user's domain.
- Interactions only change text panels.
- A diagram node or card repeats prose that could have been a label.
- The result would look plausible for almost any topic after swapping the words.
