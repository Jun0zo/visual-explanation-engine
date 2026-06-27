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
| Business logic | Rule table, state machine, scenario walkthrough | Users need to test cases or edge conditions |
| Code or API behavior | Sequence diagram, state diagram, minimal runnable example | Control flow, async behavior, caching, or errors are central |
| Story or case study | Scroll narrative, scene sequence, annotated example | Revealing context gradually improves retention |

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
2. Create a first-view overview with a single dominant visual.
3. Add step navigation, selectable concepts, or parameter controls.
4. Pair each interaction with immediate visual feedback.
5. Include examples and misconception callouts near the relevant concepts.
6. Verify responsiveness, accessible labels, keyboard usability, and readable text.

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
