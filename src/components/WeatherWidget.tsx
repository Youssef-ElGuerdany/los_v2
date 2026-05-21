"use client";

import { useEffect, useState } from "react";
import { Sun, CloudSun, Cloud, CloudRain } from "lucide-react";
import { useLocale } from "next-intl";

export default function WeatherWidget() {
  const locale = useLocale();
  const [weather, setWeather] = useState<{ temp: number; code: number } | null>(null);

  useEffect(() => {
    async function fetchWeather() {
      try {
        const res = await fetch(
          "https://api.open-meteo.com/v1/forecast?latitude=30.4278&longitude=-9.5981&current_weather=true"
        );
        const data = await res.json();
        if (data && data.current_weather) {
          setWeather({
            temp: Math.round(data.current_weather.temperature),
            code: data.current_weather.weathercode,
          });
        }
      } catch (err) {
        console.error("Weather fetch failed, falling back to static", err);
      }
    }
    fetchWeather();
  }, []);

  const getStatusText = (temp: number) => {
    const isCool = temp < 22;
    
    const translations: Record<string, { perfect: string; fresh: string }> = {
      en: {
        perfect: "Perfect for riding! 🏜️",
        fresh: "Great riding weather! 🏍️",
      },
      fr: {
        perfect: "Idéal pour rouler ! 🏜️",
        fresh: "Super climat pour rouler ! 🏍️",
      },
      es: {
        perfect: "¡Perfecto para pasear! 🏜️",
        fresh: "¡Excelente clima para rodar! 🏍️",
      },
      de: {
        perfect: "Perfekt zum Fahren! 🏜️",
        fresh: "Tolles Fahrwetter! 🏍️",
      },
    };

    const lang = translations[locale] || translations.en;
    return isCool ? lang.fresh : lang.perfect;
  };

  const getWeatherIcon = (code: number) => {
    if (code === 0) return <Sun className="w-4.5 h-4.5 text-amber-500 transition-transform duration-1000 hover:rotate-180" />;
    if (code <= 3) return <CloudSun className="w-4.5 h-4.5 text-amber-500" />;
    if (code <= 48) return <Cloud className="w-4.5 h-4.5 text-slate-400" />;
    return <CloudRain className="w-4.5 h-4.5 text-blue-400" />;
  };

  // Fallback to static perfect weather (24°C Sunny) if API is slow/down
  const displayTemp = weather ? weather.temp : 24;
  const displayCode = weather ? weather.code : 0;

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 dark:bg-amber-500/5 border border-amber-500/20 dark:border-amber-500/10 rounded-full text-xs font-semibold text-amber-700 dark:text-amber-400 shadow-sm transition-all duration-300 hover:bg-amber-500/20">
      {getWeatherIcon(displayCode)}
      <span className="font-extrabold">{displayTemp}°C</span>
      <span className="hidden xl:inline border-l border-amber-500/20 pl-2 text-slate-600 dark:text-slate-400">
        {getStatusText(displayTemp)}
      </span>
    </div>
  );
}
