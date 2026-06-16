"use client";
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect } from "react";
import { 
  Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Loader2, 
  ArrowUp, ArrowDown, Clock, CheckSquare, 
  Calendar as CalendarIcon, DollarSign, BarChart2, Star, 
  MessageSquare, HelpCircle, Settings as SettingsIcon, ShieldCheck
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

interface Activity {
  id: string;
  title: string;
  price?: string;
  description?: string;
  duration?: string;
  coming_soon?: boolean;
  images?: string[];
  image_url?: string;
  subtitle?: string;
  schedule?: string;
  suitable?: string;
  includes?: string[] | string;
  is_static?: boolean;
  static_id?: string | null;
  [key: string]: unknown;
}

interface GalleryItem {
  id: string;
  src: string;
  aspect: string;
  created_at?: string;
}

interface Reservation {
  id: string;
  activity_id?: string;
  activity_title?: string;
  customer_name?: string;
  customer_phone?: string;
  date?: string;
  time?: string;
  guests?: number;
  total_price?: string;
  status?: string;
  created_at?: string;
  name?: string;
  activity?: string;
  persons?: number;
  num_quads?: number;
  num_buggies?: number;
  [key: string]: unknown;
}

interface Review {
  id: string;
  name: string;
  date: string;
  text: string;
  rating: number;
  is_visible: boolean;
  [key: string]: unknown;
}

interface Faq {
  id: string;
  q: string;
  a: string;
  sort_order: number;
  [key: string]: unknown;
}

export default function AdminPanel() {
  const locale = useLocale();
  const router = useRouter();
  
  // Auth state
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [user, setUser] = useState<import("@supabase/supabase-js").User | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'activities' | 'gallery' | 'reservations' | 'reviews' | 'faqs' | 'settings'>('activities');
  
  // Data lists
  const [activities, setActivities] = useState<Activity[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [faqs, setFaqs] = useState<Faq[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Activities Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ 
    title: "", 
    priceVal: "", 
    priceCurrency: "$", 
    description: "",
    duration: "",
    coming_soon: false,
    subtitle: "",
    schedule: "",
    suitable: "",
    includes: ""
  });
  const [currentImages, setCurrentImages] = useState<string[]>([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [availableColumns, setAvailableColumns] = useState<string[]>([]);

  // Gallery State
  const [galleryAspect, setGalleryAspect] = useState("aspect-[4/3]");
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  // Reservations State
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Reviews CRUD Form State
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({
    name: "",
    date: "",
    text: "",
    rating: 5,
    is_visible: true
  });

  // FAQs CRUD Form State
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [faqForm, setFaqForm] = useState({
    q: "",
    a: "",
    sort_order: 0
  });

  // Settings Form State
  const [settingsForm, setSettingsForm] = useState({
    phone_number: "212661374773",
    site_title: "Land of Sand and Adventures",
    site_description: "Experience the best desert adventure in Agadir with Quad Biking, Buggy Riding, Massa off-road tours, and overnight stays."
  });

  // Auth check
  useEffect(() => {
    async function checkAuth() {
      if (!supabase) {
        setCheckingAuth(false);
        return;
      }
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push(`/${locale}/admin/login`);
      } else {
        setUser(session.user);
        setCheckingAuth(false);
      }
    }
    checkAuth();

    const { data: { subscription } } = supabase ? supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        router.push(`/${locale}/admin/login`);
      } else {
        setUser(session.user);
      }
    }) : { data: { subscription: { unsubscribe: () => {} } } };

    return () => subscription.unsubscribe();
  }, [locale, router]);

  // Load active tab data
  useEffect(() => {
    if (checkingAuth) return;
    Promise.resolve().then(() => {
      setIsLoading(true);
    });
    
    if (activeTab === 'activities') {
      fetchActivities();
    } else if (activeTab === 'gallery') {
      fetchGallery();
    } else if (activeTab === 'reservations') {
      fetchReservations();
    } else if (activeTab === 'reviews') {
      fetchReviews();
    } else if (activeTab === 'faqs') {
      fetchFaqs();
    } else if (activeTab === 'settings') {
      fetchSettings();
    }
  }, [activeTab, checkingAuth]);

  // Helper: get numeric price value
  const getNumericPrice = (priceStr: string) => {
    if (!priceStr) return 0;
    const match = priceStr.match(/\d+/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // Helper: translate text dynamically on save
  async function getTranslationsForText(text: string) {
    if (!text) return { en: "", fr: "", es: "", de: "" };
    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text,
          targetLocales: ["en", "fr", "es", "de"]
        })
      });
      if (res.ok) {
        const data = await res.json();
        return data.translations;
      }
    } catch (e) {
      console.error("Error getting translations:", e);
    }
    return { en: text, fr: text, es: text, de: text };
  }

  // --- ACTIVITIES TAB LOGIC ---
  async function fetchActivities() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('is_static', { ascending: false })
      .order('created_at', { ascending: false });
      
    if (!error && data) {
      setActivities(data);
      if (data.length > 0) {
        const columns = new Set<string>();
        data.forEach(item => {
          Object.keys(item).forEach(key => columns.add(key));
        });
        setAvailableColumns(Array.from(columns));
      }
    }
    setIsLoading(false);
  }

  function openAddModal() {
    setEditingId(null);
    setFormData({ 
      title: "", priceVal: "", priceCurrency: "$", description: "",
      duration: "", coming_soon: false, subtitle: "", schedule: "", suitable: "", includes: ""
    });
    setCurrentImages([]);
    setIsModalOpen(true);
  }

  function openEditModal(act: Activity) {
    setEditingId(act.id);

    const priceStr = act.price || "";
    let priceVal = "";
    let priceCurrency = "$";
    if (priceStr.includes("€")) {
      priceCurrency = "€";
      priceVal = priceStr.replace("€", "").trim();
    } else if (priceStr.includes("$")) {
      priceCurrency = "$";
      priceVal = priceStr.replace("$", "").trim();
    } else {
      priceVal = priceStr.trim();
    }

    setFormData({ 
      title: act.title || "", priceVal, priceCurrency, description: act.description || "",
      duration: act.duration || "", coming_soon: act.coming_soon || false,
      subtitle: act.subtitle || "", schedule: act.schedule || "", suitable: act.suitable || "",
      includes: Array.isArray(act.includes) ? act.includes.join(", ") : ""
    });
    setCurrentImages(act.images && act.images.length > 0 ? act.images : (act.image_url ? [act.image_url] : []));
    setIsModalOpen(true);
  }

  async function handleSaveActivity() {
    if (!supabase) return;
    setIsSaving(true);

    try {
      let titleTranslations = { en: formData.title, fr: formData.title, es: formData.title, de: formData.title };
      let descTranslations = { en: formData.description, fr: formData.description, es: formData.description, de: formData.description };
      let subtitleTranslations = { en: formData.subtitle, fr: formData.subtitle, es: formData.subtitle, de: formData.subtitle };
      let scheduleTranslations = { en: formData.schedule, fr: formData.schedule, es: formData.schedule, de: formData.schedule };
      let suitableTranslations = { en: formData.suitable, fr: formData.suitable, es: formData.suitable, de: formData.suitable };
      let includesTranslations = { en: formData.includes, fr: formData.includes, es: formData.includes, de: formData.includes };

      titleTranslations = await getTranslationsForText(formData.title);
      descTranslations = await getTranslationsForText(formData.description);
      if (formData.subtitle) subtitleTranslations = await getTranslationsForText(formData.subtitle);
      if (formData.schedule) scheduleTranslations = await getTranslationsForText(formData.schedule);
      if (formData.suitable) suitableTranslations = await getTranslationsForText(formData.suitable);
      if (formData.includes) includesTranslations = await getTranslationsForText(formData.includes);
      
      let finalPrice = "";
      if (formData.priceVal && formData.priceVal.trim()) {
        finalPrice = formData.priceCurrency === "$" ? `$${formData.priceVal.trim()}` : `${formData.priceVal.trim()}€`;
      }

      const payload: Record<string, unknown> = {
        title: formData.title,
        price: finalPrice,
        description: formData.description,
        duration: formData.duration,
        coming_soon: formData.coming_soon,
        images: currentImages,
        subtitle: formData.subtitle,
        schedule: formData.schedule,
        suitable: formData.suitable,
        includes: formData.includes ? formData.includes.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        title_en: titleTranslations.en,
        title_fr: titleTranslations.fr,
        title_es: titleTranslations.es,
        title_de: titleTranslations.de,
        description_en: descTranslations.en,
        description_fr: descTranslations.fr,
        description_es: descTranslations.es,
        description_de: descTranslations.de,
        subtitle_en: subtitleTranslations.en,
        subtitle_fr: subtitleTranslations.fr,
        subtitle_es: subtitleTranslations.es,
        subtitle_de: subtitleTranslations.de,
        schedule_en: scheduleTranslations.en,
        schedule_fr: scheduleTranslations.fr,
        schedule_es: scheduleTranslations.es,
        schedule_de: scheduleTranslations.de,
        suitable_en: suitableTranslations.en,
        suitable_fr: suitableTranslations.fr,
        suitable_es: suitableTranslations.es,
        suitable_de: suitableTranslations.de,
        includes_en: includesTranslations.en ? includesTranslations.en.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        includes_fr: includesTranslations.fr ? includesTranslations.fr.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        includes_es: includesTranslations.es ? includesTranslations.es.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
        includes_de: includesTranslations.de ? includesTranslations.de.split(",").map((s: string) => s.trim()).filter(Boolean) : [],
      };
      
      if (currentImages.length > 0) payload.image_url = currentImages[0];

      const filteredPayload: Record<string, unknown> = {};
      const allowedColumns = availableColumns.length > 0 ? availableColumns : Object.keys(payload);

      Object.keys(payload).forEach(key => {
        if (allowedColumns.includes(key)) {
          filteredPayload[key] = payload[key];
        }
      });

      if (editingId) {
        const { error } = await supabase.from('activities').update(filteredPayload).eq('id', editingId);
        if (error) alert("Error updating activity: " + error.message);
      } else {
        filteredPayload.is_static = false;
        const { error } = await supabase.from('activities').insert([filteredPayload]);
        if (error) alert("Error adding activity: " + error.message);
      }

      setIsModalOpen(false);
      fetchActivities();
    } catch (e) {
      console.error("Uncaught save error:", e);
      alert("Uncaught error during save: " + (e instanceof Error ? e.message : String(e)));
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteActivity(id: string) {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    if (!supabase) return;
    await supabase.from('activities').delete().eq('id', id);
    fetchActivities();
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!supabase) return;
    
    setIsUploadingImage(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('activities')
      .upload(fileName, file);
      
    if (error) {
      alert("Error uploading image: " + error.message);
    } else if (data) {
      const { data: publicUrlData } = supabase.storage.from('activities').getPublicUrl(fileName);
      setCurrentImages(prev => [...prev, publicUrlData.publicUrl]);
    }
    setIsUploadingImage(false);
  }

  function moveImage(index: number, direction: 'left' | 'right') {
    const newImages = [...currentImages];
    if (direction === 'left' && index > 0) {
      const temp = newImages[index];
      newImages[index] = newImages[index - 1];
      newImages[index - 1] = temp;
    } else if (direction === 'right' && index < newImages.length - 1) {
      const temp = newImages[index];
      newImages[index] = newImages[index + 1];
      newImages[index + 1] = temp;
    }
    setCurrentImages(newImages);
  }

  function removeImage(index: number) {
    setCurrentImages(prev => prev.filter((_, idx) => idx !== index));
  }

  // --- GALLERY TAB LOGIC ---
  async function fetchGallery() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setGallery(data);
    setIsLoading(false);
  }

  async function handleAddGalleryItem(e: React.ChangeEvent<HTMLInputElement>) {
    if (!e.target.files || e.target.files.length === 0) return;
    if (!supabase) return;
    
    setIsUploadingGallery(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    
    const { data, error: uploadError } = await supabase.storage
      .from('activities')
      .upload(fileName, file);

    if (uploadError) {
      alert("Error uploading photo: " + uploadError.message);
    } else if (data) {
      const { data: publicUrlData } = supabase.storage.from('activities').getPublicUrl(fileName);
      const { error: insertError } = await supabase
        .from('gallery')
        .insert([{ src: publicUrlData.publicUrl, aspect: galleryAspect }]);

      if (insertError) alert("Error saving photo: " + insertError.message);
      else fetchGallery();
    }
    setIsUploadingGallery(false);
  }

  async function handleDeleteGalleryItem(id: string) {
    if (!confirm("Are you sure you want to delete this photo?")) return;
    if (!supabase) return;
    await supabase.from('gallery').delete().eq('id', id);
    fetchGallery();
  }

  // --- RESERVATIONS TAB LOGIC ---
  async function fetchReservations() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setReservations(data);
    setIsLoading(false);
  }

  async function handleUpdateReservationStatus(id: string, newStatus: string) {
    if (!supabase) return;
    const { error } = await supabase
      .from('reservations')
      .update({ status: newStatus })
      .eq('id', id);
    
    if (error) alert("Error updating status: " + error.message);
    else fetchReservations();
  }

  async function handleDeleteReservation(id: string) {
    if (!confirm("Are you sure you want to delete this reservation log?")) return;
    if (!supabase) return;
    await supabase.from('reservations').delete().eq('id', id);
    fetchReservations();
  }

  // --- REVIEWS TAB LOGIC ---
  async function fetchReviews() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) setReviews(data);
    setIsLoading(false);
  }

  function openAddReviewModal() {
    setEditingId(null);
    setReviewForm({ name: "", date: "", text: "", rating: 5, is_visible: true });
    setIsReviewModalOpen(true);
  }

  function openEditReviewModal(rev: Review) {
    setEditingId(rev.id);
    setReviewForm({
      name: rev.name || "",
      date: rev.date || "",
      text: rev.text || "",
      rating: rev.rating || 5,
      is_visible: rev.is_visible !== undefined ? rev.is_visible : true
    });
    setIsReviewModalOpen(true);
  }

  async function handleSaveReview() {
    if (!supabase) return;
    setIsSaving(true);

    const translations = await getTranslationsForText(reviewForm.text);

    const payload = {
      name: reviewForm.name,
      date: reviewForm.date,
      text: reviewForm.text,
      rating: reviewForm.rating,
      is_visible: reviewForm.is_visible,
      text_en: translations.en,
      text_fr: translations.fr,
      text_es: translations.es,
      text_de: translations.de
    };

    if (editingId) {
      const { error } = await supabase.from('reviews').update(payload).eq('id', editingId);
      if (error) alert("Error updating review: " + error.message);
    } else {
      const { error } = await supabase.from('reviews').insert([payload]);
      if (error) alert("Error adding review: " + error.message);
    }

    setIsSaving(false);
    setIsReviewModalOpen(false);
    fetchReviews();
  }

  async function handleDeleteReview(id: string) {
    if (!confirm("Delete this review?")) return;
    if (!supabase) return;
    await supabase.from('reviews').delete().eq('id', id);
    fetchReviews();
  }

  // --- FAQS TAB LOGIC ---
  async function fetchFaqs() {
    if (!supabase) return;
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true });
    if (!error && data) setFaqs(data);
    setIsLoading(false);
  }

  function openAddFaqModal() {
    setEditingId(null);
    setFaqForm({ q: "", a: "", sort_order: faqs.length });
    setIsFaqModalOpen(true);
  }

  function openEditFaqModal(faq: Faq) {
    setEditingId(faq.id);
    setFaqForm({
      q: faq.q || "",
      a: faq.a || "",
      sort_order: faq.sort_order || 0
    });
    setIsFaqModalOpen(true);
  }

  async function handleSaveFaq() {
    if (!supabase) return;
    setIsSaving(true);

    const qTranslations = await getTranslationsForText(faqForm.q);
    const aTranslations = await getTranslationsForText(faqForm.a);

    const payload = {
      q: faqForm.q,
      a: faqForm.a,
      sort_order: faqForm.sort_order,
      q_en: qTranslations.en,
      q_fr: qTranslations.fr,
      q_es: qTranslations.es,
      q_de: qTranslations.de,
      a_en: aTranslations.en,
      a_fr: aTranslations.fr,
      a_es: aTranslations.es,
      a_de: aTranslations.de
    };

    if (editingId) {
      const { error } = await supabase.from('faqs').update(payload).eq('id', editingId);
      if (error) alert("Error updating FAQ: " + error.message);
    } else {
      const { error } = await supabase.from('faqs').insert([payload]);
      if (error) alert("Error adding FAQ: " + error.message);
    }

    setIsSaving(false);
    setIsFaqModalOpen(false);
    fetchFaqs();
  }

  async function handleDeleteFaq(id: string) {
    if (!confirm("Delete this FAQ?")) return;
    if (!supabase) return;
    await supabase.from('faqs').delete().eq('id', id);
    fetchFaqs();
  }

  // --- SETTINGS TAB LOGIC ---
  async function fetchSettings() {
    if (!supabase) return;
    const { data, error } = await supabase.from('settings').select('*');
    if (!error && data) {
      const mapped = {
        phone_number: "212661374773",
        site_title: "Land of Sand and Adventures",
        site_description: "Experience the best desert adventure in Agadir with Quad Biking, Buggy Riding, Massa off-road tours, and overnight stays."
      };
      data.forEach(item => {
        if (item.key === "phone_number") mapped.phone_number = item.value;
        if (item.key === "site_title") mapped.site_title = item.value;
        if (item.key === "site_description") mapped.site_description = item.value;
      });
      setSettingsForm(mapped);
    }
    setIsLoading(false);
  }

  async function handleSaveSettings() {
    if (!supabase) return;
    setIsSaving(true);

    const keys = ["phone_number", "site_title", "site_description"];
    
    for (const key of keys) {
      const val = settingsForm[key as keyof typeof settingsForm];
      const { error } = await supabase
        .from('settings')
        .upsert({ key, value: val }, { onConflict: 'key' });
        
      if (error) {
        alert(`Error saving setting ${key}: ` + error.message);
        setIsSaving(false);
        return;
      }
    }

    alert("Settings updated successfully!");
    setIsSaving(false);
    fetchSettings();
  }

  // --- RENDER FUNCTIONS FOR SECTIONS ---
  
  // STATS DASHBOARD HEADER WIDGET
  function renderStatsHeader() {
    // Calculators
    const totalBookingsCount = reservations.length;
    
    let totalUSD = 0;
    let totalEUR = 0;
    reservations.forEach(r => {
      if (r.status === 'completed' || r.status === 'confirmed') {
        const val = getNumericPrice(r.total_price || "");
        if (r.total_price && typeof r.total_price === 'string' && r.total_price.includes("€")) {
          totalEUR += val;
        } else {
          totalUSD += val;
        }
      }
    });

    const pendingCount = reservations.filter(r => r.status === 'pending').length;

    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 animate-[fadeIn_0.3s_ease-out]">
        
        {/* Total Bookings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center text-amber-500 shrink-0">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Bookings</p>
            <h3 className="text-2xl font-black text-slate-950 dark:text-white mt-1">{totalBookingsCount}</h3>
          </div>
        </div>

        {/* Pending Bookings */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
            <Clock className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Confirmation</p>
            <h3 className="text-2xl font-black text-slate-950 dark:text-white mt-1">{pendingCount}</h3>
          </div>
        </div>

        {/* Revenue USD */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500 shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Revenue (Confirmed)</p>
            <h3 className="text-2xl font-black text-green-600 dark:text-green-400 mt-1">${totalUSD}</h3>
          </div>
        </div>

        {/* Revenue EUR */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-500 shrink-0">
            <BarChart2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Euros (Confirmed)</p>
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">{totalEUR}€</h3>
          </div>
        </div>

      </div>
    );
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-12 h-12 animate-spin text-amber-500" />
        <p className="text-slate-400 font-semibold animate-pulse text-sm">Verifying credentials...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 pt-24 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 mb-10">
          <div>
            <div className="flex items-center gap-4 flex-wrap">
              <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
              {user && (
                <button 
                  onClick={async () => {
                    if (supabase) await supabase.auth.signOut();
                  }}
                  className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition-all hover:scale-105"
                >
                  Sign Out
                </button>
              )}
            </div>
            <p className="text-slate-500 mt-2">Manage your activities, prices, bookings, and customer content dynamically.</p>
          </div>
          {activeTab === 'activities' && (
            <button onClick={openAddModal} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 self-start sm:self-auto">
              <Plus className="w-5 h-5" /> Add Activity
            </button>
          )}
          {activeTab === 'reviews' && (
            <button onClick={openAddReviewModal} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 self-start sm:self-auto">
              <Plus className="w-5 h-5" /> Add Review
            </button>
          )}
          {activeTab === 'faqs' && (
            <button onClick={openAddFaqModal} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-105 self-start sm:self-auto">
              <Plus className="w-5 h-5" /> Add FAQ
            </button>
          )}
        </div>

        {/* Analytics Summary */}
        {renderStatsHeader()}

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto gap-2 py-1 [&::-webkit-scrollbar]:hidden">
          {([
            { id: "activities", label: "Activities", icon: BarChart2 },
            { id: "gallery", label: "Gallery", icon: ImageIcon },
            { id: "reservations", label: "Reservations", icon: CalendarIcon },
            { id: "reviews", label: "Reviews", icon: MessageSquare },
            { id: "faqs", label: "FAQs", icon: HelpCircle },
            { id: "settings", label: "Settings", icon: SettingsIcon }
          ] as const).map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`px-5 py-3 font-semibold transition-all border-b-2 flex items-center gap-2 text-sm shrink-0 ${active ? 'border-amber-600 text-amber-600 dark:text-amber-500 font-bold' : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
              >
                <Icon className="w-4 h-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* Loading Spinner */}
        {isLoading && (
          <div className="p-20 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>
        )}

        {/* Tab Content: Activities */}
        {!isLoading && activeTab === 'activities' && (
          <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden animate-[fadeIn_0.3s_ease-out]">
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="p-5 font-semibold">Images</th>
                  <th className="p-5 font-semibold">Title</th>
                  <th className="p-5 font-semibold">Type</th>
                  <th className="p-5 font-semibold">Price</th>
                  <th className="p-5 font-semibold">Duration</th>
                  <th className="p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 && (
                  <tr><td colSpan={6} className="p-8 text-center text-slate-500">No activities found. Click &quot;Add Activity&quot; to start!</td></tr>
                )}
                {activities.map((act) => {
                  const imagesList = act.images && act.images.length > 0 ? act.images : (act.image_url ? [act.image_url] : []);
                  const firstImg = imagesList[0] || "";
                  const displayImg = firstImg.startsWith('http') ? firstImg : `/${firstImg}`;
                  
                  return (
                    <tr key={act.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-5">
                        <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden relative">
                          {displayImg ? (
                            <img src={displayImg} alt={act.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="text-slate-400 w-8 h-8" />
                          )}
                          {imagesList.length > 1 && (
                            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1.5 py-0.5 rounded-md font-bold">
                              +{imagesList.length - 1}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-5 font-bold text-slate-900 dark:text-white">
                        {act.title}
                        {act.coming_soon && (
                          <span className="ml-2 text-xs bg-amber-500/10 text-amber-600 px-2 py-0.5 rounded-full font-bold">Coming Soon</span>
                        )}
                      </td>
                      <td className="p-5">
                        {act.static_id ? (
                          <span className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                            Default Tour
                          </span>
                        ) : (
                          <span className="bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-400 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider">
                            Custom Tour
                          </span>
                        )}
                      </td>
                      <td className="p-5">
                        <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-lg font-bold">
                          {act.price || "Free / Inquiry"}
                        </span>
                      </td>
                      <td className="p-5 text-slate-500">{act.duration || "N/A"}</td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => openEditModal(act)} className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteActivity(act.id)} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab Content: Gallery */}
        {!isLoading && activeTab === 'gallery' && (
          <div className="space-y-8 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-lg">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">Add Photo to Gallery</h3>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="w-full sm:w-auto">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Aspect Ratio</label>
                  <select 
                    value={galleryAspect} 
                    onChange={e => setGalleryAspect(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm"
                  >
                    <option value="aspect-[4/3]">Landscape (4:3)</option>
                    <option value="aspect-[3/4]">Portrait (3:4)</option>
                    <option value="aspect-square">Square (1:1)</option>
                  </select>
                </div>
                <div className="pt-5 w-full sm:w-auto">
                  <label className="cursor-pointer inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-semibold rounded-xl text-sm transition-all shadow-md">
                    {isUploadingGallery ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    Upload Photo File
                    <input type="file" accept="image/*" onChange={handleAddGalleryItem} className="hidden" disabled={isUploadingGallery} />
                  </label>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {gallery.map((img) => {
                const src = img.src.startsWith('http') || img.src.startsWith('/') ? img.src : `/${img.src}`;
                return (
                  <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden group shadow-md border border-slate-200/50 dark:border-slate-800/80 bg-slate-100 dark:bg-slate-800 transition-transform duration-300 hover:scale-[1.02]">
                    <img src={src} alt="Gallery item" className="w-full h-full object-cover animate-[fadeIn_0.3s_ease-out]" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                      <span className="text-white text-xs bg-slate-800/80 px-2 py-0.5 rounded-md font-semibold self-start uppercase tracking-wider">
                        {img.aspect?.replace('aspect-', '') || 'landscape'}
                      </span>
                      <button onClick={() => handleDeleteGalleryItem(img.id)} className="self-end p-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition-colors shadow-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab Content: Reservations */}
        {!isLoading && activeTab === 'reservations' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            {/* Filter buttons */}
            <div className="flex gap-2 flex-wrap">
              {["all", "pending", "confirmed", "completed", "cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    statusFilter === status 
                      ? "bg-slate-900 dark:bg-slate-800 text-white dark:text-amber-500" 
                      : "bg-white dark:bg-slate-900 text-slate-500 border border-slate-200 dark:border-slate-800 hover:bg-slate-100"
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-5 font-semibold">Client</th>
                    <th className="p-5 font-semibold">Date</th>
                    <th className="p-5 font-semibold">Activity</th>
                    <th className="p-5 font-semibold text-center">People</th>
                    <th className="p-5 font-semibold text-center">Quads/Buggies</th>
                    <th className="p-5 font-semibold">Total</th>
                    <th className="p-5 font-semibold">Status</th>
                    <th className="p-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations
                    .filter(r => statusFilter === "all" || r.status === statusFilter)
                    .map((res) => (
                      <tr key={res.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="p-5 font-bold text-slate-900 dark:text-white">{res.name}</td>
                        <td className="p-5 text-slate-600 dark:text-slate-400">{res.date}</td>
                        <td className="p-5 font-semibold text-amber-600 dark:text-amber-500">{res.activity}</td>
                        <td className="p-5 text-center font-bold text-slate-900 dark:text-white">{res.persons}</td>
                        <td className="p-5 text-center text-slate-500">
                          {(res.num_quads ?? 0) > 0 && <span>{res.num_quads}x Quad </span>}
                          {(res.num_buggies ?? 0) > 0 && <span>{res.num_buggies}x Buggy</span>}
                          {(res.num_quads ?? 0) === 0 && (res.num_buggies ?? 0) === 0 && "—"}
                        </td>
                        <td className="p-5 font-black text-green-600 dark:text-green-400">{res.total_price || "Free / Inquiry"}</td>
                        <td className="p-5">
                          <select 
                            value={res.status || 'pending'} 
                            onChange={(e) => handleUpdateReservationStatus(res.id, e.target.value)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider outline-none border ${
                              res.status === 'confirmed' ? 'bg-green-100 border-green-200 text-green-700' :
                              res.status === 'completed' ? 'bg-blue-100 border-blue-200 text-blue-700' :
                              res.status === 'cancelled' ? 'bg-red-100 border-red-200 text-red-700' :
                              'bg-amber-100 border-amber-200 text-amber-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="p-5 text-right">
                          <button onClick={() => handleDeleteReservation(res.id)} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  {reservations.filter(r => statusFilter === "all" || r.status === statusFilter).length === 0 && (
                    <tr><td colSpan={8} className="p-8 text-center text-slate-500">No reservations found in this category.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Reviews */}
        {!isLoading && activeTab === 'reviews' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-5 font-semibold">Author</th>
                    <th className="p-5 font-semibold">Date</th>
                    <th className="p-5 font-semibold">Rating</th>
                    <th className="p-5 font-semibold w-1/2">Review Text</th>
                    <th className="p-5 font-semibold">Visibility</th>
                    <th className="p-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map((rev) => (
                    <tr key={rev.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-5 font-bold text-slate-900 dark:text-white">{rev.name}</td>
                      <td className="p-5 text-slate-500">{rev.date}</td>
                      <td className="p-5">
                        <div className="flex gap-1 text-amber-500">
                          {[...Array(rev.rating || 5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500" />)}
                        </div>
                      </td>
                      <td className="p-5 text-slate-600 dark:text-slate-400 text-sm italic">&quot;{rev.text}&quot;</td>
                      <td className="p-5">
                        <button 
                          onClick={async () => {
                            if (!supabase) return;
                            await supabase.from('reviews').update({ is_visible: !rev.is_visible }).eq('id', rev.id);
                            fetchReviews();
                          }}
                          className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                            rev.is_visible 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400" 
                              : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
                          }`}
                        >
                          {rev.is_visible ? "Visible" : "Hidden"}
                        </button>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => openEditReviewModal(rev)} className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteReview(rev.id)} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {reviews.length === 0 && (
                    <tr><td colSpan={6} className="p-8 text-center text-slate-500">No reviews found. Click &quot;Add Review&quot; to build one!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: FAQs */}
        {!isLoading && activeTab === 'faqs' && (
          <div className="space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <tr>
                    <th className="p-5 font-semibold">Order</th>
                    <th className="p-5 font-semibold">Question</th>
                    <th className="p-5 font-semibold w-1/2">Answer</th>
                    <th className="p-5 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {faqs.map((faq) => (
                    <tr key={faq.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <td className="p-5 text-slate-500 font-bold">#{faq.sort_order}</td>
                      <td className="p-5 font-bold text-slate-900 dark:text-white">{faq.q}</td>
                      <td className="p-5 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{faq.a}</td>
                      <td className="p-5 text-right">
                        <div className="flex justify-end gap-3">
                          <button onClick={() => openEditFaqModal(faq)} className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 rounded-lg transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteFaq(faq.id)} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-400 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {faqs.length === 0 && (
                    <tr><td colSpan={4} className="p-8 text-center text-slate-500">No FAQs found. Click &quot;Add FAQ&quot; to build one!</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab Content: Settings */}
        {!isLoading && activeTab === 'settings' && (
          <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 animate-[fadeIn_0.3s_ease-out]">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-500" /> General Settings
            </h3>
            
            <div className="space-y-5">
              
              {/* WhatsApp Phone Number */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">WhatsApp Redirection Phone Number</label>
                <input 
                  type="text" 
                  value={settingsForm.phone_number} 
                  onChange={e => setSettingsForm({...settingsForm, phone_number: e.target.value})} 
                  placeholder="e.g. 212661374773"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                />
                <p className="text-xs text-slate-500 mt-1">Make sure to include the country code without leading plus (+) or double zero (00) characters.</p>
              </div>

              {/* Site Title */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">SEO Website Title</label>
                <input 
                  type="text" 
                  value={settingsForm.site_title} 
                  onChange={e => setSettingsForm({...settingsForm, site_title: e.target.value})} 
                  placeholder="Website title"
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white outline-none focus:border-amber-500"
                />
              </div>

              {/* Site Description */}
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300">SEO Website Description</label>
                <textarea 
                  value={settingsForm.site_description} 
                  onChange={e => setSettingsForm({...settingsForm, site_description: e.target.value})} 
                  placeholder="Website description"
                  rows={3}
                  className="w-full px-5 py-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-850 text-slate-900 dark:text-white outline-none focus:border-amber-500 resize-none"
                ></textarea>
              </div>

              <button 
                onClick={handleSaveSettings}
                disabled={isSaving}
                className="px-6 py-4 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md transition-all hover:scale-105 inline-flex items-center gap-2"
              >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Settings
              </button>

            </div>
          </div>
        )}

      </div>

      {/* --- MODALS SECTION --- */}

      {/* Activities Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-2xl shadow-2xl my-8 transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {editingId ? "Edit Activity" : "New Activity"}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="e.g. Quad Desert Tour" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Price Badge</label>
                  <div className="flex gap-2">
                    <input type="text" value={formData.priceVal} onChange={e => setFormData({...formData, priceVal: e.target.value})} className="flex-1 px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="e.g. 20" />
                    <select value={formData.priceCurrency} onChange={e => setFormData({...formData, priceCurrency: e.target.value})} className="px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold">
                      <option value="$">USD ($)</option>
                      <option value="€">EUR (€)</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Subtitle</label>
                  <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="e.g. Dunes & Off-Road" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Schedule</label>
                  <input type="text" value={formData.schedule} onChange={e => setFormData({...formData, schedule: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="e.g. Available daily" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Suitable for</label>
                  <input type="text" value={formData.suitable} onChange={e => setFormData({...formData, suitable: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="e.g. All levels" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">What&apos;s Included (comma-separated)</label>
                  <input type="text" value={formData.includes} onChange={e => setFormData({...formData, includes: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="e.g. Guide, Tea, Hotel Pickup" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Duration</label>
                  <input type="text" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="e.g. 2 Hours" />
                </div>
                <div className="flex items-center pt-8">
                  <label className="flex items-center cursor-pointer select-none">
                    <input type="checkbox" checked={formData.coming_soon} onChange={e => setFormData({...formData, coming_soon: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
                    <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Set as &quot;Coming Soon&quot;</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" rows={3} placeholder="Describe the experience..."></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Photos (Carousel)</label>
                {currentImages.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl mb-4 border border-slate-100 dark:border-slate-800/80">
                    {currentImages.map((img, idx) => {
                      const displayImg = img.startsWith('http') ? img : `/${img}`;
                      return (
                        <div key={idx} className="relative aspect-[4/3] rounded-xl overflow-hidden bg-slate-200 dark:bg-slate-700 group shadow-sm border border-slate-200/50 dark:border-slate-800">
                          <img src={displayImg} alt={`View ${idx + 1}`} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2 z-10">
                            <button onClick={() => removeImage(idx)} className="self-end p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors" title="Delete Photo"><X className="w-3.5 h-3.5" /></button>
                            <div className="flex justify-between gap-1 w-full">
                              <button onClick={() => moveImage(idx, 'left')} disabled={idx === 0} className="p-1 bg-slate-800/80 hover:bg-slate-800 text-white rounded disabled:opacity-40" title="Move Left"><ArrowUp className="w-3.5 h-3.5 -rotate-90" /></button>
                              <span className="text-white text-xs font-bold self-center">#{idx + 1}</span>
                              <button onClick={() => moveImage(idx, 'right')} disabled={idx === currentImages.length - 1} className="p-1 bg-slate-800/80 hover:bg-slate-800 text-white rounded disabled:opacity-40" title="Move Right"><ArrowDown className="w-3.5 h-3.5 -rotate-90" /></button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="flex items-center gap-4">
                  <label className="cursor-pointer inline-flex items-center gap-2 px-5 py-2.5 bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:hover:bg-amber-900/30 dark:text-amber-400 font-semibold rounded-xl text-sm border border-amber-200/40 dark:border-amber-900/30 transition-colors">
                    {isUploadingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    Upload Photo
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={isUploadingImage} />
                  </label>
                </div>
              </div>
              
              <button onClick={handleSaveActivity} disabled={isSaving || !formData.title} className="w-full mt-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-amber-600/20 transition-transform hover:scale-[1.01]">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Add/Edit Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-xl shadow-2xl transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {editingId ? "Edit Customer Review" : "Add Customer Review"}
              </h2>
              <button onClick={() => setIsReviewModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Author Name</label>
                <input type="text" value={reviewForm.name} onChange={e => setReviewForm({...reviewForm, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="e.g. Sarah L." />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Date</label>
                  <input type="text" value={reviewForm.date} onChange={e => setReviewForm({...reviewForm, date: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="e.g. May 2026" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Rating (Stars)</label>
                  <select value={reviewForm.rating} onChange={e => setReviewForm({...reviewForm, rating: parseInt(e.target.value, 10)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white">
                    <option value="5">5 Stars</option>
                    <option value="4">4 Stars</option>
                    <option value="3">3 Stars</option>
                    <option value="2">2 Stars</option>
                    <option value="1">1 Star</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Review Text</label>
                <textarea value={reviewForm.text} onChange={e => setReviewForm({...reviewForm, text: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none" rows={4} placeholder="Copy client testimonial..."></textarea>
              </div>

              <div className="flex items-center">
                <label className="flex items-center cursor-pointer select-none">
                  <input type="checkbox" checked={reviewForm.is_visible} onChange={e => setReviewForm({...reviewForm, is_visible: e.target.checked})} className="w-5 h-5 rounded border-slate-300 text-amber-600 focus:ring-amber-500" />
                  <span className="ml-2 text-sm font-semibold text-slate-700 dark:text-slate-300">Visible on homepage marquee</span>
                </label>
              </div>

              <button onClick={handleSaveReview} disabled={isSaving || !reviewForm.name || !reviewForm.text} className="w-full mt-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-amber-600/20 transition-transform hover:scale-[1.01]">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Review
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQs Add/Edit Modal */}
      {isFaqModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-xl shadow-2xl transition-colors duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                {editingId ? "Edit FAQ Item" : "Add FAQ Item"}
              </h2>
              <button onClick={() => setIsFaqModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Sort Order</label>
                  <input type="number" value={faqForm.sort_order} onChange={e => setFaqForm({...faqForm, sort_order: parseInt(e.target.value, 10)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Question</label>
                <input type="text" value={faqForm.q} onChange={e => setFaqForm({...faqForm, q: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="e.g. Do I need a license?" />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Answer</label>
                <textarea value={faqForm.a} onChange={e => setFaqForm({...faqForm, a: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white resize-none" rows={4} placeholder="Describe the answer..."></textarea>
              </div>

              <button onClick={handleSaveFaq} disabled={isSaving || !faqForm.q || !faqForm.a} className="w-full mt-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white py-3.5 rounded-xl font-bold flex justify-center items-center gap-2 shadow-lg shadow-amber-600/20 transition-transform hover:scale-[1.01]">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save FAQ
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
