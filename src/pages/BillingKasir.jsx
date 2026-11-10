import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import { CreditCard, CheckCircle2, AlertCircle, Clock, RefreshCw, FileText } from 'lucide-react';

export default function Billing() {
  const [antrean, setAntrean] = useState([]);
  const [selectedPasien, setSelectedPasien] = useState(null);
  const [metodeBayar, setMetodeBayar] = useState('TUNAI');
  const [totalBayar, setTotalBayar] = useState(150000);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Fetch Antrean Pasien Billing / Kasir
  const fetchAntrean = async () => {
    try {
      const res = await api.get('/billing/antrean');
      console.log("Data Antrean Billing dari API:", res.data.data);
      setAntrean(res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil antrean billing:", err);
    }
  };

  useEffect(() => {
    fetchAntrean();
  }, []);

  const handleSelectPasien = (item) => {
    setSelectedPasien(item);
  };

  const handleBayar = async (e) => {
    e.preventDefault();
    if (!selectedPasien) return;

    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const payload = {
        pendaftaran_id: selectedPasien.id,
        metode_bayar: metodeBayar,
        total_bayar: totalBayar
      };

      const res = await api.post('/billing/bayar', payload);
      setMsg({ type: 'success', text: res.data.message || 'Pembayaran lunas! Siklus pelayanan pasien selesai.' });

      setSelectedPasien(null);
      fetchAntrean();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal memproses pembayaran.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Modul Kasir / Billing Pembayaran">
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
          
          {/* Antrean Billing */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <span>Antrean Kasir ({antrean.length})</span>
                </h3>
                <button 
                  onClick={fetchAntrean}
                  className="p-1 text-slate-500 hover:text-blue-600 text-xs flex items-center gap-1 border rounded px-2"
                >
                  <RefreshCw className="w-3 h-3" /> Reload
                </button>
              </div>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {antrean.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                    Tidak ada antrean kasir (status: MENUNGGU_BILLING).
                  </div>
                ) : (
                  antrean.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectPasien(item)}
                      className={`p-3 rounded-lg border transition cursor-pointer ${
                        selectedPasien?.id === item.id 
                          ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-600/30' 
                          : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-500">{item.no_pendaftaran}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-blue-100 text-blue-800">
                          {item.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.pasien?.nama_lengkap || 'Pasien Tanpa Nama'}</h4>
                      <p className="font-mono text-[10px] text-slate-500 mt-0.5">{item.pasien?.no_rm || '-'}</p>
                      <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] text-blue-700 font-bold text-right">
                        Proses Bayar &rarr;
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Form Pembayaran Kasir */}
          <div className="lg:col-span-2">
            {selectedPasien ? (
              <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-4">
                <div className="flex justify-between items-start pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-blue-800 uppercase block">Tagihan Pasien:</span>
                    <h3 className="font-bold text-slate-900 text-base">{selectedPasien.pasien?.nama_lengkap}</h3>
                    <p className="font-mono text-[10px] text-slate-500">{selectedPasien.pasien?.no_rm} • Penjamin: {selectedPasien.jenis_penjamin || 'UMUM'}</p>
                  </div>
                  <span className="px-2.5 py-1 bg-blue-100 text-blue-800 rounded font-mono text-xs font-bold border border-blue-200">
                    {selectedPasien.status}
                  </span>
                </div>

                {/* Ringkasan Pelayanan */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1.5">
                  <div className="font-bold text-slate-700 flex items-center gap-1">
                    <FileText className="w-4 h-4 text-blue-600" /> Ringkasan Medis Pasien:
                  </div>
                  <p><strong>Diagnosis:</strong> {selectedPasien.rekam_medis?.diagnosis || '-'}</p>
                  <p><strong>Catatan Resep:</strong> {selectedPasien.rekam_medis?.catatan_resep || '-'}</p>
                </div>

                <form onSubmit={handleBayar} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Metode Pembayaran</label>
                      <select 
                        value={metodeBayar}
                        onChange={(e) => setMetodeBayar(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:bg-white focus:outline-none"
                      >
                        <option value="TUNAI">TUNAI / CASH</option>
                        <option value="QRIS">QRIS / TRANSFER BANK</option>
                        <option value="BPJS">BPJS KESEHATAN</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Total Tagihan (Rp)</label>
                      <input 
                        type="number"
                        value={totalBayar}
                        onChange={(e) => setTotalBayar(e.target.value)}
                        className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono font-bold text-emerald-700 focus:bg-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-lg transition shadow-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>{loading ? 'Memproses Pelunasan...' : 'Proses Pembayaran & Selesaikan Pasien'}</span>
                  </button>
                </form>
              </div>
            ) : (
              <div className="bg-white p-8 rounded-xl border border-slate-200/80 text-center text-slate-400 text-xs">
                Pilih pasien dari daftar antrean kasir di sebelah kiri.
              </div>
            )}
          </div>

        </div>
      </div>
    </MainLayout>
  );
}