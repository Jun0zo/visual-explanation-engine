# Visual Explanation Engine

![Visual Explanation Engine hero](../assets/hero.png)

**Visual Explanation Engine** は、説明リクエストをもっとも理解しやすい学習体験へ変換するための Codex skill です。文章、図解、生成画像、チャート、コード例、インタラクティブ UI を、内容に応じて選びます。

[English](../../README.md) | [한국어](../../README.ko.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [Español](README.es.md)

## 機能

- 長い文章や HTML に固定せず、概念に合った説明形式を選びます。
- process、timeline、comparison、architecture、algorithm、decision flow などの構造を検出します。
- summary、visual map、walkthrough、examples、details の順に段階的に説明します。
- generated educational image、diagram、chart、interactive HTML などを必要な場合だけ使います。

## Process

![Visual Explanation Engine process](../assets/process.png)

1. 学習者とトピックを理解する。
2. 説明構造を抽出する。
3. 最適な表現形式を選ぶ。
4. 段階的な開示を設計する。
5. 説明アーティファクトを作る。
6. 理解しやすさを検証する。

## Install

```bash
npm install -g visual-explanation-engine
visual-explanation-engine install
```

The installer opens a multi-select flow. Codex global and Claude Code global are selected by default, and project-local targets can be added.

## Usage

```text
Use $visual-explanation-engine to explain OAuth login flow with diagrams and examples.
```
