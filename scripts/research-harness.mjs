#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { PNG } from "pngjs";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const fixturesDir = path.join(root, "evals", "fixtures");
const runsDir = path.join(root, "evals", "runs");
const viewport = { width: 1440, height: 960 };

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, "-");
}

function clamp(value, min = 0, max = 100) {
  return Math.max(min, Math.min(max, value));
}

function tokenize(text) {
  const latin = text.match(/[A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*/g) || [];
  const hangulChunks = text.match(/[가-힣]+/g) || [];
  const cjk = text.match(/[\u3400-\u9fff]/g) || [];
  return latin.length + hangulChunks.length + cjk.length;
}

function pngDiffRatio(beforeBuffer, afterBuffer) {
  const before = PNG.sync.read(beforeBuffer);
  const after = PNG.sync.read(afterBuffer);
  const width = Math.min(before.width, after.width);
  const height = Math.min(before.height, after.height);
  let changed = 0;
  let total = 0;
  for (let y = 0; y < height; y += 2) {
    for (let x = 0; x < width; x += 2) {
      const index = (before.width * y + x) << 2;
      const other = (after.width * y + x) << 2;
      const delta =
        Math.abs(before.data[index] - after.data[other]) +
        Math.abs(before.data[index + 1] - after.data[other + 1]) +
        Math.abs(before.data[index + 2] - after.data[other + 2]);
      if (delta > 36) changed++;
      total++;
    }
  }
  return total ? changed / total : 0;
}

function scoreMetrics(metrics) {
  const visualRatio = clamp(metrics.visualAreaRatio * 100);
  const textEconomy = clamp(100 - metrics.firstViewportWordCount * 0.55);
  const boxDiscipline = clamp(
    100 -
      metrics.cardLikeCount * 3.5 -
      metrics.nestedBoxCount * 9 -
      metrics.sideCardCount * 11 -
      metrics.boxAreaRatio * 28 -
      metrics.framedVisualCount * 12
  );
  const annotation = clamp(metrics.annotationCount * 13 + metrics.attachedAnnotationRatio * 35);
  const interaction = clamp(metrics.controlCount * 5 + metrics.interactionPixelDiffRatio * 800 + metrics.visualStateChangeCount * 24);
  const antiSlop = clamp(
    100 -
      metrics.heroPenalty -
      metrics.longParagraphCount * 8 -
      metrics.roundedTextControlCount * 2.5 -
      metrics.roundedLabelCount * 1.8 -
      metrics.labelCollisionCount * 5
  );
  const overall = Math.round(
    visualRatio * 0.2 +
    textEconomy * 0.18 +
    boxDiscipline * 0.22 +
    annotation * 0.16 +
    interaction * 0.14 +
    antiSlop * 0.1
  );
  return {
    overall,
    visualRatio: Math.round(visualRatio),
    textEconomy: Math.round(textEconomy),
    boxDiscipline: Math.round(boxDiscipline),
    annotation: Math.round(annotation),
    interaction: Math.round(interaction),
    antiSlop: Math.round(antiSlop),
  };
}

async function collectStateSnapshot(page) {
  return page.evaluate(() => {
    return [...document.querySelectorAll("[data-state-target]")].map((el, index) => ({
      index,
      tag: el.tagName,
      text: (el.textContent || "").replace(/\s+/g, " ").trim(),
      className: typeof el.className === "string" ? el.className : String(el.className?.baseVal || ""),
      style: el.getAttribute("style") || "",
      aria: el.getAttribute("aria-label") || "",
    }));
  });
}

function stateDiffCount(before, after) {
  const count = Math.max(before.length, after.length);
  let changed = 0;
  for (let index = 0; index < count; index++) {
    if (JSON.stringify(before[index] || null) !== JSON.stringify(after[index] || null)) changed++;
  }
  return changed;
}

async function collectDomMetrics(page) {
  return page.evaluate(() => {
    const viewportArea = window.innerWidth * window.innerHeight;
    const all = [...document.body.querySelectorAll("*")];
    const normalize = (text) => (text || "").replace(/\s+/g, " ").trim();
    const bodyText = normalize(document.body.innerText);

    function rectOf(el) {
      const rect = el.getBoundingClientRect();
      return {
        top: rect.top,
        left: rect.left,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        area: Math.max(0, rect.width) * Math.max(0, rect.height),
      };
    }

    function clippedArea(rect) {
      const width = Math.max(0, Math.min(rect.right, window.innerWidth) - Math.max(rect.left, 0));
      const height = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
      return width * height;
    }

    function overlapArea(a, b) {
      const width = Math.max(0, Math.min(a.right, b.right) - Math.max(a.left, b.left));
      const height = Math.max(0, Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top));
      return width * height;
    }

    function isVisible(el) {
      const style = getComputedStyle(el);
      const rect = rectOf(el);
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity) > 0.03 && rect.area > 8;
    }

    function isBoxLike(el) {
      if (!isVisible(el)) return false;
      if (el.matches("[data-domain-box], [data-light-inspector], [data-floating-toolbar]")) return false;
      const style = getComputedStyle(el);
      const rect = rectOf(el);
      if (rect.area < 1800) return false;
      const borderWidth =
        Number.parseFloat(style.borderTopWidth) +
        Number.parseFloat(style.borderRightWidth) +
        Number.parseFloat(style.borderBottomWidth) +
        Number.parseFloat(style.borderLeftWidth);
      const radius = Math.max(
        Number.parseFloat(style.borderTopLeftRadius),
        Number.parseFloat(style.borderTopRightRadius),
        Number.parseFloat(style.borderBottomRightRadius),
        Number.parseFloat(style.borderBottomLeftRadius)
      );
      const hasShadow = style.boxShadow && style.boxShadow !== "none";
      const background = style.backgroundColor;
      const hasBg = background && !background.includes("0, 0, 0, 0") && background !== "rgba(0, 0, 0, 0)";
      return (borderWidth > 0 || hasShadow || radius >= 8) && hasBg;
    }

    const visible = all.filter(isVisible);
    const boxLike = visible.filter(isBoxLike);
    const nestedBoxCount = boxLike.filter((el) => boxLike.some((other) => other !== el && other.contains(el))).length;
    const sideCardCount = document.querySelectorAll("[data-side-card]").length;
    const visualEls = [...document.querySelectorAll("svg, canvas, [data-visual], .visual-object")].filter(isVisible);
    const boxAreaRatio = Math.min(1.5, boxLike.reduce((sum, el) => sum + clippedArea(rectOf(el)), 0) / viewportArea);
    const framedVisualCount = boxLike.filter((el) => {
      const rect = rectOf(el);
      return rect.area > viewportArea * 0.08 && visualEls.some((visual) => visual !== el && el.contains(visual));
    }).length;
    const visualArea = Math.min(
      viewportArea,
      visualEls.reduce((sum, el) => sum + Math.min(rectOf(el).area, viewportArea), 0)
    );
    const controls = visible.filter((el) => ["BUTTON", "SELECT", "INPUT", "TEXTAREA"].includes(el.tagName) || el.getAttribute("role") === "button" || el.matches("[data-control]"));
    const annotations = [...document.querySelectorAll("[data-annotation], .annotation, .callout")].filter(isVisible);
    const visualRects = visualEls.map(rectOf);
    const attached = annotations.filter((el) => {
      const rect = rectOf(el);
      return visualRects.some((visual) => {
        const dx = Math.max(visual.left - rect.right, rect.left - visual.right, 0);
        const dy = Math.max(visual.top - rect.bottom, rect.top - visual.bottom, 0);
        return dx + dy < 120;
      });
    });
    const firstViewportText = normalize(
      visible
        .filter((el) => {
          const rect = rectOf(el);
          return rect.top >= 0 && rect.top < window.innerHeight && ["P", "H1", "H2", "H3", "LI", "SPAN", "BUTTON", "LABEL", "TEXT"].includes(el.tagName);
        })
        .map((el) => el.innerText || el.textContent || "")
        .join(" ")
    );
    const h1 = document.querySelector("h1");
    const h1Style = h1 ? getComputedStyle(h1) : null;
    const h1Rect = h1 ? rectOf(h1) : null;
    const heroPenalty = h1 && h1Rect && h1Rect.top < window.innerHeight * 0.25 && Number.parseFloat(h1Style.fontSize) >= 48 ? 22 : 0;
    const longParagraphCount = [...document.querySelectorAll("p")].filter((p) => normalize(p.innerText).length > 140).length;
    const roundedTextControlCount = controls.filter((el) => {
      const style = getComputedStyle(el);
      const radius = Math.max(
        Number.parseFloat(style.borderTopLeftRadius),
        Number.parseFloat(style.borderTopRightRadius),
        Number.parseFloat(style.borderBottomRightRadius),
        Number.parseFloat(style.borderBottomLeftRadius)
      );
      return radius >= 8 && normalize(el.innerText || el.value || "").length > 0;
    }).length;
    const roundedHtmlLabelCount = visible.filter((el) => {
      if (controls.includes(el) || el.closest("[data-floating-toolbar]")) return false;
      const text = normalize(el.innerText || el.textContent || "");
      if (!text || text.length > 28) return false;
      const style = getComputedStyle(el);
      const radius = Math.max(
        Number.parseFloat(style.borderTopLeftRadius),
        Number.parseFloat(style.borderTopRightRadius),
        Number.parseFloat(style.borderBottomRightRadius),
        Number.parseFloat(style.borderBottomLeftRadius)
      );
      return radius >= 8;
    }).length;
    const roundedSvgLabelCount = [...document.querySelectorAll("svg rect[rx], svg rect[ry]")].filter(isVisible).filter((el) => {
      if (el.closest("[data-domain-box]")) return false;
      const rect = rectOf(el);
      if (rect.area < 60 || rect.area > 5200) return false;
      return true;
    }).length;
    const labelEls = [
      ...document.querySelectorAll("[data-annotation], .annotation, .callout, [data-label], svg text.label, svg text.small, svg text.weight, svg text.dist"),
    ].filter(isVisible).filter((el) => !el.closest("[data-floating-toolbar]"));
    const labelRects = labelEls.map((el) => rectOf(el)).filter((rect) => rect.area > 18);
    let labelCollisionCount = 0;
    for (let index = 0; index < labelRects.length; index++) {
      for (let otherIndex = index + 1; otherIndex < labelRects.length; otherIndex++) {
        const area = overlapArea(labelRects[index], labelRects[otherIndex]);
        const threshold = Math.max(24, Math.min(labelRects[index].area, labelRects[otherIndex].area) * 0.18);
        if (area > threshold) labelCollisionCount++;
      }
    }

    return {
      bodyText,
      firstViewportText,
      cardLikeCount: boxLike.length,
      nestedBoxCount,
      sideCardCount,
      boxAreaRatio,
      framedVisualCount,
      visualAreaRatio: visualArea / viewportArea,
      controlCount: controls.length,
      annotationCount: annotations.length,
      attachedAnnotationRatio: annotations.length ? attached.length / annotations.length : 0,
      heroPenalty,
      longParagraphCount,
      roundedTextControlCount,
      roundedLabelCount: roundedHtmlLabelCount + roundedSvgLabelCount,
      labelCollisionCount,
    };
  });
}

async function evaluateFixture(browser, fixture, runDir) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
  const filePath = path.join(fixturesDir, fixture.file);
  await page.goto(pathToFileURL(filePath).href);
  await page.waitForLoadState("networkidle");
  const before = await page.screenshot({ fullPage: true });
  const beforeState = await collectStateSnapshot(page);
  const screenshotName = `${fixture.id}.png`;
  await fs.writeFile(path.join(runDir, "screenshots", screenshotName), before);
  const dom = await collectDomMetrics(page);
  let interactionPixelDiffRatio = 0;
  let visualStateChangeCount = 0;
  const action = page.locator("[data-eval-action]").first();
  if (await action.count()) {
    await action.click();
    await page.waitForTimeout(250);
    const after = await page.screenshot({ fullPage: true });
    const afterState = await collectStateSnapshot(page);
    await fs.writeFile(path.join(runDir, "screenshots", `${fixture.id}-after.png`), after);
    interactionPixelDiffRatio = pngDiffRatio(before, after);
    visualStateChangeCount = stateDiffCount(beforeState, afterState);
  }
  await page.close();
  const metrics = {
    wordCount: tokenize(dom.bodyText),
    firstViewportWordCount: tokenize(dom.firstViewportText),
    cardLikeCount: dom.cardLikeCount,
    nestedBoxCount: dom.nestedBoxCount,
    sideCardCount: dom.sideCardCount,
    boxAreaRatio: Number(dom.boxAreaRatio.toFixed(3)),
    framedVisualCount: dom.framedVisualCount,
    visualAreaRatio: Number(dom.visualAreaRatio.toFixed(3)),
    controlCount: dom.controlCount,
    annotationCount: dom.annotationCount,
    attachedAnnotationRatio: Number(dom.attachedAnnotationRatio.toFixed(3)),
    interactionPixelDiffRatio: Number(interactionPixelDiffRatio.toFixed(4)),
    visualStateChangeCount,
    heroPenalty: dom.heroPenalty,
    longParagraphCount: dom.longParagraphCount,
    roundedTextControlCount: dom.roundedTextControlCount,
    roundedLabelCount: dom.roundedLabelCount,
    labelCollisionCount: dom.labelCollisionCount,
  };
  return {
    ...fixture,
    screenshot: `screenshots/${screenshotName}`,
    metrics,
    scores: scoreMetrics(metrics),
  };
}

function summarizeFindings(results) {
  const findings = [];
  const byTask = new Map();
  for (const result of results) {
    if (!byTask.has(result.task)) byTask.set(result.task, []);
    byTask.get(result.task).push(result);
  }
  for (const [task, taskResults] of byTask) {
    const baseline = taskResults.find((item) => item.variant === "baseline");
    const candidate = taskResults.find((item) => item.variant === "candidate");
    if (!baseline || !candidate) continue;
    findings.push({
      task,
      overallDelta: candidate.scores.overall - baseline.scores.overall,
      visualRatioDelta: candidate.scores.visualRatio - baseline.scores.visualRatio,
      boxDisciplineDelta: candidate.scores.boxDiscipline - baseline.scores.boxDiscipline,
      annotationDelta: candidate.scores.annotation - baseline.scores.annotation,
      interactionDelta: candidate.scores.interaction - baseline.scores.interaction,
      notes: [
        candidate.metrics.cardLikeCount < baseline.metrics.cardLikeCount ? "candidate reduced card-like containers" : "candidate still has many card-like containers",
        candidate.metrics.framedVisualCount < baseline.metrics.framedVisualCount ? "candidate lets the primary visual escape decorative frames" : "candidate still frames the primary visual too heavily",
        candidate.metrics.roundedLabelCount < baseline.metrics.roundedLabelCount ? "candidate uses fewer pill-like labels" : "candidate still leans on rounded labels",
        candidate.metrics.labelCollisionCount <= baseline.metrics.labelCollisionCount ? "labels collide less often" : "labels still collide",
        candidate.metrics.attachedAnnotationRatio >= baseline.metrics.attachedAnnotationRatio ? "annotations are better attached to evidence" : "annotations drift away from evidence",
        candidate.metrics.visualStateChangeCount > baseline.metrics.visualStateChangeCount ? "interaction changes marked visual state" : "interaction lacks marked visual state changes",
      ],
    });
  }
  return findings;
}

function weakestScoreName(scores) {
  const entries = Object.entries(scores).filter(([name]) => name !== "overall");
  entries.sort((a, b) => a[1] - b[1]);
  return entries[0]?.[0] || "overall";
}

function reportMarkdown(runId, tasks, results, findings) {
  const lines = [];
  lines.push("# Visual Explanation Research Run", "");
  lines.push(`Run: \`${runId}\``);
  lines.push(`Viewport: \`${viewport.width}x${viewport.height}\``, "");
  lines.push("## Tasks");
  for (const task of tasks) {
    lines.push("", `### ${task.id}`);
    lines.push(`- Domain: ${task.domain}`);
    lines.push(`- Prompt: ${task.prompt}`);
    lines.push(`- Success: ${task.successCriteria.join("; ")}`);
  }
  lines.push("", "## Scores", "");
  lines.push("| Fixture | Variant | Overall | Visual | Text Economy | Box Discipline | Annotation | Interaction | Anti-Slop | Screenshot |");
  lines.push("| --- | --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | --- |");
  for (const result of results) {
    lines.push(`| ${result.id} | ${result.variant} | ${result.scores.overall} | ${result.scores.visualRatio} | ${result.scores.textEconomy} | ${result.scores.boxDiscipline} | ${result.scores.annotation} | ${result.scores.interaction} | ${result.scores.antiSlop} | [png](${result.screenshot}) |`);
  }
  lines.push("", "## Quantitative Deltas");
  for (const finding of findings) {
    lines.push("", `### ${finding.task}`);
    lines.push(`- Overall delta: ${finding.overallDelta >= 0 ? "+" : ""}${finding.overallDelta}`);
    lines.push(`- Visual ratio delta: ${finding.visualRatioDelta >= 0 ? "+" : ""}${finding.visualRatioDelta}`);
    lines.push(`- Box discipline delta: ${finding.boxDisciplineDelta >= 0 ? "+" : ""}${finding.boxDisciplineDelta}`);
    lines.push(`- Annotation delta: ${finding.annotationDelta >= 0 ? "+" : ""}${finding.annotationDelta}`);
    lines.push(`- Interaction delta: ${finding.interactionDelta >= 0 ? "+" : ""}${finding.interactionDelta}`);
    for (const note of finding.notes) lines.push(`- ${note}`);
  }
  lines.push("", "## Qualitative Reading", "");
  lines.push("- Strong candidates make the primary object occupy the page and attach explanations directly to visual evidence.");
  lines.push("- Weak candidates use cards, side panels, or detached definitions to say what the visual could have shown itself.");
  const candidates = results.filter((result) => result.variant === "candidate");
  const weakSignals = candidates.map((candidate) => `${candidate.task}: ${weakestScoreName(candidate.scores)}`);
  if (weakSignals.length) {
    lines.push(`- Weakest candidate signals: ${weakSignals.join("; ")}.`);
  }
  lines.push("- The harness is intentionally heuristic; use it to catch regressions and guide iteration, not as a final human-study substitute.");
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const runId = timestamp();
  const runDir = path.join(runsDir, runId);
  await fs.mkdir(path.join(runDir, "screenshots"), { recursive: true });
  const tasks = JSON.parse(await fs.readFile(path.join(root, "evals", "research-tasks.json"), "utf8"));
  const manifest = JSON.parse(await fs.readFile(path.join(fixturesDir, "manifest.json"), "utf8"));
  const browser = await chromium.launch();
  const results = [];
  try {
    for (const fixture of manifest) {
      results.push(await evaluateFixture(browser, fixture, runDir));
    }
  } finally {
    await browser.close();
  }
  const findings = summarizeFindings(results);
  const report = { runId, viewport, generatedAt: new Date().toISOString(), tasks, results, findings };
  await fs.writeFile(path.join(runDir, "report.json"), `${JSON.stringify(report, null, 2)}\n`);
  await fs.writeFile(path.join(runDir, "report.md"), reportMarkdown(runId, tasks, results, findings));
  await fs.writeFile(path.join(runsDir, "latest.json"), `${JSON.stringify({ runId, report: path.relative(root, path.join(runDir, "report.md")) }, null, 2)}\n`);
  console.log(`Research run complete: ${path.relative(root, runDir)}`);
  for (const result of results) {
    console.log(`${result.id}: overall=${result.scores.overall} visual=${result.scores.visualRatio} box=${result.scores.boxDiscipline} annotation=${result.scores.annotation}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
