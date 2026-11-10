import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import { FlaskConical, CheckCircle2, AlertCircle, Clock, ArrowRight, RefreshCw } from 'lucide-react';

export default function Laboratorium() {
  const [antrean, setAntrean] = useState([]);
  const [selectedPasien, setSelectedPasien] = useState(null);
  const [hasilLab, setHasilLab] = useState('');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Fetch Antrean Pasien Laboratorium
  const fetchAntrean = async () => {
    try {
      const res = await api.get('/lab/antrean');
      console.log("Data Antrean Lab dari API:", res.data.data); // Cek F12 Console
      setAntrean(res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil antrean lab:", err);
    }
  };

  useEffect(() => {
    fetchAntrean();
  }, []);

  const handleSelectPasien = (item) => {
    setSelectedPasien(item);
    setHasilLab('Pemeriksaan Laboratorium Normal / Selesai');
  };

  const handleSubmitHasil = async (e) => {
    e.preventDefault();
    if (!selectedPasien) return;

    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const payload = {
        pendaftaran_id: selectedPasien.id,
        hasil: hasilLab
      };

      const res = await api.post('/lab/submit', payload);
      setMsg({ type: 'success', text: res.data.message || 'Hasil lab berhasil disimpan dan pasien diteruskan ke Farmasi.' });

      setSelectedPasien(null);
      setHasilLab('');
      fetchAntrean();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal menyimpan hasil laboratorium.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Modul Laboratorium">
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
          
          {/* Antrean Lab */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span>Antrean Pasien Lab ({antrean.length})</span>
                </h3>
                <button 
                  onClick={fetchAntrean}
                  className="p-1 text-slate-500 hover:text-purple-600 text-xs flex items-center gap-1 border rounded px-2"
                >
                  <RefreshCw className="w-3 h-3" /> Reload
                </button>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {antrean.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                    Tidak ada antrean laboratorium (status: MENUNGGU_LAB).
                  </div>
                ) : (
                  antrean.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectPasien(item)}
                      className={`p-3 rounded-lg border transition cursor-pointer ${
                        selectedPasien?.id === item.id 
                          ? 'bg-purple-50 border-purple-300 ring-1 ring-purple-600/30' 
                          : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-500">{item.no_pendaftaran}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-100 text-purple-800">
                          {item.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.pasien?.nama_lengkap || 'Pasien Tanpa Nama'}</h4>
                      <p className="font-mono text-[10px] text-slate-500 mt-0.5">{item.pasien?.no_rm || '-'}</p>
                      <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] text-purple-700 font-bold text-right">
                        Proses Lab &rarr;
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Form Hasil Lab */}
          <div className="lg:col-span-2">
            {selectedPasien ? (
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-purple-800 uppercase block">Pasien Laboratorium:</span>
                    <h3 className="font-bold text-slate-900 text-base">{selectedPasien.pasien?.nama_lengkap}</h3>
                    <p className="font-mono text-[10px] text-slate-500">{selectedPasien.pasien?.no_rm} • Dokter: {selectedPasien.dokter?.nama || '-'}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded font-mono text-xs font-bold border border-purple-200">
                    {selectedPasien.status}
                  </span>
                </div>

                {/* Info Diagnosa & Anamnesis dari Dokter */}
                <div className="p-3 bg-purple-50/50 border border-purple-100 rounded-lg text-xs space-y-1">
                  <p><strong>Anamnesis Dokter:</strong> {selectedPasien.rekam_medis?.anamnesis || '-'}</p>
                  <p><strong>Diagnosis Dokter:</strong> {selectedPasien.rekam_medis?.diagnosis || '-'}</p>
                </div>

                <form onSubmit={handleSubmitHasil} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                      <FlaskConical className="w-4 h-4 text-purple-600" /> Hasil / Catatan Pemeriksaan Lab
                    </label>
                    <textarea
                      rows="4"
                      required
                      value={hasilLab}
                      onChange={(e) => setHasilLab(e.target.value)}
                      placeholder="Masukkan catatan / nilai hasil laboratorium di sini..."
                      className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-purple-600"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>{loading ? 'Menyimpan...' : 'Selesai & Teruskan Pasien Ke Farmasi'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl border border-slate-200/80 text-center text-slate-400 text-xs">
                Pilih pasien dari daftar antrean laboratorium di sebelah kiri.
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}