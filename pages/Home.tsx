
import React from 'react';
import { useNavigate } from 'react-router-dom';

export const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-100 rounded-full blur-[120px] opacity-50"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px] opacity-50"></div>

      <nav className="flex justify-between items-center px-6 py-6 max-w-6xl mx-auto relative z-10">
        <div className="flex items-center gap-2">
          <div className="bg-indigo-600 p-1.5 rounded-lg">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
          </div>
          <span className="font-bold text-xl tracking-tight text-slate-800">SpotSync</span>
        </div>
      </nav>

      <main className="flex flex-col items-center justify-center px-4 pt-16 pb-24 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 px-3 py-1 rounded-full text-indigo-600 text-xs font-bold mb-8 uppercase tracking-wider">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Next-Gen Coordination
        </div>
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight max-w-3xl leading-[1.1]">
          Koordinasi Lokasi Tanpa <span className="text-indigo-600">Hambatan.</span>
        </h1>
        
        <p className="text-lg text-slate-600 max-w-xl mb-12 leading-relaxed">
          Platform sinkronisasi titik temu paling presisi. Buat link konfirmasi lokasi untuk tim, keluarga, atau logistik dalam hitungan detik.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
          <button 
            onClick={() => navigate('/create')}
            className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-2xl transition-all active:scale-95 shadow-xl shadow-slate-200"
          >
            Buat Link Sesi
          </button>
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex-1 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold py-4 px-8 rounded-2xl transition-all active:scale-95"
          >
            Monitor Sesi
          </button>
        </div>

        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl opacity-60">
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-bold text-slate-800">100%</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Akurasi GPS</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-bold text-slate-800">Real-time</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Update Data</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-bold text-slate-800">Secure</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">End-to-End</p>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-2xl font-bold text-slate-800">Mobile</p>
            <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Optimized</p>
          </div>
        </div>
      </main>
    </div>
  );
};
