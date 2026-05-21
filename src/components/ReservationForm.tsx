"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState } from "react";
import { CheckCircle2, ShieldCheck, CreditCard, Car, Calendar, Users, Activity, Receipt } from "lucide-react";

export default function ReservationForm() {
  const t = useTranslations("Reservation");
  const locale = useLocale();
  const currency = locale === "fr" ? "€" : "$";
  
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    activities: t("quad_tour"),
    persons: 2,
    numQuads: 1,
    numBuggies: 1,
    numCamel: 0,
    numSandboard: 0
  });

  const updateData = (key: string, value: any) => {
    setFormData(prev => {
      const next = { ...prev, [key]: value };
      
      // Ensure basic lower limits
      if (next.numQuads < 1) next.numQuads = 1;
      if (next.numBuggies < 1) next.numBuggies = 1;
      if (next.persons < 1) next.persons = 1;
      if (next.numCamel < 0) next.numCamel = 0;
      if (next.numSandboard < 0) next.numSandboard = 0;
      
      // Smart Auto-Adjust based on what the user changed
      if (
        next.activities === t("quad_tour") || 
        next.activities === t("buggy_tour") || 
        next.activities === t("quad_buggy_mix")
      ) {
        
        // 1. If user changed PERSONS
        if (key === "persons" || key === "activities") {
          // Auto-add vehicles if they exceed capacity
          if (next.activities === t("quad_tour") && next.persons > next.numQuads * 2) {
             next.numQuads = Math.ceil(next.persons / 2);
          } else if (next.activities === t("buggy_tour") && next.persons > next.numBuggies * 2) {
             next.numBuggies = Math.ceil(next.persons / 2);
          } else if (next.activities === t("quad_buggy_mix")) {
             let capacity = (next.numQuads * 2) + (next.numBuggies * 2);
             if (next.persons > capacity) {
                next.numQuads += Math.ceil((next.persons - capacity) / 2);
             }
          }
          
          // Reduce vehicles if vehicles exceed people
          if (next.activities === t("quad_tour") && next.persons < next.numQuads) {
             next.numQuads = next.persons;
          } else if (next.activities === t("buggy_tour") && next.persons < next.numBuggies) {
             next.numBuggies = next.persons;
          } else if (next.activities === t("quad_buggy_mix") && next.persons < next.numQuads + next.numBuggies) {
             let excess = (next.numQuads + next.numBuggies) - next.persons;
             if (next.numQuads >= excess) next.numQuads -= excess;
             else {
               excess -= next.numQuads;
               next.numQuads = 0;
               next.numBuggies -= excess;
             }
             if (next.numQuads === 0 && next.numBuggies > 0 && next.persons > 1) {
                next.numQuads = 1;
                next.numBuggies = Math.max(1, next.persons - 1);
             }
          }
        }
        
        // 2. If user changed VEHICLES (numQuads or numBuggies)
        if (key === "numQuads" || key === "numBuggies") {
           // Auto-add persons if vehicles exceed persons (you need at least 1 driver per vehicle)
           if (next.activities === t("quad_tour") && next.numQuads > next.persons) {
              next.persons = next.numQuads;
           } else if (next.activities === t("buggy_tour") && next.numBuggies > next.persons) {
              next.persons = next.numBuggies;
           } else if (next.activities === t("quad_buggy_mix") && (next.numQuads + next.numBuggies) > next.persons) {
              next.persons = next.numQuads + next.numBuggies;
           }
           
           // Auto-reduce persons if they exceed total capacity of new vehicle selection
           if (next.activities === t("quad_tour") && next.numQuads * 2 < next.persons) {
              next.persons = next.numQuads * 2;
           } else if (next.activities === t("buggy_tour") && next.numBuggies * 2 < next.persons) {
              next.persons = next.numBuggies * 2;
           } else if (next.activities === t("quad_buggy_mix") && (next.numQuads * 2 + next.numBuggies * 2) < next.persons) {
              next.persons = (next.numQuads * 2) + (next.numBuggies * 2);
           }
        }
      }

      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check for add-ons
    let addonsText = "";
    if (formData.numCamel > 0 || formData.numSandboard > 0) {
      const selectedAddons = [];
      if (formData.numCamel > 0) selectedAddons.push(`${formData.numCamel}x ${t("addon_camel")}`);
      if (formData.numSandboard > 0) selectedAddons.push(`${formData.numSandboard}x ${t("addon_sandboard")}`);
      addonsText = `\n*Add-ons:* ${selectedAddons.join(", ")}`;
    }

    // Check for vehicle counts
    let vehiclesText = "";
    if (formData.activities === t("quad_tour")) {
      vehiclesText = `\n*${t("quads_count")}:* ${formData.numQuads}`;
    } else if (formData.activities === t("buggy_tour")) {
      vehiclesText = `\n*${t("buggies_count")}:* ${formData.numBuggies}`;
    } else if (formData.activities === t("quad_buggy_mix")) {
      vehiclesText = `\n*${t("quads_count")}:* ${formData.numQuads}\n*${t("buggies_count")}:* ${formData.numBuggies}`;
    }

    // Calculate total amount for the WhatsApp message
    let total = 0;
    if (formData.activities === t("quad_tour")) {
      total += formData.numQuads * 25;
    } else if (formData.activities === t("buggy_tour")) {
      total += formData.numBuggies * 50;
    } else if (formData.activities === t("quad_buggy_mix")) {
      total += (formData.numQuads * 25) + (formData.numBuggies * 50);
    }
    
    if (formData.activities === t("quad_tour") || formData.activities === t("buggy_tour") || formData.activities === t("quad_buggy_mix")) {
      total += formData.numCamel * 5;
      total += formData.numSandboard * 4;
    }

    const totalStr = total > 0 ? `\n\n*Total Amount:* ${locale === 'fr' ? total + currency : currency + total} (Pay on Arrival)` : "";

    // Format WhatsApp message
    const message = `Hello Land of Sand! I would like to book an adventure:\n\n*Name:* ${formData.name}\n*Date:* ${formData.date}\n*Activity:* ${formData.activities}${vehiclesText}\n*Number of People:* ${formData.persons}${addonsText}${totalStr}\n\nPlease let me know the availability!`;
    
    // Redirect to WhatsApp safely (avoids popup blockers)
    window.location.href = `https://wa.me/212661374773?text=${encodeURIComponent(message)}`;
  };

  // The actual localized values from our JSON files
  const activitiesList = [
    t("quad_tour"),
    t("buggy_tour"),
    t("quad_buggy_mix"),
    t("moroccan_nights"),
    t("overnight_stays"),
    t("massa_offroad")
  ];

  return (
    <section id="reservation" className="py-24 bg-slate-900 transition-colors relative overflow-hidden">
      {/* Decorative Blur */}
      <div className="absolute top-1/4 -right-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Left Side: Trust & Info */}
        <div className="w-full lg:w-1/2 space-y-8">
          <div className="text-left">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {t("title")} <span className="text-amber-500">{t("title_highlight")}</span>
            </h2>
            <p className="text-xl text-slate-400">
              {t("subtitle")}
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-green-500/20 rounded-full text-green-500">
                <CreditCard size={24} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">No Prepayment Required</p>
                <p className="text-slate-400">{t("no_card")}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-blue-500/20 rounded-full text-blue-400">
                <Car size={24} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Free Transport</p>
                <p className="text-slate-400">{t("free_pickup")}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500/20 rounded-full text-amber-500">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-lg font-bold text-white">Trust & Safety Promises</p>
                <p className="text-slate-400">{t("cancellation")}</p>
                <p className="text-slate-400 mt-2">{t("safety")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Simple Form */}
        <div className="w-full lg:w-1/2">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-950 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
            
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("name")}</label>
              <input type="text" required value={formData.name} onChange={(e) => updateData("name", e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-amber-500 text-slate-900 dark:text-white" placeholder="John Doe" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-500"/> {t("date")}</label>
              <input type="date" required value={formData.date} onChange={(e) => updateData("date", e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-amber-500 text-slate-900 dark:text-white" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Activity className="w-4 h-4 text-amber-500"/> {t("activities_selected")}</label>
              <select value={formData.activities} onChange={(e) => updateData("activities", e.target.value)} className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl outline-none focus:border-amber-500 text-slate-900 dark:text-white appearance-none">
                {activitiesList.map(act => (
                  <option key={act} value={act}>{act}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Conditional Quad Counter */}
              {(formData.activities === t("quad_tour") || formData.activities === t("quad_buggy_mix")) && (
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("num_quads")}</label>
                  <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden h-12">
                    <button type="button" onClick={() => updateData("numQuads", formData.numQuads - 1)} className="w-12 h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-colors">-</button>
                    <div className="flex-1 text-center font-semibold text-slate-900 dark:text-white">{formData.numQuads}</div>
                    <button type="button" onClick={() => updateData("numQuads", formData.numQuads + 1)} className="w-12 h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-colors">+</button>
                  </div>
                </div>
              )}

              {/* Conditional Buggy Counter */}
              {(formData.activities === t("buggy_tour") || formData.activities === t("quad_buggy_mix")) && (
                <div className="space-y-2 col-span-2 sm:col-span-1">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("num_buggies")}</label>
                  <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden h-12">
                    <button type="button" onClick={() => updateData("numBuggies", formData.numBuggies - 1)} className="w-12 h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-colors">-</button>
                    <div className="flex-1 text-center font-semibold text-slate-900 dark:text-white">{formData.numBuggies}</div>
                    <button type="button" onClick={() => updateData("numBuggies", formData.numBuggies + 1)} className="w-12 h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-colors">+</button>
                  </div>
                </div>
              )}
            </div>

            {/* Conditional Add-ons if Quad or Buggy is selected */}
            {(formData.activities === t("quad_tour") || formData.activities === t("buggy_tour") || formData.activities === t("quad_buggy_mix")) && (
              <div className="space-y-4 p-5 bg-slate-100 dark:bg-slate-900/50 rounded-xl border border-slate-200 dark:border-slate-800">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block mb-2">{t("addons_label")}</label>
                
                {/* Camel Addon Counter */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{t("addon_camel")}</p>
                    <p className="text-sm text-slate-500">5{currency} / person</p>
                  </div>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden shadow-sm h-10">
                    <button type="button" onClick={() => updateData("numCamel", formData.numCamel - 1)} className="w-10 h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-colors">-</button>
                    <div className="w-10 text-center font-semibold text-slate-900 dark:text-white">{formData.numCamel}</div>
                    <button type="button" onClick={() => updateData("numCamel", formData.numCamel + 1)} className="w-10 h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-colors">+</button>
                  </div>
                </div>

                {/* Sandboard Addon Counter */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{t("addon_sandboard")}</p>
                    <p className="text-sm text-slate-500">4{currency} / person</p>
                  </div>
                  <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 overflow-hidden shadow-sm h-10">
                    <button type="button" onClick={() => updateData("numSandboard", formData.numSandboard - 1)} className="w-10 h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-colors">-</button>
                    <div className="w-10 text-center font-semibold text-slate-900 dark:text-white">{formData.numSandboard}</div>
                    <button type="button" onClick={() => updateData("numSandboard", formData.numSandboard + 1)} className="w-10 h-full flex items-center justify-center bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-colors">+</button>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2"><Users className="w-4 h-4 text-amber-500"/> {t("persons")}</label>
              <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 overflow-hidden h-14">
                <button type="button" onClick={() => updateData("persons", formData.persons - 1)} className="w-14 h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-colors">-</button>
                <div className="flex-1 text-center font-semibold text-slate-900 dark:text-white">{formData.persons}</div>
                <button type="button" onClick={() => updateData("persons", formData.persons + 1)} className="w-14 h-full flex items-center justify-center bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-bold transition-colors">+</button>
              </div>
            </div>

            {/* Total Amount Display */}
            {(() => {
              let total = 0;
              if (formData.activities === t("quad_tour")) total += formData.numQuads * 25;
              else if (formData.activities === t("buggy_tour")) total += formData.numBuggies * 50;
              else if (formData.activities === t("quad_buggy_mix")) total += (formData.numQuads * 25) + (formData.numBuggies * 50);
              
              if (formData.activities === t("quad_tour") || formData.activities === t("buggy_tour") || formData.activities === t("quad_buggy_mix")) {
                total += formData.numCamel * 5;
                total += formData.numSandboard * 4;
              }

              if (total > 0) {
                return (
                  <div className="p-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 rounded-xl flex items-center justify-between mt-6">
                    <div className="flex items-center gap-3">
                      <Receipt className="w-6 h-6 text-green-600 dark:text-green-500" />
                      <span className="font-bold text-slate-900 dark:text-white">Estimated Total:</span>
                    </div>
                    <span className="text-2xl font-black text-green-700 dark:text-green-400">
                      {locale === 'fr' ? `${total}${currency}` : `${currency}${total}`}
                    </span>
                  </div>
                );
              }
              return null;
            })()}

            <button type="submit" className="w-full flex justify-center items-center gap-2 px-8 py-5 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(22,163,74,0.4)] mt-4">
              {t("confirm")}
            </button>

          </form>
        </div>

      </div>
    </section>
  );
}
