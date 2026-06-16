import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  DollarSign, 
  ReceiptText, 
  Users, 
  Briefcase, 
  Calendar, 
  Download, 
  AlertTriangle,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { InventoryItem, TabType } from '../types';

interface DashboardViewProps {
  inventoryItems: InventoryItem[];
  ordersCount: number;
  revenueToday: number;
  netProfitToday: number;
  customersCount: number;
  onReorderItem: (sku: string, amount: number) => void;
  onNavigate: (tab: TabType) => void;
  darkMode: boolean;
}

export default function DashboardView({ 
  inventoryItems, 
  ordersCount, 
  revenueToday, 
  netProfitToday, 
  customersCount,
  onReorderItem,
  onNavigate,
  darkMode
}: DashboardViewProps) {
  const [selectedChartDay, setSelectedChartDay] = useState<string | null>(null);

  // Filter urgent/low inventory items to show under alerts
  const alertItems = inventoryItems.filter(item => item.status === 'Critical' || item.status === 'Low Stock');

  // Weekly Revenue and Profit data matching screenshot
  // MO: Revenue 60%, Profit 20%, TU: Revenue 75%, Profit 25%, WE: Revenue 45%, Profit 15% etc.
  const chartData = [
    { day: 'MON', label: 'Monday', revenue: 60, profit: 20, revVal: '$2,550', profVal: '$850' },
    { day: 'TUE', label: 'Tuesday', revenue: 75, profit: 25, revVal: '$3,187', profVal: '$1,062' },
    { day: 'WED', label: '"Strategic Wednesday"', revenue: 45, profit: 15, revVal: '$1,912', profVal: '$637' },
    { day: 'THU', label: 'Thursday', revenue: 90, profit: 40, revVal: '$3,825', profVal: '$1,700' },
    { day: 'FRI', label: 'Friday', revenue: 65, profit: 28, revVal: '$2,762', profVal: '$1,190' },
    { day: 'SAT', label: 'Saturday', revenue: 95, profit: 45, revVal: '$4,037', profVal: '$1,912' },
    { day: 'SUN', label: 'Sunday', revenue: 80, profit: 35, revVal: '$3,400', profVal: '$1,487' },
  ];

  // Dishes mapping
  const topDishes = [
    {
      name: "Signature Steak",
      orders: 32,
      impact: "+$1,440",
      imgLight: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsGuK1mZL7QXbgdheeyCqO5OK9q7iEQwMGUbDp8gtRe6Hf1zHz_r9L4jTeiGwBnBQ_U77HFM0iLpKZmkB0aVTJc_zau-wByHTH-dA5KXOgAARkrVRFkMEr3D5I-3YzCeZSKb0fERS3Ws46YttXeD5HiKqSrylS9MaoFdNp6oK9FGjQmtKsniEAzYfahrWUE6dHDKrnLyWsLLAVN_MQK_QZggDl_labeKu8EZUEv_4GalyNU-8xXsTjKG33lz_jAhIerVuVIMxpC58",
      imgDark: "https://lh3.googleusercontent.com/aida-public/AB6AXuDzY4YeN1mdaC3bAxhYwb20TdBwi7NjNmSt2lXWNYTSTvGzKdthjIAjKlk7hmRdUPBn8WloMZLMC5Sg4R2CSDCFkbdYb0Jmx20xjJ7Njd1wG3hqvsgD2X0OdifbWmN5CxsZhjH8dqwz4K5tM1pKs42-rMoTSra3jRv37XYGvZi6obfT40unO2xGYT8VteAJzOjcUx_BVhxbymeMcvMl4GeqA9unoFOwQhIzeFDfyDjY4vN_Ro4mnlXnVTlI32jJrs0TtXcnjvQhrFQ",
      rank: 1
    },
    {
      name: "Truffle Pasta",
      orders: 28,
      impact: "+$924",
      imgLight: "https://lh3.googleusercontent.com/aida-public/AB6AXuCBi_7YB_45d_GeAhXhs5BAf7RABZ30YiTFCihi9ibysYEbDvZPpTeLP70bs3WV-4qyv57g5CGHeGwOymgCvsERUA1AIbU6TvmJq81vLCnHEM0pcQNUs23gYhvi_K12CjBNfi8b5vWzHs3GITPR1yGNurZlUv7QymiowHAFxeZqrfLrbL4T9W4dHg6sLT8nYWKfnMo_btjnFFWmFXBupp10-WfwaI1_F6GGpk3yKMQ3twNcd82dAHZN2YjHf1RjW_ZzmWq4uf7hF64",
      imgDark: "https://lh3.googleusercontent.com/aida-public/AB6AXuDPc5y3hCzZkboHP-UeZ3FMF9XUP_THTOqU7R4ZKh-j_vcvLXsQh5AN4yPfjZuiUCWJZ-pnp-fCySj5LFZ5wyW5vHyQh7SWbygGSkYw-xuGFT-e2x1s6gQnmmLQoccwE8TQ_YdiLdYcDJh_V2U9pZjcgyn5qkCtfZqfVQvCQd_jx8wDeNQj4m2e-dRhZgNWwalJtsheqQmtlGtKJtBSWI4ory5GshZvkNVt6YsL9vIywtc4-QTeYUgdTBm6JIPc7cBWzTmlAbnCQjw",
      rank: 2
    },
    {
      name: "Lobster Tail",
      orders: 19,
      impact: "+$1,140",
      imgLight: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7e9lJZE6Pk5E8TmwIK_kg4YZLDrrHT_QwEyo7w8vAnJTbn0Ud3aLCxzQlDODNsvkNlJBniHgbiQrwuPwEgHCc-53eLjHeetjIbR3R7OqwP_7DhhPCECQSkcHoSO2loOE9ZDmaw-smxT4lRVA4Aui04rAg_maPcw6TuIId_5coHmS_ff-BbtrBmT73dukZOT-cuwyjMBt8ncjjNyWiGAFWyWbayLa79LtlPnO24LuPveyLm4URavqQ6k-wFbXbFSCg0hBxiX1Hq8Q",
      imgDark: "https://lh3.googleusercontent.com/aida-public/AB6AXuAO7mcfgrz4uk6brTjkfn0mzv41CdvuCKisHeaI4WuoK5xmjR1cL9cwmWzUGmXA_W5kgwVpcEF9XJAZcNXSbBDtb-48dQMn9u2gMVd8nyhjGfygXqlh7MLQvv43Fj9nRofI58hKP9NQHb86j9OzjKeyBUxogWwmlC02PhhZ529KtElFP5U9nFv8Yh9L9SsW-bRRdaS2kIxVvr2yXFrUCOrkWPHdyLPEp94KDC3clx3lGKqQ3N-lPPoN-4e4aCB_FQxTYCS6XmTQ46Q",
      rank: 3
    },
    {
      name: "Burrata Salad",
      orders: 15,
      impact: "+$330",
      imgLight: "https://lh3.googleusercontent.com/aida-public/AB6AXuB-WBVA-qmjSqSfxURLdcG9eLS_ssPmZ7icDr42Hz0VHKFdWOeisuUICQTWPXNOhkVju07QVStsfuOgYRpwY03CUwPRTPn33HqUbHklJy5j4h54vs262S2pZ7q5-LbHYFAvJE8OfcOU4CuJMBgjTodU-PrbIQHw6vqsz7ZHqUDCKs1shY6krO38o1Q8Sz_oQCQygkjwaSwl0AlemUWBeHHuQ2t9QK5xp6vrBRkSkkSFNCLE-VTPUkPh9IV4wk5_ei6JX_zeN7NxSBQ",
      imgDark: "https://lh3.googleusercontent.com/aida-public/AB6AXu6kcH6Ari7tskQTj-4A2ewqHPuPNK_xuxl7VhN5PIclo5KyPpUNV12-mJ8G4u0nqiin6GO88Rgzk7fB7wDNDxUkaNnTwnQDpliWo_JV7vl4PXZAUsbiPS2ULEwyIQuNxYvl8j-f7i5OA72fxwHhhVQAWpZ-V91uo8JgmJfRnbbvupVw0wW2VrKR3apAI_LNq7cIMTgc91OL-12wmHj_rvtHMqfNYiVvKZiAsmckhh3x2tCrjZkQkl0xUPICwcXvMuHaugmz_048BI",
      rank: 4
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Header Line */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${darkMode ? 'text-[#cbc4d2]' : 'text-slate-500'}`}>
            Executive Overview
          </p>
          <h2 className={`text-4xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-[#000000]'}`}>
            Good Morning, Alexander
          </h2>
          <p className="text-sm text-slate-400 mt-1 dark:text-[#cbc4d2]">
            Here's your strategic hospitality dashboard snapshot.
          </p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onNavigate('reports')}
            className={`flex items-center gap-2 px-4 py-2 rounded shadow-sm border transition-all text-sm font-semibold active:scale-95 ${
              darkMode 
                ? 'bg-[#211f24] hover:bg-[#36343a] border-[#494551] text-white' 
                : 'bg-white hover:bg-slate-50 border-[#c6c6cd] text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Last 24 Hours</span>
          </button>
          <button 
            onClick={() => alert("Report successfully queued for export. Sent PDF to Alexander's corporate address.")}
            className={`flex items-center gap-2 px-4 py-2 rounded shadow-sm transition-opacity text-sm font-semibold active:scale-95 ${
              darkMode 
                ? 'bg-[#cfbcff] text-[#22005d] hover:opacity-90' 
                : 'bg-[#000000] text-white hover:opacity-90'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
        </div>
      </section>

      {/* KPI Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Today's Revenue */}
        <div className={`p-6 border rounded-xl hover:border-black transition-all cursor-default relative overflow-hidden group ${
          darkMode ? 'bg-[#211f24] border-[#494551]/30 hover:border-[#cfbcff]' : 'bg-white border-[#c6c6cd] hover:border-black'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <span className={darkMode ? 'text-[#cfbcff]' : 'text-slate-500'}><DollarSign className="w-6 h-6" /></span>
            <span className="flex items-center text-[#006c49] font-bold text-sm bg-[#6cf8bb]/10 px-2.5 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              12.5%
            </span>
          </div>
          <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-[#cbc4d2]' : 'text-slate-500'}`}>Today's Revenue</p>
          <h3 className={`text-3xl font-extrabold mt-1 ${darkMode ? 'text-[#e6e0e9]' : 'text-slate-900'}`}>
            ${revenueToday.toLocaleString()}
          </h3>
        </div>

        {/* Orders */}
        <div className={`p-6 border rounded-xl hover:border-black transition-all cursor-default relative overflow-hidden group ${
          darkMode ? 'bg-[#211f24] border-[#494551]/30 hover:border-[#cfbcff]' : 'bg-white border-[#c6c6cd] hover:border-black'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <span className={darkMode ? 'text-[#cfbcff]' : 'text-slate-500'}><ReceiptText className="w-6 h-6" /></span>
            <span className="flex items-center text-[#006c49] font-bold text-sm bg-[#6cf8bb]/10 px-2.5 py-0.5 rounded-full">
              <TrendingUp className="w-3.5 h-3.5 mr-1" />
              8.2%
            </span>
          </div>
          <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-[#cbc4d2]' : 'text-slate-500'}`}>Total Orders</p>
          <h3 className={`text-3xl font-extrabold mt-1 ${darkMode ? 'text-[#e6e0e9]' : 'text-slate-900'}`}>
            {ordersCount}
          </h3>
        </div>

        {/* Customers */}
        <div className={`p-6 border rounded-xl hover:border-black transition-all cursor-default relative overflow-hidden group ${
          darkMode ? 'bg-[#211f24] border-[#494551]/30 hover:border-[#cfbcff]' : 'bg-white border-[#c6c6cd] hover:border-black'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <span className={darkMode ? 'text-[#cfbcff]' : 'text-slate-500'}><Users className="w-6 h-6" /></span>
            <span className="flex items-center text-slate-500 font-bold text-sm bg-slate-100 dark:bg-slate-800 px-2.5 py-0.5 rounded-full">
              <Minus className="w-3.5 h-3.5 mr-1" />
              0.0%
            </span>
          </div>
          <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-[#cbc4d2]' : 'text-slate-500'}`}>Customers</p>
          <h3 className={`text-3xl font-extrabold mt-1 ${darkMode ? 'text-[#e6e0e9]' : 'text-slate-900'}`}>
            {customersCount}
          </h3>
        </div>

        {/* Net Profit */}
        <div className={`p-6 border rounded-xl hover:border-black transition-all cursor-default relative overflow-hidden group ${
          darkMode ? 'bg-[#211f24] border-[#494551]/30 hover:border-[#cfbcff]' : 'bg-white border-[#c6c6cd] hover:border-black'
        }`}>
          <div className="flex justify-between items-start mb-4">
            <span className={darkMode ? 'text-[#cfbcff]' : 'text-slate-500'}><Briefcase className="w-6 h-6" /></span>
            <span className="flex items-center text-[#ba1a1a] font-bold text-sm bg-red-50 dark:bg-red-900/10 px-2.5 py-0.5 rounded-full">
              <TrendingDown className="w-3.5 h-3.5 mr-1" />
              4.1%
            </span>
          </div>
          <p className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-[#cbc4d2]' : 'text-slate-500'}`}>Net Profit</p>
          <h3 className={`text-3xl font-extrabold mt-1 ${darkMode ? 'text-[#e6e0e9]' : 'text-slate-900'}`}>
            ${netProfitToday.toLocaleString()}
          </h3>
        </div>
      </section>

      {/* Bento Grid: Charts & Top Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Revenue vs Profit Chart Card */}
        <div className={`lg:col-span-8 border rounded-xl overflow-hidden flex flex-col ${
          darkMode ? 'bg-[#211f24] border-[#494551]/30' : 'bg-white border-[#c6c6cd]'
        }`}>
          <div className={`p-6 border-b flex justify-between items-center ${
            darkMode ? 'border-[#494551]/30 bg-[#1d1b20]' : 'border-[#c6c6cd] bg-slate-50'
          }`}>
            <div>
              <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-[#000000]'}`}>
                Revenue vs Profit Analysis
              </h3>
              <p className="text-xs text-slate-400">Weekly performance metrics (Select column to inspect)</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${darkMode ? 'bg-[#cfbcff]' : 'bg-[#000000]'}`}></span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-[#cbc4d2]' : 'text-slate-500'}`}>Revenue</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#006c49]"></span>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-[#cbc4d2]' : 'text-slate-500'}`}>Profit</span>
              </div>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="p-6 flex-1 flex flex-col justify-between h-80 relative">
            <div className="flex-1 flex items-end justify-between gap-3 pt-6 min-h-[180px]">
              {chartData.map((d, index) => {
                const isSelected = selectedChartDay === d.day;
                return (
                  <div 
                    key={index} 
                    className="flex-1 flex flex-col justify-end items-center h-full group cursor-pointer"
                    onClick={() => setSelectedChartDay(isSelected ? null : d.day)}
                  >
                    <div className="w-full flex justify-center items-end gap-1.5 h-full relative">
                      {/* Revenue Bar */}
                      <div 
                        style={{ height: `${d.revenue}%` }} 
                        className={`w-4 rounded-t-sm transition-all duration-500 ${
                          isSelected 
                            ? (darkMode ? 'bg-[#ffdf93] ring-4 ring-[#ffdf93]/20 shadow-lg' : 'bg-[#000000] ring-4 ring-black/15 shadow-md')
                            : (darkMode ? 'bg-[#cfbcff]/80 group-hover:bg-[#cfbcff]' : 'bg-[#000000] group-hover:opacity-85')
                        }`}
                      ></div>
                      {/* Profit Bar */}
                      <div 
                        style={{ height: `${d.profit}%` }} 
                        className={`w-4 rounded-t-sm transition-all duration-500 ${
                          isSelected 
                            ? 'bg-[#00714d] ring-4 ring-[#00714d]/20 shadow-lg'
                            : 'bg-[#006c49]/80 group-hover:bg-[#006c49]'
                        }`}
                      ></div>

                      {/* Tooltip Float */}
                      <div className={`absolute bottom-[105%] bg-slate-950 text-white rounded p-2 text-[10px] z-10 transition-all pointer-events-none ${
                        isSelected || selectedChartDay === null ? 'group-hover:opacity-100 group-hover:scale-100' : ''
                      } ${isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                        <div className="font-bold text-center text-xs border-b border-slate-800 pb-1 mb-1 text-slate-300">
                          {d.label}
                        </div>
                        <p>Revenue: <span className="text-emerald-400 font-mono font-bold">{d.revVal}</span></p>
                        <p>Profit: <span className="text-amber-400 font-mono font-bold">{d.profVal}</span></p>
                      </div>
                    </div>
                    <span className={`text-[10px] font-bold font-mono tracking-wider mt-2.5 ${
                      isSelected 
                        ? (darkMode ? 'text-[#cfbcff] font-extrabold scale-110' : 'text-slate-900 font-extrabold scale-110')
                        : 'text-slate-400'
                    }`}>
                      {d.day}
                    </span>
                  </div>
                );
              })}
            </div>
            <div className={`mt-3 pt-3 border-t text-center text-xs italic ${darkMode ? 'border-[#494551]/30 text-slate-400' : 'border-slate-100 text-slate-500'}`}>
              💡 Hint: Click on any day columns to freeze the strategic metric overlay.
            </div>
          </div>
        </div>

        {/* Top Selling Dishes - Light & Dark Modes */}
        <div className={`lg:col-span-4 border rounded-xl overflow-hidden flex flex-col ${
          darkMode ? 'bg-[#211f24] border-[#494551]/30' : 'bg-white border-[#c6c6cd]'
        }`}>
          <div className={`p-6 border-b ${
            darkMode ? 'border-[#494551]/30 bg-[#1d1b20]' : 'border-[#c6c6cd] bg-slate-50'
          }`}>
            <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-[#000000]'}`}>
              Top Selling Dishes
            </h3>
          </div>
          
          <div className="p-6 space-y-4 flex-1">
            {topDishes.map((dish, i) => (
              <div 
                key={i} 
                onClick={() => alert(`Showing Chef's real-time culinary performance for ${dish.name}: 94% guest satisfaction core metric.`)}
                className={`flex items-center gap-4 group cursor-pointer p-1.5 rounded-lg transition-colors ${
                  darkMode ? 'hover:bg-slate-800/45' : 'hover:bg-slate-55'
                }`}
              >
                <div className="w-12 h-12 rounded overflow-hidden bg-slate-200 flex-shrink-0 border border-slate-300/30">
                  <img 
                    alt={dish.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    src={darkMode ? dish.imgDark : dish.imgLight} 
                  />
                </div>
                <div className="flex-1">
                  <p className={`font-bold text-sm ${darkMode ? 'text-[#e6e0e9]' : 'text-slate-900'}`}>{dish.name}</p>
                  <p className={`text-xs ${darkMode ? 'text-[#cbc4d2]' : 'text-slate-500'}`}>{dish.orders} Orders Today</p>
                </div>
                <p className="font-mono text-xs font-bold text-[#006c49]">{dish.impact}</p>
              </div>
            ))}
          </div>

          <div className={`p-4 border-t ${darkMode ? 'border-[#494551]/30' : 'border-[#c6c6cd]'}`}>
            <button 
              onClick={() => onNavigate('reports')}
              className={`w-full py-2.5 text-center font-bold text-xs uppercase tracking-wider rounded transition-all active:scale-95 ${
                darkMode 
                  ? 'text-[#cfbcff] hover:bg-[#36343a]' 
                  : 'text-[#000000] hover:bg-slate-100 border border-slate-200 shadow-sm'
              }`}
            >
              View Full Menu Performance
            </button>
          </div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      <section className={`border rounded-xl overflow-hidden shadow-sm ${
        darkMode ? 'bg-[#211f24] border-[#494551]/30' : 'bg-white border-[#c6c6cd]'
      }`}>
        <div className={`p-6 border-b flex justify-between items-center ${
          darkMode ? 'border-[#494551]/30 bg-[#1d1b20]' : 'border-[#c6c6cd] bg-slate-50'
        }`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="text-[#ba1a1a] w-5 h-5" />
            <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-[#000000]'}`}>
              Low-Stock Alerts
            </h3>
          </div>
          <span className="bg-[#ba1a1a] text-white px-2.5 py-1 rounded text-xs font-extrabold uppercase animate-pulse">
            {alertItems.length} URGENT
          </span>
        </div>

        {alertItems.length === 0 ? (
          <div className="p-8 text-center text-slate-500 dark:text-slate-400">
            ✅ All luxury raw material inventory counts are completely optimized above their safety par lines.
          </div>
        ) : (
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${darkMode ? 'bg-[#1d1b20]' : 'bg-slate-100'}`}>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#cbc4d2]">Inventory Item</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-center text-slate-500 dark:text-[#cbc4d2]">In Stock</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-center text-slate-500 dark:text-[#cbc4d2]">Threshold</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#cbc4d2]">Status</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-right text-slate-500 dark:text-[#cbc4d2]">Action</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-[#494551]/20' : 'divide-slate-200'}`}>
                {alertItems.map((item) => (
                  <tr 
                    key={item.id} 
                    className={`transition-colors ${
                      darkMode ? 'hover:bg-slate-800/20' : 'hover:bg-slate-50'
                    }`}
                  >
                    <td className={`p-4 border-l-4 ${item.status === 'Critical' ? 'border-[#ba1a1a]' : 'border-amber-500'}`}>
                      <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>{item.name}</p>
                      <p className="text-xs text-slate-400 font-medium">{item.sku} - {item.description}</p>
                    </td>
                    <td className={`p-4 text-center font-mono font-bold text-sm ${item.status === 'Critical' ? 'text-[#ba1a1a]' : 'text-amber-500'}`}>
                      {item.stock} {item.unit}
                    </td>
                    <td className={`p-4 text-center font-mono text-sm ${darkMode ? 'text-slate-300' : 'text-slate-900'}`}>
                      {item.threshold} {item.unit}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                        item.status === 'Critical'
                          ? 'bg-[#ffdad6] text-[#93000a]'
                          : 'bg-[#ffdf93]/30 text-[#653e00]'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      {item.status === 'Critical' ? (
                        <button 
                          onClick={() => {
                            // Reorder triggers adding 20 units
                            onReorderItem(item.sku, 20);
                            alert(`Stock level reordered! Added +20 units to ${item.name}. Status updated to optimal.`);
                          }}
                          className={`font-bold text-xs uppercase tracking-widest hover:underline ${
                            darkMode ? 'text-[#cfbcff]' : 'text-slate-900'
                          }`}
                        >
                          Reorder Now
                        </button>
                      ) : (
                        <button 
                          onClick={() => {
                            // Low stock triggers adding 10 units
                            onReorderItem(item.sku, 15);
                            alert(`Safely replenished safety threshold! Added +15 units to ${item.name}.`);
                          }}
                          className={`font-bold text-xs uppercase tracking-widest hover:underline ${
                            darkMode ? 'text-[#cfbcff]' : 'text-slate-500'
                          }`}
                        >
                          Replenish Stock
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
