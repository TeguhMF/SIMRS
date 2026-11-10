import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import { Pill, CheckCircle2, AlertCircle, Clock, ArrowRight, RefreshCw, FlaskConical } from 'lucide-react';

export default function Farmasi() {
  const [antrean, setAntrean] = useState([]);
  const [selectedPasien, setSelectedPasien] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Fetch Antrean Pasien Farmasi
  const fetchAntrean = async () => {
    try {
      const res = await api.get('/farmasi/antrean');
      console.log("Data Antrean Farmasi dari API:", res.data.data);
      setAntrean(res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil antrean farmasi:", err);
    }
  };

  useEffect(() => {
    fetchAntrean();
  }, []);

  const handleSerahObat = async (pendaftaranId) => {
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await api.post('/farmasi/proses', { pendaftaran_id: pendaftaranId });
      setMsg({ type: 'success', text: res.data.message || 'Obat berhasil diserahkan. Pasien diteruskan ke Kasir.' });

      setSelectedPasien(null);
      fetchAntrean();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal memproses penyerahan obat.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Modul Farmasi / Apotek">
      <div className="space-y-4">
        
        {/* Alert Status */}
        {msg.text && (
          <div className={`p-3 rounded-lg text-xs font-medium flex items-center justify-between border ${
            msg.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {msg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
              <span>{msg.text}</span>
            </div>
            <button onClick={() => setMsg({ type: '', text: '' })} className="font-bold">×</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Antrean Farmasi */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>Antrean Resep Farmasi ({antrean.length})</span>
                </h3>
                <button 
                  onClick={fetchAntrean}
                  className="p-1 text-slate-500 hover:text-emerald-600 text-xs flex items-center gap-1 border rounded px-2"
                >
                  <RefreshCw className="w-3 h-3" /> Reload
                </button>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {antrean.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                    Tidak ada antrean resep (status: MENUNGGU_FARMASI).
                  </div>
                ) : (
                  antrean.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedPasien(item)}
                      className={`p-3 rounded-lg border transition cursor-pointer ${
                        selectedPasien?.id === item.id 
                          ? 'bg-emerald-50 border-emerald-300 ring-1 ring-emerald-600/30' 
                          : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-500">{item.no_pendaftaran}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                          {item.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.pasien?.nama_lengkap || 'Pasien Tanpa Nama'}</h4>
                      <p className="font-mono text-[10px] text-slate-500 mt-0.5">{item.pasien?.no_rm || '-'}</p>
                      <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] text-emerald-700 font-bold text-right">
                        Lihat Resep &rarr;
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Rincian Resep & Konfirmasi */}
          <div className="lg:col-span-2">
            {selectedPasien ? (
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Resep Obat Pasien:</span>
                    <h3 className="font-bold text-slate-900 text-base">{selectedPasien.pasien?.nama_lengkap}</h3>
                    <p className="font-mono text-[10px] text-slate-500">{selectedPasien.pasien?.no_rm} • Dokter: {selectedPasien.dokter?.nama || '-'}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-mono text-xs font-bold border border-emerald-200">
                    {selectedPasien.status}
                  </span>
                </div>

                {/* Tampilan Catatan Resep dari Dokter */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Pill className="w-4 h-4 text-emerald-600" /> Catatan Resep Obat dari Dokter:
                  </span>
                  <div className="p-3 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 whitespace-pre-wrap font-mono font-medium leading-relaxed">
                    {selectedPasien.rekam_medis?.catatan_resep || 'Tidak ada catatan resep tertulis.'}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSerahObat(selectedPasien.id)}
                  disabled={loading}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <span>{loading ? 'Memproses Penyerahan...' : 'Konfirmasi Penyerahan Obat & Teruskan Ke Kasir'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl border border-slate-200/80 text-center text-slate-400 text-xs">
                Pilih pasien dari daftar antrean resep farmasi di sebelah kiri.
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}