# Visual Explanation Engine

![Visual Explanation Engine hero](../assets/hero.png)

**Visual Explanation Engine** 是一个 Codex skill，用来把解释请求转换成更容易理解的学习体验。它会根据内容选择文字、图表、生成图片、示例、代码或交互式 UI。

[English](../../README.md) | [한국어](../../README.ko.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [Español](README.es.md)

## 功能

- 不默认输出长文本或 HTML，而是先选择最适合的解释形式。
- 识别 process、timeline、comparison、architecture、algorithm、decision flow 等结构。
- 使用 summary、visual map、walkthrough、examples、details 的渐进式说明。
- 只在真正有助于理解时使用 generated educational image、diagram、chart 或 interactive HTML。

## 流程

![Visual Explanation Engine process](../assets/process.png)

1. 理解学习者和主题。
2. 提取解释结构。
3. 选择表达媒介。
4. 设计渐进式信息层次。
5. 生成解释产物。
6. 检查是否真正帮助理解。

## 安装

```bash
npm install -g visual-explanation-engine
visual-explanation-engine install --force
```

## 使用

```text
Use $visual-explanation-engine to explain OAuth login flow with diagrams and examples.
```
