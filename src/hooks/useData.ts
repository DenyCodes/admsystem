import { useState, useEffect, useCallback } from 'react';
import { User, Order, Commission, DashboardStats, ApiResponse } from '@/types';

// Simulated delay to mimic API behavior
const simulateDelay = (ms: number = 800) => new Promise(resolve => setTimeout(resolve, ms));

// Simulate random errors (10% chance)
const shouldSimulateError = () => Math.random() < 0.1;

// Local storage for persisting changes
const USERS_STORAGE_KEY = 'admin_users';
const ORDERS_STORAGE_KEY = 'admin_orders';
const COMMISSIONS_STORAGE_KEY = 'admin_commissions';

const getStoredData = <T>(key: string, fallback: T | null): T | null => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const setStoredData = <T>(key: string, data: T) => {
  localStorage.setItem(key, JSON.stringify(data));
};

// Fetch JSON data simulating API calls
const fetchJsonData = async <T>(path: string): Promise<T> => {
  await simulateDelay();
  
  if (shouldSimulateError()) {
    throw new Error(`Falha ao carregar dados de ${path}. Tente novamente.`);
  }
  
  const response = await fetch(path);
  
  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }
  
  return response.json();
};

// Initialize data from localStorage or fetch from JSON files
const getInitialUsers = async (): Promise<User[]> => {
  const stored = getStoredData<User[]>(USERS_STORAGE_KEY, null);
  if (stored) return stored;
  
  const data = await fetchJsonData<User[]>('/data/users.json');
  return data;
};

const getInitialOrders = async (): Promise<Order[]> => {
  const stored = getStoredData<Order[]>(ORDERS_STORAGE_KEY, null);
  if (stored) return stored;
  
  const data = await fetchJsonData<Order[]>('/data/orders.json');
  return data;
};

const getInitialCommissions = async (): Promise<Commission[]> => {
  const stored = getStoredData<Commission[]>(COMMISSIONS_STORAGE_KEY, null);
  if (stored) return stored;
  
  const data = await fetchJsonData<Commission[]>('/data/commissions.json');
  return data;
};

// Cache for synchronous access
let usersCache: User[] | null = null;
let ordersCache: Order[] | null = null;
let commissionsCache: Commission[] | null = null;

// Users Hook
export function useUsers() {
  const [data, setData] = useState<User[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const users = await getInitialUsers();
      usersCache = users;
      setData(users);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUser = useCallback(async (userId: string, updates: Partial<User>) => {
    const users = await getInitialUsers();
    const updatedUsers = users.map(user => 
      user.id === userId ? { ...user, ...updates } : user
    );
    setStoredData(USERS_STORAGE_KEY, updatedUsers);
    usersCache = updatedUsers;
    setData(updatedUsers);
    return updatedUsers.find(u => u.id === userId);
  }, []);

  const toggleUserStatus = useCallback(async (userId: string) => {
    const users = await getInitialUsers();
    const user = users.find(u => u.id === userId);
    if (user) {
      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      return updateUser(userId, { status: newStatus });
    }
  }, [updateUser]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { data, loading, error, refetch: fetchUsers, updateUser, toggleUserStatus };
}

// Single User Hook
export function useUser(userId: string) {
  const [data, setData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await simulateDelay(500);
      const users = await getInitialUsers();
      const user = users.find(u => u.id === userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }
      setData(user);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { data, loading, error, refetch: fetchUser };
}

// Orders Hook
export function useOrders() {
  const [data, setData] = useState<Order[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const orders = await getInitialOrders();
      ordersCache = orders;
      setData(orders);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrder = useCallback(async (orderId: string, updates: Partial<Order>) => {
    const orders = await getInitialOrders();
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, ...updates } : order
    );
    setStoredData(ORDERS_STORAGE_KEY, updatedOrders);
    ordersCache = updatedOrders;
    setData(updatedOrders);
    return updatedOrders.find(o => o.id === orderId);
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return { data, loading, error, refetch: fetchOrders, updateOrder };
}

// Single Order Hook
export function useOrder(orderId: string) {
  const [data, setData] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrder = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await simulateDelay(500);
      const orders = await getInitialOrders();
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        throw new Error('Pedido não encontrado');
      }
      setData(order);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  return { data, loading, error, refetch: fetchOrder };
}

// Commissions Hook
export function useCommissions() {
  const [data, setData] = useState<Commission[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const commissions = await getInitialCommissions();
      commissionsCache = commissions;
      setData(commissions);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCommissions();
  }, [fetchCommissions]);

  return { data, loading, error, refetch: fetchCommissions };
}

// Dashboard Stats Hook
export function useDashboardStats() {
  const [data, setData] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await simulateDelay(600);
      
      const [users, orders, commissions] = await Promise.all([
        getInitialUsers(),
        getInitialOrders(),
        getInitialCommissions(),
      ]);

      const stats: DashboardStats = {
        totalUsers: users.length,
        activeUsers: users.filter(u => u.status === 'active').length,
        totalOrders: orders.length,
        totalOrderValue: orders.reduce((sum, order) => sum + order.total, 0),
        totalCommissions: commissions.reduce((sum, comm) => sum + comm.amount, 0),
      };

      setData(stats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return { data, loading, error, refetch: fetchStats };
}

// Helper to get user by ID (synchronous - uses cache)
export function getUserById(userId: string): User | undefined {
  if (!usersCache) {
    const stored = getStoredData<User[]>(USERS_STORAGE_KEY, null);
    if (stored) {
      usersCache = stored;
    }
  }
  return usersCache?.find(u => u.id === userId);
}

// Helper to get order by ID (synchronous - uses cache)
export function getOrderById(orderId: string): Order | undefined {
  if (!ordersCache) {
    const stored = getStoredData<Order[]>(ORDERS_STORAGE_KEY, null);
    if (stored) {
      ordersCache = stored;
    }
  }
  return ordersCache?.find(o => o.id === orderId);
}
