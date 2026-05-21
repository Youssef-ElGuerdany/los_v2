"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useState, useEffect } from "react";
import { Menu, X, Sun, Moon, Globe } from "lucide-react";
import { usePathname } from "@/i18n/routing";
import WeatherWidget from "./WeatherWidget";

export default function Navbar() {
  const t = useTranslations("Navigation");
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState("dark");
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    } else {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  };

  const navLinks = [
    { name: t("home"), path: "/" },
    { name: t("activities"), path: "#activities" },
    { name: t("amenities"), path: "#why-us" },
    { name: t("gallery"), path: "#gallery" },
    { name: t("reviews"), path: "#reviews" },
    { name: t("contact"), path: "#contact" },
  ];

  return (
    <>
      <nav className="fixed w-full z-50 top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold tracking-tighter text-amber-600 dark:text-amber-500">
                Land of Sand
              </Link>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <a key={link.name} href={link.path} className="text-slate-600 hover:text-amber-600 dark:text-slate-300 dark:hover:text-amber-500 font-medium transition-colors">
                  {link.name}
                </a>
              ))}
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <WeatherWidget />
              <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300">
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <div className="relative group">
                <button className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-2 text-slate-600 dark:text-slate-300">
                  <Globe size={20} />
                </button>
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 flex flex-col overflow-hidden">
                  <Link href={pathname} locale="en" className="px-4 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors">English</Link>
                  <Link href={pathname} locale="fr" className="px-4 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors">Français</Link>
                  <Link href={pathname} locale="es" className="px-4 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors">Español</Link>
                  <Link href={pathname} locale="de" className="px-4 py-2 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 text-sm transition-colors">Deutsch</Link>
                </div>
              </div>
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsOpen(!isOpen)} className="text-slate-600 dark:text-slate-300">
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div className={`md:hidden fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[100] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`} onClick={() => setIsOpen(false)}></div>
      
      {/* Mobile Menu Panel */}
      <div className={`md:hidden fixed top-0 right-0 h-full w-4/5 max-w-sm bg-white dark:bg-slate-950 border-l border-slate-200 dark:border-slate-800 z-[101] transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          <div className="flex justify-between items-center mb-8">
            <span className="text-xl font-bold text-amber-600">Land of Sand</span>
            <button onClick={() => setIsOpen(false)} className="text-slate-900 dark:text-white p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <div className="flex flex-col space-y-4 flex-grow">
            {navLinks.map((link) => (
              <a key={link.name} href={link.path} onClick={() => setIsOpen(false)} className="px-4 py-3 text-lg font-bold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-900 rounded-xl transition-colors">
                {link.name}
              </a>
            ))}
          </div>

          <div className="mt-auto pt-8 border-t border-slate-200 dark:border-slate-800 space-y-6">
            <div className="flex items-center justify-between px-4">
              <span className="text-sm font-bold text-slate-750 dark:text-slate-250">Agadir Weather</span>
              <WeatherWidget />
            </div>
            
            <div className="flex items-center justify-between px-4">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Theme</span>
              <button onClick={toggleTheme} className="p-3 bg-slate-100 dark:bg-slate-800 rounded-full text-slate-900 dark:text-white hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            
            <div className="flex justify-between gap-2 px-2">
              <Link href={pathname} locale="en" className="flex-1 text-center py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-bold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">EN</Link>
              <Link href={pathname} locale="fr" className="flex-1 text-center py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-bold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">FR</Link>
              <Link href={pathname} locale="es" className="flex-1 text-center py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-bold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">ES</Link>
              <Link href={pathname} locale="de" className="flex-1 text-center py-2 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-bold hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors">DE</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
