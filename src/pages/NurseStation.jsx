import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import { 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Heart, 
  Thermometer, 
  Wind, 
  Scale, 
  Ruler, 
  FileSpreadsheet,
  Clock
} from 'lucide-react';

export default function NurseStation() {
  const [antrean, setAntrean] = useState([]);
  const [selectedPasien, setSelectedPasien] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const [formTtv, setFormTtv] = useState({
    tekanan_darah: '120/80',
    nadi: '80',
    suhu: '36.5',
    pernapasan: '18',
    berat_badan: '65',
    tinggi_badan: '170',
    keluhan_utama: ''
  });

  const fetchAntrean = async () => {
    try {
      const res = await api.get('/nurse/antrean');
      setAntrean(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAntrean();
  }, []);

  const handleSubmitTtv = async (e) => {
    e.preventDefault();
    if (!selectedPasien) {
      setMsg({ type: 'error', text: 'Pilih pasien dari antrean terlebih dahulu.' });
      return;
    }

    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await api.post('/nurse/ttv', {
        pendaftaran_id: selectedPasien.id,
        ...formTtv
      });

      setMsg({ type: 'success', text: res.data.message });
      setSelectedPasien(null);
      setFormTtv({
        tekanan_darah: '120/80',
        nadi: '80',
        suhu: '36.5',
        pernapasan: '18',
        berat_badan: '65',
        tinggi_badan: '170',
        keluhan_utama: ''
      });
      fetchAntrean();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal menyimpan data TTV.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Nurse Station - Examination & TTV">
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
          
          {/* Kolom Kiri: Daftar Antrean Pasien (Status: MENUNGGU_TTV) */}
          <div className="lg:col-span-1 space-y-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>Antrean Menunggu TTV ({antrean.length})</span>
                </h3>
              </div>

              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {antrean.length === 0 ? (
                  <div className="p-4 text-center text-slate-400 text-xs border border-dashed border-slate-200 rounded-lg">
                    Tidak ada antrean pasien untuk TTV saat ini.
                  </div>
                ) : (
                  antrean.map((item) => (
                    <div 
                      key={item.id}
                      onClick={() => setSelectedPasien(item)}
                      className={`p-3 rounded-lg border transition cursor-pointer ${
                        selectedPasien?.id === item.id 
                          ? 'bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-600/30' 
                          : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100/80'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-500">{item.no_pendaftaran}</span>
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-amber-100 text-amber-800">
                          {item.jenis_penjamin}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-xs">{item.pasien?.nama_lengkap}</h4>
                      <p className="font-mono text-[10px] text-slate-500 mt-0.5">{item.pasien?.no_rm} • {item.pasien?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
                      <div className="mt-2 pt-1.5 border-t border-slate-200/60 text-[10px] text-slate-600 flex justify-between">
                        <span>Dokter: {item.dokter?.name}</span>
                        <span className="font-bold text-emerald-700">Pilih Pasien &rarr;</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Input Vital Signs (TTV) */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-slate-800 text-xs mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-700" />
                <span>Pemeriksaan Tanda-Tanda Vital (TTV)</span>
              </h3>

              {selectedPasien ? (
                <div className="mb-4 p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-lg text-xs flex justify-between items-center">
                  <div>
                    <span className="text-[10px] font-bold text-emerald-800 uppercase block">Pasien Aktif:</span>
                    <p className="font-bold text-slate-900 text-sm mt-0.5">{selectedPasien.pasien?.nama_lengkap}</p>
                    <p className="font-mono text-[10px] text-emerald-700">{selectedPasien.pasien?.no_rm} • NIK: {selectedPasien.pasien?.nik}</p>
                  </div>
                  <div className="text-right font-mono text-[11px] text-slate-600">
                    <p className="font-semibold text-slate-800">Tujuan Poliklinik:</p>
                    <p>{selectedPasien.dokter?.name}</p>
                  </div>
                </div>
              ) : (
                <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  Pilih salah satu pasien dari daftar antrean sebelah kiri untuk mulai input TTV.
                </div>
              )}

              <form onSubmit={handleSubmitTtv} className="space-y-4">
                
                {/* Keluhan Utama */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Keluhan Utama Pasien</label>
                  <textarea 
                    rows="2"
                    required
                    value={formTtv.keluhan_utama}
                    onChange={(e) => setFormTtv({ ...formTtv, keluhan_utama: e.target.value })}
                    placeholder="Contoh: Demam tinggi sejak 2 hari yang lalu disertai pusing dan mual..."
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  ></textarea>
                </div>

                {/* Grid Parameter TTV */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <Activity className="w-3.5 h-3.5 text-emerald-700" /> Tekanan Darah (mmHg)
                    </label>
                    <input 
                      type="text" 
                      required
                      value={formTtv.tekanan_darah}
                      onChange={(e) => setFormTtv({ ...formTtv, tekanan_darah: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                      placeholder="120/80"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <Heart className="w-3.5 h-3.5 text-red-600" /> Denyut Nadi (x/mnt)
                    </label>
                    <input 
                      type="number" 
                      required
                      value={formTtv.nadi}
                      onChange={(e) => setFormTtv({ ...formTtv, nadi: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                      placeholder="80"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <Thermometer className="w-3.5 h-3.5 text-amber-600" /> Suhu Tubuh (°C)
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      required
                      value={formTtv.suhu}
                      onChange={(e) => setFormTtv({ ...formTtv, suhu: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                      placeholder="36.5"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <Wind className="w-3.5 h-3.5 text-blue-600" /> Pernapasan (x/mnt)
                    </label>
                    <input 
                      type="number" 
                      required
                      value={formTtv.pernapasan}
                      onChange={(e) => setFormTtv({ ...formTtv, pernapasan: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                      placeholder="18"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <Scale className="w-3.5 h-3.5 text-purple-600" /> Berat Badan (kg)
                    </label>
                    <input 
                      type="number" 
                      step="0.1"
                      value={formTtv.berat_badan}
                      onChange={(e) => setFormTtv({ ...formTtv, berat_badan: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                      placeholder="65"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1 flex items-center gap-1">
                      <Ruler className="w-3.5 h-3.5 text-teal-600" /> Tinggi Badan (cm)
                    </label>
                    <input 
                      type="number" 
                      value={formTtv.tinggi_badan}
                      onChange={(e) => setFormTtv({ ...formTtv, tinggi_badan: e.target.value })}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 font-mono"
                      placeholder="170"
                    />
                  </div>

                </div>

                <button 
                  type="submit" 
                  disabled={loading || !selectedPasien}
                  className="w-full py-2.5 bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs rounded-lg transition shadow-xs cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? 'Menyimpan TTV...' : 'Simpan TTV & Teruskan ke Dokter'}
                </button>
              </form>
            </div>
          </div>

        </div>

      </div>
    </MainLayout>
  );
}