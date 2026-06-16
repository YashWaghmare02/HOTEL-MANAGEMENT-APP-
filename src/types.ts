export type TabType = 'dashboard' | 'orders' | 'inventory' | 'reports';

export interface Order {
  id: string; // e.g. #8842
  table: string; // e.g. Table 14 or Takeaway
  status: 'Preparing' | 'Served' | 'Completed';
  server: string;
  itemsCount: number;
  elapsedTime: string; // e.g. 12m elapsed
  total: number; // e.g. 142.50
  elapsedMinutes: number; // for sorting/time logic
  itemsDetail?: string; // e.g. "Signature Steak, Truffle Pasta"
}

export interface RecentClosure {
  timeClosed: string; // e.g. 20:45
  id: string; // e.g. #8835
  server: string;
  method: 'Amex' | 'Cash' | 'Visa';
  total: number;
}

export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  category: 'Produce' | 'Meat' | 'Dairy' | 'Dry Goods';
  stock: number;
  unit: string; // e.g. "kg", "units", "doz"
  description: string; // e.g. "Grade A5 - 10kg Packs"
  threshold: number;
  value: number; // estimated value
  status: 'Critical' | 'Low Stock' | 'Optimal';
  imageUrl: string;
}

export interface DishPerformance {
  name: string;
  ordersToday: number;
  revenueGenerated: number;
  imageUrlLight: string;
  imageUrlDark: string;
  rank: number;
}

export interface LowStockAlert {
  item: string;
  description: string;
  inStock: string;
  threshold: string;
  status: 'Critical' | 'Low Stock';
  actionLabel: string;
}
