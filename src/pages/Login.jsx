import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  Activity, 
  ShieldAlert,
  User,
  Stethoscope,
  HeartPulse,
  Pill,
  CreditCard,
  Settings,
  FlaskConical
} from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('admin@simrs.com');
  const [password, setPassword] = useState('password');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const result = await login(email, password);
    if (result.success) {
      // Ambil role dari data user (AuthContext)
      const userRole = (result.user?.role || '').toLowerCase();

      // Redirect otomatis sesuai role login
      if (userRole === 'admin' || userRole === 'super-admin' || userRole === 'superadmin') {
        navigate('/admin');
      } else if (userRole === 'petugas-fo' || userRole === 'fo') {
        navigate('/pendaftaran');
      } else if (userRole === 'perawat' || userRole === 'nurse') {
        navigate('/perawat');
      } else if (userRole === 'dokter') {
        navigate('/dokter');
      } else if (userRole === 'petugas-lab' || userRole === 'lab') {
        navigate('/laboratorium');
      } else if (userRole === 'apoteker' || userRole === 'farmasi') {
        navigate('/farmasi');
      } else if (userRole === 'kasir' || userRole === 'billing') {
        navigate('/billing');
      } else {
        navigate('/dashboard');
      }
    } else {
      setErrorMsg(result.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
    }
  };

  return (
    <div className="min-h-screen bg-emerald-950 flex flex-col justify-center items-center p-4">
      <div className="w-full max-w-md bg-white rounded flex flex-col border border-emerald-800 shadow-2xl overflow-hidden">
        
        {/* Header Medis */}
        <div className="bg-emerald-900 p-5 text-white text-center border-b border-emerald-800">
          <div className="w-10 h-10 bg-emerald-700 rounded flex items-center justify-center mx-auto mb-2 border border-emerald-600">
            <Activity className="w-5 h-5 text-white" />
          </div>
          <h1 className="text-base font-bold tracking-tight uppercase">SIMRS MEDICA</h1>
          <p className="text-[11px] text-emerald-200">Sistem Informasi Manajemen Rumah Sakit</p>
        </div>

        {/* Form Section */}
        <div className="p-5">
          {errorMsg && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Pengguna</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 focus:bg-white transition outline-none"
                  placeholder="masukkan email pegawai"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Kata Sandi</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-2.5 top-2.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-8 py-1.5 bg-slate-50 border border-slate-300 rounded text-xs focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600 focus:bg-white transition outline-none"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-emerald-800 hover:bg-emerald-900 text-white font-medium text-xs rounded transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
            >
              {loading ? <span>Memproses...</span> : <span>Masuk Sistem</span>}
            </button>
          </form>

          {/* Quick Credential Test Switcher */}
          <div className="mt-5 pt-3 border-t border-slate-200">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 text-center">Akun Pengujian Sistem:</p>
            <div className="grid grid-cols-2 gap-1 text-[10px]">
              <button onClick={() => { setEmail('fo@simrs.com'); setPassword('password'); }} className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 rounded text-left truncate border border-slate-200 flex items-center gap-1.5 cursor-pointer">
                <User className="w-3 h-3 text-emerald-700 shrink-0" />
                <span className="truncate">FO: fo@simrs.com</span>
              </button>
              <button onClick={() => { setEmail('perawat@simrs.com'); setPassword('password'); }} className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 rounded text-left truncate border border-slate-200 flex items-center gap-1.5 cursor-pointer">
                <HeartPulse className="w-3 h-3 text-emerald-700 shrink-0" />
                <span className="truncate">Nurse: perawat@simrs.com</span>
              </button>
              <button onClick={() => { setEmail('dokter@simrs.com'); setPassword('password'); }} className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 rounded text-left truncate border border-slate-200 flex items-center gap-1.5 cursor-pointer">
                <Stethoscope className="w-3 h-3 text-emerald-700 shrink-0" />
                <span className="truncate">Dokter: dokter@simrs.com</span>
              </button>
              <button onClick={() => { setEmail('lab@simrs.com'); setPassword('password'); }} className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 rounded text-left truncate border border-slate-200 flex items-center gap-1.5 cursor-pointer">
                <FlaskConical className="w-3 h-3 text-emerald-700 shrink-0" />
                <span className="truncate">Lab: lab@simrs.com</span>
              </button>
              <button onClick={() => { setEmail('apoteker@simrs.com'); setPassword('password'); }} className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 rounded text-left truncate border border-slate-200 flex items-center gap-1.5 cursor-pointer">
                <Pill className="w-3 h-3 text-emerald-700 shrink-0" />
                <span className="truncate">Farmasi: apoteker@simrs.com</span>
              </button>
              <button onClick={() => { setEmail('kasir@simrs.com'); setPassword('password'); }} className="p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 rounded text-left truncate border border-slate-200 flex items-center gap-1.5 cursor-pointer">
                <CreditCard className="w-3 h-3 text-emerald-700 shrink-0" />
                <span className="truncate">Kasir: kasir@simrs.com</span>
              </button>
              <button onClick={() => { setEmail('admin@simrs.com'); setPassword('password'); }} className="col-span-2 p-1.5 bg-slate-100 hover:bg-emerald-50 text-slate-700 rounded text-left truncate border border-slate-200 flex items-center justify-center gap-1.5 cursor-pointer">
                <Settings className="w-3 h-3 text-emerald-700 shrink-0" />
                <span className="truncate">Admin: admin@simrs.com</span>
              </button>
            </div>
          </div>

        </div>
      </div>
      <p className="text-[10px] text-emerald-400 mt-3 font-mono">SIMRS Medica System v1.0.0</p>
    </div>
  );
}