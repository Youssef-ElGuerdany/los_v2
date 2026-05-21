"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";
import { useRef, useEffect, useState } from "react";

// A simple Google G Logo SVG component
const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
      <path fill="#4285F4" d="M -3.264,51.509 C -3.264,50.719 -3.334,49.969 -3.454,49.239 L -14.754,49.239 L -14.754,53.749 L -8.284,53.749 C -8.574,55.229 -9.424,56.479 -10.684,57.329 L -10.684,60.329 L -6.824,60.329 C -4.564,58.239 -3.264,55.159 -3.264,51.509 z" />
      <path fill="#34A853" d="M -14.754,63.239 C -11.514,63.239 -8.804,62.159 -6.824,60.329 L -10.684,57.329 C -11.764,58.049 -13.134,58.489 -14.754,58.489 C -17.884,58.489 -20.534,56.379 -21.484,53.529 L -25.464,53.529 L -25.464,56.619 C -23.494,60.539 -19.444,63.239 -14.754,63.239 z" />
      <path fill="#FBBC05" d="M -21.484,53.529 C -21.734,52.809 -21.864,52.039 -21.864,51.239 C -21.864,50.439 -21.724,49.669 -21.484,48.949 L -21.484,45.859 L -25.464,45.859 C -26.284,47.479 -26.754,49.299 -26.754,51.239 C -26.754,53.179 -26.284,54.999 -25.464,56.619 L -21.484,53.529 z" />
      <path fill="#EA4335" d="M -14.754,43.989 C -12.984,43.989 -11.404,44.599 -10.154,45.789 L -6.734,42.369 C -8.804,40.429 -11.514,39.239 -14.754,39.239 C -19.444,39.239 -23.494,41.939 -25.464,45.859 L -21.484,48.949 C -20.534,46.099 -17.884,43.989 -14.754,43.989 z" />
    </g>
  </svg>
);

export default function Reviews() {
  const t = useTranslations("Reviews");
  const reviewsData = t.raw("reviews") as Array<{name: string, date: string, text: string}>;
  
  // We duplicate the reviews array so the marquee seamlessly repeats
  const duplicatedReviews = [...reviewsData, ...reviewsData];

  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollAmount = 1;

    const scroll = () => {
      if (!isHovered) {
        container.scrollLeft += scrollAmount;
        if (container.scrollLeft >= container.scrollWidth / 2) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  return (
    <section id="reviews" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 overflow-hidden relative">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-20 -right-20 w-72 h-72 bg-amber-600/5 rounded-full blur-[80px]"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-[80px]"></div>
      </div>

      <div className="relative z-10 w-full">
        
        {/* Section Header */}
        <div className="text-center mb-16 px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {t("title")} <span className="text-amber-600">{t("title_highlight")}</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Infinite Horizontal Marquee with Manual Scroll */}
        <div 
          className="relative w-full flex items-center group/marquee"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          {/* Gradient fade on edges for smooth entry/exit */}
          <div className="absolute top-0 bottom-0 left-0 w-12 md:w-24 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-20 pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-12 md:w-24 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-20 pointer-events-none"></div>

          <div 
            ref={scrollRef}
            className="flex w-full overflow-x-auto gap-6 py-8 px-4 scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] cursor-grab active:cursor-grabbing"
          >
            {duplicatedReviews.map((review, idx) => (
              <div 
                key={idx} 
                className="w-[300px] md:w-[450px] shrink-0 bg-slate-50 dark:bg-slate-800/50 backdrop-blur-md border border-slate-200 dark:border-slate-700/50 p-6 md:p-8 rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 flex flex-col"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <GoogleIcon />
                </div>
                
                <p className="text-slate-700 dark:text-slate-300 text-base md:text-lg flex-grow mb-8 italic leading-relaxed whitespace-normal">
                  "{review.text}"
                </p>
                
                <div className="flex items-center gap-4 mt-auto">
                  <div className="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center font-bold text-xl text-slate-600 dark:text-slate-300 uppercase shrink-0">
                    {review.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1">{review.name}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{review.date}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Google Maps Button */}
        <div className="text-center mt-12 px-4">
          <a 
            href="https://maps.app.goo.gl/DNAJhhJEiW417PDo6" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center justify-center px-8 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 rounded-full shadow-md hover:shadow-xl transition-all duration-300 group"
          >
            <div className="mr-3 rtl:mr-0 rtl:ml-3">
              <GoogleIcon />
            </div>
            <span className="text-slate-900 dark:text-white font-bold group-hover:text-amber-600 dark:group-hover:text-amber-500 transition-colors">
              {t("google_button")}
            </span>
            <span className="ml-2 rtl:ml-0 rtl:mr-2 text-slate-400 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
              →
            </span>
          </a>
        </div>

      </div>
    </section>
  );
}
