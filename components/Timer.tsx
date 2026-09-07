"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styled, { css, keyframes } from "styled-components";
import { formatDuration } from "@/lib/time";

type TimerStatus = "idle" | "running" | "paused" | "finished";

const Section = styled.section`
  position: absolute;
  right: max(1rem, env(safe-area-inset-right));
  bottom: max(1rem, env(safe-area-inset-bottom));
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  width: min(16.5rem, calc(100vw - 2rem));
`;

const Label = styled.h2`
  margin: 0;
  color: var(--text-muted);
  font-size: 0.62rem;
  font-weight: 600;
  letter-spacing: 0.18em;
  text-transform: uppercase;
`;

const finishedPulse = keyframes`
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.015);
    opacity: 0.78;
  }
`;

const Display = styled.p<{ $finished: boolean }>`
  margin: 0.28rem 0 0;
  color: var(--text);
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: clamp(1.05rem, 3.2vw, 1.35rem);
  font-weight: 600;
  font-variant-numeric: tabular-nums;
  letter-spacing: 0.06em;
  line-height: 1;
  transition: color 0.25s ease;

  ${({ $finished }) =>
    $finished &&
    css`
      color: var(--accent);
      animation: ${finishedPulse} 1.5s ease-in-out infinite;
    `}
`;

const StatusText = styled.p`
  margin: 0.2rem 0 0;
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
  width: 100%;
  margin-top: 0.55rem;
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
  border-radius: 0.35rem;
  background: var(--input-bg);
  color: var(--text);
  font-family: var(--font-mono), ui-monospace, monospace;
  font-size: 0.88rem;
  font-variant-numeric: tabular-nums;
  text-align: center;
  transition:
    border-color 0.2s ease,
    background-color 0.2s ease,
    opacity 0.2s ease;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  &:hover:not(:disabled) {
    border-color: var(--accent);
  }

  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button {
    margin: 0;
    appearance: none;
  }

  appearance: textfield;
`;

const Controls = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.4rem;
  width: 100%;
  margin-top: 0.55rem;
`;

const Button = styled.button<{ $variant?: "primary" | "ghost" }>`
  min-width: 4.4rem;
  min-height: 2rem;
  padding: 0.32rem 0.7rem;
  border: 1px solid ${({ $variant }) => ($variant === "primary" ? "transparent" : "var(--line)")};
  border-radius: 0.35rem;
  background: ${({ $variant }) => ($variant === "primary" ? "var(--primary-bg)" : "var(--button-bg)")};
  color: ${({ $variant }) => ($variant === "primary" ? "var(--primary-text)" : "var(--button-text)")};
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.02em;
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.16s ease,
    opacity 0.2s ease;

  &:hover:not(:disabled) {
    background: ${({ $variant }) =>
      $variant === "primary" ? "var(--primary-hover)" : "var(--button-bg-hover)"};
  }

  &:active:not(:disabled) {
    transform: scale(0.97);
  }

  &:disabled {
    opacity: 0.42;
    cursor: not-allowed;
  }
`;

function clampUnit(value: string, max: number) {
  if (value.trim() === "") return 0;
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return 0;
  return Math.min(max, Math.max(0, parsed));
}

export default function Timer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(5);
  const [seconds, setSeconds] = useState(0);
  const [activeRemainingMs, setActiveRemainingMs] = useState(5 * 60 * 1000);
  const [status, setStatus] = useState<TimerStatus>("idle");
  const endAtRef = useRef<number | null>(null);

  const configuredMs = useMemo(
    () => (hours * 3600 + minutes * 60 + seconds) * 1000,
    [hours, minutes, seconds],
  );
  const remainingMs = status === "idle" ? configuredMs : activeRemainingMs;

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

    return () => {
      window.clearInterval(intervalId);
    };
  }, [status]);

  const display = formatDuration(Math.floor(remainingMs / 1000));
  const canStart = configuredMs > 0 || (status === "paused" && remainingMs > 0);
  const primaryLabel =
    status === "running" ? "Pause" : status === "paused" ? "Resume" : "Start";

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
  };

  return (
    <Section aria-label="Countdown timer">
      <Label>Timer</Label>
      <Display
        $finished={status === "finished"}
        role="timer"
        aria-label={`Timer ${display}${status === "finished" ? ", finished" : ""}`}
      >
        {display}
      </Display>
      <StatusText role="status" aria-live="polite">
        {status === "finished" ? "Finished" : status === "paused" ? "Paused" : "\u00a0"}
      </StatusText>
      <Fields>
        <Field>
          Hours
          <NumberInput
            type="number"
            inputMode="numeric"
            min={0}
            max={99}
            step={1}
            value={hours}
            disabled={status === "running"}
            aria-label="Timer hours"
            onChange={(event) => setHours(clampUnit(event.target.value, 99))}
          />
        </Field>
        <Field>
          Minutes
          <NumberInput
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            step={1}
            value={minutes}
            disabled={status === "running"}
            aria-label="Timer minutes"
            onChange={(event) => setMinutes(clampUnit(event.target.value, 59))}
          />
        </Field>
        <Field>
          Seconds
          <NumberInput
            type="number"
            inputMode="numeric"
            min={0}
            max={59}
            step={1}
            value={seconds}
            disabled={status === "running"}
            aria-label="Timer seconds"
            onChange={(event) => setSeconds(clampUnit(event.target.value, 59))}
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
    </Section>
  );
}
