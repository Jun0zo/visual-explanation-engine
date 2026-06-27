# Visual Explanation Engine

![Visual Explanation Engine hero](docs/assets/hero.png)

**Visual Explanation Engine**은 어떤 설명 요청이든 가장 이해하기 쉬운 학습 경험으로 바꾸도록 Codex를 안내하는 skill입니다. 텍스트가 가장 빠르면 텍스트로, 구조가 중요하면 다이어그램으로, 시각 자료가 이해를 돕는다면 실제 이미지로, 탐색이 필요한 개념이면 인터랙티브 UI로 설명하게 만듭니다.

[English](README.md) | [한국어](README.ko.md) | [日本語](docs/i18n/README.ja.md) | [简体中文](docs/i18n/README.zh-CN.md) | [Español](docs/i18n/README.es.md)

> 목표는 HTML 생성이 아닙니다. 목표는 사람이 가장 빠르게 이해하는 것입니다.

## 기능

- 무조건 긴 글이나 HTML로 가지 않고, 설명에 맞는 형식을 먼저 고릅니다.
- 주제가 process, timeline, comparison, hierarchy, architecture, algorithm, decision flow, data flow, lifecycle, math, science, business logic, story 중 무엇인지 분석합니다.
- 요약, 큰 그림, 단계별 설명, 예시, 구현 세부사항, 참고자료 순서로 정보를 점진적으로 공개합니다.
- selectable concept, step control, timeline, diagram, chart, example, misconception callout 같은 탐색형 학습을 유도합니다.
- generated educational image, Mermaid, SVG, table, chart, code example, interactive HTML, frontend app 중 무엇을 써야 하는지 판단하게 합니다.
- npm으로 설치 가능한 Codex skill 패키지로 배포됩니다.

## 작동 프로세스

![Visual Explanation Engine process](docs/assets/process.png)

1. **학습자와 주제 파악**: 대상 수준, 복잡도, 원하는 결과, 흔한 오해를 파악합니다.
2. **설명 구조 추출**: 과정, 타임라인, 비교, 알고리즘, 아키텍처, 시스템, 개념 지도 등 어떤 구조인지 결정합니다.
3. **표현 방식 선택**: 텍스트, 다이어그램, 이미지, 차트, 예시, 애니메이션, 인터랙션 중 필요한 것만 고릅니다.
4. **점진적 공개 설계**: 먼저 방향을 잡아주고, 깊이를 단계별로 엽니다.
5. **결과물 생성**: 답변, 다이어그램, 생성 이미지, 인터랙티브 HTML, 앱 등 가장 잘 가르치는 형태로 만듭니다.
6. **이해 품질 점검**: 장식용 시각 요소, 불필요한 문장, 학습에 도움 되지 않는 인터랙션을 제거합니다.

## 차별성

일반적인 설명 프롬프트는 쉽게 긴 글이나 평범한 웹페이지로 흐릅니다. Visual Explanation Engine은 먼저 이 질문을 하게 만듭니다.

> 이 사람이 이 개념을 진짜 이해하는 가장 빠르고 명확한 방법은 무엇인가?

| 일반 설명 | Visual Explanation Engine |
| --- | --- |
| 바로 글을 쓰기 시작함 | 먼저 학습 구조를 설계함 |
| HTML을 결과물로 착각함 | 이해를 결과물로 둠 |
| 주제마다 비슷한 레이아웃 | 개념 구조에 맞는 형식 선택 |
| 이미지를 장식으로 사용 | 이해를 돕는 경우에만 시각 자료 사용 |
| 모든 정보를 한 번에 쏟음 | 점진적으로 공개 |
| 정의를 나열함 | 개념, 예시, 오해를 연결 |

## 설치

### npm

npm에서 설치합니다.

```bash
npm install -g visual-explanation-engine
```

npm `postinstall` 단계에서는 Codex용 skill을 조용히 설치합니다.

```text
${CODEX_HOME:-~/.codex}/skills/visual-explanation-engine
```

이미 설치되어 있으면 덮어쓰지 않습니다. 갱신하려면:

```bash
visual-explanation-engine install --force
```

대상을 지정하지 않고 installer를 실행하면 화살표로 고르는 multi-select 화면이 뜹니다. 기본값은 Codex global + Claude Code global이 선택된 상태이고, Space로 project-local 대상도 추가할 수 있습니다.

```bash
visual-explanation-engine install
```

자동 설치를 건너뛰려면:

```bash
VEE_SKIP_CODEX_INSTALL=1 npm install -g visual-explanation-engine
```

### npx

```bash
npx --yes visual-explanation-engine install --force
```

### 수동 설치

```bash
cp -R skill/visual-explanation-engine "${CODEX_HOME:-$HOME/.codex}/skills/"
```

## 사용 예시

Codex에서 명시적으로 호출합니다.

```text
Use $visual-explanation-engine to explain how transformers handle attention for a beginner.
```

다른 예시:

```text
Use $visual-explanation-engine to make an interactive lesson for OAuth login flow.
Use $visual-explanation-engine to visualize the difference between TCP and UDP.
Use $visual-explanation-engine to teach gradient descent with diagrams and examples.
Use $visual-explanation-engine to explain our backend architecture to a new engineer.
```

## CLI

```bash
visual-explanation-engine install
visual-explanation-engine install codex
visual-explanation-engine install claude
visual-explanation-engine install all
visual-explanation-engine install --force
visual-explanation-engine doctor
visual-explanation-engine path
```

설치 대상:

| Target | 위치 |
| --- | --- |
| `codex` | `${CODEX_HOME:-~/.codex}/skills` |
| `claude` | `${CLAUDE_HOME:-~/.claude}/skills` |
| `project-codex` | `./.codex/skills` |
| `project-claude` | `./.claude/skills` |
| `all` | 위 대상 전체 |

짧은 alias:

```bash
vee doctor
```

## 포함 파일

```text
skill/visual-explanation-engine/
├── SKILL.md
├── agents/openai.yaml
└── references/modality-playbook.md
```

`modality-playbook.md`는 설명 구조별 추천 형식을 담고 있습니다. flow diagram, timeline, comparison matrix, architecture diagram, algorithm trace, relationship network, decision tree, chart, mathematical visual, scientific illustration, interactive lesson 같은 선택지를 안내합니다.
