"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { formatDuration } from "@/lib/time";
import { playAlert } from "@/lib/sounds";
import { usePreferences } from "@/components/PreferencesProvider";

type TimerStatus = "idle" | "running" | "paused" | "finished";

const Panel = styled.section`
  position: absolute;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(3.35rem, calc(env(safe-area-inset-bottom) + 2.45rem));
  z-index: 3;
  width: min(17.25rem, calc(100vw - 2rem));
  padding: 0.85rem 0.85rem 0.9rem;
  border: 1px solid var(--line);
  border-radius: 0.5rem;
  background: var(--panel-bg);
  box-shadow: var(--shadow);
  backdrop-filter: blur(18px);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.4rem;
`;

const Label = styled.h2`
  margin: 0;
  color: var(--text-muted);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;

const IconRow = styled.div`
  display: flex;
  gap: 0.3rem;
`;

const IconButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.7rem;
  height: 1.7rem;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  background: var(--button-bg);
  color: var(--text);
  cursor: pointer;

  &:hover {
    background: var(--button-bg-hover);
  }
`;

const Progress = styled.div`
  width: 100%;
  height: 2px;
  margin-top: 0.65rem;
  overflow: hidden;
  background: var(--line);
`;

const ProgressValue = styled.span<{ $value: number; $active: boolean }>`
  display: block;
  width: ${({ $value }) => `${Math.round($value * 100)}%`};
  height: 100%;
  background: var(--accent);
  opacity: ${({ $active }) => ($active ? 1 : 0.45)};
  transition: width 0.2s linear;
`;

const finishedPulse = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.72; }
`;

const Display = styled.p<{ $finished: boolean }>`
  margin: 0.5rem 0 0;
  color: var(--text);
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 1.25rem;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  line-height: 1;

  ${({ $finished }) =>
    $finished &&
    css`
      color: var(--accent);
      animation: ${finishedPulse} 1.5s ease-in-out infinite;
    `}
`;

const StatusText = styled.p`
  margin: 0.25rem 0 0;
  min-height: 0.95em;
  color: var(--accent);
  font-size: 0.62rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
`;

const Fields = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.4rem;
  margin-top: 0.6rem;
`;

const Field = styled.label`
  display: flex;
  flex-direction: column;
  gap: 0.22rem;
  color: var(--text-muted);
  font-size: 0.58rem;
  letter-spacing: 0.06em;
  text-transform: uppercase;
`;

const NumberInput = styled.input`
  width: 100%;
  min-height: 2rem;
  padding: 0.2rem 0.15rem;
  border: 1px solid var(--input-border);
  border-radius: 0.3rem;
  background: var(--input-bg);
  color: var(--text);
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.88rem;
  font-variant-numeric: tabular-nums;
  text-align: center;

  &:disabled {
    opacity: 0.45;
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    appearance: none;
  }

  appearance: textfield;
`;

const Controls = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.4rem;
  margin-top: 0.6rem;
`;

const Button = styled.button<{ $variant?: "primary" | "ghost" }>`
  min-width: 4.3rem;
  min-height: 2rem;
  padding: 0.32rem 0.65rem;
  border: 1px solid ${({ $variant }) => ($variant === "primary" ? "transparent" : "var(--line)")};
  border-radius: 0.3rem;
  background: ${({ $variant }) => ($variant === "primary" ? "var(--primary-bg)" : "var(--button-bg)")};
  color: ${({ $variant }) => ($variant === "primary" ? "var(--primary-text)" : "var(--button-text)")};
  font-size: 0.74rem;
  font-weight: 600;
  cursor: pointer;

  &:hover:not(:disabled) {
    background: ${({ $variant }) =>
      $variant === "primary" ? "var(--primary-hover)" : "var(--button-bg-hover)"};
  }

  &:disabled {
    opacity: 0.42;
    cursor: not-allowed;
  }
`;

const Launcher = styled.button<{ $running: boolean }>`
  position: absolute;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(3.35rem, calc(env(safe-area-inset-bottom) + 2.45rem));
  z-index: 3;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.2rem;
  width: 3.4rem;
  height: 3.4rem;
  padding: 0;
  border: 1px solid ${({ $running }) => ($running ? "var(--accent)" : "var(--line)")};
  border-radius: 0.45rem;
  background: var(--panel-bg);
  color: var(--text);
  box-shadow: var(--shadow);
  cursor: pointer;
`;

const MiniTime = styled.span`
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.58rem;
  letter-spacing: 0.04em;
`;

const focusIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Focus = styled.div`
  position: fixed;
  inset: 0;
  z-index: 8;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  background:
    radial-gradient(ellipse 70% 50% at 50% 18%, var(--accent-soft), transparent 58%),
    var(--bg);
  animation: ${focusIn} 0.35s ease;
`;

const FocusTime = styled.p<{ $finished: boolean }>`
  margin: 0;
  color: var(--text);
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: clamp(3.2rem, 12vw, 8rem);
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  line-height: 1;
  text-shadow: 0 0 48px var(--glow);

  ${({ $finished }) =>
    $finished &&
    css`
      color: var(--accent);
      animation: ${finishedPulse} 1.5s ease-in-out infinite;
    `}
`;

const FocusStatus = styled.p`
  margin: 1rem 0 0;
  min-height: 1.2em;
  color: var(--accent);
  font-size: 0.82rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
`;

const FocusControls = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.65rem;
  margin-top: 1.8rem;
`;

function clampUnit(value: string, max: number) {
  if (value.trim() === "") return 0;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 0;
  return Math.min(max, Math.max(0, parsed));
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return Boolean(target.closest("input, textarea, select, [contenteditable='true']"));
}

export default function Timer() {
  const { preferences, setPreference } = usePreferences();
  const hours = preferences.timerHours;
  const minutes = preferences.timerMinutes;
  const seconds = preferences.timerSeconds;
  const [activeRemainingMs, setActiveRemainingMs] = useState(5 * 60 * 1000);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const [focus, setFocus] = useState(false);
  const endAtRef = useRef<number | null>(null);
  const finishedRef = useRef(false);
  const primaryRef = useRef<() => void>(() => {});
  const resetRef = useRef<() => void>(() => {});

  const configuredMs = useMemo(
    () => (hours * 3600 + minutes * 60 + seconds) * 1000,
    [hours, minutes, seconds],
  );
  const remainingMs = status === "idle" ? configuredMs : activeRemainingMs;
  const display = formatDuration(Math.floor(remainingMs / 1000));
  const canStart = configuredMs > 0 || (status === "paused" && remainingMs > 0);
  const primaryLabel =
    status === "running" ? "Pause" : status === "paused" ? "Resume" : "Start";
  const progress =
    configuredMs > 0 ? Math.min(1, Math.max(0, 1 - remainingMs / configuredMs)) : 0;

  useEffect(() => {
    if (status !== "running") return;

    const tick = () => {
      const remaining = Math.max(0, (endAtRef.current ?? 0) - Date.now());
      setActiveRemainingMs(remaining);
      if (remaining === 0) {
        endAtRef.current = null;
        setStatus("finished");
      }
    };

    const intervalId = window.setInterval(tick, 200);
    return () => window.clearInterval(intervalId);
  }, [status]);

  useEffect(() => {
    if (status !== "finished" || finishedRef.current) return;
    finishedRef.current = true;
    if (preferences.soundEnabled) {
      void playAlert(preferences.soundType);
    }
  }, [status, preferences.soundEnabled, preferences.soundType]);

  useEffect(() => {
    if (status !== "finished") {
      finishedRef.current = false;
    }
  }, [status]);

  const handlePrimary = () => {
    if (status === "running") {
      const remaining = Math.max(0, (endAtRef.current ?? 0) - Date.now());
      endAtRef.current = null;
      setActiveRemainingMs(remaining);
      setStatus(remaining === 0 ? "finished" : "paused");
      return;
    }

    const nextMs = status === "paused" ? remainingMs : configuredMs;
    if (nextMs <= 0) return;
    endAtRef.current = Date.now() + nextMs;
    setActiveRemainingMs(nextMs);
    setStatus("running");
  };

  const handleReset = () => {
    endAtRef.current = null;
    setActiveRemainingMs(configuredMs);
    setStatus("idle");
    finishedRef.current = false;
  };

  useEffect(() => {
    primaryRef.current = handlePrimary;
    resetRef.current = handleReset;
  });

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.key === " " || event.code === "Space") {
        event.preventDefault();
        primaryRef.current();
        return;
      }
      if (event.key === "r" || event.key === "R") {
        event.preventDefault();
        resetRef.current();
        return;
      }
      if (event.key === "f" || event.key === "F") {
        event.preventDefault();
        setFocus(true);
        setPreference("timerCollapsed", false);
        return;
      }
      if (event.key === "Escape") {
        setFocus(false);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setPreference]);

  const statusLabel =
    status === "finished" ? "Finished" : status === "paused" ? "Paused" : status === "running" ? "Running" : "";

  if (focus) {
    return (
      <Focus>
        <FocusTime $finished={status === "finished"} role="timer" aria-label={`Focus timer ${display}`}>
          {display}
        </FocusTime>
        <FocusStatus role="status" aria-live="polite">
          {statusLabel || "\u00a0"}
        </FocusStatus>
        <FocusControls>
          <Button type="button" $variant="primary" onClick={handlePrimary} disabled={!canStart && status !== "running"}>
            {primaryLabel}
          </Button>
          <Button type="button" onClick={handleReset}>
            Reset
          </Button>
          <Button type="button" onClick={() => setFocus(false)} aria-label="Exit focus mode">
            Exit Focus
          </Button>
        </FocusControls>
      </Focus>
    );
  }

  if (preferences.timerCollapsed) {
    return (
      <Launcher
        type="button"
        data-timer="launcher"
        $running={status === "running"}
        aria-label="Show timer"
        title="Show timer"
        onClick={() => setPreference("timerCollapsed", false)}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="13" r="7" stroke="currentColor" strokeWidth="1.7" />
          <path d="M9 4h6M12 13V9.5" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
        </svg>
        <MiniTime>{hours > 0 ? display : display.slice(3)}</MiniTime>
      </Launcher>
    );
  }

  return (
    <Panel data-timer="panel" aria-label="Countdown timer">
      <Header>
        <Label>Timer</Label>
        <IconRow>
          <IconButton type="button" aria-label="Open focus mode" title="Focus mode" onClick={() => setFocus(true)}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M5 9V5h4M15 5h4v4M19 15v4h-4M9 19H5v-4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </IconButton>
          <IconButton
            type="button"
            aria-label="Hide timer"
            title="Hide timer"
            onClick={() => setPreference("timerCollapsed", true)}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 12h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </IconButton>
        </IconRow>
      </Header>
      <Progress aria-hidden="true">
        <ProgressValue $value={progress} $active={status === "running"} />
      </Progress>
      <Display $finished={status === "finished"} role="timer" aria-label={`Timer ${display}`}>
        {display}
      </Display>
      <StatusText role="status" aria-live="polite">
        {statusLabel || "\u00a0"}
      </StatusText>
      <Fields>
        <Field>
          Hours
          <NumberInput
            type="number"
            inputMode="numeric"
            min={0}
            max={99}
            value={hours}
            disabled={status === "running"}
            aria-label="Timer hours"
            onChange={(event) => setPreference("timerHours", clampUnit(event.target.value, 99))}
          />
        </Field>
        <Field>
          Minutes
          <NumberInput
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            value={minutes}
            disabled={status === "running"}
            aria-label="Timer minutes"
            onChange={(event) => setPreference("timerMinutes", clampUnit(event.target.value, 59))}
          />
        </Field>
        <Field>
          Seconds
          <NumberInput
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            value={seconds}
            disabled={status === "running"}
            aria-label="Timer seconds"
            onChange={(event) => setPreference("timerSeconds", clampUnit(event.target.value, 59))}
          />
        </Field>
      </Fields>
      <Controls>
        <Button
          type="button"
          $variant="primary"
          onClick={handlePrimary}
          disabled={!canStart && status !== "running"}
        >
          {primaryLabel}
        </Button>
        <Button type="button" onClick={handleReset} aria-label="Reset timer">
          Reset
        </Button>
      </Controls>
    </Panel>
  );
}
