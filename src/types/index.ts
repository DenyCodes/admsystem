// User Types
export type UserRole = 'admin' | 'manager' | 'seller' | 'customer';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  country: string;
  status: UserStatus;
  createdAt: string;
  avatar?: string;
}

// Order Types
export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  total: number;
  createdAt: string;
}

// Commission Types
export type CommissionStatus = 'pending' | 'paid';

export interface Commission {
  id: string;
  userId: string;
  orderId: string;
  amount: number;
  rate: number;
  status: CommissionStatus;
  createdAt: string;
}

// Dashboard Stats
export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalOrders: number;
  totalOrderValue: number;
  totalCommissions: number;
}

// API Response Types
export interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}
