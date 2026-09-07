"use client";

import { useEffect, useId, useRef, useState } from "react";
import styled from "styled-components";
import { persistTheme } from "@/lib/theme";
import { playAlert } from "@/lib/sounds";
import { SOUND_OPTIONS } from "@/lib/preferences";
import { useTheme } from "@/components/ThemeProvider";
import { usePreferences } from "@/components/PreferencesProvider";

const Bar = styled.div`
  position: absolute;
  top: max(0.9rem, env(safe-area-inset-top));
  right: max(0.9rem, env(safe-area-inset-right));
  z-index: 4;
  display: flex;
  gap: 0.4rem;
`;

const IconButton = styled.button<{ $active?: boolean }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.35rem;
  height: 2.35rem;
  padding: 0;
  border: 1px solid var(--line);
  border-radius: 0.4rem;
  background: ${({ $active }) => ($active ? "var(--accent-soft)" : "var(--button-bg)")};
  color: var(--text);
  cursor: pointer;
  transition:
    background-color 0.2s ease,
    border-color 0.2s ease,
    transform 0.16s ease;

  &:hover {
    background: var(--button-bg-hover);
  }

  &:active {
    transform: scale(0.96);
  }

  svg {
    width: 1.05rem;
    height: 1.05rem;
  }
`;

const MenuWrap = styled.div`
  position: relative;
`;

const Panel = styled.div`
  position: absolute;
  top: calc(100% + 0.45rem);
  right: 0;
  width: min(19.5rem, calc(100vw - 1.8rem));
  max-height: min(28rem, calc(100dvh - 5rem));
  overflow: auto;
  padding: 0.55rem;
  border: 1px solid var(--line);
  border-radius: 0.5rem;
  background: var(--panel-bg);
  box-shadow: var(--shadow);
  backdrop-filter: blur(18px);
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding: 0.55rem 0.45rem;
  border-radius: 0.35rem;
`;

const Label = styled.p`
  margin: 0;
  color: var(--text);
  font-size: 0.78rem;
`;

const Hint = styled.span`
  display: block;
  margin-top: 0.15rem;
  color: var(--text-muted);
  font-size: 0.66rem;
`;

const Toggle = styled.button<{ $on?: boolean }>`
  min-width: 2.6rem;
  height: 1.45rem;
  padding: 0 0.15rem;
  border: 0;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? "var(--primary-bg)" : "var(--button-bg-hover)")};
  cursor: pointer;
`;

const ToggleKnob = styled.span<{ $on?: boolean }>`
  display: block;
  width: 1.1rem;
  height: 1.1rem;
  border-radius: 999px;
  background: ${({ $on }) => ($on ? "var(--primary-text)" : "var(--text)")};
  transform: translateX(${({ $on }) => ($on ? "1.2rem" : "0")});
  transition: transform 0.18s ease;
`;

const Select = styled.select`
  max-width: 8.5rem;
  height: 1.8rem;
  padding: 0 0.4rem;
  border: 1px solid var(--input-border);
  border-radius: 0.3rem;
  background: var(--input-bg);
  color: var(--text);
`;

const TextButton = styled.button`
  width: 100%;
  min-height: 1.9rem;
  margin-top: 0.15rem;
  padding: 0.35rem 0.5rem;
  border: 1px solid var(--line);
  border-radius: 0.3rem;
  background: var(--button-bg);
  color: var(--text);
  font-size: 0.74rem;
  cursor: pointer;

  &:hover {
    background: var(--button-bg-hover);
  }
`;

const Shortcut = styled.p`
  display: flex;
  justify-content: space-between;
  margin: 0.2rem 0;
  color: var(--text-muted);
  font-size: 0.68rem;
`;

const Divider = styled.hr`
  margin: 0.25rem 0.2rem;
  border: 0;
  border-top: 1px solid var(--line);
`;

function IconSun() {
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

function IconMoon() {
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

function IconSound({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4.5 10.2v3.6h2.8L12 18V6L7.3 10.2H4.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {on ? (
        <path
          d="M15.4 9.2a3.6 3.6 0 0 1 0 5.6M17.8 7a6.4 6.4 0 0 1 0 10"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      ) : (
        <path d="M16.2 9.2 20 13m0-3.8-3.8 3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      )}
    </svg>
  );
}

function Switch({
  on,
  label,
  onClick,
}: {
  on: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <Toggle type="button" $on={on} aria-pressed={on} aria-label={label} onClick={onClick}>
      <ToggleKnob $on={on} />
    </Toggle>
  );
}

export default function TopControls() {
  const { theme, toggleTheme } = useTheme();
  const { preferences, setPreference, setHourFormat, setSoundType, resetPreferences } =
    usePreferences();
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("pointerdown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("pointerdown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <Bar>
      <IconButton
        type="button"
        $active={preferences.soundEnabled}
        aria-label={preferences.soundEnabled ? "Turn sound off" : "Turn sound on"}
        title={preferences.soundEnabled ? "Sound on" : "Sound off"}
        onClick={() => setPreference("soundEnabled", !preferences.soundEnabled)}
      >
        <IconSound on={preferences.soundEnabled} />
      </IconButton>
      <IconButton
        type="button"
        aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title="Theme"
        onClick={toggleTheme}
      >
        {theme === "dark" ? <IconSun /> : <IconMoon />}
      </IconButton>
      <MenuWrap ref={wrapRef}>
        <IconButton
          type="button"
          $active={open}
          aria-expanded={open}
          aria-controls={menuId}
          aria-label="Open settings menu"
          title="Settings"
          onClick={() => setOpen((value) => !value)}
        >
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="6" cy="12" r="1.4" />
            <circle cx="12" cy="12" r="1.4" />
            <circle cx="18" cy="12" r="1.4" />
          </svg>
        </IconButton>
        {open ? (
          <Panel id={menuId} role="menu" aria-label="Settings">
            <Row>
              <Label>
                12 / 24 hour format
                <Hint>{preferences.hourFormat === "12" ? "12-hour with AM/PM" : "24-hour"}</Hint>
              </Label>
              <Switch
                on={preferences.hourFormat === "24"}
                label="Use 24-hour format"
                onClick={() => setHourFormat(preferences.hourFormat === "12" ? "24" : "12")}
              />
            </Row>
            <Row>
              <Label>
                Sound settings
                <Hint>{preferences.soundEnabled ? "Alerts on" : "Alerts muted"}</Hint>
              </Label>
              <Switch
                on={preferences.soundEnabled}
                label="Enable timer sound"
                onClick={() => setPreference("soundEnabled", !preferences.soundEnabled)}
              />
            </Row>
            <Row>
              <Label>Alert sound</Label>
              <Select
                aria-label="Timer end sound"
                value={preferences.soundType}
                onChange={(event) =>
                  setSoundType(event.target.value as (typeof SOUND_OPTIONS)[number]["value"])
                }
              >
                {SOUND_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Row>
            <TextButton type="button" onClick={() => void playAlert(preferences.soundType)}>
              Test sound
            </TextButton>
            <Divider />
            <Row>
              <Label>Theme / Appearance</Label>
              <Switch
                on={theme === "light"}
                label="Use light mode"
                onClick={() => persistTheme(theme === "dark" ? "light" : "dark")}
              />
            </Row>
            <Row>
              <Label>Show / hide quote</Label>
              <Switch
                on={preferences.showQuote}
                label="Show daily quote"
                onClick={() => setPreference("showQuote", !preferences.showQuote)}
              />
            </Row>
            <Row>
              <Label>Show / hide date</Label>
              <Switch
                on={preferences.showDate}
                label="Show date"
                onClick={() => setPreference("showDate", !preferences.showDate)}
              />
            </Row>
            <Row>
              <Label>
                Show / hide seconds
                <Hint>{preferences.showSeconds ? "HH:MM:SS" : "Hours and minutes only"}</Hint>
              </Label>
              <Switch
                on={preferences.showSeconds}
                label="Show seconds"
                onClick={() => setPreference("showSeconds", !preferences.showSeconds)}
              />
            </Row>
            <Row>
              <Label>
                Timezone
                <Hint>Kolkata, India (IST)</Hint>
              </Label>
              <Switch
                on={preferences.showTimezone}
                label="Show timezone"
                onClick={() => setPreference("showTimezone", !preferences.showTimezone)}
              />
            </Row>
            <Divider />
            <Row>
              <Label>
                Keyboard shortcuts
                <Hint>
                  <Shortcut>
                    <span>Start / Pause</span>
                    <span>Space</span>
                  </Shortcut>
                  <Shortcut>
                    <span>Reset</span>
                    <span>R</span>
                  </Shortcut>
                  <Shortcut>
                    <span>Focus mode</span>
                    <span>F</span>
                  </Shortcut>
                  <Shortcut>
                    <span>Exit focus</span>
                    <span>Esc</span>
                  </Shortcut>
                </Hint>
              </Label>
            </Row>
            <TextButton
              type="button"
              onClick={() => {
                resetPreferences();
                persistTheme("dark");
              }}
            >
              Reset settings
            </TextButton>
          </Panel>
        ) : null}
      </MenuWrap>
    </Bar>
  );
}
