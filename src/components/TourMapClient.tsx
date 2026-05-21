"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Clock, Sun } from "lucide-react";

function MapController({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const timer = setTimeout(() => {
      map.flyTo(center, zoom, { duration: 1.5 });
    }, 100); // Short timeout to prevent Strict Mode double-invocation race conditions
    return () => clearTimeout(timer);
  }, [center, zoom, map]);
  return null;
}

export default function TourMapClient() {
  const [activeRoute, setActiveRoute] = useState<'2hour' | 'fullday'>('fullday');

  useEffect(() => {
    // Fix Leaflet icons for Next.js
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    });
  }, []);

  // Shared Base Coordinate (Agadir Takadt / Land of Sand area)
  const base: [number, number] = [30.245, -9.560];

  // Exact Coordinates from the uploaded map for "Full Day to Massa"
  const coast1: [number, number] = [30.240, -9.600];
  const tifnit: [number, number] = [30.200, -9.643];
  const douira: [number, number] = [30.133, -9.663];
  const sidiRbat: [number, number] = [30.088, -9.658];
  const arhbalou: [number, number] = [30.035, -9.645];
  const aitSaleh: [number, number] = [30.015, -9.620];
  const massa: [number, number] = [30.042, -9.664];

  const fullDayRoute: [number, number][] = [base, coast1, tifnit, douira, sidiRbat, arhbalou, aitSaleh, massa];

  // Coordinates for the standard 2-hour tour (loop to Tifnit and back via coast)
  const tifnit2h: [number, number] = [30.200, -9.643];
  const coastReturn1: [number, number] = [30.215, -9.645];
  const coastReturn2: [number, number] = [30.230, -9.635];
  
  const shortRoute: [number, number][] = [base, tifnit2h, coastReturn1, coastReturn2, base];

  // Dynamic Map Settings
  const currentRoute = activeRoute === 'fullday' ? fullDayRoute : shortRoute;
  const mapCenter = activeRoute === 'fullday' ? [30.15, -9.6] as [number, number] : [30.23, -9.58] as [number, number];
  const mapZoom = activeRoute === 'fullday' ? 10 : 12;

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            Our Adventure <span className="text-amber-600">Routes</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-8">
            Select an activity to see the exact path we take through the stunning Agadir desert, Berber villages, and isolated beaches.
          </p>

          {/* Route Toggle Buttons */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <button 
              onClick={() => setActiveRoute('2hour')}
              className={`flex-1 py-3 px-6 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeRoute === '2hour' ? 'bg-amber-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              <Clock className="w-5 h-5" /> 2-Hour Tours
            </button>
            <button 
              onClick={() => setActiveRoute('fullday')}
              className={`flex-1 py-3 px-6 rounded-full font-bold transition-all duration-300 flex items-center justify-center gap-2 ${activeRoute === 'fullday' ? 'bg-amber-600 text-white shadow-lg scale-105' : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'}`}
            >
              <Sun className="w-5 h-5" /> Full Day to Massa
            </button>
          </div>
        </div>

        <div className="w-full h-[500px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 relative z-20 group">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            scrollWheelZoom={false} 
            className="w-full h-full z-10"
            attributionControl={false}
          >
            <MapController center={mapCenter} zoom={mapZoom} />
            
            {/* High-end Dark Theme Map Tiles */}
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/rastertiles/dark_all/{z}/{x}/{y}{r}.png"
            />
            
            {/* Animated Route Line */}
            <Polyline 
              positions={currentRoute} 
              color={activeRoute === 'fullday' ? "#ef4444" : "#f59e0b"} // Red for full day (matching image), Amber for 2H
              weight={5} 
              opacity={0.8} 
              dashArray={activeRoute === 'fullday' ? "" : "15, 10"} // Solid line for full day, dashed for 2H
              className={activeRoute === '2hour' ? "animate-[dash_20s_linear_infinite]" : ""}
            />

            {/* Base Marker */}
            <Marker position={base}>
              <Popup className="custom-popup">
                <div className="font-bold text-slate-900">Land of Sand Base</div>
                <div className="text-sm">Start your adventure here.</div>
              </Popup>
            </Marker>
            
            {/* Conditional Route Markers */}
            {activeRoute === 'fullday' ? (
              <>
                <Marker position={tifnit}>
                  <Popup><div className="font-bold text-slate-900">Tifnit</div><div className="text-sm">Coastal fishing village</div></Popup>
                </Marker>
                <Marker position={massa}>
                  <Popup><div className="font-bold text-slate-900">Massa</div><div className="text-sm">Full Day Trip Destination</div></Popup>
                </Marker>
              </>
            ) : (
              <>
                <Marker position={tifnit2h}>
                  <Popup><div className="font-bold text-slate-900">Tifnit Coast</div><div className="text-sm">Turnaround point.</div></Popup>
                </Marker>
              </>
            )}
          </MapContainer>

          {/* Floating UI overlay for Map Info */}
          <div className="absolute bottom-4 left-4 md:top-4 md:bottom-auto md:right-4 md:left-auto z-[400] bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-white/10 shadow-2xl transform transition-transform duration-500 hover:scale-105">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2 text-lg">
              <Navigation className={`w-5 h-5 ${activeRoute === 'fullday' ? 'text-red-500' : 'text-amber-500'}`} /> Route Highlights
            </h4>
            <ul className="text-sm text-slate-300 space-y-4">
              <li className="flex items-center gap-3">
                <div className="relative">
                  <div className={`w-3 h-3 rounded-full z-10 relative ${activeRoute === 'fullday' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                  <div className={`absolute inset-0 rounded-full animate-ping opacity-50 ${activeRoute === 'fullday' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                </div>
                <span className="font-medium">1. Land of Sand Base</span>
              </li>
              <li className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full opacity-50 ${activeRoute === 'fullday' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                <span className="font-medium text-slate-400">
                  {activeRoute === 'fullday' ? '2. Tifnit & Douira Coast' : '2. Straight to Tifnit'}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full opacity-50 ${activeRoute === 'fullday' ? 'bg-red-500' : 'bg-amber-500'}`}></div>
                <span className="font-medium text-slate-400">
                  {activeRoute === 'fullday' ? '3. Massa National Park' : '3. Coastal Return Loop'}
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
