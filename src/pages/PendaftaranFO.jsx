import React, { useState, useEffect } from 'react';
import MainLayout from '../components/MainLayout';
import api from '../api/axios';
import { 
  UserPlus, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  FileText,
  Users
} from 'lucide-react';

export default function PendaftaranFO() {
  const [pasiens, setPasiens] = useState([]);
  const [dokters, setDokters] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedPasien, setSelectedPasien] = useState(null);

  // Form Registrasi Pasien Baru
  const [formPasien, setFormPasien] = useState({
    nik: '',
    nama_lengkap: '',
    jenis_kelamin: 'L',
    tanggal_lahir: '',
    alamat: '',
    no_hp: '',
    golongan_darah: 'O'
  });

  // Form Pendaftaran Kunjungan
  const [formPendaftaran, setFormPendaftaran] = useState({
    dokter_id: '',
    jenis_layanan: 'RJ',
    jenis_penjamin: 'UMUM'
  });

  const [msg, setMsg] = useState({ type: '', text: '' });
  const [isModalPasienOpen, setIsModalPasienOpen] = useState(false);

  // Fetch Data Pasien & Dokter
  const fetchPasiens = async (keyword = '') => {
    try {
      const res = await api.get(`/pasiens?search=${keyword}`);
      setPasiens(res.data.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDokters = async () => {
    try {
      const res = await api.get('/dokters');
      setDokters(res.data.data);
      if (res.data.data.length > 0) {
        setFormPendaftaran(prev => ({ ...prev, dokter_id: res.data.data[0].id }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPasiens();
    fetchDokters();
  }, []);

  const handleSearchPasien = (e) => {
    e.preventDefault();
    fetchPasiens(search);
  };

  // Submit Pasien Baru
  const handleCreatePasien = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await api.post('/pasiens', formPasien);
      setMsg({ type: 'success', text: res.data.message });
      setIsModalPasienOpen(false);
      setFormPasien({ nik: '', nama_lengkap: '', jenis_kelamin: 'L', tanggal_lahir: '', alamat: '', no_hp: '', golongan_darah: 'O' });
      fetchPasiens();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal registrasi pasien.' });
    } finally {
      setLoading(false);
    }
  };

  // Submit Pendaftaran Kunjungan
  const handleCreatePendaftaran = async (e) => {
    e.preventDefault();
    if (!selectedPasien) {
      setMsg({ type: 'error', text: 'Pilih pasien terlebih dahulu dari tabel.' });
      return;
    }

    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const res = await api.post('/pendaftarans', {
        pasien_id: selectedPasien.id,
        ...formPendaftaran
      });
      setMsg({ type: 'success', text: res.data.message });
      setSelectedPasien(null);
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.message || 'Gagal membuat pendaftaran.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout title="Pendaftaran Pasien (Front Office)">
      <div className="space-y-4">

        {/* Alert Notification */}
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
          
          {/* Kolom Kiri: Pencarian & Master Pasien */}
          <div className="lg:col-span-2 space-y-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-slate-800 text-xs flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-emerald-700" />
                  <span>Pencarian Pasien</span>
                </h3>
                <button 
                  onClick={() => setIsModalPasienOpen(true)}
                  className="px-2.5 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white rounded-lg text-xs font-medium transition flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Pasien Baru</span>
                </button>
              </div>

              {/* Form Search */}
              <form onSubmit={handleSearchPasien} className="flex gap-2 mb-3">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
                  <input 
                    type="text" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Ketik Nama Pasien / NIK / No. RM..." 
                    className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
                <button type="submit" className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium cursor-pointer">
                  Cari
                </button>
              </form>

              {/* Tabel Pasien */}
              <div className="overflow-x-auto border border-slate-200/80 rounded-lg">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold text-[10px] uppercase border-b border-slate-200">
                    <tr>
                      <th className="p-2.5">No. RM</th>
                      <th className="p-2.5">NIK & Nama</th>
                      <th className="p-2.5">JK / Tgl Lahir</th>
                      <th className="p-2.5 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pasiens.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="p-4 text-center text-slate-400">Data pasien tidak ditemukan.</td>
                      </tr>
                    ) : (
                      pasiens.map((p) => (
                        <tr key={p.id} className={`hover:bg-slate-50 transition ${selectedPasien?.id === p.id ? 'bg-emerald-50/60' : ''}`}>
                          <td className="p-2.5 font-mono font-bold text-slate-700">{p.no_rm}</td>
                          <td className="p-2.5">
                            <span className="block font-semibold text-slate-800">{p.nama_lengkap}</span>
                            <span className="block text-[10px] font-mono text-slate-400">NIK: {p.nik}</span>
                          </td>
                          <td className="p-2.5 text-slate-600">
                            {p.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'} • {p.tanggal_lahir}
                          </td>
                          <td className="p-2.5 text-right">
                            <button 
                              onClick={() => setSelectedPasien(p)}
                              className={`px-2.5 py-1 rounded text-[11px] font-medium transition cursor-pointer ${
                                selectedPasien?.id === p.id 
                                  ? 'bg-emerald-800 text-white font-semibold' 
                                  : 'bg-slate-100 text-slate-700 hover:bg-emerald-50 hover:text-emerald-800'
                              }`}
                            >
                              {selectedPasien?.id === p.id ? 'Terpilih' : 'Pilih Pasien'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Pendaftaran Kunjungan */}
          <div className="space-y-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-xs">
              <h3 className="font-bold text-slate-800 text-xs mb-3 pb-2 border-b border-slate-100 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Form Pendaftaran Kunjungan</span>
              </h3>

              {selectedPasien ? (
                <div className="mb-3 p-2.5 bg-emerald-50/80 border border-emerald-200/80 rounded-lg text-xs">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase block">Pasien Terpilih:</span>
                  <p className="font-bold text-slate-900 mt-0.5">{selectedPasien.nama_lengkap}</p>
                  <p className="font-mono text-[10px] text-emerald-700">{selectedPasien.no_rm} • NIK: {selectedPasien.nik}</p>
                </div>
              ) : (
                <div className="mb-3 p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                  Silakan pilih pasien dari tabel di sebelah kiri.
                </div>
              )}

              <form onSubmit={handleCreatePendaftaran} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Dokter DPJP / Poliklinik</label>
                  <select 
                    value={formPendaftaran.dokter_id}
                    onChange={(e) => setFormPendaftaran({ ...formPendaftaran, dokter_id: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    required
                  >
                    {dokters.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Jenis Layanan</label>
                  <select 
                    value={formPendaftaran.jenis_layanan}
                    onChange={(e) => setFormPendaftaran({ ...formPendaftaran, jenis_layanan: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="RJ">Rawat Jalan (Outpatient)</option>
                    <option value="IGD">IGD (Gawat Darurat)</option>
                    <option value="RI">Rawat Inap (Inpatient)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Jenis Penjamin</label>
                  <select 
                    value={formPendaftaran.jenis_penjamin}
                    onChange={(e) => setFormPendaftaran({ ...formPendaftaran, jenis_penjamin: e.target.value })}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  >
                    <option value="UMUM">UMUM (Bayar Mandiri)</option>
                    <option value="BPJS">BPJS Kesehatan</option>
                    <option value="ASURANSI_SWASTA">Asuransi Swasta</option>
                  </select>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !selectedPasien}
                  className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs rounded-lg transition shadow-xs cursor-pointer disabled:opacity-50 mt-2"
                >
                  {loading ? 'Daftarkan...' : 'Daftarkan Pasien'}
                </button>
              </form>
            </div>
          </div>

        </div>

        {/* Modal Registrasi Pasien Baru */}
        {isModalPasienOpen && (
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl border border-slate-200 shadow-2xl w-full max-w-lg overflow-hidden">
              <div className="p-4 bg-emerald-900 text-white flex items-center justify-between">
                <h3 className="font-bold text-xs uppercase tracking-wider">Registrasi Pasien Baru</h3>
                <button onClick={() => setIsModalPasienOpen(false)} className="text-emerald-200 hover:text-white font-bold">×</button>
              </div>

              <form onSubmit={handleCreatePasien} className="p-4 space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">NIK (16 Digit)</label>
                    <input 
                      type="text" 
                      maxLength="16"
                      required
                      value={formPasien.nik}
                      onChange={(e) => setFormPasien({ ...formPasien, nik: e.target.value })}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      placeholder="32750..."
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Nama Lengkap</label>
                    <input 
                      type="text" 
                      required
                      value={formPasien.nama_lengkap}
                      onChange={(e) => setFormPasien({ ...formPasien, nama_lengkap: e.target.value })}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                      placeholder="Sesuai KTP"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Jenis Kelamin</label>
                    <select 
                      value={formPasien.jenis_kelamin}
                      onChange={(e) => setFormPasien({ ...formPasien, jenis_kelamin: e.target.value })}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Tanggal Lahir</label>
                    <input 
                      type="date" 
                      required
                      value={formPasien.tanggal_lahir}
                      onChange={(e) => setFormPasien({ ...formPasien, tanggal_lahir: e.target.value })}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Gol. Darah</label>
                    <select 
                      value={formPasien.golongan_darah}
                      onChange={(e) => setFormPasien({ ...formPasien, golongan_darah: e.target.value })}
                      className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    >
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="AB">AB</option>
                      <option value="O">O</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">No. HP / WhatsApp</label>
                  <input 
                    type="text" 
                    value={formPasien.no_hp}
                    onChange={(e) => setFormPasien({ ...formPasien, no_hp: e.target.value })}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    placeholder="0812..."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">Alamat Lengkap</label>
                  <textarea 
                    rows="2"
                    required
                    value={formPasien.alamat}
                    onChange={(e) => setFormPasien({ ...formPasien, alamat: e.target.value })}
                    className="w-full p-1.5 bg-slate-50 border border-slate-200 rounded text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                    placeholder="Jalan, RT/RW, Kelurahan..."
                  ></textarea>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button 
                    type="button" 
                    onClick={() => setIsModalPasienOpen(false)}
                    className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded text-xs hover:bg-slate-200 cursor-pointer"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="px-3 py-1.5 bg-emerald-800 text-white rounded text-xs font-semibold hover:bg-emerald-900 cursor-pointer"
                  >
                    {loading ? 'Menyimpan...' : 'Simpan Pasien'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </MainLayout>
  );
}