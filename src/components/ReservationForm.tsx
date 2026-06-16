"use client";

import { useTranslations, useLocale } from "next-intl";
import { useState, useEffect } from "react";
import { ShieldCheck, CreditCard, Car, Calendar, Users, Activity, Receipt } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSettings } from "@/lib/settings";

export default function ReservationForm() {
  const t = useTranslations("Reservation");
  const locale = useLocale();
  const currency = locale === "fr" ? "€" : "$";
  const settings = useSettings();
  
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    activities: t("quad_tour"),
    persons: 2,
    numQuads: 1,
    numBuggies: 1
  });

  const [activitiesList, setActivitiesList] = useState<string[]>([
    t("quad_tour"),
    t("buggy_tour"),
    t("quad_buggy_mix"),
    t("moroccan_nights"),
    t("overnight_stays"),
    t("massa_offroad")
  ]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activitiesData, setActivitiesData] = useState<any[]>([]);

  const getNumericPrice = (priceStr: string) => {
    if (!priceStr) return 0;
    const match = priceStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolveActivityTitle = (act: any, activeLocale: string) => {
    if (!act) return "";
    return act[`title_${activeLocale}`] || act.title || "";
  };

  const getSelectedActivityType = (selectedTitle: string) => {
    if (!selectedTitle) return "";
    
    // 1. Check virtual/mixed option
    if (selectedTitle === t("quad_buggy_mix") || selectedTitle === "Quad & Buggy (Mixed)") {
      return "quad_buggy_mix";
    }

    // 2. Find in activitiesData
    const found = activitiesData.find(act => {
      const titleInCurrentLocale = resolveActivityTitle(act, locale);
      if (titleInCurrentLocale === selectedTitle) return true;
      
      // Fallback: check raw database columns (across all locales)
      const locales = ["en", "fr", "es", "de"];
      if (act.title === selectedTitle) return true;
      for (const loc of locales) {
        if (act[`title_${loc}`] === selectedTitle) return true;
      }
      return false;
    });

    if (found) {
      if (found.static_id === "tour1") return "quad_tour";
      if (found.static_id === "tour2") return "buggy_tour";
      return found.static_id || found.id;
    }

    // 3. Fallback to locale translations
    if (selectedTitle === t("quad_tour") || selectedTitle === "Quad Tour") return "quad_tour";
    if (selectedTitle === t("buggy_tour") || selectedTitle === "Buggy Tour") return "buggy_tour";
    if (selectedTitle === t("moroccan_nights") || selectedTitle === "Moroccan Nights & Gnawa Dinners") return "tour3";
    if (selectedTitle === t("overnight_stays") || selectedTitle === "Overnight Stays (Families-Only)" || selectedTitle === "Overnight Stays") return "tour4";
    if (selectedTitle === t("massa_offroad") || selectedTitle === "Full Day Excursion Takadt to Massa") return "tour5";

    return "";
  };

  const currentActType = getSelectedActivityType(formData.activities);

  useEffect(() => {
    async function loadActivities() {
      if (!supabase) return;
      const { data } = await supabase
        .from('activities')
        .select('*')
        .order('is_static', { ascending: false })
        .order('created_at', { ascending: true });

      if (data && data.length > 0) {
        setActivitiesData(data);
        const resolvedList: string[] = [];

        // 1. Quad Tour
        const qd = data.find(d => d.static_id === "tour1");
        resolvedList.push(resolveActivityTitle(qd, locale));

        // 2. Buggy Tour
        const bg = data.find(d => d.static_id === "tour2");
        resolvedList.push(resolveActivityTitle(bg, locale));

        // 3. Quad & Buggy (Mixed)
        resolvedList.push(t("quad_buggy_mix"));

        // 4. Moroccan Nights
        const mn = data.find(d => d.static_id === "tour3");
        resolvedList.push(resolveActivityTitle(mn, locale));

        // 5. Overnight Stays
        const os = data.find(d => d.static_id === "tour4");
        resolvedList.push(resolveActivityTitle(os, locale));

        // 6. Massa Offroad
        const mo = data.find(d => d.static_id === "tour5");
        resolvedList.push(resolveActivityTitle(mo, locale));

        // 7. Custom dynamic activities
        const custom = data.filter(d => !d.static_id);
        custom.forEach(c => {
          resolvedList.push(resolveActivityTitle(c, locale));
        });

        setActivitiesList(resolvedList);

        // Sync default selected activity name from database resolved title
        const defaultActivity = resolveActivityTitle(qd, locale);
        setFormData(prev => ({ ...prev, activities: defaultActivity }));
      }
    }
    loadActivities();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locale, t]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const updateData = (key: string, value: any) => {
    setFormData(prev => {
      const next = { ...prev, [key]: value };
      
      // Ensure basic lower limits
      if (next.numQuads < 1) next.numQuads = 1;
      if (next.numBuggies < 1) next.numBuggies = 1;
      if (next.persons < 1) next.persons = 1;
      
      // Smart Auto-Adjust based on what the user changed
      const actType = getSelectedActivityType(next.activities);
      if (
        actType === "quad_tour" || 
        actType === "buggy_tour" || 
        actType === "quad_buggy_mix"
      ) {
        
        // 1. If user changed PERSONS
        if (key === "persons" || key === "activities") {
          // Auto-add vehicles if they exceed capacity
          if (actType === "quad_tour" && next.persons > next.numQuads * 2) {
             next.numQuads = Math.ceil(next.persons / 2);
          } else if (actType === "buggy_tour" && next.persons > next.numBuggies * 2) {
             next.numBuggies = Math.ceil(next.persons / 2);
          } else if (actType === "quad_buggy_mix") {
             const capacity = (next.numQuads * 2) + (next.numBuggies * 2);
             if (next.persons > capacity) {
                 next.numQuads += Math.ceil((next.persons - capacity) / 2);
             }
          }
          
          // Reduce vehicles if vehicles exceed people
          if (actType === "quad_tour" && next.persons < next.numQuads) {
             next.numQuads = next.persons;
          } else if (actType === "buggy_tour" && next.persons < next.numBuggies) {
             next.numBuggies = next.persons;
          } else if (actType === "quad_buggy_mix" && next.persons < next.numQuads + next.numBuggies) {
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
           if (actType === "quad_tour" && next.numQuads > next.persons) {
              next.persons = next.numQuads;
           } else if (actType === "buggy_tour" && next.numBuggies > next.persons) {
              next.persons = next.numBuggies;
           } else if (actType === "quad_buggy_mix" && (next.numQuads + next.numBuggies) > next.persons) {
              next.persons = next.numQuads + next.numBuggies;
           }
           
           // Auto-reduce persons if they exceed total capacity of new vehicle selection
           if (actType === "quad_tour" && next.numQuads * 2 < next.persons) {
              next.persons = next.numQuads * 2;
           } else if (actType === "buggy_tour" && next.numBuggies * 2 < next.persons) {
              next.persons = next.numBuggies * 2;
           } else if (actType === "quad_buggy_mix" && (next.numQuads * 2 + next.numBuggies * 2) < next.persons) {
              next.persons = (next.numQuads * 2) + (next.numBuggies * 2);
           }
        }
      }

      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const actType = getSelectedActivityType(formData.activities);

    // Check for vehicle counts
    let vehiclesText = "";
    if (actType === "quad_tour") {
      vehiclesText = `\n*${t("quads_count")}:* ${formData.numQuads}`;
    } else if (actType === "buggy_tour") {
      vehiclesText = `\n*${t("buggies_count")}:* ${formData.numBuggies}`;
    } else if (actType === "quad_buggy_mix") {
      vehiclesText = `\n*${t("quads_count")}:* ${formData.numQuads}\n*${t("buggies_count")}:* ${formData.numBuggies}`;
    }

    // Calculate total amount for the WhatsApp message
    let total = 0;

    const quadActivity = activitiesData.find(d => d.static_id === "tour1");
    const buggyActivity = activitiesData.find(d => d.static_id === "tour2");
    
    const quadPrice = quadActivity ? getNumericPrice(quadActivity.price) : 25;
    const buggyPrice = buggyActivity ? getNumericPrice(buggyActivity.price) : 50;

    if (actType === "quad_tour") {
      total += formData.numQuads * quadPrice;
    } else if (actType === "buggy_tour") {
      total += formData.numBuggies * buggyPrice;
    } else if (actType === "quad_buggy_mix") {
      total += (formData.numQuads * quadPrice) + (formData.numBuggies * buggyPrice);
    } else {
      // Find selected activity in state
      const selectedDbActivity = activitiesData.find(act => {
        const actTitle = act[`title_${locale}`] || act.title;
        return actTitle === formData.activities;
      });
      if (selectedDbActivity) {
        const basePrice = getNumericPrice(selectedDbActivity.price);
        total += basePrice * formData.persons;
      }
    }

    const totalStr = total > 0 ? `\n\n*Total Amount:* ${locale === 'fr' ? total + currency : currency + total} (Pay on Arrival)` : "";

    // Save reservation log to Supabase
    if (supabase) {
      try {
        const hasQuad = actType === "quad_tour" || actType === "quad_buggy_mix";
        const hasBuggy = actType === "buggy_tour" || actType === "quad_buggy_mix";
        
        await supabase.from("reservations").insert([
          {
            name: formData.name,
            date: formData.date,
            activity: formData.activities,
            persons: formData.persons,
            num_quads: hasQuad ? formData.numQuads : 0,
            num_buggies: hasBuggy ? formData.numBuggies : 0,
            total_price: total > 0 ? (locale === 'fr' ? `${total}${currency}` : `${currency}${total}`) : "Free / Inquiry",
            status: "pending"
          }
        ]);
      } catch (err) {
        console.error("Failed to store reservation log in Supabase:", err);
      }
    }

    // Format WhatsApp message
    const message = `Hello Land of Sand! I would like to book an adventure:\n\n*Name:* ${formData.name}\n*Date:* ${formData.date}\n*Activity:* ${formData.activities}${vehiclesText}\n*Number of People:* ${formData.persons}${totalStr}\n\nPlease let me know the availability!`;
    
    // Redirect to WhatsApp safely (avoids popup blockers)
    window.location.href = `https://wa.me/${settings.phone_number}?text=${encodeURIComponent(message)}`;
  };

  // Activities list is dynamically loaded via useEffect

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
              {(currentActType === "quad_tour" || currentActType === "quad_buggy_mix") && (
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
              {(currentActType === "buggy_tour" || currentActType === "quad_buggy_mix") && (
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

              const quadActivity = activitiesData.find(d => d.static_id === "tour1");
              const buggyActivity = activitiesData.find(d => d.static_id === "tour2");
              
              const quadPrice = quadActivity ? getNumericPrice(quadActivity.price) : 25;
              const buggyPrice = buggyActivity ? getNumericPrice(buggyActivity.price) : 50;

              if (currentActType === "quad_tour") {
                total += formData.numQuads * quadPrice;
              } else if (currentActType === "buggy_tour") {
                total += formData.numBuggies * buggyPrice;
              } else if (currentActType === "quad_buggy_mix") {
                total += (formData.numQuads * quadPrice) + (formData.numBuggies * buggyPrice);
              } else {
                // Find selected activity in state
                const selectedDbActivity = activitiesData.find(act => {
                  const actTitle = act[`title_${locale}`] || act.title;
                  return actTitle === formData.activities;
                });
                if (selectedDbActivity) {
                  const basePrice = getNumericPrice(selectedDbActivity.price);
                  total += basePrice * formData.persons;
                }
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
