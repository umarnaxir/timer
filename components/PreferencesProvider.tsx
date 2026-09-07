"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import {
  defaultPreferences,
  readPreferences,
  subscribePreferences,
  writePreferences,
  type HourFormat,
  type Preferences,
  type SoundType,
} from "@/lib/preferences";

type PreferencesContextValue = {
  preferences: Preferences;
  setPreference: <K extends keyof Preferences>(key: K, value: Preferences[K]) => void;
  setHourFormat: (value: HourFormat) => void;
  setSoundType: (value: SoundType) => void;
  resetPreferences: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function getSnapshot() {
  return readPreferences();
}

function subscribe(listener: () => void) {
  const unsubscribe = subscribePreferences(listener);
  readPreferences();
  listener();
  return unsubscribe;
}

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const preferences = useSyncExternalStore(
    subscribe,
    getSnapshot,
    () => defaultPreferences,
  );

  const setPreference = useCallback(
    <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
      writePreferences({ ...readPreferences(), [key]: value });
    },
    [],
  );

  const setHourFormat = useCallback((value: HourFormat) => {
    writePreferences({ ...readPreferences(), hourFormat: value });
  }, []);

  const setSoundType = useCallback((value: SoundType) => {
    writePreferences({ ...readPreferences(), soundType: value });
  }, []);

  const resetPreferences = useCallback(() => {
    writePreferences(defaultPreferences);
  }, []);

  const value = useMemo(
    () => ({
      preferences,
      setPreference,
      setHourFormat,
      setSoundType,
      resetPreferences,
    }),
    [preferences, setPreference, setHourFormat, setSoundType, resetPreferences],
  );

  return (
    <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within PreferencesProvider");
  }
  return context;
}
