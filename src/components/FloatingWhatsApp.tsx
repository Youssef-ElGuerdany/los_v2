"use client";

import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { useSettings } from "@/lib/settings";

export default function FloatingWhatsApp() {
  const settings = useSettings();
  const [isVisible, setIsVisible] = useState(false);
  const [showBubble, setShowBubble] = useState(false);
  const [closed, setClosed] = useState(false);

  // Delay the appearance of the button, then pop open the bubble
  useEffect(() => {
    const btnTimer = setTimeout(() => {
      setIsVisible(true);
      
      // Pop the bubble open 1 second after the button appears
      const bubbleTimer = setTimeout(() => {
        if (!closed) setShowBubble(true);
      }, 1000);
      
      return () => clearTimeout(bubbleTimer);
    }, 1500);
    
    return () => clearTimeout(btnTimer);
  }, [closed]);

  const handleClose = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowBubble(false);
    setClosed(true);
  };

  return (
    <div className={`fixed bottom-6 right-6 rtl:right-auto rtl:left-6 z-50 flex flex-col items-end rtl:items-start transition-all duration-500 ${isVisible ? "translate-y-0 opacity-100" : "translate-y-20 opacity-0"}`}>
      
      {/* Concierge Bubble */}
      <div 
        className={`mb-4 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden transition-all duration-500 origin-bottom-right rtl:origin-bottom-left ${showBubble ? 'scale-100 opacity-100 translate-y-0' : 'scale-50 opacity-0 translate-y-4 pointer-events-none'}`}
      >
        <div className="bg-amber-500 p-4 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-amber-500 rounded-full"></span>
            </div>
            <div>
              <h4 className="font-bold text-sm leading-tight">Land of Sand Concierge</h4>
              <p className="text-[11px] text-white/90">Typically replies instantly</p>
            </div>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-white/20 rounded-full transition-colors text-white/80 hover:text-white" aria-label="Close chat bubble">
            <X className="w-4 h-4" />
          </button>
        </div>
        <a href={`https://wa.me/${settings.phone_number}`} target="_blank" rel="noopener noreferrer" className="block p-5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <p className="text-sm text-slate-700 dark:text-slate-300 font-medium leading-relaxed">
            👋 Hello! Planning an adventure in Agadir? Let&apos;s chat and build your perfect tour!
          </p>
        </a>
      </div>

      {/* Main Button */}
      <a
        href={`https://wa.me/${settings.phone_number}`}
        target="_blank"
        rel="noopener noreferrer"
        className="relative flex items-center justify-center w-16 h-16 bg-green-500 text-white rounded-full shadow-[0_4px_20px_rgba(34,197,94,0.4)] hover:bg-green-600 transition-all duration-500 hover:scale-110 group"
        aria-label="Chat on WhatsApp"
        onMouseEnter={() => { if(!closed) setShowBubble(true) }}
      >
        <MessageCircle className="w-8 h-8" />
        
        {/* Pulse Effect */}
        <span className="absolute w-full h-full bg-green-500 rounded-full animate-ping opacity-20 pointer-events-none"></span>
      </a>
    </div>
  );
}
