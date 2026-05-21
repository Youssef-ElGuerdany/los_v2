"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

export default function Gallery() {
  const t = useTranslations("Gallery");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const images = [
    { src: "/images/DSC_5976.JPG", aspect: "aspect-[4/3]" },
    { src: "/images/DSC_6002.JPG", aspect: "aspect-[3/4]" },
    { src: "/images/DSC_6005.JPG", aspect: "aspect-square" },
    { src: "/images/DSC_6015.JPG", aspect: "aspect-[3/4]" },
    { src: "/images/DSC_6154.JPG", aspect: "aspect-[4/3]" },
    { src: "/images/DSC_6211.JPG", aspect: "aspect-square" },
    { src: "/images/DSC_6225.JPG", aspect: "aspect-[4/3]" },
    { src: "/images/DSC_6228.JPG", aspect: "aspect-[3/4]" },
    { src: "/images/DSC_6292.JPG", aspect: "aspect-[4/3]" },
    { src: "/images/DSC_6353.JPG", aspect: "aspect-square" },
    { src: "/images/DSC_6360.JPG", aspect: "aspect-[3/4]" },
    { src: "/images/DSC_6368.JPG", aspect: "aspect-[4/3]" },
    { src: "/images/DSC_6371.JPG", aspect: "aspect-square" },
    { src: "/images/DSC_6380.JPG", aspect: "aspect-[3/4]" },
    { src: "/images/DSC_6387.JPG", aspect: "aspect-[4/3]" },
    { src: "/images/DSC_6395.JPG", aspect: "aspect-[3/4]" },
    { src: "/images/IMG_20230611_002038.jpg", aspect: "aspect-square" },
  ];

  // Prevent body scrolling when lightbox is open
  useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedImage]);

  // Auto-scroll logic for mobile
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let animationId: number;
    let scrollAmount = 1;

    const scroll = () => {
      // Only auto-scroll on mobile views (< 768px) and when not hovering/touching
      if (!isHovered && window.innerWidth < 768) {
        container.scrollLeft += scrollAmount;
        // Loop back to start if reached the end
        if (container.scrollLeft >= container.scrollWidth - container.clientWidth - 1) {
          container.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  return (
    <section id="gallery" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {t("title")} <span className="text-amber-600">{t("title_highlight")}</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Gallery Grid (Auto-scroll flex row on Mobile, Grid on Desktop) */}
        <div 
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          onTouchStart={() => setIsHovered(true)}
          onTouchEnd={() => setIsHovered(false)}
        >
          <div 
            ref={scrollRef}
            className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible pb-8 md:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] scroll-smooth"
          >
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`flex-shrink-0 w-[280px] sm:w-[320px] md:w-auto relative group overflow-hidden rounded-2xl cursor-pointer aspect-square md:${img.aspect} shadow-lg hover:shadow-2xl transition-all duration-500 animate-[fadeIn_0.6s_ease-out_both]`}
                style={{ animationDelay: `${idx * 50}ms` }}
                onClick={() => setSelectedImage(img.src)}
              >
                <Image 
                  src={img.src} 
                  alt={`Gallery image ${idx + 1}`} 
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                
                {/* Glassmorphism Hover Overlay */}
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/40 backdrop-blur-[2px] transition-all duration-500 flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/20 backdrop-blur-md p-3 rounded-full border border-white/30 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-500 shadow-xl">
                    <ZoomIn className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Lightweight Custom Lightbox */}
      <div 
        className={`fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/95 backdrop-blur-lg transition-all duration-500 ${selectedImage ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={() => setSelectedImage(null)}
      >
        {/* Close Button */}
        <button 
          className="absolute top-6 right-6 p-4 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md border border-white/10 transition-colors z-[101]"
          onClick={(e) => { e.stopPropagation(); setSelectedImage(null); }}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Main Image */}
        {selectedImage && (
          <div 
            className="relative w-[90%] max-w-5xl h-[80vh] flex items-center justify-center"
            onClick={(e) => e.stopPropagation()} // Prevent clicking image from closing lightbox
          >
            <Image 
              src={selectedImage}
              alt="Enlarged gallery image"
              fill
              sizes="100vw"
              className="object-contain animate-[fadeIn_0.5s_ease-out]"
            />
          </div>
        )}
      </div>

    </section>
  );
}
