import { useTranslations } from "next-intl";
import { Camera, Plane } from "lucide-react";

export default function Highlights() {
  const t = useTranslations("Highlights");

  return (
    <section className="py-20 bg-amber-50 dark:bg-amber-950/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* GoPro Feature */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-amber-100 dark:border-amber-900/30 transform transition-all hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Camera size={120} className="text-amber-600" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/50 rounded-2xl flex items-center justify-center mb-6 text-amber-600 dark:text-amber-500">
                <Camera size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {t("gopro_title")}
              </h3>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-lg">
                {t("gopro_desc")}
              </p>
            </div>
          </div>

          {/* Airport Package */}
          <div className="bg-slate-900 dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-800 transform transition-all hover:-translate-y-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Plane size={120} className="text-blue-500" />
            </div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-6 text-blue-400">
                <Plane size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {t("airport_title")}
              </h3>
              <p className="text-slate-300 leading-relaxed text-lg">
                {t("airport_desc")}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
