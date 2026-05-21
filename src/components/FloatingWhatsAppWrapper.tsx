"use client";

import dynamic from "next/dynamic";

const FloatingWhatsApp = dynamic(() => import("./FloatingWhatsApp"), { ssr: false });

export default function FloatingWhatsAppWrapper() {
  return <FloatingWhatsApp />;
}
