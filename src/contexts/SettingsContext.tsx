"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { defaultSettings, type SiteSettings } from "@/lib/siteSettings";

interface SettingsContextValue {
  settings: SiteSettings;
  updateSettings: (partial: Partial<SiteSettings>) => void;
  updateSection: <K extends keyof SiteSettings>(section: K, value: Partial<SiteSettings[K]>) => void;
}

const SettingsContext = createContext<SettingsContextValue>({
  settings: defaultSettings,
  updateSettings: () => {},
  updateSection: () => {},
});

export function SettingsProvider({ children, initial = defaultSettings }: { children: ReactNode; initial?: SiteSettings }) {
  const [settings, setSettings] = useState<SiteSettings>(initial);

  const updateSettings = useCallback((partial: Partial<SiteSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const updateSection = useCallback(<K extends keyof SiteSettings>(
    section: K,
    value: Partial<SiteSettings[K]>
  ) => {
    setSettings((prev) => ({
      ...prev,
      [section]: { ...(prev[section] as object), ...value },
    }));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, updateSection }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
