"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Clock, CheckCircle2, MapPin, Calendar, Users, Camera, Car } from "lucide-react";

function ActivityCarousel({ images, title, duration }: { images: string[], title: string, duration: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % images.length);
    }, 3000); // Auto-scroll every 3 seconds
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl group">
      <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors duration-500 z-10 pointer-events-none"></div>
      
      {images.map((img, idx) => (
        <Image
          key={idx}
          src={`/${img}`}
          alt={`${title} - view ${idx + 1}`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className={`object-cover transition-opacity duration-1000 ${
            idx === currentIndex ? "opacity-100" : "opacity-0"
          } transition-transform duration-700 group-hover:scale-105`}
        />
      ))}

      {/* Floating Duration Badge */}
      {duration && (
        <div className="absolute bottom-6 rtl:right-6 ltr:left-6 rtl:left-auto right-auto bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl flex items-center gap-2 shadow-xl z-20 border border-slate-200 dark:border-slate-700">
          <Clock className="w-4 h-4 text-amber-600" />
          <span className="font-semibold text-slate-900 dark:text-white text-sm">
            {duration}
          </span>
        </div>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
          {images.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-6 bg-amber-500' : 'w-2 bg-white/50'}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Activities() {
  const t = useTranslations("Activities");
  const [dynamicActivities, setDynamicActivities] = useState<any[]>([]);

  useEffect(() => {
    async function fetchDynamic() {
      if (!supabase) return;
      const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
      if (data) setDynamicActivities(data);
    }
    fetchDynamic();
  }, []);

  const activitiesData = [
    {
      id: "tour1",
      images: [
        "images/QuadAgadir1.JPG", 
        "images/quadagadir2.JPG", 
        "images/QuadAgadir3.JPG", 
        "images/quadagadir4.JPG"
      ],
      icon: <Car className="w-5 h-5" />,
      duration: "2 Hours"
    },
    {
      id: "tour2",
      images: [
        "images/buggyAgadir1.JPG",
        "images/buggyAgadir2.JPG",
        "images/buggyAgadir3.JPG",
        "images/buggyAgadir4.JPG",
        "images/buggyAgadir5.JPG"
      ],
      icon: <Camera className="w-5 h-5" />,
      duration: "2 Hours"
    },
    {
      id: "tour3",
      images: [
        "images/Gnawa/GnawaEvent1.png",
        "images/Gnawa/GnawaEvent2.png",
        "images/Gnawa/GnawaEvent3.png",
        "images/Gnawa/GnawaEvent4.png",
        "images/Gnawa/GnawaEvent5.png",
        "images/Gnawa/GnawaEvent6.jpg",
        "images/Gnawa/GnawaEvent7.jpg"
      ],
      icon: <MapPin className="w-5 h-5" />,
      duration: "" // No duration displayed for Gnawa Night
    },
    {
      id: "tour5",
      images: [
        "images/AgadirTour/AgadirTour1.jpg",
        "images/AgadirTour/AgadirTour2.jpg",
        "images/AgadirTour/AgadirTour3.jpg",
        "images/AgadirTour/AgadirTour4.jpg",
        "images/AgadirTour/AgadirTour5.jpg",
        "images/AgadirTour/AgadirTour6.jpg",
        "images/AgadirTour/AgadirTour7.jpg",
        "images/AgadirTour/AgadirTour8.jpg",
        "images/AgadirTour/AgadirTour9.jpg",
        "images/AgadirTour/AgadirTour10.jpg",
        "images/AgadirTour/AgadirTour11.jpg"
      ],
      icon: <MapPin className="w-5 h-5" />,
      duration: "10:00 AM - 5:00 PM"
    },
    {
      id: "tour4",
      images: [
        "images/quadAgadirNight/AgadirNight1.JPG",
        "images/quadAgadirNight/AgadirNight2.JPG"
      ],
      icon: <Users className="w-5 h-5" />,
      duration: "Full Day",
      comingSoon: true
    }
  ];

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
          {activitiesData.map((act, index) => {
            const isEven = index % 2 === 0;
            return (
              <div key={act.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center group`}>
                
                {/* Image Section */}
                <div className="w-full lg:w-1/2 relative">
                  <ActivityCarousel 
                    images={act.images} 
                    title={t(`${act.id}.title`)} 
                    duration={t("duration", { time: act.duration })} 
                  />
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                      <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                        {t(`${act.id}.title`)}
                      </h3>
                      {t(`${act.id}.price`) !== "" && (
                        <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-black text-2xl rounded-xl border border-green-200 dark:border-green-800 shadow-sm whitespace-nowrap self-start">
                          {t(`${act.id}.price`)}
                        </div>
                      )}
                    </div>
                    <p className="inline-block px-4 py-1.5 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-500 rounded-full text-sm font-bold uppercase tracking-wider mb-4 mt-2 sm:mt-0">
                      {t(`${act.id}.subtitle`)}
                    </p>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                      {t(`${act.id}.description`)}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <Calendar className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{t("schedule_label")}</p>
                        <p className="text-slate-600 dark:text-slate-400">{t(`${act.id}.schedule`)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="w-5 h-5 text-amber-500 flex-shrink-0 mt-1" />
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">{t("suitable_label")}</p>
                        <p className="text-slate-600 dark:text-slate-400">{t(`${act.id}.suitable`)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-slate-900/50 rounded-2xl p-6 border border-slate-100 dark:border-slate-800 shadow-sm mt-6">
                    <p className="font-bold text-slate-900 dark:text-white mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">{t("includes_label")}</p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {t.raw(`${act.id}.includes`).map((detail: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-700 dark:text-slate-300 text-sm">{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    {act.comingSoon ? (
                      <div className="px-8 py-4 bg-slate-200 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-bold rounded-xl text-center w-full sm:w-auto uppercase tracking-wider cursor-not-allowed border border-slate-300 dark:border-slate-700">
                        {t("coming_soon")}
                      </div>
                    ) : (
                      <>
                        <a href="#reservation" className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all text-center shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                          {t("book_now")}
                        </a>
                        <a href="https://wa.me/212661374773" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold rounded-xl transition-all text-center">
                          {t("whatsapp")}
                        </a>
                      </>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
          
          {/* Render Dynamic Activities from Supabase */}
          {dynamicActivities.map((act, idx) => {
            const index = activitiesData.length + idx;
            const isEven = index % 2 === 0;
            return (
              <div key={act.id} className={`flex flex-col ${isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-12 items-center group`}>
                <div className="w-full lg:w-1/2 relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl">
                  {act.image_url ? (
                    <Image src={act.image_url} alt={act.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover transition-transform duration-700 hover:scale-105" />
                  ) : (
                    <div className="w-full h-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center">No Image</div>
                  )}
                </div>
                <div className="w-full lg:w-1/2 space-y-6">
                  <div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                      <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">{act.title}</h3>
                      {act.price && (
                        <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-black text-2xl rounded-xl border border-green-200 dark:border-green-800 shadow-sm whitespace-nowrap self-start">
                          {act.price}
                        </div>
                      )}
                    </div>
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mt-4">{act.description}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-4 pt-4">
                    <a href="#reservation" className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl transition-all text-center shadow-[0_0_15px_rgba(217,119,6,0.3)]">
                      {t("book_now")}
                    </a>
                    <a href="https://wa.me/212661374773" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-8 py-4 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 dark:hover:bg-slate-700 text-white font-semibold rounded-xl transition-all text-center">
                      {t("whatsapp")}
                    </a>
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
