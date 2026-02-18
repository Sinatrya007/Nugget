
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<any[]>([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem('locateMe_sessions') || '[]');
    setSessions(data);
  }, []);

  const clearHistory = () => {
    if (confirm('Hapus semua riwayat sesi?')) {
      localStorage.removeItem('locateMe_sessions');
      setSessions([]);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Riwayat Sesi</h1>
        {sessions.length > 0 && (
          <button 
            onClick={clearHistory}
            className="text-sm text-red-500 hover:text-red-700 font-medium"
          >
            Hapus Semua
          </button>
        )}
      </div>

      <div className="space-y-4">
        {sessions.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <p className="text-slate-400 mb-6">Belum ada sesi yang dibuat.</p>
            <button 
              onClick={() => navigate('/create')}
              className="bg-blue-600 text-white font-bold py-3 px-8 rounded-xl"
            >
              Buat Sesi Pertama
            </button>
          </div>
        ) : (
          sessions.map((session) => (
            <div 
              key={session.id}
              onClick={() => navigate(`/session/${session.id}`)}
              className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer group flex items-center justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-lg font-bold text-slate-900 truncate">{session.title}</h3>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    session.receivedLocations.length > 0 ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {session.receivedLocations.length} Update
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Dibuat oleh <span className="text-slate-700 font-medium">{session.creatorName}</span> • {new Date(session.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div className="text-slate-300 group-hover:text-blue-500 ml-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="mt-8 flex justify-center">
         <button onClick={() => navigate('/')} className="text-slate-500 font-medium hover:text-blue-600">
          ← Kembali ke Beranda
        </button>
      </div>
    </div>
  );
};
