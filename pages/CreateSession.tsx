
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateShareMessage } from '../services/gemini';
import { syncToCloud } from '../services/api';

export const CreateSession: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    creatorName: '',
    purpose: 'Verifikasi Jaringan'
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const sessionId = Math.random().toString(36).substring(2, 10);
      const aiMessage = await generateShareMessage(formData.creatorName, formData.purpose);
      
      const sessionData = {
        id: sessionId,
        title: formData.title || 'Sesi Diagnosa',
        creatorName: formData.creatorName,
        purpose: formData.purpose,
        aiMessage: aiMessage,
        createdAt: Date.now(),
        receivedLocations: []
      };

      // SIMPAN KE CLOUD
      await syncToCloud(sessionId, sessionData);

      // Simpan ID lokal agar muncul di riwayat
      const existing = JSON.parse(localStorage.getItem('locateMe_sessions') || '[]');
      localStorage.setItem('locateMe_sessions', JSON.stringify([{ id: sessionId, title: sessionData.title }, ...existing]));
      
      navigate(`/share/${sessionId}`);
    } catch (error) {
      alert('Gagal membuat sesi cloud.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12">
      <header className="mb-10 text-center">
        <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Konfigurasi Stealth</h2>
        <p className="text-slate-500 text-sm">Target akan melihat ini sebagai uji jaringan teknis.</p>
      </header>
      
      <form onSubmit={handleCreate} className="space-y-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Nama Sesi (Internal)</label>
            <input 
              type="text" required placeholder="Contoh: Target A"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm font-medium"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Samaran Pengirim</label>
            <input 
              type="text" required placeholder="Contoh: Admin Jaringan / Logistik"
              className="w-full px-4 py-3.5 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all text-sm font-medium"
              value={formData.creatorName}
              onChange={(e) => setFormData({...formData, creatorName: e.target.value})}
            />
          </div>
        </div>

        <button 
          disabled={loading}
          type="submit"
          className="w-full bg-slate-900 text-white font-bold py-5 rounded-3xl shadow-xl hover:bg-slate-800 disabled:opacity-70 transition-all flex items-center justify-center gap-3"
        >
          {loading ? "Mempersiapkan Jalur Cloud..." : "Aktifkan Link Stealth"}
        </button>
      </form>
    </div>
  );
};
