import React from 'react';
import { 
  Layers, 
  ReceiptText, 
  Box, 
  Briefcase, 
  Bell, 
  Sun, 
  Moon, 
  Menu,
  Activity,
  Settings
} from 'lucide-react';
import { TabType } from '../types';

interface NavbarProps {
  currentTab: TabType;
  onTabChange: (tab: TabType) => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export default function Navbar({
  currentTab,
  onTabChange,
  darkMode,
  onToggleDarkMode
}: NavbarProps) {
  
  const navItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', desc: 'Executive Snapshot', icon: Layers },
    { id: 'orders' as TabType, label: 'Active Orders', desc: 'Kitchen Flow', icon: ReceiptText },
    { id: 'inventory' as TabType, label: 'Kitchen Inventory', desc: 'Safety Stock', icon: Box },
    { id: 'reports' as TabType, label: 'Profit Reports', desc: 'Fiscal Analytics', icon: Briefcase },
  ];

  return (
    <>
      {/* Top Main Navigation Header Bar */}
      <header className={`sticky top-0 z-40 border-b flex items-center justify-between px-6 py-4 shadow-sm backdrop-blur-md transition-all ${
        darkMode 
          ? 'bg-[#141218]/90 border-[#494551]/20 text-white' 
          : 'bg-[#000000]/95 border-[#c6c6cd] text-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded bg-indigo-650 flex items-center justify-center animate-pulse">
            <Activity className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h1 className="font-extrabold text-[#fff4e5] text-lg tracking-tight flex items-center gap-1.5 leading-none">
              LuxeAnalytics
            </h1>
            <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest block mt-0.5">
              Alexander's Suite
            </span>
          </div>
        </div>

        {/* Desktop navbar tabs horizontal in center */}
        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isSelected = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer flex items-center gap-2 ${
                  isSelected 
                    ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/15'
                    : 'text-slate-350 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Top Header Utilities */}
        <div className="flex items-center gap-3">
          {/* Notifications button */}
          <button 
            onClick={() => alert("Notifications panel: Currently running in optimal parameters. All server terminals online.")}
            className="p-2 rounded-full hover:bg-white/10 text-slate-200 relative transition-colors cursor-pointer"
          >
            <Bell className="w-4 h-4 text-slate-200" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-400"></span>
          </button>

          {/* Theme Switcher Toggle - Crucial to experience both Light vs Dark mockups */}
          <button 
            onClick={onToggleDarkMode}
            title={darkMode ? "Switch to High-Contrast Light Mode" : "Switch to Immersive Dark Mode"}
            className="p-2 rounded-full hover:bg-white/10 text-slate-200 transition-colors cursor-pointer"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-[#cfbcff]" />
            ) : (
              <Moon className="w-4 h-4 text-emerald-400" />
            )}
          </button>

          {/* Alexander profile thumbnail avatar */}
          <div 
            onClick={() => alert("Logged in as: Chef Manager Alexander \nTerminal ID: LUXE-3000-MAIN \nSession: Active")}
            className="flex items-center gap-2 cursor-pointer pl-2 border-l border-white/10 hover:opacity-85"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-slate-700 border border-white/20">
              <img 
                alt="Alexander Chief Manager" 
                src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=80&q=80&fit=crop" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-extrabold text-white leading-none">Alexander</p>
              <span className="text-[9px] text-[#cfbcff] font-bold block mt-0.5 uppercase tracking-widest">CHEF EXECUTIVE</span>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Navigation Bar sticking directly at the foot of viewport */}
      <div className={`md:hidden fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-md flex justify-around items-center px-4 py-2.5 shadow-xl ${
        darkMode 
          ? 'bg-[#141218]/95 border-[#494551]/30 text-white' 
          : 'bg-[#ffffff]/95 border-slate-200 text-slate-900'
      }`}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isSelected = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`flex flex-col items-center gap-1 cursor-pointer py-1 flex-1 text-center transition-all ${
                isSelected 
                  ? (darkMode ? 'text-[#cfbcff] font-extrabold scale-105' : 'text-slate-950 font-extrabold scale-105')
                  : 'text-slate-400 hover:text-slate-500'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-bold tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}
