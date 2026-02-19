
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getFromCloud } from '../services/api';
import { MapPin, Clock, ArrowLeft, ExternalLink, Copy, Check, Navigation, Info } from 'lucide-react';

export const SessionDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const fetchData = async () => {
    const cloudData = await getFromCloud(id!);
    if (cloudData) {
      setSession(cloudData);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 font-sans">
        <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full mb-4"></div>
        <p className="text-slate-400 font-medium">Memuat data lokasi...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div>
              <h1 className="font-bold text-xl tracking-tight">{session.title}</h1>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">ID: {id}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            Live Sync
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Total Update</div>
            <div className="text-4xl font-black text-slate-900">{session.receivedLocations?.length || 0}</div>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Dibuat Oleh</div>
            <div className="text-xl font-bold text-slate-900 truncate">{session.creatorName}</div>
          </div>
          <div className="bg-indigo-600 p-8 rounded-3xl shadow-lg shadow-indigo-100 text-white">
            <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-2">Status</div>
            <div className="text-xl font-bold">Menunggu Data...</div>
          </div>
        </div>

        {/* Location Log */}
        <div className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Navigation className="w-5 h-5 text-indigo-600" />
              Riwayat Transmisi
            </h2>
          </div>

          {(!session.receivedLocations || session.receivedLocations.length === 0) ? (
            <div className="bg-white border border-slate-200 border-dashed rounded-[2rem] py-24 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-medium">Belum ada lokasi yang diterima untuk sesi ini.</p>
            </div>
          ) : (
            [...session.receivedLocations].reverse().map((loc: any, i: number) => (
              <div key={i} className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 hover:shadow-md transition-all group">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl">
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                          {new Date(loc.time).toLocaleTimeString()} • {new Date(loc.time).toLocaleDateString()}
                        </div>
                        <h3 className="font-bold text-lg">Koordinat GPS Diterima</h3>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-4 flex items-start gap-3">
                      <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
                      <p className="text-sm text-slate-600 italic leading-relaxed">"{loc.desc}"</p>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <span>Akurasi: ±{Math.round(loc.acc)}m</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>Lat: {loc.lat.toFixed(6)}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span>Lng: {loc.lng.toFixed(6)}</span>
                    </div>
                  </div>

                  <div className="flex flex-row md:flex-col gap-3">
                    <a 
                      href={`https://www.google.com/maps/search/?api=1&query=${loc.lat},${loc.lng}`}
                      target="_blank" rel="noopener noreferrer"
                      className="flex-1 md:w-full flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-indigo-600 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Buka Peta
                    </a>
                    <button 
                      onClick={() => copyToClipboard(`${loc.lat}, ${loc.lng}`, i)}
                      className="flex-1 md:w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-600 px-6 py-3 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors"
                    >
                      {copiedIndex === i ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                      {copiedIndex === i ? 'Tersalin' : 'Salin'}
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};
