import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Briefcase, 
  Compass, 
  ShoppingBag, 
  Download,
  Loader2,
  Sparkles
} from 'lucide-react';

interface ReportsViewProps {
  darkMode: boolean;
}

export default function ReportsView({ darkMode }: ReportsViewProps) {
  const [activeRange, setActiveRange] = useState<'today' | 'weekly' | 'monthly'>('weekly');
  const [selectedMonth, setSelectedYear] = useState<string | null>(null);

  // Financial active AI advice state
  const [aiReportAdvice, setAiReportAdvice] = useState<string | null>(null);
  const [loadingAiReport, setLoadingAiReport] = useState(false);

  // P&L Mock data
  const plData = [
    { category: 'Total Revenue', actual: '$142,850.00', budgeted: '$135,000.00', variance: '+5.8%', isPositive: true, status: 'Completed' },
    { category: 'Operational Expenses', actual: '$48,500.00', budgeted: '$45,000.00', variance: '+7.7%', isPositive: false, status: 'Pending' },
    { category: 'Inventory Costs', actual: '$46,130.00', budgeted: '$48,000.00', variance: '-3.9%', isPositive: true, status: 'Completed' },
  ];

  // Month-by-month mockup
  const monthData = [
    { month: 'JAN', height: '45%', actual: '$82,500', target: '$80,000' },
    { month: 'FEB', height: '55%', actual: '$95,100', target: '$90,005' },
    { month: 'MAR', height: '75%', actual: '$138,400', target: '$120,400' },
    { month: 'APR', height: '65%', actual: '$112,000', target: '$110,000' },
    { month: 'MAY', height: '85%', actual: '$156,200', target: '$140,000' },
    { month: 'JUN', height: '95%', actual: '$178,000', target: '$150,000' },
  ];

  const handleRunFiscalAiInsight = async () => {
    setLoadingAiReport(true);
    setAiReportAdvice(null);
    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: {
            revenue: 142850,
            expenses: 48500,
            margins: '7.7% variance in OPEX',
            target: '12% net profit forecast'
          },
          type: 'fiscal'
        })
      });
      const data = await response.json();
      if (data.success) {
        setAiReportAdvice(data.advice);
      } else {
        setAiReportAdvice("<p class='text-red-400'>Unable to invoke report AI analysis. Verify Settings secrets.</p>");
      }
    } catch (e) {
      console.error(e);
      setAiReportAdvice("<p class='text-red-450'>Server synchronization timeout. Please re-run.</p>");
    } finally {
      setLoadingAiReport(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header and Controls */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Financial Performance
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">
            Real-time fiscal oversight, revenue margins, and luxury kitchen commodity variances.
          </p>
        </div>

        {/* Date Range Picker */}
        <div className="flex bg-[#e5eeff] dark:bg-slate-800 rounded-lg p-1 border border-slate-300/30">
          {(['today', 'weekly', 'monthly'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-5 py-2 text-xs font-bold uppercase rounded transition-all active:scale-95 ${
                activeRange === range
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-950'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </section>

      {/* Grid: 4 KPI Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between transition-colors group ${
          darkMode ? 'bg-[#211f24] border-[#494551]/20 hover:border-[#cfbcff]' : 'bg-white border-[#c6c6cd] hover:border-slate-800'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 tracking-wider">TOTAL REVENUE</span>
            <TrendingUp className="w-4 h-4 text-[#006c49]" />
          </div>
          <div className="mt-4">
            <span className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-950'}`}>$142,850.00</span>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              <span className="text-[#006c49] font-bold">+12.5%</span>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">VS LAST MONTH</span>
            </div>
          </div>
        </div>

        {/* Net Profit */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between transition-colors group ${
          darkMode ? 'bg-[#211f24] border-[#494551]/20 hover:border-[#cfbcff]' : 'bg-white border-[#c6c6cd] hover:border-slate-800'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 tracking-wider">NET PROFIT</span>
            <DollarSign className="w-4 h-4 text-[#006c49]" />
          </div>
          <div className="mt-4">
            <span className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-950'}`}>$48,220.00</span>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              <span className="text-[#006c49] font-bold">+8.2%</span>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">VS LAST MONTH</span>
            </div>
          </div>
        </div>

        {/* Opex Ratio */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between transition-colors group ${
          darkMode ? 'bg-[#211f24] border-[#494551]/20 hover:border-[#cfbcff]' : 'bg-white border-[#c6c6cd] hover:border-slate-800'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 tracking-wider">OPEX RATIO</span>
            <TrendingDown className="w-4 h-4 text-[#ba1a1a]" />
          </div>
          <div className="mt-4">
            <span className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-950'}`}>34.2%</span>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              <span className="text-[#ba1a1a] font-bold">+2.1%</span>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">INCREASE IN COSTS</span>
            </div>
          </div>
        </div>

        {/* Avg Order Value */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between transition-colors group ${
          darkMode ? 'bg-[#211f24] border-[#494551]/20 hover:border-[#cfbcff]' : 'bg-white border-[#c6c6cd] hover:border-slate-800'
        }`}>
          <div className="flex justify-between items-start">
            <span className="text-xs font-bold text-slate-400 tracking-wider">AVG ORDER VALUE</span>
            <ShoppingBag className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-4">
            <span className={`text-2xl font-extrabold ${darkMode ? 'text-white' : 'text-slate-950'}`}>$84.50</span>
            <div className="flex items-center gap-1 mt-1 text-[11px]">
              <span className="text-[#006c49] font-bold">+4.3%</span>
              <span className="text-slate-400 font-bold uppercase tracking-wider text-[9px]">VS LAST MONTH</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Monthly Trend Bars Graph */}
        <div className={`md:col-span-8 border p-6 flex flex-col rounded-xl ${
          darkMode ? 'bg-[#211f24] border-[#494551]/30' : 'bg-white border-[#c6c6cd]'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Revenue Monthly Trend
              </h3>
              <p className="text-xs text-slate-400">Month-on-month active fiscal trend line (Select month)</p>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${darkMode ? 'bg-[#cfbcff]' : 'bg-[#000000]'}`}></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Year</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-slate-350 dark:bg-slate-700"></span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Target</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative flex items-end justify-between gap-3 px-2 border-l border-b border-slate-200 dark:border-slate-800 pt-6 h-64 min-h-[220px]">
            {monthData.map((m, idx) => {
              const isSelected = selectedMonth === m.month;
              return (
                <div 
                  key={idx} 
                  onClick={() => setSelectedYear(isSelected ? null : m.month)}
                  className="group relative flex-1 flex flex-col justify-end items-center h-full cursor-pointer"
                >
                  {/* Subtle target backing column */}
                  <div 
                    style={{ height: m.height }} 
                    className={`w-full bg-[#131b2e]/5 dark:bg-slate-800/40 rounded-t-sm transition-all duration-300 ${
                      isSelected ? 'bg-indigo-50 dark:bg-indigo-950/20' : ''
                    }`}
                  ></div>
                  
                  {/* Foreground core actual column line */}
                  <div 
                    className={`absolute bottom-0 rounded-t-sm transition-all duration-500 overflow-hidden ${
                      isSelected 
                        ? 'bg-[#006c49] w-3.5 shadow-md shadow-emerald-500/25' 
                        : (darkMode ? 'bg-[#cfbcff]/70 group-hover:bg-[#cfbcff] w-2' : 'bg-black group-hover:opacity-85')
                    }`}
                    style={{ height: m.height }}
                  ></div>

                  {/* Indicator Tooltip */}
                  <div className={`absolute bottom-[105%] bg-slate-950 text-white rounded p-1.5 text-[9px] font-mono z-15 transition-all text-center ${
                    isSelected ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                  }`}>
                    <p className="font-bold border-b border-slate-800 pb-0.5 mb-1 text-slate-300">{m.month} Revenue</p>
                    <p>Actual: <span className="text-emerald-400 font-bold">{m.actual}</span></p>
                    <p>Target: <span className="text-slate-400">{m.target}</span></p>
                  </div>

                  <span className={`text-[10px] font-bold font-mono tracking-wider mt-2.5 ${
                    isSelected ? 'text-[#cfbcff] dark:text-[#cfbcff] font-extrabold' : 'text-slate-450 dark:text-slate-400'
                  }`}>
                    {m.month}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue by Category (Pie Chart Donut) */}
        <div className={`md:col-span-4 border p-6 flex flex-col rounded-xl ${
          darkMode ? 'bg-[#211f24] border-[#494551]/30' : 'bg-white border-[#c6c6cd]'
        }`}>
          <h3 className={`font-semibold text-base mb-6 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Revenue by Category
          </h3>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Donut representation */}
            <div className="relative w-40 h-48 flex items-center justify-center">
              {/* Outer mask */}
              <div 
                className="absolute inset-0 rounded-full animate-pulse-slow" 
                style={{ 
                  background: 'conic-gradient(#000000 0% 45%, #494551 45% 75%, #bec6e0 75% 90%, #d3e4fe 90% 100%)', 
                  mask: 'radial-gradient(transparent 58%, black 59%)',
                  WebkitMask: 'radial-gradient(transparent 58%, black 59%)'
                }}
              ></div>
              
              <div className="text-center z-10 bg-white dark:bg-[#1d1b20] p-4 rounded-full shadow-inner">
                <span className={`block font-extrabold text-2xl ${darkMode ? 'text-white' : 'text-slate-900'}`}>45%</span>
                <span className="block text-[8px] font-bold tracking-widest text-slate-400 uppercase">Beverage</span>
              </div>
            </div>

            {/* Sectors Indicators mapping */}
            <div className="w-full mt-6 grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-black dark:bg-[#cfbcff]"></span>
                <span className="font-semibold text-slate-700 dark:text-[#cbc4d2]">Food (45%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-650 dark:bg-[#494551]"></span>
                <span className="font-semibold text-slate-700 dark:text-[#cbc4d2]">Wine (30%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#bec6e0]"></span>
                <span className="font-semibold text-slate-700 dark:text-[#cbc4d2]">Spirits (15%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#d3e4fe]"></span>
                <span className="font-semibold text-slate-700 dark:text-[#cbc4d2]">Other (10%)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Profit & Loss Table */}
      <section className={`border rounded-xl overflow-hidden shadow-sm ${
        darkMode ? 'bg-[#211f24] border-[#494551]/30' : 'bg-white border-[#c6c6cd]'
      }`}>
        <div className={`p-6 border-b flex justify-between items-center ${
          darkMode ? 'border-[#494551]/30 bg-[#1d1b20]' : 'border-[#c6c6cd] bg-slate-50'
        }`}>
          <h3 className={`font-semibold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Profit &amp; Loss Summary
          </h3>
          <button 
            onClick={() => alert("Comprehensive PDF Audit Statement queued for download (P&L Year-To-Date).")}
            className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider hover:underline text-slate-500 hover:text-slate-900 dark:text-[#cbc4d2]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Statement</span>
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${darkMode ? 'bg-[#1d1b20]' : 'bg-slate-100'}`}>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#cbc4d2]">Fiscal Category</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-right text-slate-500 dark:text-[#cbc4d2]">Actual</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-right text-slate-500 dark:text-[#cbc4d2]">Budgeted</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-right text-slate-500 dark:text-[#cbc4d2]">Variance (%)</th>
                <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#cbc4d2]">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-[#494551]/20' : 'divide-slate-200'}`}>
              {plData.map((row, index) => (
                <tr key={index} className={darkMode ? 'hover:bg-slate-800/10' : 'hover:bg-slate-50'}>
                  <td className="p-4 text-sm font-bold text-slate-800 dark:text-[#cbc4d2]">{row.category}</td>
                  <td className="p-4 text-sm font-mono text-right font-semibold text-slate-900 dark:text-white">{row.actual}</td>
                  <td className="p-4 text-sm font-mono text-right text-slate-400">{row.budgeted}</td>
                  <td className={`p-4 text-sm font-mono text-right font-bold ${row.isPositive ? 'text-[#006c49]' : 'text-[#ba1a1a]'} `}>
                    {row.variance}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
                      row.status === 'Completed'
                        ? 'bg-emerald-50 text-emerald-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}>
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              
              {/* Highlighted Net Profit row matching mockup */}
              <tr className={`border-l-4 border-l-slate-900 border-t-2 font-bold ${
                darkMode ? 'bg-slate-800/20 text-[#cfbcff]' : 'bg-slate-100 text-slate-950 shadow-inner'
              }`}>
                <td className="p-4 text-sm font-bold uppercase tracking-wider">Net Profit</td>
                <td className="p-4 text-sm font-mono text-right font-extrabold text-emerald-600 dark:text-[#6cf8bb]">$48,220.00</td>
                <td className="p-4 text-sm font-mono text-right text-slate-450 dark:text-slate-400">$42,000.00</td>
                <td className="p-4 text-sm font-mono text-right text-emerald-600 dark:text-[#6cf8bb]">+14.8%</td>
                <td className="p-4 font-bold">
                  <span className="bg-slate-900 text-white dark:bg-[#cfbcff] dark:text-[#22005d] px-2.5 py-1 rounded text-[9px] font-extrabold uppercase tracking-widest">
                    Target Achieved
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Contextual Insights and Analytics Map with server-side AI integration */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        
        {/* Dark AI Liquidity card matching mockup */}
        <div className="bg-[#000000] dark:bg-[#211f24] dark:border dark:border-[#494551]/30 text-white p-8 relative overflow-hidden flex flex-col justify-between rounded-xl">
          <div className="relative z-10 space-y-4">
            <span className="text-[10px] font-bold text-emerald-400 tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-emerald-400 fill-emerald-400" />
              AI INSIGHT
            </span>
            <h4 className="font-extrabold text-xl text-white">Liquidity Forecast</h4>
            
            {aiReportAdvice ? (
              <div 
                className="text-xs text-slate-350 leading-relaxed space-y-2 border-t border-slate-800 pt-3 max-h-[160px] overflow-y-auto custom-scrollbar animate-fade-in"
                dangerouslySetInnerHTML={{ __html: aiReportAdvice }}
              />
            ) : (
              <p className="text-sm text-slate-350 leading-relaxed">
                Based on current monthly performance and inventory cycles, we project a 12% increase in net profit for the next quarter. Click the analysis modeler to formulate custom pricing policies.
              </p>
            )}
          </div>

          <div className="mt-8 relative z-10 flex items-center gap-3">
            <button 
              disabled={loadingAiReport}
              onClick={handleRunFiscalAiInsight}
              className={`bg-white hover:bg-slate-100 text-slate-900 px-6 py-2.5 font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-95 flex items-center gap-2 ${
                loadingAiReport ? 'opacity-80 pointer-events-none' : ''
              }`}
            >
              {loadingAiReport ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Modeling Reports...</span>
                </>
              ) : (
                <span>View Full Analysis</span>
              )}
            </button>
            {aiReportAdvice && (
              <button 
                onClick={() => setAiReportAdvice(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold hover:underline"
              >
                Clear Insight
              </button>
            )}
          </div>

          <div className="absolute -right-10 -bottom-10 opacity-[0.03] pointer-events-none">
            <TrendingUp className="w-60 h-64 text-slate-100" />
          </div>
        </div>

        {/* Real-time Sync mapping details card with mockup image overlay! */}
        <div className="relative min-h-[300px] bg-slate-950 rounded-xl overflow-hidden group shadow-lg">
          <img 
            className="absolute inset-0 w-full h-full object-cover opacity-35 grayscale group-hover:grayscale-0 transition-all duration-700" 
            alt="Inventory Wastage Chart Screen" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDyxFY7CMSh3vIX-6Rj7zyVtwpplZXnucayPGI7C6Gr9UF6cEdHw69dRaM0jbs3nl2_2ptmF01TXmo-3rW2wcx1NpKLK-ODNbINpkIQ3GpPCYhlNXn46YKEzYmyOE9mJWMEglYR-p7DZ7FY9W06SpRUiTgtxoat7qGE0Jww7vxA2uuQKfnvNqKwpEgQHSNFRimYs48qLRdjYY3jD_GTrw5a5lAgt1fJluG6tloTISmm48ioX0GRAY0EYYqcGVyMktdcFmZ18qdHfwM" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 p-8 space-y-1 z-10">
            <span className="text-[10px] font-bold tracking-widest text-[#6cf8bb] uppercase">Real-Time Sync</span>
            <h4 className="font-extrabold text-lg text-white">Inventory Correlation</h4>
            <p className="text-xs text-slate-350 leading-relaxed">
              Active predictive mapping of safety thresholds, dining volumes, and commodities waste ratios.
            </p>
          </div>
        </div>

      </section>
    </div>
  );
}
