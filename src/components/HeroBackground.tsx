"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const IMAGES = [
  { src: "/images/hero.JPG", alt: "Desert adventure" },
  { src: "/images/QuadAgadir1.JPG", alt: "Quad Biking on Dunes" },
  { src: "/images/buggyAgadir1.JPG", alt: "Buggy Riding adventure" },
  { src: "/images/quadAgadirNight/AgadirNight1.JPG", alt: "Dune sunset tours" },
  { src: "/images/AgadirTour/AgadirTour1.jpg", alt: "Agadir sights tour" },
];

export default function HeroBackground() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % IMAGES.length);
    }, 6000); // Change image every 6 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute inset-0 bg-slate-950 z-0">
      {/* CSS Animations */}
      <style>{`
        @keyframes kenburns-0 {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.12) translate(-1%, -1%); }
        }
        @keyframes kenburns-1 {
          0% { transform: scale(1.12) translate(1%, 1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        @keyframes kenburns-2 {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.12) translate(1%, -1%); }
        }
        @keyframes kenburns-3 {
          0% { transform: scale(1.12) translate(-1%, 1%); }
          100% { transform: scale(1) translate(0, 0); }
        }
        @keyframes kenburns-4 {
          0% { transform: scale(1) translate(0, 0); }
          100% { transform: scale(1.15) translate(0, 0); }
        }
        .animate-kb-0 { animation: kenburns-0 7s ease-out forwards; }
        .animate-kb-1 { animation: kenburns-1 7s ease-out forwards; }
        .animate-kb-2 { animation: kenburns-2 7s ease-out forwards; }
        .animate-kb-3 { animation: kenburns-3 7s ease-out forwards; }
        .animate-kb-4 { animation: kenburns-4 7s ease-out forwards; }
      `}</style>

      {/* Dark overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/40 to-slate-950/90 z-10"></div>

      {IMAGES.map((img, idx) => {
        const isActive = idx === activeIndex;
        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ${
              isActive ? "opacity-60 z-0" : "opacity-0 -z-10"
            }`}
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className={`object-cover ${
                isActive ? `animate-kb-${idx % 5}` : ""
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
