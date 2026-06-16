"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Clock, CheckCircle2, Calendar, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useSettings } from "@/lib/settings";

function ActivityCarousel({ images, title, duration }: { images: string[], title: string, duration: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const minSwipeDistance = 50;

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 4000); // Auto-scroll every 4 seconds
    return () => clearInterval(interval);
  }, [images.length, isHovered]);

  const handleNext = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    if (images.length <= 1) return;
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDotClick = (idx: number) => {
    setCurrentIndex(idx);
  };

  const onTouchStartHandler = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMoveHandler = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEndHandler = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <div 
      className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={onTouchStartHandler}
      onTouchMove={onTouchMoveHandler}
      onTouchEnd={onTouchEndHandler}
    >
      {/* Semi-transparent dark overlay */}
      <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
      
      {/* Sliding Images Container */}
      <div 
        className="w-full h-full flex transition-transform duration-700 cubic-bezier(0.16, 1, 0.3, 1)"
        style={{ 
          transform: `translateX(-${currentIndex * 100}%)`,
          direction: 'ltr' 
        }}
      >
        {images.map((img, idx) => {
          const src = img.startsWith('http') ? img : `/${img}`;
          return (
            <div key={idx} className="w-full h-full flex-shrink-0 relative">
              <Image
                src={src}
                alt={`${title} - view ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                unoptimized={src.startsWith('http')}
                className="object-cover transition-transform duration-[1500ms] ease-out group-hover:scale-102"
              />
            </div>
          );
        })}
      </div>

      {/* Manual Chevrons */}
      {images.length > 1 && (
        <>
          <button 
            onClick={(e) => { e.stopPropagation(); handlePrev(); }}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-slate-950/40 hover:bg-amber-600 text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-3 group-hover:translate-x-0 cursor-pointer shadow-lg"
            title="Previous Photo"
            aria-label="Previous Photo"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); handleNext(); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-slate-950/40 hover:bg-amber-600 text-white border border-white/10 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-3 group-hover:translate-x-0 cursor-pointer shadow-lg"
            title="Next Photo"
            aria-label="Next Photo"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* Floating Duration Badge */}
      {duration && (
        <div className="absolute bottom-6 rtl:right-6 ltr:left-6 rtl:left-auto right-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl z-20 border border-slate-200 dark:border-slate-700">
          <Clock className="w-4 h-4 text-amber-600" />
          <span className="font-semibold text-slate-900 dark:text-white text-sm">
            {duration}
          </span>
        </div>
      )}

      {/* Interactive Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2.5 z-20">
          {images.map((_, idx) => (
            <button 
              key={idx} 
              onClick={(e) => { e.stopPropagation(); handleDotClick(idx); }}
              className={`h-2.5 rounded-full transition-all duration-350 cursor-pointer ${
                idx === currentIndex 
                  ? 'w-6 bg-amber-500 shadow-md shadow-amber-500/20' 
                  : 'w-2.5 bg-white/50 hover:bg-white/85'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function formatPrice(priceStr: string, activeLocale: string) {
  if (!priceStr) return "";
  const match = priceStr.match(/\d+/);
  if (!match) return priceStr;
  const value = match[0];
  return activeLocale === "fr" ? `${value}€` : `$${value}`;
}

interface ActivityItem {
  id: string;
  static_id?: string;
  is_static?: boolean;
  images: string[];
  duration: string;
  coming_soon?: boolean;
  title?: string;
  description?: string;
  price?: string;
  subtitle?: string;
  schedule?: string;
  suitable?: string;
  includes?: string[];
  image_url?: string;
  [key: string]: string | boolean | string[] | undefined | null;
}

export default function Activities() {
  const t = useTranslations("Activities");
  const locale = useLocale();
  const settings = useSettings();
  const [activities, setActivities] = useState<ActivityItem[]>([]);

  useEffect(() => {
    async function fetchActivities() {
      if (!supabase) return;
      const { data } = await supabase
        .from('activities')
        .select('*')
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        const staticOrder = ["tour1", "tour2", "tour3", "tour5", "tour4"];
        const sorted = [...data].sort((a, b) => {
          const idxA = a.static_id ? staticOrder.indexOf(a.static_id) : -1;
          const idxB = b.static_id ? staticOrder.indexOf(b.static_id) : -1;
          
          if (idxA !== -1 && idxB !== -1) {
            return idxA - idxB;
          }
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          
          const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
          const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
          return dateA - dateB;
        });

        const processed = sorted.map(act => ({
          ...act,
          images: act.images && act.images.length > 0 
            ? act.images 
            : (act.image_url ? [act.image_url] : [])
        }));
        setActivities(processed);
      }
    }
    fetchActivities();
  }, []);

  return (
    <section id="activities" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute top-1/2 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            {t("section_title")} <span className="text-amber-600">{t("section_highlight")}</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
            {t("section_subtitle")}
          </p>
        </div>

        <div className="space-y-24">
          {activities.map((act, index) => {
            const isEven = index % 2 === 0;
            
            // Resolve localized vs dynamic text
            const title = (act[`title_${locale}`] || act.title || "") as string;
            const subtitle = (act[`subtitle_${locale}`] || act.subtitle || "") as string;
            const description = (act[`description_${locale}`] || act.description || "") as string;
            
            // Resolve price
            const price = act.price ? formatPrice(act.price, locale) : "";

            // Resolve duration
            const durationText = act.duration ? t("duration", { time: act.duration }) : "";

            // Resolve schedule and suitable fields
            const schedule = (act[`schedule_${locale}`] || act.schedule || "") as string;
            const suitable = (act[`suitable_${locale}`] || act.suitable || "") as string;

            // Resolve includes list
            let includesList: string[] = [];
            const localizedIncludes = act[`includes_${locale}`];
            if (Array.isArray(localizedIncludes) && localizedIncludes.length > 0) {
              includesList = localizedIncludes as string[];
            } else if (act.includes && act.includes.length > 0) {
              includesList = act.includes;
            }

            return (
              <div key={act.id || index} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center group`}>
                
                {/* Image Section */}
                <div className="w-full lg:w-1/2 relative">
                  <ActivityCarousel 
                    images={act.images && act.images.length > 0 ? act.images : ["images/hero.JPG"]} 
                    title={title} 
                    duration={durationText} 
                  />
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                      <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                        {title}
                      </h3>
                      {price && (
                        <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-black text-2xl rounded-xl border border-green-200 dark:border-green-800 shadow-sm whitespace-nowrap self-start">
                          {price}
                        </div>
                      )}
                    </div>
                    {subtitle && (
                      <p className="inline-block px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-full text-sm font-bold uppercase tracking-wider mb-4 mt-2 sm:mt-0">
                        {subtitle}
                      </p>
                    )}
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                      {description}
                    </p>
                  </div>

                  {/* Schedule & Suitable */}
                  {(schedule || suitable) && (
                    <div className="space-y-4">
                      {schedule && (
                        <div className="flex items-start gap-3">
                          <Calendar className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{t("schedule_label")}</p>
                            <p className="text-slate-600 dark:text-slate-400">{schedule}</p>
                          </div>
                        </div>
                      )}
                      {suitable && (
                        <div className="flex items-start gap-3">
                          <Users className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                          <div>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">{t("suitable_label")}</p>
                            <p className="text-slate-600 dark:text-slate-400">{suitable}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Includes List */}
                  {includesList && includesList.length > 0 && (
                    <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm mt-6">
                      <p className="font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">{t("includes_label")}</p>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {includesList.map((detail: string, idx: number) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span className="text-slate-700 dark:text-slate-300 text-sm">{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {act.coming_soon ? (
                      <div className="px-8 py-4 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-xl text-center w-full sm:w-auto uppercase tracking-wider cursor-not-allowed border border-slate-300 dark:border-slate-700">
                        {t("coming_soon")}
                      </div>
                    ) : (
                      <>
                        <a href="#reservation" className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all text-center shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                          {t("book_now")}
                        </a>
                        <a href={`https://wa.me/${settings.phone_number}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold rounded-xl transition-all text-center">
                          {t("whatsapp")}
                        </a>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
