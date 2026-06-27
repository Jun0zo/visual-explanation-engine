# Visual Explanation Engine

![Visual Explanation Engine hero](../assets/hero.png)

**Visual Explanation Engine** es una skill de Codex para convertir una peticion de explicacion en una experiencia de aprendizaje mas clara. Elige texto, diagramas, imagenes generadas, ejemplos, codigo o UI interactiva segun lo que ayude mas a entender.

[English](../../README.md) | [한국어](../../README.ko.md) | [日本語](README.ja.md) | [简体中文](README.zh-CN.md) | [Español](README.es.md)

## Funciones

- No asume que la salida debe ser texto largo o HTML.
- Detecta estructuras como process, timeline, comparison, architecture, algorithm y decision flow.
- Usa divulgacion progresiva: resumen, mapa visual, pasos, ejemplos y detalles.
- Usa generated educational images, diagrams, charts o interactive HTML solo cuando mejoran la comprension.

## Proceso

![Visual Explanation Engine process](../assets/process.png)

1. Entender al aprendiz y el tema.
2. Extraer la estructura de la explicacion.
3. Elegir las modalidades correctas.
4. Disenar divulgacion progresiva.
5. Crear el artefacto explicativo.
6. Verificar que realmente ensena.

## Instalacion

```bash
npm install -g github:Jun0zo/visual-explanation-engine
visual-explanation-engine install --force
```

## Uso

```text
Use $visual-explanation-engine to explain OAuth login flow with diagrams and examples.
```
