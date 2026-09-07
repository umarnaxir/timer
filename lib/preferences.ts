export type HourFormat = "12" | "24";
export type SoundType = "bell" | "beep" | "digital" | "chime";

export type Preferences = {
  hourFormat: HourFormat;
  soundEnabled: boolean;
  soundType: SoundType;
  showQuote: boolean;
  showDate: boolean;
  showTimezone: boolean;
  showSeconds: boolean;
  timerCollapsed: boolean;
  timerHours: number;
  timerMinutes: number;
  timerSeconds: number;
};

export const PREFERENCES_KEY = "timer-preferences";
export const defaultPreferences: Preferences = {
  hourFormat: "12",
  soundEnabled: true,
  soundType: "chime",
  showQuote: true,
  showDate: true,
  showTimezone: true,
  showSeconds: true,
  timerCollapsed: false,
  timerHours: 0,
  timerMinutes: 5,
  timerSeconds: 0,
};

export const SOUND_OPTIONS: { value: SoundType; label: string }[] = [
  { value: "bell", label: "Bell" },
  { value: "beep", label: "Beep" },
  { value: "digital", label: "Digital" },
  { value: "chime", label: "Soft Chime" },
];

function clampPref(value: unknown, min: number, max: number, fallback: number) {
  if (typeof value !== "number" || Number.isNaN(value)) return fallback;
  return Math.min(max, Math.max(min, Math.floor(value)));
}

function parsePreferences(raw: string | null): Preferences {
  if (!raw) return defaultPreferences;
  try {
    const parsed = JSON.parse(raw) as Partial<Preferences>;
    return {
      hourFormat: parsed.hourFormat === "24" ? "24" : "12",
      soundEnabled: parsed.soundEnabled !== false,
      soundType: SOUND_OPTIONS.some((option) => option.value === parsed.soundType)
        ? (parsed.soundType as SoundType)
        : "chime",
      showQuote: parsed.showQuote !== false,
      showDate: parsed.showDate !== false,
      showTimezone: parsed.showTimezone !== false,
      showSeconds: parsed.showSeconds !== false,
      timerCollapsed: parsed.timerCollapsed === true,
      timerHours: clampPref(parsed.timerHours, 0, 99, 0),
      timerMinutes: clampPref(parsed.timerMinutes, 0, 59, 5),
      timerSeconds: clampPref(parsed.timerSeconds, 0, 59, 0),
    };
  } catch {
    return defaultPreferences;
  }
}

let snapshot = defaultPreferences;

export function readPreferences(): Preferences {
  if (typeof window === "undefined") return defaultPreferences;
  snapshot = parsePreferences(localStorage.getItem(PREFERENCES_KEY));
  return snapshot;
}

export function writePreferences(next: Preferences) {
  snapshot = next;
  try {
    localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
  } catch {
    // Ignore quota / private-mode failures
  }
  window.dispatchEvent(new Event("timer-preferences"));
}

export function getPreferencesSnapshot() {
  return snapshot;
}

export function subscribePreferences(listener: () => void) {
  const handle = () => {
    snapshot = parsePreferences(localStorage.getItem(PREFERENCES_KEY));
    listener();
  };
  window.addEventListener("timer-preferences", handle);
  window.addEventListener("storage", handle);
  return () => {
    window.removeEventListener("timer-preferences", handle);
    window.removeEventListener("storage", handle);
  };
}
