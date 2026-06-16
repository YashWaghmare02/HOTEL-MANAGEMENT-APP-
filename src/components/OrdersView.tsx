import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Clock, 
  Plus, 
  CheckCircle, 
  ChevronRight, 
  AlertTriangle,
  User,
  PlusCircle,
  FileSpreadsheet
} from 'lucide-react';
import { Order, RecentClosure } from '../types';

interface OrdersViewProps {
  orders: Order[];
  recentClosures: RecentClosure[];
  onAddOrder: (order: Omit<Order, 'id' | 'elapsedTime' | 'elapsedMinutes'>) => void;
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onCloseOrder: (id: string, paymentMethod: 'Amex' | 'Cash' | 'Visa') => void;
  darkMode: boolean;
}

export default function OrdersView({
  orders,
  recentClosures,
  onAddOrder,
  onUpdateOrderStatus,
  onCloseOrder,
  darkMode
}: OrdersViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'time' | 'price'>('time');

  // New Order modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTable, setNewTable] = useState('Table ');
  const [newServer, setNewServer] = useState('Julian V.');
  const [newItemsCount, setNewItemsCount] = useState(2);
  const [newTotal, setNewTotal] = useState(75.50);
  const [newItemsDetail, setNewItemsDetail] = useState('Truffle Pasta, Burrata Salad');

  // Filter orders based on user queries
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.table.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.server.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'All' || order.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  }).sort((a, b) => {
    if (sortBy === 'time') {
      return b.elapsedMinutes - a.elapsedMinutes; // higher elapsed is shown first / warning
    } else {
      return b.total - a.total; // highest total paid first
    }
  });

  const handleSubmitNewOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTable.trim()) return;

    onAddOrder({
      table: newTable.trim(),
      server: newServer,
      itemsCount: newItemsCount,
      total: Number(newTotal),
      status: 'Preparing',
      itemsDetail: newItemsDetail
    });

    // Reset Form & Close Modal
    setNewTable('Table ');
    setNewServer('Julian V.');
    setNewItemsCount(2);
    setNewTotal(75.50);
    setNewItemsDetail('Truffle Pasta, Burrata Salad');
    setIsModalOpen(false);
    alert('🎉 Premium order successfully dispatched to the kitchen terminal!');
  };

  return (
    <div className="space-y-8 animate-fade-in relative">
      {/* Active Orders Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className={`text-3xl font-extrabold tracking-tight ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Active Orders
          </h2>
          <p className={`text-sm ${darkMode ? 'text-[#cbc4d2]' : 'text-slate-500'}`}>
            Managing current active dining tables, takeaway dispatches, and kitchen flow.
          </p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className={`px-6 py-3 rounded-full flex items-center gap-2 font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-95 ${
            darkMode 
              ? 'bg-[#cfbcff] text-[#22005d] hover:bg-[#cfbcff]/90' 
              : 'bg-black text-white hover:opacity-90'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>New Order</span>
        </button>
      </section>

      {/* Search and Filters Custom Toolbar */}
      <div className={`border p-4 rounded-xl shadow-sm flex flex-col md:flex-row items-stretch md:items-center gap-4 ${
        darkMode ? 'bg-[#211f24] border-[#494551]/30' : 'bg-white border-[#c6c6cd]'
      }`}>
        {/* Search */}
        <div className="relative flex-grow">
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input 
            type="text" 
            placeholder="Search active orders table, id, or dining server..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border-b-2 outline-none transition-all ${
              darkMode 
                ? 'bg-[#1d1b20] border-[#cfbcff]/50 text-white focus:border-[#cfbcff]' 
                : 'bg-slate-50 border-black focus:border-[#006c49] text-slate-900'
            }`}
          />
        </div>

        {/* State Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filters */}
          <div className="flex border rounded-lg p-0.5 bg-slate-100 dark:bg-slate-800 border-slate-300/30">
            {['All', 'Preparing', 'Served', 'Completed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all ${
                  filterStatus === status
                    ? (darkMode ? 'bg-[#cfbcff] text-[#22005d]' : 'bg-black text-white')
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Sorting metrics */}
          <button
            onClick={() => setSortBy(sortBy === 'time' ? 'price' : 'time')}
            className={`px-4 py-2 rounded-lg border text-xs font-bold transition-all flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800 ${
              darkMode ? 'border-[#494551] text-white' : 'border-slate-300 text-slate-700'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Sort: {sortBy === 'time' ? 'Longest Wait' : 'Bill Size'}</span>
          </button>
        </div>
      </div>

      {/* Grid of Interactive Order Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredOrders.map((order) => {
          const isLate = order.elapsedMinutes >= 15;
          return (
            <div 
              key={order.id} 
              className={`border rounded-xl p-5 flex flex-col justify-between shadow-sm relative group transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${
                order.status === 'Completed' ? 'opacity-85 ' : ''
              } ${
                isLate && order.status !== 'Completed' ? 'border-l-4 border-l-[#ba1a1a]' : ''
              } ${
                darkMode ? 'bg-[#211f24] border-[#494551]/30 hover:border-[#cfbcff]' : 'bg-white border-[#c6c6cd] hover:border-[#000000]'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {order.id}
                    </span>
                    <h3 className={`text-lg font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                      {order.table}
                    </h3>
                  </div>
                  
                  {/* Styled Badge */}
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-widest ${
                    order.status === 'Preparing' 
                      ? 'bg-[#fff4e5] text-[#663c00]' 
                      : order.status === 'Served' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-200' 
                      : 'bg-[#e8f5e9] text-[#1b5e20]'
                  }`}>
                    {order.status}
                  </span>
                </div>

                <div className="space-y-1.5 mb-6 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Server</span>
                    <span className="font-bold flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      {order.server}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400">Items Count</span>
                    <span className="font-semibold text-slate-900 dark:text-slate-100">{order.itemsCount} Items</span>
                  </div>
                  {order.itemsDetail && (
                    <div className="pt-1.5 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400 line-clamp-1">
                      {order.itemsDetail}
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-end">
                <div>
                  <div className={`flex items-center gap-1 text-[11px] font-mono font-bold mb-1 ${
                    isLate && order.status !== 'Completed' ? 'text-[#ba1a1a] dark:text-[#ffb4ab]' : 'text-slate-400'
                  }`}>
                    {isLate && order.status !== 'Completed' ? (
                      <AlertTriangle className="w-3.5 h-3.5" />
                    ) : (
                      <Clock className="w-3.5 h-3.5" />
                    )}
                    <span>{order.elapsedMinutes}m wait</span>
                  </div>
                  <span className={`text-lg font-extrabold ${darkMode ? 'text-[#cfbcff]' : 'text-slate-900'}`}>
                    ${order.total.toFixed(2)}
                  </span>
                </div>

                {/* State advancing handler */}
                <div className="flex items-center gap-1.5">
                  {order.status === 'Preparing' && (
                    <button 
                      onClick={() => {
                        onUpdateOrderStatus(order.id, 'Served');
                        alert(`Order ${order.id} sent out! Status changed to 'Served'.`);
                      }}
                      title="Mark as Served"
                      className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                      Serve
                    </button>
                  )}
                  {order.status === 'Served' && (
                    <button 
                      onClick={() => {
                        onUpdateOrderStatus(order.id, 'Completed');
                        alert(`Order ${order.id} marked as Completed! Select Payment Method below to archive.`);
                      }}
                      title="Mark as Completed"
                      className="px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white rounded hover:bg-emerald-700 transition-colors"
                    >
                      Complete
                    </button>
                  )}
                  {order.status === 'Completed' && (
                    <div className="flex gap-1">
                      {['Amex', 'Visa', 'Cash'].map((m) => (
                        <button
                          key={m}
                          onClick={() => {
                            onCloseOrder(order.id, m as any);
                            alert(`Order archived into Recent Closures. Billed via ${m}.`);
                          }}
                          className={`px-1.5 py-1 text-[9px] font-bold rounded border ${
                            darkMode ? 'border-[#494551] text-[#cfbcff] hover:bg-slate-800' : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* Create New Order Shortcut Grid Card */}
        <div 
          onClick={() => setIsModalOpen(true)}
          className={`border-2 border-dashed rounded-xl p-5 flex flex-col items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800/10 cursor-pointer min-h-[200px] transition-all duration-200 ${
            darkMode ? 'border-[#494551]' : 'border-slate-300'
          }`}
        >
          <PlusCircle className="w-10 h-10 mb-2 text-slate-400 group-hover:scale-105 transition-transform" />
          <span className="text-xs font-bold uppercase tracking-widest">Create New Order</span>
        </div>
      </section>

      {/* Recent Closures (Completed order logs) */}
      <section className={`border rounded-xl shadow-sm overflow-hidden ${
        darkMode ? 'bg-[#211f24] border-[#494551]/30' : 'bg-white border-[#c6c6cd]'
      }`}>
        <div className={`p-6 border-b flex justify-between items-center ${
          darkMode ? 'border-[#494551]/30 bg-[#1d1b20]' : 'border-[#c6c6cd] bg-slate-50'
        }`}>
          <div>
            <h3 className={`font-semibold text-lg ${darkMode ? 'text-white' : 'text-slate-900'}`}>
              Recent Closures
            </h3>
            <p className="text-xs text-slate-400">Historical archive of settled tickets for this session.</p>
          </div>
          <button 
            onClick={() => alert(`Comprehensive corporate dining spreadsheet audit export queued.`)}
            className="text-xs font-bold uppercase tracking-widest hover:underline flex items-center gap-1 text-slate-500 hover:text-slate-900 dark:text-[#cbc4d2]"
          >
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>Audit History</span>
          </button>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className={`${darkMode ? 'bg-[#1d1b20]' : 'bg-slate-100'}`}>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#cbc4d2]">Time Settled</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#cbc4d2]">Order ID</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#cbc4d2]">Dining Server</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-[#cbc4d2]">Settlement Method</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-right text-slate-500 dark:text-[#cbc4d2]">Paid Total</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-center text-slate-500 dark:text-[#cbc4d2]">Receipt</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-[#494551]/20' : 'divide-slate-200'}`}>
              {recentClosures.map((cl) => (
                <tr key={cl.id} className={darkMode ? 'hover:bg-slate-800/10' : 'hover:bg-slate-50'}>
                  <td className="px-6 py-4 font-mono text-xs font-bold text-slate-400">{cl.timeClosed}</td>
                  <td className={`px-6 py-4 text-sm font-extrabold ${darkMode ? 'text-white' : 'text-slate-900'}`}>{cl.id}</td>
                  <td className="px-6 py-4 text-sm font-medium">{cl.server}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="bg-slate-100 dark:bg-slate-800 border border-slate-350 dark:border-slate-700/50 px-2 py-0.5 rounded text-xs font-semibold">
                      {cl.method}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-extrabold text-right text-emerald-600 dark:text-[#6cf8bb]">
                    ${cl.total.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => alert(`Settlement detailed receipt: \nTICKET: ${cl.id} \nSettled by ${cl.server} via ${cl.method} \nAmount: $${cl.total.toFixed(2)}.`)}
                      className="p-1 px-2.5 rounded bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-600 dark:text-slate-400"
                    >
                      View Slip
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Upscale Add Order Modal Form */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          <div className={`w-full max-w-md rounded-xl shadow-2xl overflow-hidden animate-slide-up border ${
            darkMode ? 'bg-[#1d1b20] border-[#494551] text-white' : 'bg-white border-[#c6c6cd] text-slate-900'
          }`}>
            <div className={`p-6 border-b flex justify-between items-center ${
              darkMode ? 'bg-[#211f24] border-[#494551]/30' : 'bg-slate-105 border-slate-200'
            }`}>
              <h3 className="font-extrabold text-lg">Disptach Kitchen Ticket</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className={`text-slate-400 hover:text-slate-900 dark:hover:text-white font-bold text-lg`}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewOrder} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                  Table / Ticket ID
                </label>
                <input 
                  type="text" 
                  value={newTable}
                  onChange={(e) => setNewTable(e.target.value)}
                  placeholder="e.g. Table 18 or Takeaway"
                  required
                  className={`w-full p-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-[#00714d] outline-none ${
                    darkMode ? 'bg-[#211f24] border-[#494551] text-white' : 'bg-slate-50 border-slate-320 text-slate-900'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                    Host Server
                  </label>
                  <select 
                    value={newServer}
                    onChange={(e) => setNewServer(e.target.value)}
                    className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#00714d] ${
                      darkMode ? 'bg-[#211f24] border-[#494551] text-white' : 'bg-slate-50 border-slate-320 text-slate-900'
                    }`}
                  >
                    <option value="Julian V.">Julian V.</option>
                    <option value="Maria G.">Maria G.</option>
                    <option value="S. Richards">S. Richards</option>
                    <option value="Chef Alexander">Chef Alexander</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                    Dish Items Count
                  </label>
                  <input 
                    type="number" 
                    value={newItemsCount}
                    onChange={(e) => setNewItemsCount(Number(e.target.value))}
                    min={1}
                    required
                    className={`w-full p-2.5 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-[#00714d] ${
                      darkMode ? 'bg-[#211f24] border-[#494551] text-white' : 'bg-slate-50 border-slate-320 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                  Dish Titles Detail
                </label>
                <input 
                  type="text" 
                  value={newItemsDetail}
                  onChange={(e) => setNewItemsDetail(e.target.value)}
                  placeholder="e.g. Signature Steak, Truffle Pasta"
                  className={`w-full p-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-[#00714d] outline-none ${
                    darkMode ? 'bg-[#211f24] border-[#494551] text-white' : 'bg-slate-50 border-slate-320 text-slate-900'
                  }`}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider mb-2 text-slate-400">
                  Estimated Bill Cost ($)
                </label>
                <input 
                  type="number" 
                  step="0.01"
                  value={newTotal}
                  onChange={(e) => setNewTotal(Number(e.target.value))}
                  required
                  className={`w-full p-2.5 rounded-lg border text-sm focus:ring-2 focus:ring-[#00714d] outline-none ${
                    darkMode ? 'bg-[#211f24] border-[#494551] text-white' : 'bg-slate-50 border-slate-320 text-slate-900'
                  }`}
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className={`flex-1 py-3 text-center text-xs font-bold rounded-lg border uppercase tracking-wider hover:bg-slate-50 dark:hover:bg-slate-800 ${
                    darkMode ? 'border-[#494551] text-white' : 'border-slate-300 text-slate-700'
                  }`}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={`flex-1 py-3 text-center text-xs font-bold rounded-lg uppercase tracking-wider text-white bg-[#006c49] hover:bg-[#005236] transition-colors`}
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
