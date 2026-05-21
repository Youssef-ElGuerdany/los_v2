"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

export default function AboutUs() {
  const t = useTranslations("About");

  return (
    <div id="about" className="overflow-hidden">
      
      {/* ABOUT LAND OF SAND */}
      <section className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            
            <div className="w-full lg:w-1/2 space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight">
                {t("about_title")}
              </h2>
              <p className="text-xl text-amber-600 font-medium">
                {t("about_subtitle")}
              </p>
              
              <div className="space-y-4 text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
                <p>{t("about_desc1")}</p>
                <p>{t("about_desc2")}</p>
              </div>

              <div className="pt-4">
                <a href="#reservation" className="inline-block px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                  {t("reserve_btn")}
                </a>
              </div>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl group h-[600px]">
                <Image 
                  src="/images/real1.png" 
                  alt="Agadir Dunes and Beach" 
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
                />
                {/* Dark gradient overlay for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-80"></div>
                
                {/* Center text (Logo style) */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                  <h3 className="text-4xl md:text-5xl font-extrabold text-white tracking-widest drop-shadow-2xl mb-2">
                    LAND OF SAND
                  </h3>
                  <span className="text-xl md:text-2xl text-amber-500 font-bold tracking-[0.2em] uppercase drop-shadow-md">
                    & Adventures
                  </span>
                </div>

                {/* Bottom quote */}
                <div className="absolute bottom-8 left-8 right-8 text-white/90 text-center">
                  <p className="text-xl font-light italic tracking-wide">"More Than Just a Rental Shop."</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </section>

    </div>
  );
}
