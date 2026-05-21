"use client";

import { useTranslations } from "next-intl";

export default function Footer() {
  const currentYear = 2026; // As requested by user

  return (
    <footer className="bg-slate-950 py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 w-full pt-8 mt-8">
          {/* Brand / Logo Area */}
          <div className="flex items-center gap-3 flex-1">
            <img src="/logo.png" alt="Land of Sand Logo" className="h-10 w-auto" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
            <span className="text-xl font-bold text-white tracking-wider">
              LAND OF SAND<span className="text-amber-500">.</span>
            </span>
          </div>

          {/* Copyright Text */}
          <div className="text-slate-400 text-sm text-center flex-1">
            &copy; {currentYear} Land of Sand Resort. All rights reserved. Agadir Takadt, Agadir, Morocco.
          </div>

          {/* Social Links */}
          <div className="flex gap-6 justify-center md:justify-end flex-1">
            <a href="https://www.instagram.com/quad_buggy_land_of_sand_agadir" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-500 transition-colors font-medium">
              Instagram
            </a>
            <a href="https://wa.me/212661374773" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-amber-500 transition-colors font-medium">
              WhatsApp
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
