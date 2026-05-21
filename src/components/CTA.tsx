"use client";

import { useTranslations } from "next-intl";

export default function CTA() {
  const t = useTranslations("CTA");

  return (
    <section className="relative py-32 overflow-hidden flex items-center justify-center">
      {/* Background Image & Overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900/80 z-10"></div>
        <img 
          src="/images/cta.JPG" 
          alt="Desert sunset" 
          className="w-full h-full object-cover"
        />
      </div>

      <div className="relative z-20 max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight drop-shadow-md">
          {t("title")}
        </h2>
        <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
          {t("subtitle")}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a href="#reservation" className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(217,119,6,0.4)] text-lg">
            {t("book")}
          </a>
          <a href="https://wa.me/212661374773" target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-semibold rounded-full transition-all transform hover:scale-105 text-lg">
            {t("whatsapp")}
          </a>
        </div>
      </div>
    </section>
  );
}
