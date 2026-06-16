import React, { useState } from 'react';
import { 
  Search, 
  Leaf, 
  Flame, 
  Egg, 
  Box, 
  Infinity, 
  Plus, 
  Sparkles, 
  Loader2, 
  ArrowRight,
  TrendingUp,
  Truck,
  AlertCircle
} from 'lucide-react';
import { InventoryItem, TabType } from '../types';

interface InventoryViewProps {
  items: InventoryItem[];
  totalStockValue: number;
  onAddItem: (item: Omit<InventoryItem, 'id' | 'status'>) => void;
  onUpdateStock: (sku: string, newStock: number) => void;
  darkMode: boolean;
}

export default function InventoryView({
  items,
  totalStockValue,
  onAddItem,
  onUpdateStock,
  darkMode
}: InventoryViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  
  // AI advice state
  const [aiAdvice, setAiAdvice] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // New Item dialog state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newSKU, setNewSKU] = useState('');
  const [newCategory, setNewCategory] = useState<'Produce' | 'Meat' | 'Dairy' | 'Dry Goods'>('Produce');
  const [newStock, setNewStock] = useState(10);
  const [newUnit, setNewUnit] = useState('kg');
  const [newDescription, setNewDescription] = useState('Organic quality freshness');
  const [newThreshold, setNewThreshold] = useState(15);
  const [newValue, setNewTotalValue] = useState(250);

  // Get active item lists
  const filteredItems = items.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category mapping
    let matchesCategory = true;
    if (selectedCategory !== 'All') {
      if (selectedCategory === 'Meat') {
        matchesCategory = item.category === 'Meat';
      } else {
        matchesCategory = item.category === selectedCategory;
      }
    }

    return matchesSearch && matchesCategory;
  });

  // Calculate par-level breaches counts for badges
  const breachCount = items.filter(item => item.status === 'Critical' || item.status === 'Low Stock').length;

  const handleRunAiOptimization = async () => {
    setLoadingAi(true);
    setAiAdvice(null);
    try {
      const response = await fetch('/api/ai/optimize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(it => ({ name: it.name, stock: it.stock, threshold: it.threshold, status: it.status })),
          type: 'inventory'
        })
      });
      const data = await response.json();
      if (data.success) {
        setAiAdvice(data.advice);
      } else {
        setAiAdvice("<p className='text-red-400'>Failed to load AI suggestions. Please verify your GEMINI_API_KEY environment config.</p>");
      }
    } catch (e: any) {
      console.error(e);
      setAiAdvice("<p className='text-red-400'>Server connection timed out. Please retry in a few seconds.</p>");
    } finally {
      setLoadingAi(false);
    }
  };

  const handleAddNewItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newSKU.trim()) return;

    onAddItem({
      name: newName.trim(),
      sku: newSKU.trim(),
      category: newCategory,
      stock: Number(newStock),
      unit: newUnit,
      description: newDescription.trim(),
      threshold: Number(newThreshold),
      value: Number(newValue),
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=120&auto=format&fit=crop'
    });

    // Reset Form & Close
    setNewName('');
    setNewSKU('');
    setNewCategory('Produce');
    setNewStock(10);
    setNewUnit('kg');
    setNewDescription('Organic quality freshness');
    setNewThreshold(15);
    setNewTotalValue(250);
    setIsModalOpen(false);
    alert('🛒 Custom raw ingredient successfully registered in the inventory catalog!');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page Header & Summary */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className={`text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Inventory Management
          </h2>
          <p className={`text-sm ${darkMode ? 'text-[#cbc4d2]' : 'text-slate-500'}`}>
            Real-time tracking, safety thresholds, and replenishment of premium raw materials.
          </p>
        </div>

        {/* Total Stock Value Widget Card matching mockup */}
        <div className={`border p-5 rounded-xl shadow-sm min-w-[300px] relative overflow-hidden flex flex-col justify-between ${
          darkMode ? 'bg-[#211f24] border-[#494551]/30' : 'bg-slate-50 border-[#c6c6cd]'
        }`}>
          <div className="absolute top-0 right-0 p-4 opacity-5">
            <TrendingUp className="w-16 h-16 text-slate-400" />
          </div>
          <p className={`text-[10px] font-bold uppercase tracking-wider ${darkMode ? 'text-[#cbc4d2]' : 'text-slate-500'}`}>
            Total Stock Value
          </p>
          <div className="flex items-baseline gap-2 mt-1">
            <span className={`text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              ${totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-[#006c49] font-bold text-xs flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> 2.4%
            </span>
          </div>
          {/* Progress bar matching mockup */}
          <div className="mt-3 h-1.5 w-full bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div className="bg-[#006c49] h-full w-[65%]"></div>
          </div>
        </div>
      </section>

      {/* Search & Filter Controls Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-grow w-full md:w-auto">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search raw culinary materials, SKUs, or food suppliers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border-b-2 outline-none transition-all ${
              darkMode 
                ? 'bg-[#211f24] border-[#cfbcff]/50 text-white focus:border-[#cfbcff]' 
                : 'bg-white border-slate-350 focus:border-[#006c49] text-slate-900'
            }`}
          />
        </div>

        {/* Tab Controls for Current Stock, Purchases, Suppliers */}
        <div className="flex bg-slate-100 dark:bg-slate-800 rounded-lg p-1 w-full md:w-auto border border-slate-300/30">
          {['Current Stock', 'Purchases', 'Suppliers'].map((tab) => (
            <button
              key={tab}
              onClick={() => alert(`Showing registered ${tab} list - standard corporate directory fallback.`)}
              className={`flex-1 md:flex-none px-5 py-2 rounded text-xs font-bold transition-all ${
                tab === 'Current Stock'
                  ? 'bg-white dark:bg-[#cfbcff] text-slate-900 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* New item addition entry */}
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider whitespace-nowrap transition-all shadow-sm active:scale-95 ${
            darkMode 
              ? 'bg-[#cfbcff] text-[#22005d] hover:bg-[#cfbcff]/95' 
              : 'bg-black text-white hover:opacity-90'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Main Catalog View Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Category Sidebar matching mockup */}
        <div className="lg:col-span-3 space-y-2">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 px-2">
            Categories
          </p>
          
          <button 
            onClick={() => setSelectedCategory('All')}
            className={`w-full flex items-center justify-between p-3 rounded-lg font-bold text-sm transition-all ${
              selectedCategory === 'All'
                ? (darkMode ? 'bg-[#cfbcff] text-[#22005d]' : 'bg-[#e5eeff] text-[#131b2e]')
                : 'text-slate-550 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Infinity className="w-4 h-4" />
              <span>All Items</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-xs ${
              selectedCategory === 'All' ? 'bg-[#131b2e]/10 text-slate-900' : 'bg-slate-200 dark:bg-slate-800'
            }`}>
              {items.length}
            </span>
          </button>

          <button 
            onClick={() => setSelectedCategory('Produce')}
            className={`w-full flex items-center justify-between p-3 rounded-lg font-bold text-sm transition-all ${
              selectedCategory === 'Produce'
                ? (darkMode ? 'bg-[#cfbcff] text-[#22005d]' : 'bg-[#e5eeff] text-[#131b2e]')
                : 'text-slate-550 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Leaf className="w-4 h-4" />
              <span>Produce</span>
            </div>
            <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
              {items.filter(it => it.category === 'Produce').length}
            </span>
          </button>

          <button 
            onClick={() => setSelectedCategory('Meat')}
            className={`w-full flex items-center justify-between p-3 rounded-lg font-bold text-sm transition-all ${
              selectedCategory === 'Meat'
                ? (darkMode ? 'bg-[#cfbcff] text-[#22005d]' : 'bg-[#e5eeff] text-[#131b2e]')
                : 'text-slate-550 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Flame className="w-4 h-4" />
              <span>Meat &amp; Poultry</span>
            </div>
            <span className="text-xs font-bold text-red-500 bg-red-50 dark:bg-red-900/10 px-2.5 py-0.5 rounded">
              {items.filter(it => it.status === 'Critical' && it.category === 'Meat').length} Low
            </span>
          </button>

          <button 
            onClick={() => setSelectedCategory('Dairy')}
            className={`w-full flex items-center justify-between p-3 rounded-lg font-bold text-sm transition-all ${
              selectedCategory === 'Dairy'
                ? (darkMode ? 'bg-[#cfbcff] text-[#22005d]' : 'bg-[#e5eeff] text-[#131b2e]')
                : 'text-slate-550 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Egg className="w-4 h-4" />
              <span>Dairy</span>
            </div>
            <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
              {items.filter(it => it.category === 'Dairy').length}
            </span>
          </button>

          <button 
            onClick={() => setSelectedCategory('Dry Goods')}
            className={`w-full flex items-center justify-between p-3 rounded-lg font-bold text-sm transition-all ${
              selectedCategory === 'Dry Goods'
                ? (darkMode ? 'bg-[#cfbcff] text-[#22005d]' : 'bg-[#e5eeff] text-[#131b2e]')
                : 'text-slate-550 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <Box className="w-4 h-4" />
              <span>Dry Goods</span>
            </div>
            <span className="text-xs bg-slate-200 dark:bg-slate-800 px-2 py-0.5 rounded">
              {items.filter(it => it.category === 'Dry Goods').length}
            </span>
          </button>
        </div>

        {/* Main Inventory Table with progress bars */}
        <div className={`lg:col-span-9 border rounded-xl overflow-hidden flex flex-col ${
          darkMode ? 'bg-[#211f24] border-[#494551]/30' : 'bg-white border-[#c6c6cd]'
        }`}>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className={`${darkMode ? 'bg-[#1d1b20]' : 'bg-slate-50'} border-b ${darkMode ? 'border-[#494551]/20' : 'border-[#c6c6cd]'}`}>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#cbc4d2]">Item Name</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#cbc4d2]">Category</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#cbc4d2]">Stock Level</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-center text-slate-500 dark:text-[#cbc4d2]">Par Level</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-right text-slate-500 dark:text-[#cbc4d2]">Value (Est)</th>
                  <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#cbc4d2]">Status</th>
                </tr>
              </thead>
              <tbody className={`divide-y ${darkMode ? 'divide-[#494551]/20' : 'divide-slate-200'}`}>
                {filteredItems.map((item) => {
                  // Calculate dynamic percentage of stock relative to threshold or target (e.g. 5x threshold as optimal limit)
                  const percentage = Math.min(100, Math.floor((item.stock / (item.threshold * 2)) * 100));

                  return (
                    <tr 
                      key={item.id} 
                      className={`transition-colors ${
                        item.status === 'Critical' ? 'border-l-4 border-l-[#ba1a1a]' : item.status === 'Low Stock' ? 'border-l-4 border-l-amber-500' : ''
                      } ${
                        darkMode ? 'hover:bg-slate-800/10' : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* Image Thumbnail + Name */}
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 border border-slate-350 dark:border-slate-800/50">
                            <img alt={item.name} src={item.imageUrl} className="w-full h-full object-cover" />
                          </div>
                          <div>
                            <p className={`font-bold text-sm ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                              {item.name}
                            </p>
                            <p className="text-[10px] font-semibold text-slate-400">
                              {item.sku}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="p-4 text-sm text-slate-600 dark:text-[#cbc4d2]">{item.category}</td>

                      {/* Stock indicator with metric progress bar matching mock */}
                      <td className="p-4">
                        <div className="flex flex-col gap-1.5 min-w-[120px]">
                          <span className={`font-mono text-sm font-bold ${
                            item.status === 'Critical' ? 'text-[#ba1a1a]' : item.status === 'Low Stock' ? 'text-amber-500' : 'text-[#006c49]'
                          }`}>
                            {item.stock} {item.unit}
                          </span>
                          <div className="w-24 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${
                              item.status === 'Critical' ? 'bg-[#ba1a1a]' : item.status === 'Low Stock' ? 'bg-amber-500' : 'bg-[#006c49]'
                            }`} style={{ width: `${percentage}%` }}></div>
                          </div>
                        </div>
                      </td>

                      {/* Par line target */}
                      <td className="p-4 text-center font-mono text-sm font-semibold">
                        {item.threshold} {item.unit}
                      </td>

                      {/* Est value */}
                      <td className="p-4 text-right font-mono text-sm font-semibold text-slate-900 dark:text-white">
                        ${item.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>

                      {/* Pill Badge and clicking to increment */}
                      <td className="p-4">
                        <button
                          onClick={() => {
                            // Replenish stock count interactively right inside the table
                            const increase = item.status === 'Critical' ? 20 : 10;
                            onUpdateStock(item.sku, item.stock + increase);
                            alert(`Replenished safety stock! Added +${increase} ${item.unit} to ${item.name}.`);
                          }}
                          className={`px-2 text-[10px] font-extrabold uppercase py-1 rounded transition-transform active:scale-95 ${
                            item.status === 'Critical'
                              ? 'bg-red-500 text-white hover:bg-red-650'
                              : item.status === 'Low Stock'
                              ? 'bg-amber-500 text-white hover:bg-amber-600'
                              : 'bg-emerald-600 text-white hover:bg-emerald-700'
                          }`}
                        >
                          {item.status} (+ Reorder)
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className={`p-4 border-t flex justify-between items-center bg-slate-50 dark:bg-[#1d1b20] ${
            darkMode ? 'border-[#494551]/30' : 'border-[#c6c6cd]'
          }`}>
            <p className="text-xs text-slate-400">
              Showing {filteredItems.length} of {items.length} catalog commodities
            </p>
            <div className="flex gap-1.5">
              <button 
                onClick={() => alert('No older items catalog listings present.')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-550 dark:text-[#cbc4d2]"
              >
                ◀
              </button>
              <button 
                onClick={() => alert('No subsequent items catalog pages registered.')}
                className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-550 dark:text-[#cbc4d2]"
              >
                ▶
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Insights & Smart Inventory Assistant with server-side Gemini AI support */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Logistics deliveries */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between ${
          darkMode ? 'bg-[#211f24] border-[#494551]/20' : 'bg-white border-[#c6c6cd]'
        }`}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-[#e5eeff] dark:bg-slate-800 flex items-center justify-center">
                <Truck className="w-5 h-5 text-[#006c49]" />
              </div>
              <span className="text-[10px] font-bold text-[#006c49] bg-emerald-55 dark:bg-slate-85 px-2 py-0.5 rounded uppercase">ACTIVE</span>
            </div>
            <h4 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>Upcoming Deliveries</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              3 shipments expected in the next 24 hours including organic dairy shipments and farm egg replenishments.
            </p>
          </div>
          <button 
            onClick={() => alert("Showing details for 3 arriving delivery trucks: \n1 - Fresh Asparagus Organic (10:15) \n2 - Premium Wagyu Beef packs (13:40) \n3 - Creamery Delivery (15:00)")}
            className="mt-4 text-xs font-bold text-slate-900 dark:text-[#cfbcff] uppercase flex items-center gap-1 hover:gap-2 transition-all hover:underline"
          >
            <span>View Logistics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Par level breaks */}
        <div className={`p-5 rounded-xl border flex flex-col justify-between ${
          darkMode ? 'bg-[#211f24] border-[#494551]/20' : 'bg-white border-[#c6c6cd]'
        }`}>
          <div>
            <div className="flex justify-between items-start mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-[#ba1a1a]" />
              </div>
              <span className="text-[10px] font-bold text-[#ba1a1a] bg-red-50 px-2 py-0.5 rounded uppercase">ALERTS</span>
            </div>
            <h4 className={`font-bold text-base ${darkMode ? 'text-white' : 'text-slate-900'}`}>Par-Level Breaches</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              {breachCount} luxury raw material ingredients are currently resting below safety levels.
            </p>
          </div>
          <button 
            onClick={() => {
              // Reorder ALL breaches by adding units
              items.forEach(it => {
                if (it.status !== 'Optimal') {
                  onUpdateStock(it.sku, it.threshold * 2);
                }
              });
              alert(`Dispatched automated bulk orders to suppliers of all ${breachCount} understocked assets! All items have been replenished.`);
            }}
            className="mt-4 text-xs font-bold text-slate-900 dark:text-[#cfbcff] uppercase flex items-center gap-1 hover:gap-2 transition-all hover:underline"
          >
            <span>Auto-Generate Bulk Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Smart Inventory Assistant (Real Gemini AI Integration) */}
        <div className="bg-[#000000] dark:bg-[#211f24] dark:border dark:border-[#494551]/30 text-white rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute -right-6 -bottom-6 opacity-5 pointer-events-none">
            <Sparkles className="w-32 h-32 text-indigo-300" />
          </div>

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-2">
              <span className="text-[10px] font-mono font-bold tracking-widest text-emerald-400 flex items-center gap-1 uppercase">
                <Sparkles className="w-3 h-3 text-emerald-400 fill-emerald-400" />
                LuxeAnalytics Executive Officer AI
              </span>
            </div>
            <h4 className="font-extrabold text-lg text-white">Smart Inventory Assistant</h4>
            
            {/* Advice panel */}
            {aiAdvice ? (
              <div 
                className="text-xs text-slate-300 mt-3 space-y-2 border-t border-slate-800 pt-3 max-h-[140px] overflow-y-auto custom-scrollbar animate-fade-in"
                dangerouslySetInnerHTML={{ __html: aiAdvice }}
              />
            ) : (
              <p className="text-xs text-slate-350 mt-1 leading-relaxed">
                AI predicts a 15% increase in Meat and truffle pasta demands for the upcoming holiday weekend. Click "Run Optimization" below to initiate deep analytical modeling on active inventory stocks.
              </p>
            )}
          </div>

          {/* Trigger button */}
          <div className="relative z-10 mt-4 flex items-center gap-2">
            <button 
              disabled={loadingAi}
              onClick={handleRunAiOptimization}
              className={`bg-white hover:bg-slate-100 text-slate-900 border text-xs px-4 py-2.5 rounded-lg font-bold uppercase transition-all shadow-sm active:scale-95 flex items-center gap-2 ${
                loadingAi ? 'opacity-85 pointer-events-none' : ''
              }`}
            >
              {loadingAi ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Modeling Stocks...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 fill-indigo-600" />
                  <span>Run Optimization</span>
                </>
              )}
            </button>
            {aiAdvice && (
              <button 
                onClick={() => setAiAdvice(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold hover:underline"
              >
                Clear Advice
              </button>
            )}
          </div>
        </div>

      </section>

      {/* Upscale Add Item Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className={`w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-up border ${
            darkMode ? 'bg-[#1d1b20] border-[#494551] text-white' : 'bg-white border-[#c6c6cd] text-slate-900'
          }`}>
            <div className={`p-6 border-b flex justify-between items-center ${
              darkMode ? 'bg-[#211f24] border-[#494551]/30' : 'bg-slate-50'
            }`}>
              <h3 className="font-extrabold text-lg">Register Raw Material Asset</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddNewItem} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                  Item Title
                </label>
                <input 
                  type="text" 
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. White Truffles Extra Grade"
                  required
                  className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#00714d] ${
                    darkMode ? 'bg-[#211f24] border-[#494551] text-white' : 'bg-slate-50 border-slate-320 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                    Category Code
                  </label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as any)}
                    className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#00714d] ${
                      darkMode ? 'bg-[#211f24] border-[#494551] text-white' : 'bg-slate-50 border-slate-320 text-slate-900'
                    }`}
                  >
                    <option value="Produce">Produce</option>
                    <option value="Meat">Meat &amp; Poultry</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Dry Goods">Dry Goods</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                    SKU Code
                  </label>
                  <input 
                    type="text" 
                    value={newSKU}
                    onChange={(e) => setNewSKU(e.target.value)}
                    placeholder="e.g. MEAT-0044"
                    required
                    className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#00714d] ${
                      darkMode ? 'bg-[#211f24] border-[#494551] text-white' : 'bg-slate-50 border-slate-320 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-2 text-slate-400">
                    Units Unit
                  </label>
                  <input 
                    type="text" 
                    value={newUnit}
                    onChange={(e) => setNewUnit(e.target.value)}
                    placeholder="e.g. kg or units"
                    required
                    className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#00714d] ${
                      darkMode ? 'bg-[#211f24] border-[#494551] text-white' : 'bg-slate-50 border-slate-320'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-2 text-slate-400">
                    Active Stock
                  </label>
                  <input 
                    type="number" 
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    required
                    className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#00714d] ${
                      darkMode ? 'bg-[#211f24] border-[#494551] text-white' : 'bg-slate-50 border-slate-320'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider mb-2 text-slate-400">
                    Safety Par Level
                  </label>
                  <input 
                    type="number" 
                    value={newThreshold}
                    onChange={(e) => setNewThreshold(Number(e.target.value))}
                    required
                    className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#00714d] ${
                      darkMode ? 'bg-[#211f24] border-[#494551] text-white' : 'bg-slate-50 border-slate-320'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                  Item Description or Grade
                </label>
                <input 
                  type="text" 
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="e.g. White Truffle Infused - 500ml"
                  className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#00714d] ${
                    darkMode ? 'bg-[#211f24] border-[#494551] text-white' : 'bg-slate-50 border-slate-320'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                  Estimated Stock Value ($)
                </label>
                <input 
                  type="number" 
                  value={newValue}
                  onChange={(e) => setNewTotalValue(Number(e.target.value))}
                  required
                  className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#00714d] ${
                    darkMode ? 'bg-[#211f24] border-[#494551] text-white' : 'bg-slate-50 border-slate-320'
                  }`}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className={`flex-1 py-3 text-[11px] outline-none font-bold rounded-lg border uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    darkMode ? 'border-[#494551] text-slate-300' : 'border-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-3 text-[11px] font-bold rounded-lg uppercase tracking-wider text-white bg-slate-900 dark:bg-[#cfbcff] dark:text-[#22005d] hover:opacity-90 transition-opacity"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
