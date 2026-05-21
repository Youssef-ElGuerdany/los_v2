import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";
import FloatingWhatsAppWrapper from "@/components/FloatingWhatsAppWrapper";
import ScrollToTop from "@/components/ScrollToTop";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Land of Sand and Adventures | Premium Quad, Buggy & Desert Oasis in Agadir",
  description: "Experience the ultimate Agadir quad and buggy adventures. Explore Agadir Takadt dunes, Massa off-road tracks, and enjoy our premium desert oasis base camp.",
  keywords: ["Land of Sand and Adventures", "Agadir Quad Biking", "Quad Agadir", "Best Buggy Rental Agadir", "Agadir Desert Adventures", "Agadir Takadt dunes", "Massa off-road tour", "Camel riding Agadir", "Gnawa night Agadir", "GoPro quad tour Agadir"],
  openGraph: {
    title: "Land of Sand and Adventures | Premium Quad, Buggy & Desert Oasis in Agadir",
    description: "Experience the ultimate Agadir quad and buggy adventures in the Agadir Takadt dunes.",
    type: "website",
    locale: "en_US",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  // LocalBusiness Schema for SEO
  const schema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "Land of Sand and Adventures",
    "image": "https://landofsandagadir.com/images/hero.JPG",
    "description": "Premium Quad, Buggy & Desert Oasis Resort in Agadir / Agadir Takadt.",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Agadir Takadt Dunes",
      "addressLocality": "Agadir",
      "addressRegion": "Souss-Massa",
      "addressCountry": "MA"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "120"
    }
  };

  return (
    <html lang={locale} dir="ltr" className="scroll-smooth">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body className={`${inter.className} bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-50`}>
        <NextIntlClientProvider messages={messages}>
          {children}
          <FloatingWhatsAppWrapper />
          <ScrollToTop />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
