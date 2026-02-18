
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
    setSession(found);
  }, [id]);

  const getShareUrl = () => {
    const origin = window.location.origin;
    const pathname = window.location.pathname;
    return `${origin}${pathname}#/l/${id}`;
  };

  const shareUrl = getShareUrl();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-md mx-auto px-6 py-12 text-center animate-in fade-in duration-500">
      <div className="mb-6 inline-block p-4 bg-indigo-600 text-white rounded-3xl shadow-lg shadow-indigo-100">
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      </div>
      <h2 className="text-3xl font-extrabold mb-2 text-slate-900">Link Siap Dikirim</h2>
      <p className="text-slate-500 mb-8 text-sm px-4">Tautan ini meminta satu kali snapshot lokasi koordinat dari target Anda.</p>

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
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-2">Pesan Untuk Target:</p>
        <p className="text-slate-700 italic text-sm font-medium leading-relaxed">
          {session?.aiMessage || "Mohon kirimkan koordinat lokasi Anda saat ini melalui tautan di atas."}
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <button 
          onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent((session?.aiMessage || "Permintaan Lokasi") + "\n\n" + shareUrl)}`)}
          className="flex items-center justify-center gap-2 bg-[#25D366] text-white font-bold py-4 rounded-2xl hover:opacity-90 transition-all shadow-lg shadow-green-100"
        >
          Kirim via WhatsApp
        </button>
        <button 
          onClick={() => navigate(`/session/${id}`)}
          className="bg-white border border-slate-200 text-slate-700 font-bold py-4 rounded-2xl hover:bg-slate-50 transition-all active:scale-95"
        >
          Lihat Dashboard Penerimaan
        </button>
      </div>
      
      <div className="mt-12 flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Single Snapshot Mode Active</p>
      </div>
    </div>
  );
};
