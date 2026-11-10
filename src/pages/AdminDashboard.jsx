import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import { 
  ShieldAlert, 
  Users, 
  Activity, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  CreditCard, 
  CheckCircle2, 
  AlertCircle,
  RefreshCw,
  Send,
  Eye
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    total_pendaftaran: 0,
    menunggu_ttv: 0,
    menunggu_dokter: 0,
    menunggu_lab: 0,
    menunggu_farmasi: 0,
    menunggu_billing: 0,
    selesai_lunas: 0
  });
  const [pendaftarans, setPendaftarans] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [targetStatus, setTargetStatus] = useState('MENUNGGU_DOKTER');
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Fetch Overview Data
  const fetchOverview = async () => {
    try {
      const res = await api.get('/admin/overview');
      setStats(res.data.data.stats);
      setPendaftarans(res.data.data.pendaftarans);
    } catch (err) {
      console.error("Gagal mengambil data overview admin:", err);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  // Dispatch / Override Status Pasien
  const handleOverrideStatus = async (pendaftaranId) => {
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await api.post('/admin/override-status', {
        pendaftaran_id: pendaftaranId,
        target_status: targetStatus
      });

      setMsg({ type: 'success', text: res.data.message });
      setSelectedItem(null);
      fetchOverview();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal mengubah status pasien.' });
    } finally {
      setLoading(false);
    }
  };

  // Badge Warna Status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'MENUNGGU_TTV':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'MENUNGGU_DOKTER':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'MENUNGGU_LAB':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'MENUNGGU_FARMASI':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'MENUNGGU_BILLING':
        return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'SELESAI_LUNAS':
        return 'bg-slate-800 text-white border-slate-900';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <MainLayout title="Admin Control Tower (Super Admin)">
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

        {/* Real-time Cards Monitoring SIMRS */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-amber-600 mb-1">
              <span className="text-[10px] font-bold uppercase">Nurse (TTV)</span>
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stats.menunggu_ttv}</div>
            <p className="text-[9px] text-slate-400">Menunggu Perawat</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-blue-600 mb-1">
              <span className="text-[10px] font-bold uppercase">Dokter (RME)</span>
              <Stethoscope className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stats.menunggu_dokter}</div>
            <p className="text-[9px] text-slate-400">Menunggu Dokter</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-purple-600 mb-1">
              <span className="text-[10px] font-bold uppercase">Laboratorium</span>
              <FlaskConical className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stats.menunggu_lab}</div>
            <p className="text-[9px] text-slate-400">Menunggu Lab</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-emerald-600 mb-1">
              <span className="text-[10px] font-bold uppercase">Farmasi</span>
              <Pill className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stats.menunggu_farmasi}</div>
            <p className="text-[9px] text-slate-400">Menunggu Obat</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-cyan-600 mb-1">
              <span className="text-[10px] font-bold uppercase">Billing Kasir</span>
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stats.menunggu_billing}</div>
            <p className="text-[9px] text-slate-400">Menunggu Kasir</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-slate-700 mb-1">
              <span className="text-[10px] font-bold uppercase">Selesai Lunas</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stats.selesai_lunas}</div>
            <p className="text-[9px] text-slate-400">Pelayanan Selesai</p>
          </div>
        </div>

        {/* Table Control Master & Override Action */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-emerald-700" />
                <span>Monitoring Master & Manual Status Dispatcher</span>
              </h3>
              <p className="text-[10px] text-slate-500">Admin dapat memindahkan posisi pasien ke modul mana pun secara bebas.</p>
            </div>

            <button 
              onClick={fetchOverview}
              className="p-1.5 text-slate-600 hover:text-emerald-700 text-xs font-semibold flex items-center gap-1 border border-slate-200 rounded-lg hover:bg-slate-50"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-[10px] uppercase font-bold">
                  <th className="p-2.5">No. Reg / Pasien</th>
                  <th className="p-2.5">Dokter DPJP</th>
                  <th className="p-2.5">Status Saat Ini</th>
                  <th className="p-2.5">Catatan Medis / Resep</th>
                  <th className="p-2.5 text-center">Aksi Override Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {pendaftarans.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-4 text-center text-slate-400 text-xs">Belum ada data pendaftaran pasien.</td>
                  </tr>
                ) : (
                  pendaftarans.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 transition">
                      <td className="p-2.5">
                        <div className="font-mono font-bold text-slate-800 text-[11px]">{item.no_pendaftaran}</div>
                        <div className="font-bold text-slate-900 text-xs">{item.pasien?.nama_lengkap}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.pasien?.no_rm}</div>
                      </td>

                      <td className="p-2.5 font-medium text-slate-700">
                        {item.dokter?.nama || 'Dokter Umum'}
                      </td>

                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>

                      <td className="p-2.5 text-slate-600 text-[11px] max-w-xs truncate">
                        {item.rekam_medis?.catatan_resep || item.rekam_medis?.diagnosis || '-'}
                      </td>

                      <td className="p-2.5 text-center">
                        <button
                          onClick={() => setSelectedItem(item)}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded text-[10px] font-bold flex items-center gap-1 mx-auto transition cursor-pointer"
                        >
                          <Send className="w-3 h-3" /> Pindahkan Status
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Override Status Pasien */}
        {selectedItem && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-4 space-y-4">
              <div className="flex justify-between items-start pb-2 border-b border-slate-100">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Override Status Pasien (Admin)</h3>
                  <p className="text-[10px] font-mono text-slate-500">{selectedItem.no_pendaftaran} • {selectedItem.pasien?.nama_lengkap}</p>
                </div>
                <button onClick={() => setSelectedItem(null)} className="font-bold text-slate-400 hover:text-slate-600">×</button>
              </div>

              <div className="space-y-3">
                <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <span className="text-[10px] font-bold text-slate-400 block uppercase">Status Saat Ini:</span>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(selectedItem.status)}`}>
                    {selectedItem.status}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pilih Modul Tujuan (Pindahkan Ke):</label>
                  <select 
                    value={targetStatus}
                    onChange={(e) => setTargetStatus(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold focus:bg-white focus:outline-none"
                  >
                    <option value="MENUNGGU_TTV">1. Nurse Station (MENUNGGU_TTV)</option>
                    <option value="MENUNGGU_DOKTER">2. RME Dokter (MENUNGGU_DOKTER)</option>
                    <option value="MENUNGGU_LAB">3. Laboratorium (MENUNGGU_LAB)</option>
                    <option value="MENUNGGU_FARMASI">4. Farmasi / Apotek (MENUNGGU_FARMASI)</option>
                    <option value="MENUNGGU_BILLING">5. Kasir / Billing (MENUNGGU_BILLING)</option>
                    <option value="SELESAI_LUNAS">6. Pelayanan Selesai (SELESAI_LUNAS)</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOverrideStatus(selectedItem.id)}
                    disabled={loading}
                    className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-bold transition shadow-xs cursor-pointer"
                  >
                    {loading ? 'Memindahkan...' : 'Eksekusi Perpindahan Data'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}