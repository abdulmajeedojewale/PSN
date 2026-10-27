import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  Layers, 
  ShoppingCart, 
  Boxes, 
  Home, 
  Image as ImageIcon, 
  Building2, 
  Share2, 
  Megaphone, 
  Users, 
  FileText, 
  Shield, 
  LogOut, 
  ExternalLink, 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  X, 
  Upload, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Filter, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Copy, 
  Save, 
  Lock,
  ArrowRight
} from 'lucide-react';
import { 
  Product, 
  Category, 
  Order, 
  SiteSettings, 
  AdminUser, 
  AuditLog, 
  InventoryLog, 
  AnalyticsSummary 
} from '../types';
import { api } from '../services/api';

interface AdminDashboardProps {
  currentUser: AdminUser;
  onLogout: () => void;
  onClose: () => void;
  onRefreshPublicData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onLogout,
  onClose,
  onRefreshPublicData,
}) => {
  // Active Sidebar Tab (1-13)
  const [activeTab, setActiveTab] = useState<string>('overview');

  // Core Data States from API
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [inventoryLogs, setInventoryLogs] = useState<InventoryLog[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [staffUsers, setStaffUsers] = useState<AdminUser[]>([]);

  // UI & Loading States
  const [loading, setLoading] = useState(true);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Modals inside Admin
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  // Filters
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  const showSuccess = (msg: string) => {
    setActionSuccess(msg);
    setTimeout(() => setActionSuccess(null), 3500);
  };

  const showError = (msg: string) => {
    setActionError(msg);
    setTimeout(() => setActionError(null), 5000);
  };

  // Load all initial admin data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [prods, cats, ords, setts, logs, audits, stats] = await Promise.all([
        api.getProducts({ includeDrafts: true }),
        api.getCategories(),
        api.getOrders(),
        api.getSettings(),
        api.getInventoryLogs(),
        api.getAuditLogs(),
        api.getAnalytics()
      ]);

      setProducts(prods);
      setCategories(cats);
      setOrders(ords);
      setSettings(setts);
      setInventoryLogs(logs);
      setAuditLogs(audits);
      setAnalytics(stats);

      if (currentUser.role === 'Administrator') {
        const users = await api.getUsers();
        setStaffUsers(users);
      }
    } catch (err: any) {
      showError(err.message || 'Failed to sync with backend database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Handle Image Upload for Product or Branding or Hero
  const handleFileUpload = async (file: File): Promise<string> => {
    setUploadingImage(true);
    try {
      const res = await api.uploadImage(file);
      showSuccess(`Image uploaded successfully: ${res.filename}`);
      return res.url;
    } catch (err: any) {
      showError(err.message || 'Image upload failed');
      throw err;
    } finally {
      setUploadingImage(false);
    }
  };

  // --- PRODUCT ACTIONS ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      if (isNewProduct) {
        const created = await api.createProduct(editingProduct);
        setProducts([created, ...products]);
        showSuccess(`Product "${created.name}" created and saved to database.`);
      } else {
        const updated = await api.updateProduct(editingProduct.id!, editingProduct);
        setProducts(products.map(p => p.id === updated.id ? updated : p));
        showSuccess(`Product "${updated.name}" updated successfully.`);
      }
      setEditingProduct(null);
      onRefreshPublicData();
    } catch (err: any) {
      showError(err.message || 'Failed to save product');
    }
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const updated = await api.togglePublish(id);
      setProducts(products.map(p => p.id === id ? updated : p));
      showSuccess(`Product publication status changed to: ${updated.isPublished ? 'Published' : 'Draft'}`);
      onRefreshPublicData();
    } catch (err: any) {
      showError(err.message || 'Failed to update publication');
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete product "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await api.deleteProduct(id);
      setProducts(products.filter(p => p.id !== id));
      showSuccess(`Product "${name}" deleted from catalogue.`);
      onRefreshPublicData();
    } catch (err: any) {
      showError(err.message || 'Failed to delete product');
    }
  };

  // --- INVENTORY ADJUSTMENT ---
  const handleStockAdjust = async (productId: string, newStock: number, reason: string) => {
    try {
      const updated = await api.updateStock(productId, newStock, reason);
      setProducts(products.map(p => p.id === productId ? updated : p));
      const newLogs = await api.getInventoryLogs();
      setInventoryLogs(newLogs);
      showSuccess(`Stock for "${updated.name}" updated to ${newStock} units.`);
      onRefreshPublicData();
    } catch (err: any) {
      showError(err.message || 'Failed to update stock');
    }
  };

  // --- ORDER STATUS ACTIONS ---
  const handleUpdateOrderStatus = async (orderId: string, status: string, paymentStatus?: string, notes?: string) => {
    try {
      const updated = await api.updateOrderStatus(orderId, status, paymentStatus, notes);
      setOrders(orders.map(o => o.id === orderId ? updated : o));
      if (viewingOrder && viewingOrder.id === orderId) {
        setViewingOrder(updated);
      }
      showSuccess(`Order #${orderId} marked as ${status}.`);
      onRefreshPublicData();
    } catch (err: any) {
      showError(err.message || 'Failed to update order');
    }
  };

  // --- SETTINGS ACTIONS ---
  const handleSaveHomepage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.updateHomepageSettings({
        hero: settings.hero,
        banners: settings.banners,
        sections: settings.sections
      });
      showSuccess('Homepage content & hero settings published successfully!');
      onRefreshPublicData();
    } catch (err: any) {
      showError(err.message || 'Failed to update homepage settings');
    }
  };

  const handleSaveBranding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.updateBrandingSettings(settings.branding);
      showSuccess('Brand logo & icon settings saved and updated across store!');
      onRefreshPublicData();
    } catch (err: any) {
      showError(err.message || 'Failed to update branding');
    }
  };

  const handleSaveCompany = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.updateCompanySettings(settings.company);
      showSuccess('Company information, addresses & phone numbers updated!');
      onRefreshPublicData();
    } catch (err: any) {
      showError(err.message || 'Failed to update company settings');
    }
  };

  const handleSaveSocial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.updateSocialSettings(settings.social);
      showSuccess('Social media and contact channels updated!');
      onRefreshPublicData();
    } catch (err: any) {
      showError(err.message || 'Failed to update social settings');
    }
  };

  // Nav Items definition (13 Sections)
  const navItems = [
    { id: 'overview', label: '1. Overview', icon: LayoutDashboard },
    { id: 'products', label: '2. Product Catalogue', icon: Package },
    { id: 'categories', label: '3. Categories', icon: Layers },
    { id: 'orders', label: '4. Orders & Alerts', icon: ShoppingCart },
    { id: 'inventory', label: '5. Inventory Control', icon: Boxes },
    { id: 'homepage', label: '6. Homepage Editor', icon: Home },
    { id: 'branding', label: '7. Branding & Logo', icon: ImageIcon },
    { id: 'company', label: '8. Company Info', icon: Building2 },
    { id: 'social', label: '9. Social & Channels', icon: Share2 },
    { id: 'promotions', label: '10. Banners & Promos', icon: Megaphone },
    { id: 'customers', label: '11. Customer Records', icon: Users },
    { id: 'reports', label: '12. Audit Logs', icon: FileText },
    { id: 'security', label: '13. Security & Staff', icon: Shield },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-100 flex flex-col overflow-hidden font-sans">
      
      {/* Top Admin Header Bar */}
      <header className="h-16 bg-psn-navy-900 border-b border-psn-navy-700 px-4 sm:px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <img 
            src={settings?.branding?.logoWhiteUrl || '/logo-white.svg'} 
            alt="PSN Admin" 
            className="h-8 w-auto object-contain"
            onError={(e) => { (e.target as HTMLImageElement).src = '/logo.svg'; }}
          />
          <span className="hidden sm:inline bg-amber-400 text-psn-navy-900 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded">
            Admin Portal
          </span>
        </div>

        {/* Global Notifications / Status Feedback */}
        {actionSuccess && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{actionSuccess}</span>
          </div>
        )}
        {actionError && (
          <div className="bg-red-500/20 border border-red-500/40 text-red-300 text-xs px-3.5 py-1.5 rounded-full flex items-center gap-1.5 animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span>{actionError}</span>
          </div>
        )}

        {/* User profile & Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              onClose();
              onRefreshPublicData();
            }}
            className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            title="View Live Store"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Storefront</span>
          </button>

          <div className="text-right hidden md:block">
            <div className="text-xs font-bold text-white">{currentUser.name}</div>
            <div className="text-[10px] text-amber-400 font-semibold">{currentUser.role}</div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 px-3 py-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors font-bold"
            title="Sign Out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar Navigation */}
        <aside className="w-64 bg-psn-navy-900/95 border-r border-psn-navy-700/80 flex flex-col shrink-0 overflow-y-auto">
          <div className="p-3 text-[11px] font-black uppercase text-slate-500 tracking-wider">
            Management Modules
          </div>
          <nav className="flex-1 px-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? 'bg-psn-blue text-white shadow-md font-bold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-psn-yellow' : 'text-slate-500'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-psn-navy-700/60 text-[11px] text-slate-500">
            <div>PSN Portal v2.0</div>
            <div className="text-slate-600">Unified Live Backend</div>
          </div>
        </aside>

        {/* Central Content Panel */}
        <main className="flex-1 overflow-y-auto bg-slate-900/70 p-4 sm:p-6 lg:p-8">
          
          {/* ==============================================================
              SECTION 1: OVERVIEW DASHBOARD
             ============================================================== */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">System Overview &amp; Health</h2>
                <p className="text-xs text-slate-400 mt-1">Live metrics from PSN production database</p>
              </div>

              {/* Stat Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
                  <div className="text-xs text-slate-400 font-medium">Published Products</div>
                  <div className="text-2xl font-black text-white mt-1">
                    {products.filter(p => p.isPublished !== false).length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {products.filter(p => p.isPublished === false).length} drafts
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
                  <div className="text-xs text-slate-400 font-medium">New / Pending Orders</div>
                  <div className="text-2xl font-black text-amber-400 mt-1">
                    {orders.filter(o => o.orderStatus === 'New' || o.orderStatus === 'Processing').length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">
                    {orders.length} total orders recorded
                  </div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
                  <div className="text-xs text-slate-400 font-medium">Gross Order Revenue</div>
                  <div className="text-2xl font-black text-emerald-400 mt-1">
                    ₦{orders.filter(o => o.orderStatus !== 'Cancelled').reduce((sum, o) => sum + (o.grandTotal || 0), 0).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">All time processed</div>
                </div>

                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
                  <div className="text-xs text-slate-400 font-medium">Low Stock Alerts</div>
                  <div className="text-2xl font-black text-red-400 mt-1">
                    {products.filter(p => p.stockCount <= 20).length}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1">Items below 20 units</div>
                </div>
              </div>

              {/* Conversion Funnel & Quick Orders */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Real-time Customer Activity Funnel */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-psn-blue" />
                    <span>Customer Conversion Funnel</span>
                  </h3>
                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Catalogue Product Views</span>
                        <span className="font-bold">{analytics?.funnel.productViews || 0}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-psn-blue w-full" />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Items Added to Cart</span>
                        <span className="font-bold">{analytics?.funnel.addedToCart || 0}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-400" style={{ width: '65%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Checkouts Initiated</span>
                        <span className="font-bold">{analytics?.funnel.checkoutStarted || 0}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-400" style={{ width: '45%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-slate-300 mb-1">
                        <span>Orders Successfully Completed</span>
                        <span className="font-bold text-emerald-400">{orders.length}</span>
                      </div>
                      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500" style={{ width: '35%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Orders Overview */}
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4 text-amber-400" />
                      <span>Recent Orders</span>
                    </h3>
                    <button 
                      onClick={() => setActiveTab('orders')}
                      className="text-xs text-psn-blue hover:underline"
                    >
                      View all →
                    </button>
                  </div>

                  <div className="divide-y divide-slate-700 max-h-60 overflow-y-auto">
                    {orders.slice(0, 5).map(o => (
                      <div key={o.id} className="py-2.5 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{o.customer.fullName}</div>
                          <div className="text-[11px] text-slate-400">#{o.id} • {o.customer.state}</div>
                        </div>
                        <div className="text-right">
                          <div className="font-black text-emerald-400">₦{o.grandTotal.toLocaleString()}</div>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            o.orderStatus === 'New' ? 'bg-amber-500/20 text-amber-300' :
                            o.orderStatus === 'Delivered' ? 'bg-emerald-500/20 text-emerald-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {o.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              SECTION 2: PRODUCT MANAGEMENT
             ============================================================== */}
          {activeTab === 'products' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Product Catalogue Management</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    Add, edit, upload product photos, update prices, and control published status.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsNewProduct(true);
                    setEditingProduct({
                      name: '',
                      sku: `PSN-${Math.floor(1000 + Math.random() * 9000)}`,
                      category: 'buckets-basins',
                      categoryLabel: 'Buckets & Basins',
                      retailPrice: 10000,
                      wholesalePrice: 8500,
                      cartonQty: 10,
                      wholesaleMinQty: 10,
                      stockCount: 100,
                      inStock: true,
                      isPublished: true,
                      description: '',
                      specs: {
                        material: 'Virgin High-Density Polyethylene (HDPE)',
                        capacity: '',
                        dimensions: '',
                        foodGrade: true,
                        uvResistant: true,
                        availableColors: ['#1E56A0', '#059669', '#0B192C']
                      },
                      features: ['100% Virgin Polymer', 'Heavy-duty crack proof'],
                      imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80'
                    });
                  }}
                  className="px-4 py-2.5 rounded-xl bg-psn-blue hover:bg-psn-blue-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shrink-0"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add New Product</span>
                </button>
              </div>

              {/* Filters Bar */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    placeholder="Search by name, SKU, or polymer material..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-psn-blue"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-300 text-xs rounded-xl px-3 py-2 focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Products Table */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800 text-slate-400 font-bold border-b border-slate-700 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="py-3 px-4">Product Details</th>
                        <th className="py-3 px-4">Category</th>
                        <th className="py-3 px-4">Retail Price</th>
                        <th className="py-3 px-4">Wholesale Rate</th>
                        <th className="py-3 px-4">Stock</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60">
                      {products
                        .filter(p => {
                          if (productCategoryFilter !== 'all' && p.category !== productCategoryFilter) return false;
                          if (productSearch) {
                            const q = productSearch.toLowerCase();
                            return p.name.toLowerCase().includes(q) || (p.sku && p.sku.toLowerCase().includes(q));
                          }
                          return true;
                        })
                        .map(p => (
                          <tr key={p.id} className="hover:bg-slate-700/30 transition-colors">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={p.imageUrl}
                                  alt={p.name}
                                  className="w-12 h-12 rounded-lg object-cover bg-slate-900 border border-slate-700 shrink-0"
                                />
                                <div className="min-w-0">
                                  <div className="font-bold text-white line-clamp-1">{p.name}</div>
                                  <div className="text-[11px] text-slate-400 font-mono">SKU: {p.sku || p.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-slate-300">
                              {p.categoryLabel}
                            </td>
                            <td className="py-3 px-4 font-extrabold text-white">
                              ₦{p.retailPrice.toLocaleString()}
                            </td>
                            <td className="py-3 px-4 text-amber-300 font-semibold">
                              ₦{p.wholesalePrice.toLocaleString()}
                              <span className="text-[10px] text-slate-400 block font-normal">Min: {p.wholesaleMinQty} pcs</span>
                            </td>
                            <td className="py-3 px-4">
                              <span className={`font-black ${p.stockCount <= 20 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {p.stockCount} pcs
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <button
                                onClick={() => handleTogglePublish(p.id)}
                                className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 ${
                                  p.isPublished !== false
                                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    : 'bg-slate-700 text-slate-400'
                                }`}
                              >
                                {p.isPublished !== false ? (
                                  <>
                                    <Eye className="w-3 h-3" /> Published
                                  </>
                                ) : (
                                  <>
                                    <EyeOff className="w-3 h-3" /> Draft
                                  </>
                                )}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => {
                                    setIsNewProduct(false);
                                    setEditingProduct(p);
                                  }}
                                  className="p-1.5 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200"
                                  title="Edit Product"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(p.id, p.name)}
                                  className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                                  title="Delete Product"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              SECTION 3: CATEGORY MANAGEMENT
             ============================================================== */}
          {activeTab === 'categories' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Category Management</h2>
                  <p className="text-xs text-slate-400 mt-1">Organize catalogue sections and homepage navigation</p>
                </div>
                <button
                  onClick={() => setEditingCategory({ id: '', label: '', icon: 'Layers', description: '', displayOrder: categories.length })}
                  className="px-4 py-2 rounded-xl bg-psn-blue hover:bg-psn-blue-600 text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Category</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((c) => (
                  <div key={c.id} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-mono text-slate-400">ID: {c.id}</span>
                        <span className="text-[10px] bg-slate-700 text-slate-300 px-2 py-0.5 rounded font-bold">
                          Order: {c.displayOrder}
                        </span>
                      </div>
                      <h4 className="font-bold text-white text-sm mb-1">{c.label}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{c.description}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-700 mt-3 flex justify-end gap-2">
                      <button
                        onClick={() => setEditingCategory(c)}
                        className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 text-xs font-semibold rounded-lg text-slate-200"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==============================================================
              SECTION 4: ORDERS & NOTIFICATIONS
             ============================================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-white">Orders &amp; Processing Notifications</h2>
                  <p className="text-xs text-slate-400 mt-1">Real-time orders placed by Nigerian customers</p>
                </div>

                <div className="flex gap-2">
                  {['all', 'New', 'Processing', 'Delivered', 'Cancelled'].map(st => (
                    <button
                      key={st}
                      onClick={() => setOrderStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        orderStatusFilter === st
                          ? 'bg-psn-blue text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {st === 'all' ? 'All Orders' : st}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {orders
                  .filter(o => orderStatusFilter === 'all' || o.orderStatus.toLowerCase() === orderStatusFilter.toLowerCase())
                  .map(o => (
                    <div key={o.id} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-black text-white text-sm">#{o.id}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-extrabold ${
                            o.orderStatus === 'New' ? 'bg-amber-500/20 text-amber-300' :
                            o.orderStatus === 'Delivered' ? 'bg-emerald-500/20 text-emerald-300' :
                            o.orderStatus === 'Cancelled' ? 'bg-red-500/20 text-red-300' :
                            'bg-blue-500/20 text-blue-300'
                          }`}>
                            {o.orderStatus}
                          </span>
                          <span className="text-[11px] text-slate-400">
                            {new Date(o.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <div className="text-xs text-slate-300">
                          <strong>Customer:</strong> {o.customer.fullName} ({o.customer.phone}) • {o.customer.city}, {o.customer.state}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">
                          {o.items.length} line items • Payment: {o.paymentMethod} ({o.paymentStatus})
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center">
                        <div className="text-right">
                          <div className="text-base font-black text-emerald-400">₦{o.grandTotal.toLocaleString()}</div>
                          <div className="text-[10px] text-slate-400">Delivery: {o.deliveryMethod}</div>
                        </div>

                        <button
                          onClick={() => setViewingOrder(o)}
                          className="px-3.5 py-2 rounded-xl bg-psn-blue hover:bg-psn-blue-600 text-white text-xs font-bold shadow-sm"
                        >
                          Review &amp; Update
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* ==============================================================
              SECTION 5: INVENTORY MANAGEMENT
             ============================================================== */}
          {activeTab === 'inventory' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Inventory Synchronization &amp; Audit</h2>
                <p className="text-xs text-slate-400 mt-1">Live stock levels, out-of-stock preventions &amp; movements log</p>
              </div>

              {/* Quick stock grid */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4">
                <h3 className="text-xs font-bold uppercase text-slate-400 mb-3">Adjust Stock Quantities</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {products.map(p => (
                    <div key={p.id} className="bg-slate-900/60 p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white line-clamp-1">{p.name}</div>
                        <div className="text-[11px] text-slate-400">Current: {p.stockCount} units</div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="number"
                          defaultValue={p.stockCount}
                          id={`stock-input-${p.id}`}
                          className="w-16 text-center text-xs p-1 bg-slate-800 border border-slate-600 rounded text-white font-bold"
                        />
                        <button
                          onClick={() => {
                            const input = document.getElementById(`stock-input-${p.id}`) as HTMLInputElement;
                            if (input) {
                              const val = parseInt(input.value);
                              handleStockAdjust(p.id, val, 'Administrative inventory adjustment');
                            }
                          }}
                          className="px-2 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-bold"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Inventory Movement Log Table */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="p-3.5 border-b border-slate-700 font-bold text-xs text-white">
                  Recent Stock Movements Log
                </div>
                <div className="max-h-72 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800 text-[10px] uppercase text-slate-400 font-bold">
                      <tr>
                        <th className="py-2.5 px-4">Date / Time</th>
                        <th className="py-2.5 px-4">Product</th>
                        <th className="py-2.5 px-4">Type</th>
                        <th className="py-2.5 px-4">Change</th>
                        <th className="py-2.5 px-4">New Balance</th>
                        <th className="py-2.5 px-4">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 text-[11px]">
                      {inventoryLogs.map(log => (
                        <tr key={log.id}>
                          <td className="py-2 px-4 text-slate-400">{new Date(log.timestamp).toLocaleString()}</td>
                          <td className="py-2 px-4 text-white font-semibold">{log.productName}</td>
                          <td className="py-2 px-4 text-slate-300">{log.type}</td>
                          <td className={`py-2 px-4 font-bold ${log.quantityChange < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                            {log.quantityChange > 0 ? `+${log.quantityChange}` : log.quantityChange}
                          </td>
                          <td className="py-2 px-4 text-white font-mono">{log.newStock}</td>
                          <td className="py-2 px-4 text-slate-400">{log.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              SECTION 6: HOMEPAGE EDITOR
             ============================================================== */}
          {activeTab === 'homepage' && settings && (
            <form onSubmit={handleSaveHomepage} className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Homepage Content Editor</h2>
                <p className="text-xs text-slate-400 mt-1">Control hero headlines, background imagery, and section toggles</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-psn-yellow uppercase">Hero Banner Configuration</h3>
                
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Main Headline</label>
                  <input
                    type="text"
                    value={settings.hero.headline}
                    onChange={(e) => setSettings({
                      ...settings,
                      hero: { ...settings.hero, headline: e.target.value }
                    })}
                    className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-psn-blue"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Highlight Word(s) in Gold</label>
                  <input
                    type="text"
                    value={settings.hero.highlightText || ''}
                    onChange={(e) => setSettings({
                      ...settings,
                      hero: { ...settings.hero, highlightText: e.target.value }
                    })}
                    placeholder="e.g. Never Crack"
                    className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-psn-blue"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Supporting Subheadline</label>
                  <textarea
                    rows={3}
                    value={settings.hero.subheadline}
                    onChange={(e) => setSettings({
                      ...settings,
                      hero: { ...settings.hero, subheadline: e.target.value }
                    })}
                    className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-psn-blue"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Primary Button Text</label>
                    <input
                      type="text"
                      value={settings.hero.ctaPrimaryText}
                      onChange={(e) => setSettings({
                        ...settings,
                        hero: { ...settings.hero, ctaPrimaryText: e.target.value }
                      })}
                      className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Secondary Button Text</label>
                    <input
                      type="text"
                      value={settings.hero.ctaSecondaryText}
                      onChange={(e) => setSettings({
                        ...settings,
                        hero: { ...settings.hero, ctaSecondaryText: e.target.value }
                      })}
                      className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>

                {/* Hero Promotional Banner Upload */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Hero Showcase Image</label>
                  <div className="flex items-center gap-4">
                    <img 
                      src={settings.hero.bannerImageUrl} 
                      alt="Hero banner" 
                      className="w-24 h-16 object-cover rounded-xl border border-slate-700"
                    />
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await handleFileUpload(file);
                            setSettings({
                              ...settings,
                              hero: { ...settings.hero, bannerImageUrl: url }
                            });
                          }
                        }}
                        className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-psn-blue file:text-white hover:file:bg-psn-blue-600"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-psn-blue hover:bg-psn-blue-600 text-white font-black text-xs shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Publish Homepage Changes</span>
              </button>
            </form>
          )}

          {/* ==============================================================
              SECTION 7: BRANDING & LOGO SETTINGS
             ============================================================== */}
          {activeTab === 'branding' && settings && (
            <form onSubmit={handleSaveBranding} className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Branding &amp; Logo Settings</h2>
                <p className="text-xs text-slate-400 mt-1">Upload primary logos, favicon, and adjust display scale</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-5">
                {/* Primary Logo */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Primary Brand Logo (Navbar)</label>
                  <div className="p-4 bg-white rounded-xl mb-2 flex items-center justify-center">
                    <img src={settings.branding.logoUrl} alt="Logo preview" style={{ height: `${settings.branding.logoHeight}px` }} />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleFileUpload(file);
                        setSettings({
                          ...settings,
                          branding: { ...settings.branding, logoUrl: url }
                        });
                      }
                    }}
                    className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-psn-blue file:text-white"
                  />
                </div>

                {/* White Logo */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">White Logo (Footer &amp; Dark Ribbons)</label>
                  <div className="p-4 bg-psn-navy-900 rounded-xl mb-2 flex items-center justify-center">
                    <img src={settings.branding.logoWhiteUrl} alt="White logo preview" style={{ height: `${settings.branding.logoHeight}px` }} />
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const url = await handleFileUpload(file);
                        setSettings({
                          ...settings,
                          branding: { ...settings.branding, logoWhiteUrl: url }
                        });
                      }
                    }}
                    className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-psn-blue file:text-white"
                  />
                </div>

                {/* Scale */}
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">
                    Logo Height Scale: {settings.branding.logoHeight}px
                  </label>
                  <input
                    type="range"
                    min="32"
                    max="64"
                    value={settings.branding.logoHeight}
                    onChange={(e) => setSettings({
                      ...settings,
                      branding: { ...settings.branding, logoHeight: parseInt(e.target.value) }
                    })}
                    className="w-full accent-psn-blue"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-psn-blue hover:bg-psn-blue-600 text-white font-black text-xs shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Branding Settings</span>
              </button>
            </form>
          )}

          {/* ==============================================================
              SECTION 8: COMPANY INFO
             ============================================================== */}
          {activeTab === 'company' && settings && (
            <form onSubmit={handleSaveCompany} className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Company Information &amp; Contacts</h2>
                <p className="text-xs text-slate-400 mt-1">Official addresses, telephone lines, and customer service details</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Official Enterprise Name</label>
                    <input
                      type="text"
                      value={settings.company.officialName}
                      onChange={(e) => setSettings({
                        ...settings,
                        company: { ...settings.company, officialName: e.target.value }
                      })}
                      className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Customer Support Email</label>
                    <input
                      type="email"
                      value={settings.company.supportEmail}
                      onChange={(e) => setSettings({
                        ...settings,
                        company: { ...settings.company, supportEmail: e.target.value }
                      })}
                      className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Primary Phone</label>
                    <input
                      type="text"
                      value={settings.company.primaryPhone}
                      onChange={(e) => setSettings({
                        ...settings,
                        company: { ...settings.company, primaryPhone: e.target.value }
                      })}
                      className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Secondary Phone</label>
                    <input
                      type="text"
                      value={settings.company.secondaryPhone}
                      onChange={(e) => setSettings({
                        ...settings,
                        company: { ...settings.company, secondaryPhone: e.target.value }
                      })}
                      className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">WhatsApp Hotline Number</label>
                    <input
                      type="text"
                      value={settings.company.whatsappNumber}
                      onChange={(e) => setSettings({
                        ...settings,
                        company: { ...settings.company, whatsappNumber: e.target.value }
                      })}
                      className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Opening Hours</label>
                  <input
                    type="text"
                    value={settings.company.openingHours}
                    onChange={(e) => setSettings({
                      ...settings,
                      company: { ...settings.company, openingHours: e.target.value }
                    })}
                    className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-psn-blue hover:bg-psn-blue-600 text-white font-black text-xs shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Company Details</span>
              </button>
            </form>
          )}

          {/* ==============================================================
              SECTION 9: SOCIAL MEDIA CHANNELS
             ============================================================== */}
          {activeTab === 'social' && settings && (
            <form onSubmit={handleSaveSocial} className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Social Media &amp; Communication Channels</h2>
                <p className="text-xs text-slate-400 mt-1">Configure verified links that appear in header and footer</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
                {Object.entries(settings.social).map(([key, item]) => (
                  <div key={key} className="flex items-center gap-3">
                    <span className="w-28 text-xs font-bold text-slate-300 capitalize">{key}:</span>
                    <input
                      type="text"
                      value={item.url}
                      onChange={(e) => setSettings({
                        ...settings,
                        social: {
                          ...settings.social,
                          [key]: { ...item, url: e.target.value }
                        }
                      })}
                      className="flex-1 text-xs p-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                    />
                    <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={item.enabled}
                        onChange={(e) => setSettings({
                          ...settings,
                          social: {
                            ...settings.social,
                            [key]: { ...item, enabled: e.target.checked }
                          }
                        })}
                        className="rounded"
                      />
                      <span>Active</span>
                    </label>
                  </div>
                ))}
              </div>

              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-psn-blue hover:bg-psn-blue-600 text-white font-black text-xs shadow-lg flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>Save Social Channels</span>
              </button>
            </form>
          )}

          {/* ==============================================================
              SECTION 10: PROMOTIONS & BANNERS
             ============================================================== */}
          {activeTab === 'promotions' && settings && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Promotional Banners &amp; Clearance Campaigns</h2>
                <p className="text-xs text-slate-400 mt-1">Manage wholesale promo banners displayed on the storefront</p>
              </div>

              <div className="space-y-4">
                {settings.banners.map((b, idx) => (
                  <div key={b.id || idx} className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 flex flex-col sm:flex-row gap-4 items-center">
                    <img src={b.imageUrl} alt={b.headline} className="w-32 h-20 object-cover rounded-xl border border-slate-700 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] bg-amber-400 text-psn-navy-900 font-black px-2 py-0.5 rounded uppercase">
                        {b.badge}
                      </span>
                      <h4 className="text-sm font-bold text-white mt-1">{b.headline}</h4>
                      <p className="text-xs text-slate-400">{b.subheadline}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-full">
                      Active
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ==============================================================
              SECTION 11: CUSTOMER MANAGEMENT
             ============================================================== */}
          {activeTab === 'customers' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Customer Records &amp; Directory</h2>
                <p className="text-xs text-slate-400 mt-1">Customers who have placed orders across Nigeria</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-800 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-700">
                    <tr>
                      <th className="py-3 px-4">Customer Name</th>
                      <th className="py-3 px-4">Phone / WhatsApp</th>
                      <th className="py-3 px-4">Location</th>
                      <th className="py-3 px-4">Orders Placed</th>
                      <th className="py-3 px-4">Total Value</th>
                      <th className="py-3 px-4 text-right">Quick Contact</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/60">
                    {Array.from(new Set(orders.map(o => o.customer.phone))).map(phone => {
                      const customerOrders = orders.filter(o => o.customer.phone === phone);
                      const customer = customerOrders[0].customer;
                      const totalSpent = customerOrders.reduce((sum, o) => sum + o.grandTotal, 0);

                      return (
                        <tr key={phone} className="hover:bg-slate-700/20">
                          <td className="py-3 px-4 font-bold text-white">{customer.fullName}</td>
                          <td className="py-3 px-4 text-slate-300 font-mono">{customer.phone}</td>
                          <td className="py-3 px-4 text-slate-400">{customer.city}, {customer.state}</td>
                          <td className="py-3 px-4 font-bold text-amber-300">{customerOrders.length} orders</td>
                          <td className="py-3 px-4 font-extrabold text-emerald-400">₦{totalSpent.toLocaleString()}</td>
                          <td className="py-3 px-4 text-right">
                            <a
                              href={`https://wa.me/234${customer.phone.replace(/^0/, '')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="text-xs px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold"
                            >
                              WhatsApp
                            </a>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==============================================================
              SECTION 12: AUDIT LOGS
             ============================================================== */}
          {activeTab === 'reports' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">System Reports &amp; Audit Trail</h2>
                <p className="text-xs text-slate-400 mt-1">Immutable record of all administrative catalog, inventory, and order changes</p>
              </div>

              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl overflow-hidden">
                <div className="max-h-96 overflow-y-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-800 text-[10px] uppercase text-slate-400 font-bold border-b border-slate-700">
                      <tr>
                        <th className="py-3 px-4">Timestamp</th>
                        <th className="py-3 px-4">Staff Member</th>
                        <th className="py-3 px-4">Action</th>
                        <th className="py-3 px-4">Target</th>
                        <th className="py-3 px-4">Activity Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/60 text-[11px]">
                      {auditLogs.map(log => (
                        <tr key={log.id} className="hover:bg-slate-700/20">
                          <td className="py-2.5 px-4 text-slate-400 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleString()}
                          </td>
                          <td className="py-2.5 px-4 text-white font-bold whitespace-nowrap">
                            {log.userName}
                            <span className="text-[10px] text-slate-400 block font-normal">{log.userRole}</span>
                          </td>
                          <td className="py-2.5 px-4">
                            <span className="bg-slate-700 text-slate-200 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                              {log.action}
                            </span>
                          </td>
                          <td className="py-2.5 px-4 text-psn-blue font-semibold">{log.target}</td>
                          <td className="py-2.5 px-4 text-slate-300 leading-relaxed">{log.details}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ==============================================================
              SECTION 13: SECURITY & STAFF SETTINGS
             ============================================================== */}
          {activeTab === 'security' && (
            <div className="space-y-6 max-w-4xl">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-white">Security &amp; Staff Access Control</h2>
                <p className="text-xs text-slate-400 mt-1">Manage portal roles, change passwords, and audit active sessions</p>
              </div>

              {/* Password change */}
              <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-psn-blue" />
                  <span>Update Your Password</span>
                </h3>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const curr = (form.elements.namedItem('currentPassword') as HTMLInputElement).value;
                    const next = (form.elements.namedItem('newPassword') as HTMLInputElement).value;
                    try {
                      await api.changePassword(curr, next);
                      showSuccess('Password updated successfully.');
                      form.reset();
                    } catch (err: any) {
                      showError(err.message || 'Password update failed');
                    }
                  }}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                >
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      required
                      className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-300 block mb-1">New Password (Min 8 chars)</label>
                    <input
                      type="password"
                      name="newPassword"
                      required
                      minLength={8}
                      className="w-full text-xs p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-psn-blue hover:bg-psn-blue-600 text-white font-bold text-xs shadow-md"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>

              {/* Staff users */}
              {currentUser.role === 'Administrator' && (
                <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-5 space-y-4">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-400" />
                    <span>Authorized Administrative Personnel</span>
                  </h3>

                  <div className="divide-y divide-slate-700">
                    {staffUsers.map(user => (
                      <div key={user.id} className="py-3 flex items-center justify-between text-xs">
                        <div>
                          <div className="font-bold text-white">{user.name}</div>
                          <div className="text-[11px] text-slate-400">{user.email} • {user.phone}</div>
                        </div>
                        <span className="text-[10px] bg-psn-blue/20 text-psn-blue font-bold px-2 py-0.5 rounded-full border border-psn-blue/30">
                          {user.role}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </main>
      </div>

      {/* ==============================================================
          MODAL: EDIT / CREATE PRODUCT
         ============================================================== */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-psn-navy-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <h3 className="text-base font-black">
                {isNewProduct ? 'Add New Product to Catalogue' : `Edit Product: ${editingProduct.name}`}
              </h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-300 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-psn-blue"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">SKU / Code</label>
                  <input
                    type="text"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Category *</label>
                  <select
                    value={editingProduct.category || 'buckets-basins'}
                    onChange={(e) => {
                      const cat = categories.find(c => c.id === e.target.value);
                      setEditingProduct({
                        ...editingProduct,
                        category: e.target.value,
                        categoryLabel: cat?.label || e.target.value
                      });
                    }}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing & Stock */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Retail Price (₦) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.retailPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, retailPrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Wholesale Price (₦)</label>
                  <input
                    type="number"
                    value={editingProduct.wholesalePrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, wholesalePrice: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Carton Qty</label>
                  <input
                    type="number"
                    value={editingProduct.cartonQty || 1}
                    onChange={(e) => setEditingProduct({ ...editingProduct, cartonQty: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-300 block mb-1">Stock Units</label>
                  <input
                    type="number"
                    value={editingProduct.stockCount || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                    className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Product Image Upload & Replacement */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Product Photograph *</label>
                <div className="flex items-center gap-4">
                  {editingProduct.imageUrl && (
                    <img
                      src={editingProduct.imageUrl}
                      alt="Product preview"
                      className="w-20 h-20 object-cover rounded-xl border border-slate-700 bg-slate-900"
                    />
                  )}
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const url = await handleFileUpload(file);
                          setEditingProduct({ ...editingProduct, imageUrl: url });
                        }
                      }}
                      className="text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-psn-blue file:text-white"
                    />
                    <input
                      type="text"
                      placeholder="Or enter direct image URL"
                      value={editingProduct.imageUrl || ''}
                      onChange={(e) => setEditingProduct({ ...editingProduct, imageUrl: e.target.value })}
                      className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none"
                />
              </div>

              {/* Specs & Material */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Material Polymer</label>
                  <input
                    type="text"
                    value={editingProduct.specs?.material || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      specs: { ...editingProduct.specs!, material: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-300 block mb-1">Capacity / Volume</label>
                  <input
                    type="text"
                    placeholder="e.g. 100 Litres"
                    value={editingProduct.specs?.capacity || ''}
                    onChange={(e) => setEditingProduct({
                      ...editingProduct,
                      specs: { ...editingProduct.specs!, capacity: e.target.value }
                    })}
                    className="w-full p-2 bg-slate-900 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-700 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-psn-blue hover:bg-psn-blue-600 rounded-xl font-black text-white shadow-md"
                >
                  Save Product to Database
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==============================================================
          MODAL: VIEW / PROCESS ORDER
         ============================================================== */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-psn-navy-900/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white space-y-5 my-8">
            <div className="flex items-center justify-between border-b border-slate-700 pb-3">
              <div>
                <h3 className="text-lg font-black">Order #{viewingOrder.id}</h3>
                <span className="text-xs text-slate-400">Placed on {new Date(viewingOrder.createdAt).toLocaleString()}</span>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-300 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Customer & Destination */}
            <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-700 text-xs space-y-1">
              <div className="font-bold text-white text-sm">{viewingOrder.customer.fullName}</div>
              <div className="text-slate-300">Phone: {viewingOrder.customer.phone}</div>
              <div className="text-slate-400">Address: {viewingOrder.customer.address}, {viewingOrder.customer.city}, {viewingOrder.customer.state}</div>
              <div className="text-amber-400 font-semibold pt-1">Logistics: {viewingOrder.deliveryMethod}</div>
            </div>

            {/* Items table */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-slate-400">Ordered Items</h4>
              <div className="bg-slate-900/60 rounded-xl divide-y divide-slate-700 text-xs">
                {viewingOrder.items.map((item, idx) => (
                  <div key={idx} className="p-3 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">{item.productName}</div>
                      <div className="text-[11px] text-slate-400">Qty: {item.quantity} {item.isWholesale ? '(Wholesale)' : '(Retail)'}</div>
                    </div>
                    <div className="text-right font-black text-emerald-400">
                      ₦{item.totalPrice.toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="p-3 bg-slate-900/60 rounded-xl flex justify-between items-baseline font-bold text-sm">
              <span className="text-slate-300">Total Amount:</span>
              <span className="text-xl font-black text-emerald-400">₦{viewingOrder.grandTotal.toLocaleString()}</span>
            </div>

            {/* Status Update Control */}
            <div className="space-y-3 pt-2 border-t border-slate-700">
              <label className="text-xs font-bold text-slate-300 block">Update Processing Status</label>
              <div className="flex flex-wrap gap-2">
                {['New', 'Processing', 'Dispatched / In Transit', 'Delivered', 'Cancelled'].map(st => (
                  <button
                    key={st}
                    onClick={() => handleUpdateOrderStatus(viewingOrder.id, st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                      viewingOrder.orderStatus === st
                        ? 'bg-psn-blue text-white shadow-sm'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Mark {st}
                  </button>
                ))}
              </div>

              <div className="pt-2 flex justify-between items-center">
                <a
                  href={`https://wa.me/234${viewingOrder.customer.phone.replace(/^0/, '')}?text=${encodeURIComponent(`Hello ${viewingOrder.customer.fullName}, this is Plastic Store Nigeria regarding your order #${viewingOrder.id}.`)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold"
                >
                  Message Customer on WhatsApp
                </a>

                <button
                  onClick={() => setViewingOrder(null)}
                  className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-xl text-xs font-bold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
