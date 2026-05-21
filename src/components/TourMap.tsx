"use client";

import dynamic from "next/dynamic";

// Dynamically import the map component with SSR disabled
// This prevents 'window is not defined' errors during Next.js server-side rendering
const TourMapClient = dynamic(() => import("./TourMapClient"), { 
  ssr: false,
  loading: () => (
    <section className="py-24 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="w-full h-[500px] md:h-[600px] bg-slate-800 animate-pulse rounded-3xl flex items-center justify-center">
          <span className="text-slate-400 font-medium">Loading Map...</span>
        </div>
      </div>
    </section>
  )
});

export default function TourMap() {
  return <TourMapClient />;
}
