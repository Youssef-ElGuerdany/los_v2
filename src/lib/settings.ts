import { useState, useEffect } from "react";
import { supabase } from "./supabase";

export interface SettingsType {
  phone_number: string;
  site_title: string;
  site_description: string;
}

const defaultSettings: SettingsType = {
  phone_number: "212661374773",
  site_title: "Land of Sand and Adventures",
  site_description: "Experience the best desert adventure in Agadir with Quad Biking, Buggy Riding, Massa off-road tours, and overnight stays."
};

// Global cache to avoid double fetches in multiple mounts
let cachedSettings: SettingsType | null = null;
let listeners: Array<(settings: SettingsType) => void> = [];

export function useSettings() {
  const [settings, setSettings] = useState<SettingsType>(cachedSettings || defaultSettings);

  useEffect(() => {
    const handler = (newSettings: SettingsType) => {
      setSettings(newSettings);
    };
    listeners.push(handler);

    // Fetch if cache is empty
    if (!cachedSettings) {
      async function loadFromDB() {
        if (!supabase) return;
        try {
          const { data, error } = await supabase.from("settings").select("*");
          if (!error && data && data.length > 0) {
            const mapped: SettingsType = { ...defaultSettings };
            data.forEach((row: { key: string; value: string }) => {
              if (row.key === "phone_number") mapped.phone_number = row.value;
              if (row.key === "site_title") mapped.site_title = row.value;
              if (row.key === "site_description") mapped.site_description = row.value;
            });
            cachedSettings = mapped;
            listeners.forEach(lis => lis(mapped));
          }
        } catch (e) {
          console.error("Failed to load settings from Supabase:", e);
        }
      }
      loadFromDB();
    }

    return () => {
      listeners = listeners.filter(lis => lis !== handler);
    };
  }, []);

  return settings;
}
