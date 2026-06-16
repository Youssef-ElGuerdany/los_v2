import { getTranslations, setRequestLocale } from "next-intl/server";
import Navbar from "@/components/Navbar";
import AboutUs from "@/components/AboutUs";
import Highlights from "@/components/Highlights";
import Activities from "@/components/Activities";
import WhyUs from "@/components/WhyUs";
import Gallery from "@/components/Gallery";
import Reviews from "@/components/Reviews";
import FAQ from "@/components/FAQ";
import ReservationForm from "@/components/ReservationForm";
import Contact from "@/components/Contact";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import TourMap from "@/components/TourMap";
import HeroBackground from "@/components/HeroBackground";

export default async function HomePage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params;
  return <HomePageContent locale={locale} />;
}

// Separate async component to handle params correctly in Next 15
async function HomePageContent({ locale }: { locale: string }) {
  setRequestLocale(locale);
  const t = await getTranslations("Hero");

  return (
    <main className="min-h-screen">
      <Navbar />
      <section className="relative h-[100dvh] flex items-center justify-center overflow-hidden">
        <HeroBackground />
        
        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-20">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight drop-shadow-lg">
            {t('title').split(' ').slice(0, -2).join(' ')} <br/><span className="text-amber-500">{t('title').split(' ').slice(-2).join(' ')}</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-200 mb-10 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#reservation" className="inline-flex items-center justify-center px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-full transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(217,119,6,0.4)] text-lg">
              {t('book_now')}
            </a>
            <a href="#activities" className="inline-flex items-center justify-center px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all transform hover:scale-105 border border-white/25 backdrop-blur-sm text-lg">
              {t('explore')}
            </a>
          </div>
        </div>
      </section>

      <Activities />
      <Highlights />
      <AboutUs />
      <WhyUs />
      <Gallery />
      <ReservationForm />
      <TourMap />
      <Reviews />
      <FAQ />
      <Contact />
      <CTA />
      <Footer />
    </main>
  );
}
