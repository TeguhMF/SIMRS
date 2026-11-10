import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import { 
  Activity, 
  Stethoscope, 
  FlaskConical, 
  Pill, 
  CreditCard, 
  CheckCircle2,
  Clock,
  Search,
  Award,
  GraduationCap,
  RefreshCw
} from 'lucide-react';

export default function Dashboard() {
  const [antrean, setAntrean] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [loading, setLoading] = useState(true);

  // Status Counters
  const [stats, setStats] = useState({
    total: 0,
    menunggu_ttv: 0,
    menunggu_dokter: 0,
    menunggu_lab: 0,
    menunggu_farmasi: 0,
    menunggu_billing: 0,
    selesai_lunas: 0
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/pendaftarans');
      const data = res.data.data || [];
      setAntrean(data);

      // Hitung statistik antrean secara otomatis dari API
      setStats({
        total: data.length,
        menunggu_ttv: data.filter(i => i.status === 'MENUNGGU_TTV').length,
        menunggu_dokter: data.filter(i => i.status === 'MENUNGGU_DOKTER').length,
        menunggu_lab: data.filter(i => i.status === 'MENUNGGU_LAB').length,
        menunggu_farmasi: data.filter(i => i.status === 'MENUNGGU_FARMASI').length,
        menunggu_billing: data.filter(i => i.status === 'MENUNGGU_BILLING').length,
        selesai_lunas: data.filter(i => i.status === 'SELESAI_LUNAS').length,
      });
    } catch (err) {
      console.error("Gagal mengambil data dashboard:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Filter Data Pasien
  const filteredAntrean = antrean.filter(item => {
    const matchSearch = 
      item.pasien?.nama_lengkap?.toLowerCase().includes(search.toLowerCase()) ||
      item.no_pendaftaran?.toLowerCase().includes(search.toLowerCase()) ||
      item.pasien?.no_rm?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = filterStatus === 'ALL' || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

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
    <MainLayout title="Dashboard Pelayanan SIMRS">
      <div className="space-y-4">
        
        {/* Banner Identitas Tim Tugas Kuliah */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-slate-900 p-4 rounded-xl text-white shadow-md border border-emerald-700">
          <div className="flex items-center gap-2 mb-2 pb-2 border-b border-emerald-700/60">
            <GraduationCap className="w-5 h-5 text-emerald-300" />
            <h2 className="font-extrabold text-sm tracking-wide uppercase">Tugas Kelompok Pengembangan SIMRS Medica</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            <div className="bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-700/50 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Teguh Maulana Firmansyah</p>
                <p className="text-[10px] font-mono text-emerald-300">NIM: 241011401348</p>
              </div>
            </div>

            <div className="bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-700/50 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">Sahrul Hidayat</p>
                <p className="text-[10px] font-mono text-emerald-300">NIM: 241011401344</p>
              </div>
            </div>

            <div className="bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-700/50 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-white">M. Naufal Zakwan</p>
                <p className="text-[10px] font-mono text-emerald-300">NIM: 241011401351</p>
              </div>
            </div>
          </div>
        </div>

        {/* Real-Time Status Counters */}
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
            <p className="text-[9px] text-slate-400">Menunggu Pemeriksaan</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-purple-600 mb-1">
              <span className="text-[10px] font-bold uppercase">Laboratorium</span>
              <FlaskConical className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stats.menunggu_lab}</div>
            <p className="text-[9px] text-slate-400">Menunggu Tes Lab</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-emerald-600 mb-1">
              <span className="text-[10px] font-bold uppercase">Farmasi</span>
              <Pill className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stats.menunggu_farmasi}</div>
            <p className="text-[9px] text-slate-400">Menunggu Resep</p>
          </div>

          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex justify-between items-center text-cyan-600 mb-1">
              <span className="text-[10px] font-bold uppercase">Billing Kasir</span>
              <CreditCard className="w-4 h-4" />
            </div>
            <div className="text-xl font-extrabold text-slate-900">{stats.menunggu_billing}</div>
            <p className="text-[9px] text-slate-400">Menunggu Pembayaran</p>
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

        {/* Tabel Pemantauan Antrean Live */}
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-700" />
                <span>Monitoring Antrean Live Poliklinik ({filteredAntrean.length} Pasien)</span>
              </h3>
              <p className="text-[10px] text-slate-500">Memantau status pergerakan pasien real-time di seluruh modul pelayanan.</p>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama / RM / Reg..."
                  className="pl-8 pr-3 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="py-1 px-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold focus:outline-none"
              >
                <option value="ALL">Semua Status</option>
                <option value="MENUNGGU_TTV">Menunggu TTV</option>
                <option value="MENUNGGU_DOKTER">Menunggu Dokter</option>
                <option value="MENUNGGU_LAB">Menunggu Lab</option>
                <option value="MENUNGGU_FARMASI">Menunggu Farmasi</option>
                <option value="MENUNGGU_BILLING">Menunggu Kasir</option>
                <option value="SELESAI_LUNAS">Selesai Lunas</option>
              </select>

              <button 
                onClick={fetchDashboardData}
                className="p-1.5 text-slate-600 hover:text-emerald-700 text-xs font-semibold flex items-center gap-1 border border-slate-200 rounded-lg hover:bg-slate-50"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-100 rounded-lg">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 text-[10px] uppercase font-bold">
                <tr>
                  <th className="p-2.5">#</th>
                  <th className="p-2.5">No. Registrasi / RM</th>
                  <th className="p-2.5">Nama Pasien</th>
                  <th className="p-2.5">Dokter DPJP</th>
                  <th className="p-2.5">Penjamin</th>
                  <th className="p-2.5">Status Alur Pelayanan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-slate-400 text-xs">Memuat data antrean...</td>
                  </tr>
                ) : filteredAntrean.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="p-4 text-center text-slate-400 text-xs">Belum ada data antrean pasien yang terdaftar.</td>
                  </tr>
                ) : (
                  filteredAntrean.map((item, index) => (
                    <tr key={item.id} className="hover:bg-slate-50 transition">
                      <td className="p-2.5 font-mono text-slate-400 text-[10px]">{index + 1}</td>
                      <td className="p-2.5">
                        <div className="font-mono font-bold text-slate-800 text-[11px]">{item.no_pendaftaran}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{item.pasien?.no_rm}</div>
                      </td>

                      <td className="p-2.5">
                        <div className="font-bold text-slate-900 text-xs">{item.pasien?.nama_lengkap}</div>
                        <div className="text-[10px] text-slate-500">{item.pasien?.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                      </td>

                      <td className="p-2.5 font-medium text-slate-700">
                        {item.dokter?.nama || 'Dokter Umum'}
                      </td>

                      <td className="p-2.5">
                        <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {item.jenis_penjamin || 'UMUM'}
                        </span>
                      </td>

                      <td className="p-2.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${getStatusBadge(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}