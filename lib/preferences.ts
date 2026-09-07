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

export const preferencesInitScript = `(function(){try{var raw=localStorage.getItem(${JSON.stringify(PREFERENCES_KEY)});if(!raw)return;var p=JSON.parse(raw);if(!p||typeof p!=="object")return;var r=document.documentElement;function flag(key,fallback){return p[key]===false?"false":p[key]===true?"true":fallback}r.setAttribute("data-hour-format",p.hourFormat==="24"?"24":"12");r.setAttribute("data-show-quote",flag("showQuote","true"));r.setAttribute("data-show-date",flag("showDate","true"));r.setAttribute("data-show-seconds",flag("showSeconds","true"));r.setAttribute("data-show-timezone",flag("showTimezone","true"));r.setAttribute("data-timer-collapsed",p.timerCollapsed===true?"true":"false");r.setAttribute("data-sound-enabled",flag("soundEnabled","true"));}catch(e){}})();`;

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

function samePreferences(a: Preferences, b: Preferences) {
  return (
    a.hourFormat === b.hourFormat &&
    a.soundEnabled === b.soundEnabled &&
    a.soundType === b.soundType &&
    a.showQuote === b.showQuote &&
    a.showDate === b.showDate &&
    a.showTimezone === b.showTimezone &&
    a.showSeconds === b.showSeconds &&
    a.timerCollapsed === b.timerCollapsed &&
    a.timerHours === b.timerHours &&
    a.timerMinutes === b.timerMinutes &&
    a.timerSeconds === b.timerSeconds
  );
}

function applyPreferenceAttributes(prefs: Preferences) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.setAttribute("data-hour-format", prefs.hourFormat);
  root.setAttribute("data-show-quote", String(prefs.showQuote));
  root.setAttribute("data-show-date", String(prefs.showDate));
  root.setAttribute("data-show-seconds", String(prefs.showSeconds));
  root.setAttribute("data-show-timezone", String(prefs.showTimezone));
  root.setAttribute("data-timer-collapsed", String(prefs.timerCollapsed));
  root.setAttribute("data-sound-enabled", String(prefs.soundEnabled));
}

let snapshot = defaultPreferences;
let cachedRaw: string | null | undefined;

export function readPreferences(): Preferences {
  if (typeof window === "undefined") return defaultPreferences;
  const raw = localStorage.getItem(PREFERENCES_KEY);
  if (raw === cachedRaw) return snapshot;
  cachedRaw = raw;
  const next = parsePreferences(raw);
  if (!samePreferences(snapshot, next)) {
    snapshot = next;
    applyPreferenceAttributes(snapshot);
  }
  return snapshot;
}

export function writePreferences(next: Preferences) {
  const current = typeof window === "undefined" ? snapshot : readPreferences();
  const merged = samePreferences(current, next) ? current : next;
  snapshot = merged;
  const raw = JSON.stringify(merged);
  cachedRaw = raw;
  try {
    localStorage.setItem(PREFERENCES_KEY, raw);
  } catch {
    cachedRaw = undefined;
  }
  applyPreferenceAttributes(merged);
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("timer-preferences"));
  }
  return merged;
}

export function getPreferencesSnapshot() {
  if (typeof window !== "undefined") {
    return readPreferences();
  }
  return snapshot;
}

export function subscribePreferences(listener: () => void) {
  const handle = (event: Event) => {
    if (event instanceof StorageEvent && event.key !== PREFERENCES_KEY && event.key !== null) {
      return;
    }
    if (event instanceof StorageEvent) {
      cachedRaw = undefined;
    }
    readPreferences();
    listener();
  };
  window.addEventListener("timer-preferences", handle);
  window.addEventListener("storage", handle);
  return () => {
    window.removeEventListener("timer-preferences", handle);
    window.removeEventListener("storage", handle);
  };
}
