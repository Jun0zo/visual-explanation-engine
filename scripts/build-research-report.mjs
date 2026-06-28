#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const runsDir = path.join(root, "evals", "runs");
const outputDir = path.join(root, "output", "pdf");
const htmlPath = path.join(outputDir, "visual-explanation-research-report.html");
const pdfPath = path.join(outputDir, "visual-explanation-research-report.pdf");

const taskMeta = {
  "dijkstra-lab": {
    title: "Dijkstra Lab",
    domain: "Algorithm",
    lesson: "그래프 자체가 화면이 되면 거리 확정, 후보, 경로 변화가 카드 설명 없이 읽힌다.",
  },
  "rubric-inspection": {
    title: "Rubric Inspection",
    domain: "Evaluation Language",
    lesson: "평가 언어는 추상 기준보다 실제 산출물 위 evidence lens로 보여줄 때 강하다.",
  },
  "oauth-request-path": {
    title: "OAuth Request Path",
    domain: "System/API Flow",
    lesson: "보안 개념은 request path 위의 state, code, token 위치로 붙을 때 이해가 빠르다.",
  },
  "gradient-descent-surface": {
    title: "Gradient Descent Surface",
    domain: "Math",
    lesson: "정의 카드보다 곡선, 기울기, step, 다음 점이 같은 그래프에서 움직이는 편이 낫다.",
  },
  "react-render-debugging": {
    title: "React Render Debugging",
    domain: "Code Debugging",
    lesson: "코드 라인, runtime state, output, trace를 한 작업면에 연결해야 lifecycle 카드가 필요 없어진다.",
  },
  "photosynthesis-mechanism": {
    title: "Photosynthesis Mechanism",
    domain: "Science",
    lesson: "숨은 구조와 matter/energy flow를 직접 붙이면 정의 암기가 아니라 메커니즘으로 읽힌다.",
  },
  "incident-timeline": {
    title: "Incident Timeline",
    domain: "Timeline/Causality",
    lesson: "사건 카드를 늘어놓는 대신 time axis, duration, overlap, metric traces가 원인과 MTTR을 보여준다.",
  },
  "architecture-tradeoff": {
    title: "Architecture Tradeoff",
    domain: "Architecture",
    lesson: "장단점 카드보다 constraint surface 위에서 workload point가 움직일 때 추천 변화가 보인다.",
  },
  "retention-analysis": {
    title: "Retention Analysis",
    domain: "Data/Analytics",
    lesson: "KPI 타일보다 cohort grid, baseline, selected segment, claim annotation이 같은 데이터 표면에 있어야 한다.",
  },
  "dependency-graph": {
    title: "Dependency Graph",
    domain: "Library-backed Network",
    lesson: "복잡한 dependency network는 손으로 배치한 SVG보다 Cytoscape 같은 그래프 라이브러리가 layout, selection, neighbor/path highlight를 맡을 때 실제로 탐색 가능하다.",
  },
};

const developmentStages = [
  ["8d64f81", "Research harness", "스크린샷, DOM metric, interaction diff를 같은 run report로 수집."],
  ["7543b86", "Anti-box pressure", "box area, nested cards, rounded labels, collision metric으로 AI스러운 카드 UI를 압박."],
  ["1c201e6", "Code trace benchmark", "React render 설명을 lifecycle 카드가 아니라 code/runtime/output trace로 전환."],
  ["bfbc395", "Science mechanism benchmark", "정의 카드 대신 chloroplast cross-section과 energy/matter flow를 검증."],
  ["362a8a6", "Timeline causality", "incident postmortem을 event cards가 아닌 scaled timeline으로 비교."],
  ["9427d0b", "Architecture tradeoff", "pros/cons 카드 대신 constraint decision surface를 추가."],
  ["962c26a", "Data analytics", "KPI dashboard 대신 cohort heatmap과 retention curve lens를 추가."],
];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function latestReportPath() {
  const explicitRun = process.argv.find((arg) => arg.startsWith("--run="))?.slice("--run=".length);
  if (explicitRun) return path.join(runsDir, explicitRun, "report.json");

  const entries = await fs.readdir(runsDir, { withFileTypes: true });
  const reportPaths = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => path.join(runsDir, entry.name, "report.json"));
  const existing = [];
  for (const reportPath of reportPaths) {
    try {
      const stat = await fs.stat(reportPath);
      existing.push({ reportPath, mtimeMs: stat.mtimeMs });
    } catch {
      // Skip incomplete runs.
    }
  }
  existing.sort((a, b) => a.mtimeMs - b.mtimeMs);
  if (!existing.length) throw new Error("No evals/runs/*/report.json files found.");
  return existing.at(-1).reportPath;
}

function screenshotUrl(runPath, result, after = false) {
  const base = path.dirname(runPath);
  const screenshot = after
    ? result.screenshot.replace(/\.png$/, "-after.png")
    : result.screenshot;
  return pathToFileURL(path.join(base, screenshot)).href;
}

function scoreBadge(result) {
  return `<span class="score">${result.scores.overall}</span>`;
}

function metricLine(result) {
  const m = result.metrics;
  return [
    `cards ${m.cardLikeCount}`,
    `box ${m.boxAreaRatio.toFixed(2)}`,
    `labels ${m.labelCollisionCount}`,
    `lib ${m.libraryVisualCount ?? 0}`,
    `hand ${m.handRolledComplexVisualCount ?? 0}`,
    `libscore ${result.scores.libraryDiscipline ?? 100}`,
    `state ${m.visualStateChangeCount}`,
  ].join(" · ");
}

function groupPairs(results) {
  const groups = new Map();
  for (const result of results) {
    if (!groups.has(result.task)) groups.set(result.task, {});
    groups.get(result.task)[result.variant] = result;
  }
  return [...groups.entries()]
    .map(([task, pair]) => ({ task, ...pair }))
    .filter((pair) => pair.baseline && pair.candidate);
}

function renderScoreTable(pairs) {
  return pairs.map((pair) => {
    const meta = taskMeta[pair.task] || { title: pair.task, domain: pair.task, lesson: "" };
    const delta = pair.candidate.scores.overall - pair.baseline.scores.overall;
    return `
      <tr>
        <td><strong>${escapeHtml(meta.title)}</strong><br><span>${escapeHtml(meta.domain)}</span></td>
        <td>${pair.baseline.scores.overall}</td>
        <td>${pair.candidate.scores.overall}</td>
        <td class="delta">+${delta}</td>
      </tr>
    `;
  }).join("");
}

function renderBenchmarkPage(runPath, pair, index) {
  const meta = taskMeta[pair.task] || { title: pair.task, domain: pair.task, lesson: "" };
  const delta = pair.candidate.scores.overall - pair.baseline.scores.overall;
  return `
    <section class="page benchmark">
      <header class="page-head">
        <div>
          <p class="eyebrow">Benchmark ${index + 1} · ${escapeHtml(meta.domain)}</p>
          <h2>${escapeHtml(meta.title)}</h2>
        </div>
        <div class="delta-card">+${delta}<span>overall</span></div>
      </header>
      <div class="shot-grid">
        <figure>
          <figcaption>Baseline ${scoreBadge(pair.baseline)}</figcaption>
          <img src="${screenshotUrl(runPath, pair.baseline)}" alt="${escapeHtml(pair.baseline.id)}">
          <p>${escapeHtml(metricLine(pair.baseline))}</p>
        </figure>
        <figure>
          <figcaption>Candidate ${scoreBadge(pair.candidate)}</figcaption>
          <img src="${screenshotUrl(runPath, pair.candidate)}" alt="${escapeHtml(pair.candidate.id)}">
          <p>${escapeHtml(metricLine(pair.candidate))}</p>
        </figure>
      </div>
      <div class="lesson">
        <strong>What changed</strong>
        <p>${escapeHtml(meta.lesson)}</p>
        <p class="notes">${escapeHtml(pair.candidate.notes)}</p>
      </div>
    </section>
  `;
}

function renderInteractionPage(runPath, pairs) {
  const selected = ["incident-timeline", "architecture-tradeoff", "retention-analysis", "gradient-descent-surface"]
    .map((task) => pairs.find((pair) => pair.task === task))
    .filter(Boolean);
  return `
    <section class="page interactions">
      <header class="page-head">
        <div>
          <p class="eyebrow">Interaction Check</p>
          <h2>버튼이 문장만 바꾸는지, 시각 객체를 바꾸는지 확인</h2>
        </div>
      </header>
      <div class="interaction-grid">
        ${selected.map((pair) => {
          const meta = taskMeta[pair.task];
          return `
            <figure>
              <figcaption>${escapeHtml(meta.title)} · after state</figcaption>
              <img src="${screenshotUrl(runPath, pair.candidate, true)}" alt="${escapeHtml(pair.candidate.id)} after">
            </figure>
          `;
        }).join("")}
      </div>
      <p class="footer-note">좋은 interaction은 설명 패널만 교체하지 않고, graph, timeline, decision surface, cohort grid 같은 primary object의 상태를 바꾼다.</p>
    </section>
  `;
}

function renderHtml(runPath, report) {
  const pairs = groupPairs(report.results);
  const baselineAvg = Math.round(pairs.reduce((sum, pair) => sum + pair.baseline.scores.overall, 0) / pairs.length);
  const candidateAvg = Math.round(pairs.reduce((sum, pair) => sum + pair.candidate.scores.overall, 0) / pairs.length);
  const avgDelta = candidateAvg - baselineAvg;
  const generated = new Date(report.generatedAt).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <title>Visual Explanation Engine Research Report</title>
  <style>
    @page { size: A4 landscape; margin: 12mm; }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      color: #1f2924;
      background: #fbfcf8;
      font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      min-height: 186mm;
      page-break-after: always;
      position: relative;
      padding: 6mm 4mm;
    }
    .page:last-child { page-break-after: auto; }
    .cover {
      display: grid;
      grid-template-columns: 1.05fr .95fr;
      gap: 18mm;
      align-items: center;
      background:
        linear-gradient(#e5eee8 1px, transparent 1px),
        linear-gradient(90deg, #e5eee8 1px, transparent 1px);
      background-size: 10mm 10mm;
    }
    h1 { margin: 0; font-size: 44px; line-height: 1.08; letter-spacing: 0; }
    h2 { margin: 0; font-size: 28px; line-height: 1.12; letter-spacing: 0; }
    h3 { margin: 0 0 8px; font-size: 18px; }
    p { margin: 0; font-size: 12.5px; line-height: 1.48; color: #5f6f67; }
    .eyebrow {
      margin-bottom: 8px;
      color: #10866f;
      font-size: 12px;
      font-weight: 850;
      text-transform: uppercase;
      letter-spacing: .04em;
    }
    .summary {
      margin-top: 18px;
      max-width: 620px;
      color: #42514a;
      font-size: 17px;
      line-height: 1.55;
    }
    .run-meta {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 26px;
    }
    .run-meta div, .delta-card, .metric-card, .lesson {
      border: 1px solid #d4dfd8;
      background: rgba(255,255,255,.76);
      border-radius: 10px;
      padding: 12px;
    }
    .run-meta strong, .metric-card strong { display: block; font-size: 24px; }
    .cover-visual {
      border-left: 5px solid #10866f;
      padding-left: 18px;
    }
    .cover-visual .big {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 18px;
    }
    .metric-card strong { font-size: 34px; line-height: 1; }
    .metric-card span { color: #68756e; font-weight: 750; }
    .page-head {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 14px;
    }
    .delta-card {
      min-width: 90px;
      text-align: center;
      color: #10866f;
      font-size: 32px;
      font-weight: 950;
    }
    .delta-card span { display: block; margin-top: 3px; color: #68756e; font-size: 10px; }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; font-size: 13px; }
    th, td { border-bottom: 1px solid #d8e1dc; padding: 9px 8px; text-align: left; }
    th { color: #68756e; font-size: 11px; text-transform: uppercase; letter-spacing: .04em; }
    td:nth-child(n+2), th:nth-child(n+2) { text-align: right; }
    td span { color: #68756e; font-size: 11px; }
    .delta { color: #10866f; font-weight: 900; }
    .process-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      gap: 8px;
      margin-top: 16px;
    }
    .stage {
      min-height: 90px;
      border-top: 4px solid #10866f;
      background: rgba(255,255,255,.72);
      padding: 10px;
    }
    .stage code { color: #68756e; font-size: 10px; }
    .stage strong { display: block; margin: 5px 0; font-size: 13px; }
    .stage p { font-size: 10.5px; }
    .rules {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-top: 18px;
    }
    .rule {
      border-left: 4px solid #2c69d8;
      background: rgba(255,255,255,.74);
      padding: 12px;
    }
    .metric-notes {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
      margin-top: 12px;
    }
    .metric-note {
      border-left: 3px solid #2c69d8;
      background: rgba(255,255,255,.74);
      padding: 8px 10px;
    }
    .metric-note h3 {
      margin: 0 0 4px;
      font-size: 14px;
    }
    .metric-note p {
      font-size: 10.5px;
      line-height: 1.35;
    }
    .shot-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    figure {
      margin: 0;
      min-width: 0;
    }
    figcaption {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 12px;
      font-weight: 900;
    }
    .score {
      display: inline-grid;
      place-items: center;
      min-width: 34px;
      height: 26px;
      border-radius: 999px;
      background: #1f2924;
      color: #fff;
      font-size: 13px;
    }
    img {
      display: block;
      width: 100%;
      height: 88mm;
      object-fit: contain;
      object-position: center center;
      border: 1px solid #d5dfd9;
      border-radius: 8px;
      background: #fff;
    }
    figure p { margin-top: 5px; font-size: 10.5px; }
    .lesson {
      margin-top: 10px;
      display: grid;
      grid-template-columns: 130px 1fr 1fr;
      gap: 12px;
      align-items: start;
    }
    .lesson strong { font-size: 13px; }
    .lesson p { color: #42514a; }
    .lesson .notes { color: #68756e; }
    .interaction-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
    }
    .interaction-grid img { height: 62mm; }
    .footer-note {
      margin-top: 8px;
      padding: 10px 12px;
      background: rgba(16,134,111,.08);
      color: #1f2924;
      font-weight: 750;
    }
  </style>
</head>
<body>
  <section class="page cover">
    <div>
      <p class="eyebrow">Visual Explanation Engine</p>
      <h1>AI스러운 카드 설명을 줄이기 위한 연구 보고서</h1>
      <p class="summary">여러 설명 fixture를 만들고, 브라우저 캡처와 heuristic metric으로 비교하면서 skill 지침을 반복 개선했다. 핵심 목표는 "박스 안에 박스"와 detached prose card를 줄이고, 주제의 native surface가 이해를 직접 운반하게 만드는 것이다.</p>
      <div class="run-meta">
        <div><strong>${pairs.length}</strong><p>benchmark pairs</p></div>
        <div><strong>${baselineAvg} -> ${candidateAvg}</strong><p>average overall</p></div>
        <div><strong>+${avgDelta}</strong><p>average lift</p></div>
      </div>
      <p class="summary">Run: ${escapeHtml(report.runId)} · Generated: ${escapeHtml(generated)}</p>
    </div>
    <div class="cover-visual">
      <p class="eyebrow">Research Loop</p>
      <h2>Generate examples, capture screenshots, score regressions, inspect visually, then tighten the skill.</h2>
      <div class="big">
        <div class="metric-card"><strong>box</strong><span>container pressure</span></div>
        <div class="metric-card"><strong>visual</strong><span>surface dominance</span></div>
        <div class="metric-card"><strong>labels</strong><span>collision checks</span></div>
        <div class="metric-card"><strong>state</strong><span>interaction change</span></div>
      </div>
    </div>
  </section>

  <section class="page">
    <header class="page-head">
      <div>
        <p class="eyebrow">Middle Process</p>
        <h2>개선은 한 번의 디자인이 아니라 압력 루프였다</h2>
      </div>
    </header>
    <div class="process-grid">
      ${developmentStages.map(([hash, title, text]) => `
        <div class="stage">
          <code>${hash}</code>
          <strong>${escapeHtml(title)}</strong>
          <p>${escapeHtml(text)}</p>
        </div>
      `).join("")}
    </div>
    <div class="rules">
      <div class="rule"><h3>1. Primary object first</h3><p>그래프, 코드, 타임라인, cohort grid, decision surface가 화면을 이끌고, 텍스트는 annotation으로 붙는다.</p></div>
      <div class="rule"><h3>2. Cards are suspect</h3><p>카드는 진짜 domain object일 때만 쓴다. 설명 카드가 많아질수록 box discipline이 떨어진다.</p></div>
      <div class="rule"><h3>3. Interaction must change the object</h3><p>버튼은 paragraph를 바꾸는 장식이 아니라 selected state, path, segment, point, surface를 바꿔야 한다.</p></div>
      <div class="rule"><h3>4. Labels must not cover evidence</h3><p>하네스는 label collision을 잡고, 시각 QA는 실제 screenshot에서 겹침을 다시 확인한다.</p></div>
      <div class="rule"><h3>5. Native surface beats metaphor</h3><p>알고리즘은 그래프, 평가는 산출물, 과학은 구조, 데이터는 데이터 표면으로 설명한다.</p></div>
      <div class="rule"><h3>6. Metrics guide, eyes decide</h3><p>점수는 압력 장치이고, 최종 판단은 캡처를 보며 과밀함과 이해 가능성을 확인한다.</p></div>
    </div>
  </section>

  <section class="page">
    <header class="page-head">
      <div>
        <p class="eyebrow">Quantitative Summary</p>
        <h2>카드형 baseline 대비 visual-first candidate가 안정적으로 상승</h2>
      </div>
    </header>
    <table>
      <thead><tr><th>Task</th><th>Baseline</th><th>Candidate</th><th>Delta</th></tr></thead>
      <tbody>${renderScoreTable(pairs)}</tbody>
    </table>
  </section>

  ${pairs.map((pair, index) => renderBenchmarkPage(runPath, pair, index)).join("")}
  ${renderInteractionPage(runPath, pairs)}

  <section class="page">
    <header class="page-head">
      <div>
        <p class="eyebrow">Conclusion</p>
        <h2>현재까지의 결론과 다음 압력 지점</h2>
      </div>
    </header>
    <div class="rules">
      <div class="rule"><h3>결론</h3><p>좋은 설명은 예쁜 카드가 아니라 subject-native surface 위에서 관계, 상태, 근거, 변화가 직접 보이는 것이다.</p></div>
      <div class="rule"><h3>현재 강점</h3><p>알고리즘, API flow, code trace, science mechanism, timeline, architecture, analytics, library-backed network까지 anti-box 기준이 넓어졌다.</p></div>
      <div class="rule"><h3>남은 압력</h3><p>large hand-authored SVG debt, chart brushing, timeline zoom, maps, code editors, rich tables, 3D/physics, statistical uncertainty, narrative slide output을 추가해야 한다.</p></div>
    </div>
  </section>
</body>
</html>`;
}

async function main() {
  const runPath = await latestReportPath();
  const report = JSON.parse(await fs.readFile(runPath, "utf8"));
  await fs.mkdir(outputDir, { recursive: true });
  const html = renderHtml(runPath, report);
  await fs.writeFile(htmlPath, html, "utf8");

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1100 }, deviceScaleFactor: 1 });
  await page.goto(pathToFileURL(htmlPath).href, { waitUntil: "networkidle" });
  await page.pdf({
    path: pdfPath,
    format: "A4",
    landscape: true,
    printBackground: true,
    margin: { top: "12mm", right: "12mm", bottom: "12mm", left: "12mm" },
  });
  await browser.close();

  console.log(`HTML: ${htmlPath}`);
  console.log(`PDF: ${pdfPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
