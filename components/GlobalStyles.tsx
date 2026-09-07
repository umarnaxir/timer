"use client";

import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  :root {
    color-scheme: dark;
    --bg: #09090c;
    --bg-soft: #111218;
    --text: #f4f0e6;
    --text-muted: #8d887c;
    --accent: #d4b37f;
    --accent-soft: rgba(212, 179, 127, 0.14);
    --line: rgba(244, 240, 230, 0.1);
    --button-bg: rgba(244, 240, 230, 0.06);
    --button-bg-hover: rgba(244, 240, 230, 0.11);
    --button-text: #f4f0e6;
    --primary-bg: #d4b37f;
    --primary-text: #1a140c;
    --primary-hover: #e0c28f;
    --input-bg: rgba(244, 240, 230, 0.04);
    --input-border: rgba(244, 240, 230, 0.1);
    --glow: rgba(212, 179, 127, 0.16);
    --focus: #e6c993;
    --shadow: 0 18px 50px rgba(0, 0, 0, 0.28);
    --panel-bg: rgba(17, 18, 24, 0.82);
  }

  [data-theme="light"] {
    color-scheme: light;
    --bg: #f3eee4;
    --bg-soft: #fffdf8;
    --text: #1b1813;
    --text-muted: #6f6a60;
    --accent: #8f6d38;
    --accent-soft: rgba(143, 109, 56, 0.1);
    --line: rgba(27, 24, 19, 0.1);
    --button-bg: rgba(27, 24, 19, 0.05);
    --button-bg-hover: rgba(27, 24, 19, 0.09);
    --button-text: #1b1813;
    --primary-bg: #8f6d38;
    --primary-text: #fffaf1;
    --primary-hover: #7d5e2f;
    --input-bg: rgba(255, 253, 248, 0.8);
    --input-border: rgba(27, 24, 19, 0.12);
    --glow: rgba(143, 109, 56, 0.08);
    --focus: #8f6d38;
    --shadow: 0 16px 40px rgba(80, 62, 32, 0.08);
    --panel-bg: rgba(255, 253, 248, 0.86);
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  html,
  body {
    margin: 0;
    width: 100%;
    max-width: 100%;
    height: 100%;
    overflow: hidden;
  }

  html {
    background: var(--bg);
    color: var(--text);
    -webkit-text-size-adjust: 100%;
    transition: background-color 0.35s ease, color 0.35s ease;
  }

  body {
    min-height: 100vh;
    min-height: 100dvh;
    font-family: var(--font-sans), "Segoe UI", sans-serif;
    background: var(--bg);
    color: var(--text);
    transition: background-color 0.35s ease, color 0.35s ease;
  }

  button,
  input {
    font: inherit;
  }

  button {
    touch-action: manipulation;
  }

  :focus-visible {
    outline: 2px solid var(--focus);
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    html,
    body,
    *,
    *::before,
    *::after {
      scroll-behavior: auto !important;
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export default GlobalStyles;
