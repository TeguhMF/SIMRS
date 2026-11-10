import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import { 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Pill, 
  FlaskConical, 
  Clock,
  ArrowRight
} from 'lucide-react';

export default function RMEDokter() {
  const [antrean, setAntrean] = useState([]);
  const [selectedPasien, setSelectedPasien] = useState(null);
  const [ttvData, setTtvData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Form Rekam Medis & Resep
  const [formRme, setFormRme] = useState({
    anamnesis: '',
    diagnosis: '',
    tindakan: '',
    catatan_resep: '', // Catatan Resep Obat untuk Farmasi
  });

  // Tombol Toggle Ke Lab (Opsional: Ya/Tidak)
  const [kirimKeLab, setKirimKeLab] = useState(false);

  // Fetch Antrean Pasien Dokter
  const fetchAntrean = async () => {
    try {
      const res = await api.get('/dokter/antrean');
      setAntrean(res.data.data);
    } catch (err) {
      console.error("Gagal mengambil antrean dokter:", err);
    }
  };

  useEffect(() => {
    fetchAntrean();
  }, []);

  // Ketika pasien dipilih dari antrean
  const handleSelectPasien = async (item) => {
    setSelectedPasien(item);
    setTtvData(null);

    // Ambil data TTV dari eager loading antrean
    if (item.pemeriksaan_perawat) {
      let ttv = { ...item.pemeriksaan_perawat };
      if (!ttv.tekanan_darah && (ttv.sistol || ttv.diastol)) {
        ttv.tekanan_darah = `${ttv.sistol}/${ttv.diastol}`;
      }
      setTtvData(ttv);
    }

    // Fetch TTV paling baru via API
    try {
      const res = await api.get(`/dokter/ttv/${item.id}`);
      if (res.data && res.data.data) {
        let fetched = res.data.data;
        if (!fetched.tekanan_darah && (fetched.sistol || fetched.diastol)) {
          fetched.tekanan_darah = `${fetched.sistol}/${fetched.diastol}`;
        }
        setTtvData(fetched);
      }
    } catch (err) {
      console.error("Gagal mengambil data TTV:", err);
    }
  };

  // Submit Form RME
  const handleSubmitRme = async (e) => {
    e.preventDefault();
    if (!selectedPasien) {
      setMsg({ type: 'error', text: 'Pilih pasien terlebih dahulu dari daftar antrean.' });
      return;
    }

    if (!formRme.catatan_resep.trim()) {
      setMsg({ type: 'error', text: 'Catatan resep obat wajib diisi untuk Farmasi.' });
      return;
    }

    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const payload = {
        pendaftaran_id: selectedPasien.id,
        anamnesis: formRme.anamnesis,
        diagnosis: formRme.diagnosis,
        tindakan: formRme.tindakan,
        catatan_resep: formRme.catatan_resep,
        kirim_ke_lab: kirimKeLab // Boolean flag (true/false)
      };

      const res = await api.post('/dokter/rme', payload);
      setMsg({ type: 'success', text: res.data.message });

      // Reset Form & Refresh Antrean Pasien
      setSelectedPasien(null);
      setTtvData(null);
      setFormRme({ anamnesis: '', diagnosis: '', tindakan: '', catatan_resep: '' });
      setKirimKeLab(false);
      fetchAntrean();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal menyimpan Rekam Medis.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Rekam Medis Elektronik (RME Dokter)">
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
            <button onClick={() => setMsg({ type: '', text: '' })} className="text-slate-400 hover:text-slate-600 font-bold">×</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          
          {/* Kolom Kiri: Antrean Pasien Dokter */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-slate-800 text-xs mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Antrean Poliklinik ({antrean.length})</span>
              </h3>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {antrean.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                    Tidak ada antrean pasien untuk Anda saat ini.
                  </div>
                ) : (
                  antrean.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => handleSelectPasien(item)}
                      className={`p-3 rounded-lg border transition cursor-pointer ${
                        selectedPasien?.id === item.id 
                          ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-600/30' 
                          : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-500">{item.no_pendaftaran}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-blue-100 text-blue-800">
                          {item.jenis_penjamin || 'UMUM'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.pasien?.nama_lengkap}</h4>
                      <p className="font-mono text-[10px] text-slate-500 mt-0.5">{item.pasien?.no_rm} • {item.pasien?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                      <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] text-emerald-700 font-bold text-right">
                        Periksa Pasien &rarr;
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form RME, Lab Button & Catatan Resep */}
          <div className="lg:col-span-2 space-y-3">
            
            {/* Box Ringkasan TTV Pasien */}
            {selectedPasien && (
              <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Pasien Sedang Diperiksa:</span>
                    <h3 className="font-bold text-slate-900 text-sm">{selectedPasien.pasien?.nama_lengkap}</h3>
                    <p className="font-mono text-[10px] text-slate-500">{selectedPasien.pasien?.no_rm} • NIK: {selectedPasien.pasien?.nik}</p>
                  </div>
                  <span className="px-2 py-1 bg-emerald-50 text-emerald-800 rounded font-mono text-[10px] font-bold border border-emerald-200">
                    Status: {selectedPasien.status}
                  </span>
                </div>

                {/* TTV Grid Summary */}
                {ttvData ? (
                  <div className="mt-3 p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-2">
                    <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-emerald-700" /> Vital Signs & Keluhan (Nurse Station)
                    </div>
                    <p className="text-slate-800 font-medium"><strong>Keluhan Utama:</strong> "{ttvData.keluhan_utama || '-'}"</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono pt-1 border-t border-slate-200/60">
                      <div><span className="text-slate-400 block text-[9px]">TD:</span> {ttvData.tekanan_darah || '-'} mmHg</div>
                      <div><span className="text-slate-400 block text-[9px]">Nadi:</span> {ttvData.nadi || '-'} x/mnt</div>
                      <div><span className="text-slate-400 block text-[9px]">Suhu:</span> {ttvData.suhu || '-'} °C</div>
                      <div><span className="text-slate-400 block text-[9px]">BB / TB:</span> {ttvData.berat_badan || '-'} kg / {ttvData.tinggi_badan || '-'} cm</div>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-amber-700 italic mt-2">Data TTV perawat belum tersedia untuk pasien ini.</p>
                )}
              </div>
            )}

            {/* Form Input RME */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-slate-800 text-xs mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-emerald-700" />
                <span>Anamnesis, Diagnosis & Plan</span>
              </h3>

              <form onSubmit={handleSubmitRme} className="space-y-4">
                
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Anamnesis / Keluhan Dokter</label>
                  <textarea 
                    rows="2"
                    required
                    value={formRme.anamnesis}
                    onChange={(e) => setFormRme({ ...formRme, anamnesis: e.target.value })}
                    placeholder="Hasil pemeriksaan dan anamnesis dokter..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Diagnosis (ICD-10)</label>
                    <input 
                      type="text"
                      required
                      value={formRme.diagnosis}
                      onChange={(e) => setFormRme({ ...formRme, diagnosis: e.target.value })}
                      placeholder="Contoh: Febris Typhoid (A01.0)"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">Tindakan / Prosedur</label>
                    <input 
                      type="text"
                      value={formRme.tindakan}
                      onChange={(e) => setFormRme({ ...formRme, tindakan: e.target.value })}
                      placeholder="Contoh: Konseling & Istirahat Baring"
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                </div>

                {/* Section Order Laboratorium (CUKUP SATU TOMBOL DAFTAR/TIDAK) */}
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex justify-between items-center bg-purple-50 p-3 rounded-lg border border-purple-200">
                    <div className="flex items-center gap-2">
                      <FlaskConical className="w-5 h-5 text-purple-600" />
                      <div>
                        <h4 className="font-bold text-xs text-purple-900">Pemeriksaan Laboratorium (Opsional)</h4>
                        <p className="text-[10px] text-purple-700">Aktifkan tombol jika pasien perlu tes ke Laboratorium dulu.</p>
                      </div>
                    </div>
                    
                    <button
                      type="button"
                      onClick={() => setKirimKeLab(!kirimKeLab)}
                      className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition cursor-pointer ${
                        kirimKeLab 
                          ? 'bg-purple-700 text-white border-purple-800 shadow-sm' 
                          : 'bg-white text-purple-700 border-purple-300 hover:bg-purple-100'
                      }`}
                    >
                      {kirimKeLab ? '✓ Didaftarkan Ke Lab' : '+ Daftarkan Ke Lab'}
                    </button>
                  </div>
                </div>

                {/* Section Resep Obat (CATATAN DOKTER UNTUK FARMASI - WAJIB) */}
                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1 flex items-center gap-1">
                    <Pill className="w-3.5 h-3.5 text-emerald-700" /> Catatan Resep Obat untuk Farmasi (Wajib)
                  </label>
                  <textarea 
                    rows="3"
                    required
                    value={formRme.catatan_resep}
                    onChange={(e) => setFormRme({ ...formRme, catatan_resep: e.target.value })}
                    placeholder="Tuliskan daftar obat dan aturan pakainya di sini. Contoh: Paracetamol 500mg 3x1 (10 tab), Amoxicillin 500mg 3x1 (10 tab sesudah makan)..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !selectedPasien}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg transition shadow-xs cursor-pointer disabled:opacity-50 mt-4 flex items-center justify-center gap-1.5"
                >
                  <span>{loading ? 'Menyimpan Pemeriksaan...' : 'Simpan Rekam Medis & Teruskan Pasien'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>

          </div>

        </div>

      </div>
    </MainLayout>
  );
}