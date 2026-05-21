"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  // Show button when page is scrolled down
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    // Rely on native scroll-behavior: smooth from the HTML tag
    window.scrollTo(0, 0);
  };

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-28 right-6 rtl:right-auto rtl:left-6 z-[100] flex items-center justify-center w-12 h-12 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl shadow-lg hover:bg-slate-800 dark:hover:bg-slate-100 transition-all duration-300 cursor-pointer ${
        isVisible ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-10 opacity-0 pointer-events-none"
      }`}
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5" />
    </button>
  );
}
