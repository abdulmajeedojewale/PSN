import { Product } from '../types';

const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('psn_admin_token');
};

export const setAuthToken = (token: string | null) => {
  if (token) {
    localStorage.setItem('psn_admin_token', token);
  } else {
    localStorage.removeItem('psn_admin_token');
  }
};

const getHeaders = (isFormData: boolean = false): HeadersInit => {
  const headers: Record<string, string> = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  const token = getAuthToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const api = {
  // Auth
  async login(email: string, password: string) {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to authenticate');
    if (data.token) {
      setAuthToken(data.token);
    }
    return data;
  },

  async getMe() {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Not authenticated');
    return res.json();
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const res = await fetch(`${API_BASE}/auth/change-password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ currentPassword, newPassword })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update password');
    return data;
  },

  async getUsers() {
    const res = await fetch(`${API_BASE}/auth/users`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load staff users');
    return data;
  },

  async createUser(userData: any) {
    const res = await fetch(`${API_BASE}/auth/users`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create user');
    return data;
  },

  // Products
  async getProducts(options: { includeDrafts?: boolean; category?: string; search?: string } = {}) {
    const params = new URLSearchParams();
    if (options.includeDrafts) params.append('includeDrafts', 'true');
    if (options.category && options.category !== 'all') params.append('category', options.category);
    if (options.search) params.append('search', options.search);

    const res = await fetch(`${API_BASE}/products?${params.toString()}`, {
      headers: getHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json() as Promise<Product[]>;
  },

  async getProduct(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error('Product not found');
    return res.json() as Promise<Product>;
  },

  async createProduct(productData: Partial<Product>) {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create product');
    return data as Product;
  },

  async updateProduct(id: string, updates: Partial<Product>) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update product');
    return data as Product;
  },

  async updateStock(id: string, stockCount: number, reason?: string) {
    const res = await fetch(`${API_BASE}/products/${id}/stock`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ stockCount, reason })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update stock');
    return data as Product;
  },

  async togglePublish(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}/publish`, {
      method: 'PATCH',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle publication');
    return data as Product;
  },

  async deleteProduct(id: string) {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete product');
    return data;
  },

  // Categories
  async getCategories() {
    const res = await fetch(`${API_BASE}/categories`);
    if (!res.ok) throw new Error('Failed to load categories');
    return res.json();
  },

  async saveCategory(categoryData: any) {
    const isUpdate = !!categoryData.id;
    const url = isUpdate ? `${API_BASE}/categories/${categoryData.id}` : `${API_BASE}/categories`;
    const res = await fetch(url, {
      method: isUpdate ? 'PUT' : 'POST',
      headers: getHeaders(),
      body: JSON.stringify(categoryData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to save category');
    return data;
  },

  async deleteCategory(id: string) {
    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: 'DELETE',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete category');
    return data;
  },

  // Orders
  async createOrder(orderData: any) {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(orderData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to place order');
    return data;
  },

  async getOrders(options: { status?: string; search?: string } = {}) {
    const params = new URLSearchParams();
    if (options.status) params.append('status', options.status);
    if (options.search) params.append('search', options.search);

    const res = await fetch(`${API_BASE}/orders?${params.toString()}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to fetch orders');
    return data;
  },

  async getOrder(id: string) {
    const res = await fetch(`${API_BASE}/orders/${id}`, {
      headers: getHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Order not found');
    return data;
  },

  async updateOrderStatus(id: string, orderStatus: string, paymentStatus?: string, notes?: string) {
    const res = await fetch(`${API_BASE}/orders/${id}/status`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify({ orderStatus, paymentStatus, notes })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update order status');
    return data;
  },

  // Inventory
  async getInventoryLogs(limit?: number) {
    const url = limit ? `${API_BASE}/inventory/logs?limit=${limit}` : `${API_BASE}/inventory/logs`;
    const res = await fetch(url, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load inventory logs');
    return data;
  },

  async getInventoryAlerts() {
    const res = await fetch(`${API_BASE}/inventory/alerts`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load inventory alerts');
    return data;
  },

  // Settings
  async getSettings() {
    const res = await fetch(`${API_BASE}/settings`);
    if (!res.ok) throw new Error('Failed to load settings');
    return res.json();
  },

  async updateHomepageSettings(data: any) {
    const res = await fetch(`${API_BASE}/settings/homepage`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to update homepage settings');
    return resData;
  },

  async updateBrandingSettings(data: any) {
    const res = await fetch(`${API_BASE}/settings/branding`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to update branding');
    return resData;
  },

  async updateCompanySettings(data: any) {
    const res = await fetch(`${API_BASE}/settings/company`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to update company settings');
    return resData;
  },

  async updateSocialSettings(data: any) {
    const res = await fetch(`${API_BASE}/settings/social`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });
    const resData = await res.json();
    if (!res.ok) throw new Error(resData.error || 'Failed to update social links');
    return resData;
  },

  // Image Upload
  async uploadImage(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: getHeaders(true),
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Image upload failed');
    return data as { success: boolean; url: string; filename: string; originalName: string; size: number };
  },

  // Activity & Analytics
  async logActivity(type: string, metadata: any = {}) {
    try {
      await fetch(`${API_BASE}/activity`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, metadata })
      });
    } catch {
      // Non-blocking
    }
  },

  async getAnalytics() {
    const res = await fetch(`${API_BASE}/analytics`, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load analytics');
    return data;
  },

  async getAuditLogs(limit?: number) {
    const url = limit ? `${API_BASE}/audit-logs?limit=${limit}` : `${API_BASE}/audit-logs`;
    const res = await fetch(url, { headers: getHeaders() });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load audit logs');
    return data;
  }
};
