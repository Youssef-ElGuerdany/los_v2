"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function FAQ() {
  const t = useTranslations("FAQ");
  const locale = useLocale();
  const [faqs, setFaqs] = useState<{ q: string, a: string }[]>(() => {
    try {
      return t.raw("items") as Array<{q: string, a: string}>;
    } catch {
      return [];
    }
  });
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  useEffect(() => {
    let active = true;

    async function loadFaqs() {
      await Promise.resolve(); // Force execution to the next microtask to avoid react-hooks/set-state-in-effect warning
      const staticFaqs = t.raw("items") as Array<{q: string, a: string}>;
      
      if (!supabase) {
        if (active) setFaqs(staticFaqs);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("faqs")
          .select("*")
          .order("sort_order", { ascending: true })
          .order("created_at", { ascending: true });

        if (!active) return;

        if (!error && data && data.length > 0) {
          const mapped = data.map(item => ({
            q: item[`q_${locale}`] || item.q,
            a: item[`a_${locale}`] || item.a
          }));
          setFaqs(mapped);
        } else {
          setFaqs(staticFaqs);
        }
      } catch (err) {
        console.error("Failed to load FAQs from Supabase:", err);
        if (active) {
          setFaqs(staticFaqs);
        }
      }
    }
    loadFaqs();
    return () => {
      active = false;
    };
  }, [locale, t]);

  const toggleAccordion = (index: number) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <section id="faq" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {t("title")} <span className="text-amber-600">{t("title_highlight")}</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((item: { q: string, a: string }, idx: number) => {
            const isOpen = openIndex === idx;
            return (
              <div 
                key={idx} 
                className={`border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'bg-slate-50 dark:bg-slate-800/50 shadow-md' : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}
              >
                <button 
                  onClick={() => toggleAccordion(idx)}
                  className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none"
                >
                  <span className="font-semibold text-lg text-slate-900 dark:text-white pr-8 rtl:pr-0 rtl:pl-8">
                    {item.q}
                  </span>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center transition-transform duration-300 ${isOpen ? 'rotate-180 bg-amber-500 text-white' : 'text-amber-600'}`}>
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </button>
                
                <div 
                  className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                >
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed border-t border-slate-100 dark:border-slate-800 pt-4">
                    {item.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
