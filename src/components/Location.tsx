"use client";

export default function Location() {
  return (
    <section id="location" className="py-24 bg-white dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Our <span className="text-amber-600">Location</span></h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">Find us in the heart of Agadir. We offer free pickup from the tourist zone for all our activities.</p>
        </div>

        <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden h-[500px] shadow-lg relative">
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d109865.2319200085!2d-9.664536248981442!3d30.419958742880795!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdb3b6e9eaa1eb75%3A0x4ebada3cdfb4db2f!2sAgadir%2080000%2C%20Morocco!5e0!3m2!1sen!2sus!4v1714402685933!5m2!1sen!2sus" 
            width="100%" 
            height="100%" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Agadir Location Map"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
