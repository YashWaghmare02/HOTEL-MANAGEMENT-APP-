import React, { useState } from 'react';
import { TabType, Order, InventoryItem, RecentClosure } from './types';
import Navbar from './components/Navbar';
import DashboardView from './components/DashboardView';
import OrdersView from './components/OrdersView';
import InventoryView from './components/InventoryView';
import ReportsView from './components/ReportsView';

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType>('dashboard');
  const [darkMode, setDarkMode] = useState<boolean>(true); // default to dark executive mode

  // Kitchen Inventory State
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([
    { 
      id: '1', 
      name: 'Premium Wagyu Beef', 
      sku: 'MEAT-0042', 
      category: 'Meat', 
      stock: 4.2, 
      unit: 'kg', 
      description: 'Grade A5 - 10kg Packs', 
      threshold: 25.0, 
      value: 840.00, 
      status: 'Critical', 
      imageUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=120&auto=format&fit=crop' 
    },
    { 
      id: '2', 
      name: 'Truffle Oil Infusion', 
      sku: 'DRY-0094', 
      category: 'Dry Goods', 
      stock: 1, 
      unit: 'unit', 
      description: 'White Truffle Infused - 500ml', 
      threshold: 3, 
      value: 220.00, 
      status: 'Critical', 
      imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=120&auto=format&fit=crop' 
    },
    { 
      id: '3', 
      name: 'Heavy Whipping Cream', 
      sku: 'DAIRY-0125', 
      category: 'Dairy', 
      stock: 8, 
      unit: 'units', 
      description: 'Organic Dairy - 1L', 
      threshold: 10, 
      value: 32.00, 
      status: 'Low Stock', 
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=120&auto=format&fit=crop' 
    },
    { 
      id: '4', 
      name: 'Farm-Fresh Organic Eggs', 
      sku: 'DAIRY-0114', 
      category: 'Dairy', 
      stock: 45, 
      unit: 'doz', 
      description: 'Cage-Free Pasture Raised', 
      threshold: 20, 
      value: 135.00, 
      status: 'Optimal', 
      imageUrl: 'https://images.unsplash.com/photo-1506976785307-8732e854ad03?w=120&auto=format&fit=crop' 
    },
    { 
      id: '5', 
      name: 'Organic Avocados', 
      sku: 'PROD-0012', 
      category: 'Produce', 
      stock: 55, 
      unit: 'units', 
      description: 'Hass Premium - Grade A', 
      threshold: 15, 
      value: 165.00, 
      status: 'Optimal', 
      imageUrl: 'https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?w=120&auto=format&fit=crop' 
    },
    { 
      id: '6', 
      name: 'Fresh Asparagus', 
      sku: 'PROD-0041', 
      category: 'Produce', 
      stock: 3.5, 
      unit: 'kg', 
      description: 'Hydroponic Tender Tips', 
      threshold: 5.0, 
      value: 42.00, 
      status: 'Low Stock', 
      imageUrl: 'https://images.unsplash.com/photo-1515471204579-247ab08422aa?w=120&auto=format&fit=crop' 
    }
  ]);

  // Customer Orders State
  const [orders, setOrders] = useState<Order[]>([
    { id: '#8842', table: 'Table 14', status: 'Preparing', server: 'Julian V.', itemsCount: 4, elapsedTime: '12m elapsed', elapsedMinutes: 12, total: 142.50, itemsDetail: 'Premium Wagyu Beef, Signature Steak' },
    { id: '#8843', table: 'Takeaway', status: 'Preparing', server: 'S. Richards', itemsCount: 2, elapsedTime: '3m elapsed', elapsedMinutes: 3, total: 44.50, itemsDetail: 'Burrata Salad, Diet Coke' },
    { id: '#8844', table: 'Table 02', status: 'Served', server: 'Julian V.', itemsCount: 5, elapsedTime: '32m elapsed', elapsedMinutes: 32, total: 212.00, itemsDetail: 'Truffle Pasta, Glass of Barolo' },
    { id: '#8845', table: 'Table 22', status: 'Served', server: 'Maria G.', itemsCount: 3, elapsedTime: '18m elapsed', elapsedMinutes: 18, total: 89.00, itemsDetail: 'Burrata Salad, Truffle Pasta' },
    { id: '#8846', table: 'Table 05', status: 'Preparing', server: 'S. Richards', itemsCount: 2, elapsedTime: '9m elapsed', elapsedMinutes: 9, total: 115.50, itemsDetail: 'Lobster Tail, White Wine' },
    { id: '#8847', table: 'Table 09', status: 'Completed', server: 'Julian V.', itemsCount: 7, elapsedTime: '45m elapsed', elapsedMinutes: 45, total: 310.20, itemsDetail: 'Chef Selection Premium Wagyu' }
  ]);

  // Settled recent closure tickets
  const [recentClosures, setRecentClosures] = useState<RecentClosure[]>([
    { timeClosed: '10:45', id: '#8835', server: 'Julian V.', method: 'Amex', total: 142.50 },
    { timeClosed: '10:12', id: '#8834', server: 'Maria G.', method: 'Cash', total: 64.00 },
    { timeClosed: '09:55', id: '#8832', server: 'S. Richards', method: 'Visa', total: 188.00 },
  ]);

  // Derived dashboard statistics
  const activeOrdersCount = orders.filter(o => o.status !== 'Completed').length;
  
  // Dynamic summation of today's totals
  const revenueTodaySum = recentClosures.reduce((acc, curr) => acc + curr.total, 0) + 
    orders.filter(o => o.status === 'Completed').reduce((acc, curr) => acc + curr.total, 0) + 
    4104.25; // Base static revenue from screenshot metadata

  const netProfitTodaySum = (revenueTodaySum * 0.43); // 43% target high margin scaling

  const totalStockValuation = inventoryItems.reduce((acc, curr) => acc + curr.value, 0);

  // Toggle dark class on host body
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    const bodyClass = document.body.classList;
    if (darkMode) {
      bodyClass.remove('dark');
      bodyClass.add('light');
    } else {
      bodyClass.remove('light');
      bodyClass.add('dark');
    }
  };

  // Helper helper to update state status
  const recalculateStatus = (stock: number, threshold: number): 'Critical' | 'Low Stock' | 'Optimal' => {
    if (stock <= threshold * 0.3) return 'Critical';
    if (stock <= threshold) return 'Low Stock';
    return 'Optimal';
  };

  // INTERACTIVE ACTION: Reorders safety stocks
  const handleReorderItemStock = (sku: string, amount: number) => {
    setInventoryItems(prev => prev.map(item => {
      if (item.sku === sku) {
        const nextStock = item.stock + amount;
        const nextStatus = recalculateStatus(nextStock, item.threshold);
        return {
          ...item,
          stock: nextStock,
          status: nextStatus,
          value: item.value * 1.5 // approximate dynamic value rise
        };
      }
      return item;
    }));
  };

  // INTERACTIVE ACTION: Directly increments item stock level
  const handleUpdateStockCount = (sku: string, newStock: number) => {
    setInventoryItems(prev => prev.map(item => {
      if (item.sku === sku) {
        const nextStatus = recalculateStatus(newStock, item.threshold);
        return {
          ...item,
          stock: newStock,
          status: nextStatus,
          value: (newStock / (item.threshold || 1)) * 120 // realistic value calculation
        };
      }
      return item;
    }));
  };

  // INTERACTIVE ACTION: Adds a new inventory stock item
  const handleAddInventoryItem = (newItem: Omit<InventoryItem, 'id' | 'status'>) => {
    const calculatedStatus = recalculateStatus(newItem.stock, newItem.threshold);
    const itemWithId: InventoryItem = {
      ...newItem,
      id: String(inventoryItems.length + 1),
      status: calculatedStatus
    };
    setInventoryItems(prev => [...prev, itemWithId]);
  };

  // INTERACTIVE ACTION: Dispatches a new customer ticket
  const handleAddGuestOrder = (newOrder: Omit<Order, 'id' | 'elapsedTime' | 'elapsedMinutes'>) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const randomId = `#${randomNum}`;
    const mappedOrder: Order = {
      ...newOrder,
      id: randomId,
      elapsedTime: '1m elapsed',
      elapsedMinutes: 1
    };
    setOrders(prev => [mappedOrder, ...prev]);
  };

  // INTERACTIVE ACTION: Advances table order statuses
  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === id) {
        return { ...o, status };
      }
      return o;
    }));
  };

  // INTERACTIVE ACTION: Closes and archives payments
  const handleCloseAndArchiveOrder = (id: string, paymentMethod: 'Amex' | 'Cash' | 'Visa') => {
    const target = orders.find(o => o.id === id);
    if (!target) return;

    // Remove from active list
    setOrders(prev => prev.filter(o => o.id !== id));

    // Archive inside the closures ledger
    const now = new Date();
    const formattedTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const archivedTicket: RecentClosure = {
      timeClosed: formattedTime,
      id: target.id,
      server: target.server,
      method: paymentMethod,
      total: target.total
    };
    setRecentClosures(prev => [archivedTicket, ...prev]);
  };

  return (
    <div className={`min-h-screen pb-24 transition-colors duration-200 ${
      darkMode ? 'bg-[#141218] text-[#cbc4d2] dark' : 'bg-[#f8f9ff] text-[#0b1c30]'
    }`}>
      {/* Universal Luxe Navigation Header */}
      <Navbar 
        currentTab={currentTab} 
        onTabChange={setCurrentTab} 
        darkMode={darkMode} 
        onToggleDarkMode={toggleDarkMode} 
      />

      {/* Main Responsive View Container Frame */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {currentTab === 'dashboard' && (
          <DashboardView 
            inventoryItems={inventoryItems}
            ordersCount={activeOrdersCount}
            revenueToday={revenueTodaySum}
            netProfitToday={netProfitTodaySum}
            customersCount={112} // Premium static scale
            onReorderItem={handleReorderItemStock}
            onNavigate={setCurrentTab}
            darkMode={darkMode}
          />
        )}

        {currentTab === 'orders' && (
          <OrdersView 
            orders={orders}
            recentClosures={recentClosures}
            onAddOrder={handleAddGuestOrder}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            onCloseOrder={handleCloseAndArchiveOrder}
            darkMode={darkMode}
          />
        )}

        {currentTab === 'inventory' && (
          <InventoryView 
            items={inventoryItems}
            totalStockValue={totalStockValuation}
            onAddItem={handleAddInventoryItem}
            onUpdateStock={handleUpdateStockCount}
            darkMode={darkMode}
          />
        )}

        {currentTab === 'reports' && (
          <ReportsView 
            darkMode={darkMode}
          />
        )}

      </main>
    </div>
  );
}

