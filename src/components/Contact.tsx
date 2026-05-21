"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Phone, Mail, Send, CheckCircle2, AlertCircle } from "lucide-react";

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

export default function Contact() {
  const t = useTranslations("Contact");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    
    const formData = new FormData(e.currentTarget);
    
    // IMPORTANT: Replace this with your actual Web3Forms Access Key
    // You can get it for free at https://web3forms.com/
    formData.append("access_key", "aabb3de3-d68e-4a90-b9f2-797db9106947");
    
    // Hidden fields to improve email formatting
    formData.append("subject", "New Contact from Land of Sand Website");
    formData.append("from_name", "Land of Sand Website");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      });
      
      if (response.ok) {
        setStatus("success");
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setStatus("idle"), 5000); // Reset after 5 seconds
      } else {
        setStatus("error");
        setTimeout(() => setStatus("idle"), 5000);
      }
    } catch (error) {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 5000);
    }
  };

  return (
    <section id="contact" className="py-24 bg-slate-50 dark:bg-slate-950 transition-colors duration-300 relative overflow-hidden">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-amber-600/10 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
            {t("title")} <span className="text-amber-600">{t("title_highlight")}</span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Contact Information Side */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{t("info_title")}</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8">{t("info_desc")}</p>

              <div className="space-y-6">
                
                {/* WhatsApp */}
                <a href="https://wa.me/212661374773" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center text-green-600 dark:text-green-500 group-hover:scale-110 group-hover:bg-green-500 group-hover:text-white transition-all duration-300 shadow-sm border border-green-500/20">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">WhatsApp / Phone</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-green-500 transition-colors">+212 661-374773</p>
                  </div>
                </a>

                {/* Email */}
                <a href="mailto:landofsandadventures@gmail.com" className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-500 group-hover:scale-110 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 shadow-sm border border-amber-500/20">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Email</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-500 transition-colors break-all">landofsandadventures@gmail.com</p>
                  </div>
                </a>

                {/* Instagram */}
                <a href="https://www.instagram.com/quad_buggy_land_of_sand_agadir?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 group">
                  <div className="w-14 h-14 rounded-full bg-pink-500/10 dark:bg-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-500 group-hover:scale-110 group-hover:bg-gradient-to-tr group-hover:from-yellow-400 group-hover:via-pink-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300 shadow-sm border border-pink-500/20">
                    <InstagramIcon />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Instagram</p>
                    <p className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-pink-500 transition-colors">@quad_buggy_land_of_sand_agadir</p>
                  </div>
                </a>

              </div>
            </div>
          </div>

          {/* Contact Form Side */}
          <div className="w-full lg:w-2/3">
            <div className="bg-white dark:bg-slate-900/80 backdrop-blur-md p-8 md:p-10 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Input */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("name")}</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                      placeholder="John Doe"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("phone")}</label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      required 
                      className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                      placeholder="+1 234 567 8900"
                    />
                  </div>
                </div>

                {/* Email Input */}
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("email")}</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400"
                    placeholder="john@example.com"
                  />
                </div>

                {/* Message Input */}
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-semibold text-slate-700 dark:text-slate-300">{t("message")}</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={5} 
                    required 
                    className="w-full px-5 py-4 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-slate-900 dark:text-white placeholder-slate-400 resize-none"
                    placeholder="Tell us about your planned adventure..."
                  ></textarea>
                </div>

                {/* Status Messages */}
                {status === "success" && (
                  <div className="flex items-center gap-2 text-green-600 dark:text-green-500 bg-green-50 dark:bg-green-500/10 p-4 rounded-xl border border-green-200 dark:border-green-500/20">
                    <CheckCircle2 className="w-5 h-5" />
                    <p className="font-medium">{t("success")}</p>
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-500/10 p-4 rounded-xl border border-red-200 dark:border-red-500/20">
                    <AlertCircle className="w-5 h-5" />
                    <p className="font-medium">{t("error")}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button 
                  type="submit" 
                  disabled={status === "submitting"}
                  className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-600/50 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(217,119,6,0.3)] hover:shadow-[0_0_30px_rgba(217,119,6,0.5)] active:scale-[0.98]"
                >
                  {status === "submitting" ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{t("send")}</span>
                      <Send className="w-5 h-5 rtl:-scale-x-100" />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
