
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export const ShareLink: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    const sessions = JSON.parse(localStorage.getItem('locateMe_sessions') || '[]');
    const found = sessions.find((s: any) => s.id === id);
    if (!found) navigate('/');
    setSession(found);
  }, [id, navigate]);

  // Menggunakan base URL yang lebih aman untuk menghindari 404
  const getBaseUrl = () => {
    const href = window.location.href;
    return href.split('#')[0];
  };

  const shareUrl = `${getBaseUrl()}#/l/${id}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!session) return null;

  return (
    <div className="max-w-md mx-auto px-6 py-12 text-center animate-in fade-in duration-500">
      <div className="mb-6 inline-block p-4 bg-indigo-600 text-white rounded-3xl shadow-lg shadow-indigo-100">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        </svg>
      </div>
      <h2 className="text-3xl font-extrabold mb-2 text-slate-900">Tautan Terenkripsi</h2>
      <p className="text-slate-500 mb-8 text-sm px-4">Salin tautan di bawah dan kirimkan ke target. Tautan ini menyamar sebagai sistem uji koneksi.</p>

      <div className="bg-white p-2 pl-5 rounded-2xl border border-slate-200 shadow-sm mb-6 flex items-center gap-3">
        <input 
          readOnly 
          value={shareUrl} 
          className="flex-1 bg-transparent border-none text-indigo-600 font-mono text-xs focus:outline-none overflow-hidden text-ellipsis"
        />
        <button 
          onClick={copyToClipboard}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-3 rounded-xl text-xs font-bold transition-all active:scale-95 shadow-md shadow-indigo-100"
        >
          {copied ? "Berhasil!" : "Salin Link"}
        </button>
      </div>

      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-10 text-left relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-5">
          <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z"/></svg>
        </div>
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Pesan Umpan (AI-Generated):</p>
        <p className="text-slate-700 italic text-sm font-medium leading-relaxed">"{session.aiMessage}"</p>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(session.aiMessage + "\n\n" + shareUrl)}`)}
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-green-100"
        >
          Kirim via WhatsApp
        </button>
        <button 
          onClick={() => navigate(`/session/${id}`)}
          className="text-slate-400 hover:text-indigo-600 font-bold py-2 text-xs uppercase tracking-widest transition-colors"
        >
          Lewati & Pantau Dashboard
        </button>
      </div>
      
      <div className="mt-12 pt-8 border-t border-slate-100">
        <p className="text-[10px] text-slate-300 font-medium leading-relaxed">
          CATATAN: Karena ini versi demo tanpa database server, data hanya akan muncul jika Anda mencoba di HP yang sama (tab berbeda). Untuk penggunaan antar HP, aplikasi harus dihubungkan ke database (Firebase/Supabase).
        </p>
      </div>
    </div>
  );
};
