
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFromCloud } from '../services/api';

export const SessionDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const cloudData = await getFromCloud(id!);
      if (cloudData) {
        setSession(cloudData);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full"></div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sinkronisasi Cloud...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="mb-10">
        <button onClick={() => navigate('/dashboard')} className="text-xs font-bold text-indigo-600 mb-4 uppercase tracking-widest">← Kembali ke Dashboard</button>
        <h1 className="text-4xl font-black text-slate-900">{session.title}</h1>
        <p className="text-slate-500 text-sm mt-2">ID Sesi: <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-indigo-600">{id}</span></p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Total Lokasi Diterima</p>
          <p className="text-4xl font-black text-slate-900">{session.receivedLocations?.length || 0}</p>
        </div>
        <div className="bg-indigo-600 p-6 rounded-3xl shadow-lg shadow-indigo-100 text-white">
          <p className="text-[10px] font-bold opacity-70 uppercase mb-2">Mode Operasi</p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-indigo-300 rounded-full"></div>
            <p className="text-xl font-bold">Snapshot (Sekali Share)</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-xl font-black text-slate-900">Riwayat Lokasi Diterima</h2>
        
        {(!session.receivedLocations || session.receivedLocations.length === 0) ? (
          <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] py-20 text-center">
            <p className="text-slate-400 text-sm italic">Menunggu target menekan tombol kirim lokasi...</p>
          </div>
        ) : (
          [...session.receivedLocations].reverse().map((loc: any, i: number) => (
            <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">
                    TERKIRIM PADA {new Date(loc.time).toLocaleTimeString()}
                  </p>
                  <p className="text-lg font-bold text-slate-900">Titik Koordinat Terdeteksi</p>
                </div>
                <div className="bg-indigo-50 text-indigo-600 text-[10px] font-bold px-3 py-1 rounded-full">
                  AKURASI ±{Math.round(loc.acc)}M
                </div>
              </div>
              
              <div className="bg-slate-50 rounded-2xl p-4 mb-6 border border-slate-100">
                <p className="text-sm text-slate-600 italic leading-relaxed">"{loc.desc}"</p>
              </div>

              <div className="flex gap-2">
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 bg-slate-900 text-white text-xs font-bold py-4 rounded-2xl text-center hover:bg-slate-800 transition-colors"
                >
                  Lihat di Google Maps
                </a>
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(`${loc.lat}, ${loc.lng}`);
                    alert('Koordinat disalin!');
                  }}
                  className="px-6 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-slate-50"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
