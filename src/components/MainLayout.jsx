import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import { 
  Users, 
  Stethoscope, 
  Activity, 
  Pill, 
  CreditCard, 
  LogOut, 
  FlaskConical,
  LayoutDashboard,
  Bell,
  Search
} from 'lucide-react';

export default function MainLayout({ children, title = 'Dashboard Operasional' }) {
  const { user, logout } = useAuth();
  const location = useLocation();

  const navigationMenu = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['super-admin', 'petugas-fo', 'perawat', 'dokter', 'petugas-lab', 'apoteker', 'kasir'] },
    { name: 'Pendaftaran (FO)', path: '/pendaftaran', icon: Users, roles: ['super-admin', 'petugas-fo'] },
    { name: 'Nurse Station (TTV)', path: '/perawat', icon: Activity, roles: ['super-admin', 'perawat'] },
    { name: 'Rekam Medis (RME)', path: '/dokter', icon: Stethoscope, roles: ['super-admin', 'dokter'] },
    { name: 'Laboratorium', path: '/laboratorium', icon: FlaskConical, roles: ['super-admin', 'petugas-lab'] },
    { name: 'e-Resep & Farmasi', path: '/farmasi', icon: Pill, roles: ['super-admin', 'apoteker'] },
    { name: 'Kasir & Billing', path: '/billing', icon: CreditCard, roles: ['super-admin', 'kasir'] },
  ];

  const filteredMenu = navigationMenu.filter(item => 
    user?.role && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-xs text-slate-800 antialiased">
      
      {/* Top Header Clean & Balanced */}
      <header className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0 sticky top-0 z-20 shadow-xs">
        
        {/* Brand Left */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow-xs">
            <Activity className="w-4 h-4" />
          </div>
          <div className="leading-tight">
            <span className="font-bold text-sm tracking-tight text-slate-900 block">SIMRS MEDICA</span>
            <span className="text-[10px] text-emerald-700 font-medium">Hospital Operating System</span>
          </div>
        </div>

        {/* Search Bar - CENTERED */}
        <div className="flex-1 max-w-md mx-6">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari Pasien / No. RM / NIK..." 
              className="w-full pl-9 pr-3 py-1.5 bg-slate-100/80 border border-slate-200 rounded-lg text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600 transition"
            />
          </div>
        </div>

        {/* User Info & Actions - RIGHT */}
        <div className="flex items-center gap-4 shrink-0">
          <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition relative">
            <Bell className="w-4 h-4" />
            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full absolute top-1 right-1"></span>
          </button>

          <div className="h-5 w-[1px] bg-slate-200"></div>

          {/* User Profile Clean Layout */}
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="font-semibold text-slate-900 text-xs leading-tight mb-1">{user?.name}</p>
              <span className="inline-block text-[9px] font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/80 uppercase font-semibold">
                {user?.role}
              </span>
            </div>

            <button 
              onClick={logout}
              title="Keluar Sistem"
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition border border-transparent hover:border-red-100 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-slate-200 flex flex-col shrink-0">
          <div className="p-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Main Workspace
          </div>
          <nav className="px-2 space-y-1 flex-1">
            {filteredMenu.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg transition text-xs font-medium ${
                    isActive 
                      ? 'bg-emerald-800 text-white shadow-sm font-semibold' 
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-emerald-200' : 'text-slate-400'}`} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>

          <div className="p-3 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-slate-500 font-medium">Status Sistem</span>
              <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                Online
              </span>
            </div>
          </div>
        </aside>

        {/* Main Operational Canvas */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          {/* Sub Header - Teks 'Vite SPA' dihapus */}
          <div className="h-9 bg-white border-b border-slate-200 px-4 flex items-center justify-between shrink-0">
            <h2 className="font-semibold text-slate-800 text-xs uppercase tracking-wider flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span>
              {title}
            </h2>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}