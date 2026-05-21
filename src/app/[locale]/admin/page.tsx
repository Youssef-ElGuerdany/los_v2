"use client";

import { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, X, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function AdminPanel() {
  const [activities, setActivities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", price: "", description: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchActivities();
  }, []);

  async function fetchActivities() {
    setIsLoading(true);
    if (!supabase) return;
    const { data, error } = await supabase.from('activities').select('*').order('created_at', { ascending: false });
    if (!error && data) {
      setActivities(data);
    }
    setIsLoading(false);
  }

  function openAddModal() {
    setEditingId(null);
    setFormData({ title: "", price: "", description: "" });
    setImageFile(null);
    setIsModalOpen(true);
  }

  function openEditModal(act: any) {
    setEditingId(act.id);
    setFormData({ title: act.title, price: act.price, description: act.description });
    setImageFile(null);
    setIsModalOpen(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    if (!supabase) return;
    await supabase.from('activities').delete().eq('id', id);
    fetchActivities();
  }

  async function handleSave() {
    if (!supabase) return;
    setIsSaving(true);
    
    let imageUrl = null;

    // 1. Upload Image if new one selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('activities')
        .upload(fileName, imageFile);
        
      if (uploadData) {
        const { data: publicUrlData } = supabase.storage.from('activities').getPublicUrl(fileName);
        imageUrl = publicUrlData.publicUrl;
      }
    }

    // 2. Save to Database
    const payload: any = {
      title: formData.title,
      price: formData.price,
      description: formData.description,
    };
    
    if (imageUrl) payload.image_url = imageUrl;

    if (editingId) {
      // Update
      const { error } = await supabase.from('activities').update(payload).eq('id', editingId);
      if (error) alert("Error updating: " + error.message);
    } else {
      // Insert
      const { error } = await supabase.from('activities').insert([payload]);
      if (error) alert("Error adding: " + error.message);
    }

    setIsSaving(false);
    setIsModalOpen(false);
    fetchActivities();
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 pt-24">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
            <p className="text-slate-500 mt-2">Manage your activities, prices, and images dynamically.</p>
          </div>
          <button onClick={openAddModal} className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg transition-transform hover:scale-105">
            <Plus className="w-5 h-5" /> Add Activity
          </button>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
          {isLoading ? (
            <div className="p-10 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-amber-500" /></div>
          ) : (
            <table className="w-full text-left">
              <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                <tr>
                  <th className="p-5 font-semibold">Image</th>
                  <th className="p-5 font-semibold">Title</th>
                  <th className="p-5 font-semibold">Price</th>
                  <th className="p-5 font-semibold">Description</th>
                  <th className="p-5 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activities.length === 0 && (
                  <tr><td colSpan={5} className="p-8 text-center text-slate-500">No activities found. Click "Add Activity" to start!</td></tr>
                )}
                {activities.map((act) => (
                  <tr key={act.id} className="border-t border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                    <td className="p-5">
                      <div className="w-20 h-20 rounded-xl bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden relative">
                        {act.image_url ? (
                           <img src={act.image_url} alt={act.title} className="w-full h-full object-cover" />
                        ) : (
                          <ImageIcon className="text-slate-400 w-8 h-8" />
                        )}
                      </div>
                    </td>
                    <td className="p-5 font-bold text-slate-900 dark:text-white">{act.title}</td>
                    <td className="p-5">
                      <span className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 px-3 py-1 rounded-lg font-bold">
                        {act.price || "Free"}
                      </span>
                    </td>
                    <td className="p-5 text-slate-500 max-w-xs truncate">{act.description}</td>
                    <td className="p-5 text-right">
                      <div className="flex justify-end gap-3">
                        <button onClick={() => openEditModal(act)} className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-lg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => handleDelete(act.id)} className="p-2 bg-red-100 text-red-600 hover:bg-red-200 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{editingId ? "Edit Activity" : "New Activity"}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600"><X className="w-6 h-6" /></button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="e.g. Quad Desert Tour" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Price</label>
                <input type="text" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" placeholder="e.g. 40€ or 400 MAD" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white" rows={3} placeholder="Describe the experience..."></textarea>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Image</label>
                <input type="file" accept="image/*" onChange={e => e.target.files && setImageFile(e.target.files[0])} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100" />
              </div>
              
              <button onClick={handleSave} disabled={isSaving || !formData.title} className="w-full mt-4 bg-amber-600 hover:bg-amber-700 disabled:bg-slate-400 text-white py-3 rounded-xl font-bold flex justify-center items-center gap-2">
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />} Save Activity
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
