"use client";

import { useTranslations } from "next-intl";
import { Compass, Key, ShieldCheck, Camera, Gift, Star, Waves } from "lucide-react";

export default function WhyUs() {
  const t = useTranslations("WhyUs");

  // Map icons to features
  const featureIcons = [
    <Compass key="compass" className="w-8 h-8 text-amber-500" />,
    <Key key="key" className="w-8 h-8 text-amber-500" />,
    <ShieldCheck key="shield" className="w-8 h-8 text-amber-500" />,
    <Camera key="camera" className="w-8 h-8 text-amber-500" />,
    <Gift key="gift" className="w-8 h-8 text-amber-500" />,
    <Star key="star" className="w-8 h-8 text-amber-500" />,
    <Waves key="waves" className="w-8 h-8 text-blue-500 group-hover:text-cyan-400 transition-colors duration-500 animate-pulse" />
  ];

  return (
    <section id="why-us" className="py-24 bg-slate-900 relative overflow-hidden transition-colors duration-300">
      
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjAyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] z-0"></div>
        {/* Glow effects */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-600/10 blur-[120px] rounded-full z-0"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-amber-600/10 blur-[120px] rounded-full z-0"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <span className="text-amber-500 font-bold tracking-widest uppercase text-sm mb-4 block">
            {t("subtitle")}
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6">
            {t("title")} <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">{t("title_highlight")}</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-600 to-amber-400 mx-auto rounded-full"></div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {t.raw("values").map((feature: { title: string, desc: string }, idx: number) => {
            // Make the first card and the swimming pool card span 2 columns on large screens for a balanced Bento framing
            const isFeatured = idx === 0 || idx === 6;
            const isPool = idx === 6;

            return (
              <div 
                key={idx} 
                className={`group relative bg-slate-800/50 hover:bg-slate-800 backdrop-blur-md border border-slate-700/50 rounded-3xl p-8 transition-all duration-500 hover:-translate-y-1 overflow-hidden 
                  ${isFeatured ? 'lg:col-span-2' : ''} 
                  ${isPool 
                    ? 'hover:border-blue-500/30 hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)]' 
                    : 'hover:border-amber-500/30 hover:shadow-[0_10px_40px_rgba(217,119,6,0.1)]'
                  }`}
              >
                {/* Subtle hover gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br transition-all duration-500 z-0
                  ${isPool 
                    ? 'from-blue-600/0 to-blue-600/0 group-hover:from-blue-600/5 group-hover:to-transparent' 
                    : 'from-amber-600/0 to-amber-600/0 group-hover:from-amber-600/5 group-hover:to-transparent'
                  }`}
                ></div>
                
                {/* Coming Soon Badge for the Pool Card */}
                {isPool && (
                  <span className="absolute top-6 right-6 bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-xs font-extrabold px-3.5 py-1.5 rounded-full uppercase tracking-wider shadow-[0_0_15px_rgba(37,99,235,0.4)] animate-pulse z-10">
                    {t("coming_soon_badge")}
                  </span>
                )}
                
                <div className="relative z-10 h-full flex flex-col">
                  <div className={`w-16 h-16 rounded-2xl bg-slate-900/80 border flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-all duration-500
                    ${isPool 
                      ? 'border-blue-500/20 group-hover:border-blue-500/50' 
                      : 'border-slate-700/50 group-hover:border-amber-500/50'
                    }`}
                  >
                    {featureIcons[idx]}
                  </div>
                  
                  <h3 className={`font-bold text-white mb-4 ${isFeatured ? 'text-3xl' : 'text-2xl'}`}>
                    {feature.title}
                  </h3>
                  
                  <p className={`text-slate-400 font-light flex-grow ${isFeatured ? 'text-lg max-w-2xl' : 'text-base'}`}>
                    {feature.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-slate-400 mb-8 italic">&quot;{t("subtitle")}&quot;</p>
          <a href="#reservation" className="inline-flex items-center px-8 py-4 rounded-full bg-transparent border-2 border-amber-600 text-amber-500 font-bold hover:bg-amber-600 hover:text-white transition-all duration-300 group shadow-[0_0_15px_rgba(217,119,6,0.1)] hover:shadow-[0_0_25px_rgba(217,119,6,0.4)]">
            Explore Activities
            <span className="ml-2 transform group-hover:translate-x-1 transition-transform rtl:rotate-180 rtl:group-hover:-translate-x-1">→</span>
          </a>
        </div>

      </div>
    </section>
  );
}
