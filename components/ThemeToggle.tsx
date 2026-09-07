"use client";

import styled from "styled-components";
import { useTheme } from "@/components/ThemeProvider";

const Toggle = styled.button`
  position: absolute;
  top: max(0.9rem, env(safe-area-inset-top));
  right: max(0.9rem, env(safe-area-inset-right));
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 0.4rem;
  background: var(--button-bg);
  color: var(--text);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;

  &:hover {
    background: var(--button-bg-hover);
  }

  &:active {
    transform: scale(0.96);
  }

  svg {
    width: 1.15rem;
    height: 1.15rem;
  }
`;

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M15.4 3.2a8.8 8.8 0 1 0 5.4 15.6A9 9 0 0 1 15.4 3.2Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 3v1.6M12 19.4V21M4.6 12H3M21 12h-1.6M6.1 6.1l1.1 1.1M16.8 16.8l1.1 1.1M17.9 6.1l-1.1 1.1M7.2 16.8l-1.1 1.1"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <Toggle
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </Toggle>
  );
}
