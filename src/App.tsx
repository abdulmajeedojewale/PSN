import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  Package, 
  Truck, 
  Calculator, 
  MessageCircle, 
  Search,
  CheckCircle,
  ShieldCheck,
  ChevronRight,
  Lock,
  LayoutDashboard
} from 'lucide-react';
import { Product, ProductCategory, CartItem, SiteSettings, Category, AdminUser } from './types';
import { PRODUCTS as DEFAULT_PRODUCTS, CATEGORIES as DEFAULT_CATEGORIES } from './data/products';
import { api, getAuthToken, setAuthToken } from './services/api';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductCard } from './components/ProductCard';
import { ProductModal } from './components/ProductModal';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { BulkCalculator } from './components/BulkCalculator';
import { Features } from './components/Features';
import { PlasticGuide } from './components/PlasticGuide';
import { Testimonials } from './components/Testimonials';
import { Footer } from './components/Footer';
import { AdminLoginModal } from './admin/AdminLoginModal';
import { AdminDashboard } from './admin/AdminDashboard';

export const App: React.FC = () => {
  // Live Backend Data States
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [isLoadingStore, setIsLoadingStore] = useState(true);

  // Navigation & Filtering State
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'rating'>('featured');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  
  // Public Modals & Drawers State
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isBulkCalcOpen, setIsBulkCalcOpen] = useState(false);

  // Admin Portal & Authentication State
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isAdminDashboardOpen, setIsAdminDashboardOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);

  // Cart & Wishlist State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);

  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  // Sync with live backend
  const fetchStoreData = useCallback(async () => {
    try {
      const [fetchedProducts, fetchedCategories, fetchedSettings] = await Promise.all([
        api.getProducts().catch(() => DEFAULT_PRODUCTS),
        api.getCategories().catch(() => []),
        api.getSettings().catch(() => null)
      ]);

      if (fetchedProducts && fetchedProducts.length > 0) {
        setProducts(fetchedProducts);
      }
      if (fetchedCategories && fetchedCategories.length > 0) {
        setCategories(fetchedCategories);
      }
      if (fetchedSettings) {
        setSettings(fetchedSettings);
      }
    } catch (err) {
      console.warn('Backend sync warning, using local cached store data:', err);
    } finally {
      setIsLoadingStore(false);
    }
  }, []);

  // Check existing admin session
  const checkAdminSession = useCallback(async () => {
    const token = getAuthToken();
    if (token) {
      try {
        const user = await api.getMe();
        setCurrentUser(user);
      } catch {
        setAuthToken(null);
        setCurrentUser(null);
      }
    }
  }, []);

  useEffect(() => {
    fetchStoreData();
    checkAdminSession();

    // Check URL query param for ?admin=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('admin') === 'true') {
      const token = getAuthToken();
      if (token) {
        setIsAdminDashboardOpen(true);
      } else {
        setIsAdminLoginOpen(true);
      }
    }

    // Keyboard shortcut handler: Ctrl + Shift + A
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        const token = getAuthToken();
        if (token && currentUser) {
          setIsAdminDashboardOpen(prev => !prev);
        } else {
          setIsAdminLoginOpen(prev => !prev);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fetchStoreData, checkAdminSession, currentUser]);

  // Cart Actions
  const handleAddToCart = (product: Product, isWholesale: boolean = false) => {
    const qty = isWholesale ? product.cartonQty : 1;
    handleAddToCartWithQty(product, qty, isWholesale, product.specs?.availableColors?.[0]);
  };

  const handleAddToCartWithQty = (
    product: Product, 
    quantity: number, 
    isWholesale: boolean, 
    color?: string
  ) => {
    setCartItems(prev => {
      const existingIndex = prev.findIndex(
        item => item.product.id === product.id && item.isWholesale === isWholesale
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, isWholesale, selectedColor: color }];
      }
    });

    api.logActivity('added_to_cart', { productId: product.id, productName: product.name, quantity, isWholesale });
    showToast(`Added ${quantity}x "${product.name}" to cart!`);
  };

  const handleUpdateCartQuantity = (productId: string, quantity: number, isWholesale: boolean) => {
    if (quantity <= 0) {
      handleRemoveCartItem(productId, isWholesale);
      return;
    }

    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId && item.isWholesale === isWholesale
          ? { ...item, quantity }
          : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string, isWholesale: boolean) => {
    setCartItems(prev =>
      prev.filter(item => !(item.product.id === productId && item.isWholesale === isWholesale))
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist Action
  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.includes(product.id);
      if (exists) {
        showToast(`Removed "${product.name}" from wishlist.`);
        return prev.filter(id => id !== product.id);
      } else {
        showToast(`Saved "${product.name}" to wishlist!`);
        return [...prev, product.id];
      }
    });
  };

  // Calculations
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartItems.reduce((sum, item) => {
    const unitPrice = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
    return sum + unitPrice * item.quantity;
  }, 0);

  // Filtered and Sorted Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }
      if (selectedMaterial !== 'all') {
        if (!p.specs?.material?.toLowerCase().includes(selectedMaterial.toLowerCase())) {
          return false;
        }
      }
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesCategory = p.categoryLabel.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesMaterial = p.specs?.material?.toLowerCase().includes(q);
        const matchesSku = p.sku && p.sku.toLowerCase().includes(q);
        if (!matchesName && !matchesCategory && !matchesDesc && !matchesMaterial && !matchesSku) {
          return false;
        }
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.retailPrice - b.retailPrice;
      if (sortBy === 'price-desc') return b.retailPrice - a.retailPrice;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });
  }, [products, selectedCategory, selectedMaterial, searchQuery, sortBy]);

  const activeCategoryObject = categories.find(c => c.id === selectedCategory) || 
    DEFAULT_CATEGORIES.find(c => c.id === selectedCategory) || 
    DEFAULT_CATEGORIES[0];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-psn-yellow selection:text-psn-navy-900">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-psn-navy-900 text-white px-5 py-3.5 rounded-2xl shadow-floating border border-white/10 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs sm:text-sm font-bold">{toastMessage}</span>
          <button 
            onClick={() => setIsCartOpen(true)}
            className="text-xs text-psn-yellow font-extrabold hover:underline ml-2"
          >
            Open Cart →
          </button>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        cartCount={cartCount}
        cartTotal={cartTotal}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenBulkCalc={() => setIsBulkCalcOpen(true)}
        products={products}
        onSelectProduct={(p) => {
          setSelectedProduct(p);
          api.logActivity('product_viewed', { productId: p.id, productName: p.name });
        }}
        branding={settings?.branding}
        company={settings?.company}
        categoriesList={categories}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdminLoggedIn={!!currentUser}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Hero Section */}
      <Hero
        onExplore={() => {
          const catalogSection = document.getElementById('catalog');
          if (catalogSection) {
            catalogSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}
        onOpenBulkCalc={() => setIsBulkCalcOpen(true)}
        onSelectCategory={setSelectedCategory}
        heroSettings={settings?.hero}
        whatsappNumber={settings?.company?.whatsappNumber}
      />

      {/* Core Brand Value Pillars (Enhanced with subtle blue tints & soft borders) */}
      <div className="bg-gradient-to-b from-slate-50 via-blue-50/25 to-slate-50">
        <Features />
      </div>

      {/* Product Catalog Section with Soft Light Background for Premium Contrast */}
      <main id="catalog" className="flex-1 w-full bg-gradient-to-b from-slate-50/60 via-slate-100/40 to-slate-50 py-12 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Catalog Header & Filters Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {activeCategoryObject.label}
                </h2>
                <span className="bg-psn-blue/10 text-psn-blue text-xs font-bold px-2.5 py-0.5 rounded-full border border-psn-blue/20">
                  {filteredProducts.length} items
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {activeCategoryObject.description || 'Heavy-duty household, commercial, and industrial grade plastic products'}
              </p>
            </div>

            {/* Filter & Sort Controls */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Material Filter */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs shadow-sm">
                <Filter className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="all">All Polymer Types</option>
                  <option value="HDPE">Virgin HDPE</option>
                  <option value="Polypropylene">Polypropylene (PP)</option>
                  <option value="Food-Grade">Food Safe Grade</option>
                </select>
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs shadow-sm">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-slate-700 font-semibold focus:outline-none cursor-pointer"
                >
                  <option value="featured">Featured / Best Deals</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
              </div>

              {/* Bulk Calc Quick Link */}
              <button
                onClick={() => setIsBulkCalcOpen(true)}
                className="bg-amber-500 hover:bg-amber-400 text-psn-navy-900 font-black text-xs px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-colors"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>Wholesale Calc</span>
              </button>
            </div>
          </div>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="py-20 text-center text-slate-400 bg-white/70 rounded-3xl border border-slate-200/80 my-8 shadow-sm">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <Search className="w-8 h-8 text-slate-300" />
              </div>
              <h3 className="text-base font-bold text-slate-700 mb-1">No products match your filter</h3>
              <p className="text-xs text-slate-500 mb-4">Try clearing the search query or selecting "All Products".</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedMaterial('all');
                  setSearchQuery('');
                }}
                className="px-4 py-2 bg-psn-blue text-white rounded-xl text-xs font-bold shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-8">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={(p) => {
                    setSelectedProduct(p);
                    api.logActivity('product_viewed', { productId: p.id, productName: p.name });
                  }}
                  onAddToCart={handleAddToCart}
                  isWishlisted={wishlist.includes(product.id)}
                  onToggleWishlist={handleToggleWishlist}
                />
              ))}
            </div>
          )}

          {/* Wholesale Banner Callout */}
          <div className="mt-16 bg-gradient-to-r from-psn-blue via-psn-blue-dark to-psn-navy-900 rounded-3xl p-8 sm:p-10 text-white relative overflow-hidden shadow-xl border border-white/10">
            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 bg-psn-yellow text-psn-navy-900 text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider mb-3">
                <Package className="w-3.5 h-3.5" />
                <span>Commercial &amp; Bulk Haulage</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black mb-2">
                Ordering Cartons, Crates or Full Trailer Loads?
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed mb-6">
                Get direct factory floor quotes with tiered discounts up to 32% off retail prices. We deliver trailer loads directly to your warehouse anywhere across Nigeria.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsBulkCalcOpen(true)}
                  className="px-5 py-3 rounded-xl bg-psn-yellow hover:bg-amber-400 text-psn-navy-900 font-extrabold text-xs sm:text-sm transition-all shadow-md active:scale-95"
                >
                  Launch Wholesale Calculator
                </button>
                <a
                  href={`https://wa.me/${settings?.company?.whatsappNumber || '2348031234567'}?text=${encodeURIComponent('Hello PSN, I want to discuss a commercial truckload/wholesale order.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-400" />
                  <span>Chat with Factory Manager</span>
                </a>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Virgin Polymer & Durability Education Guide */}
      <div className="bg-white">
        <PlasticGuide />
      </div>

      {/* Verified Nigerian Testimonials */}
      <div className="bg-slate-50/80">
        <Testimonials />
      </div>

      {/* Footer with Dynamic Settings & Discreet Admin Access */}
      <Footer
        onSelectCategory={setSelectedCategory}
        onOpenBulkCalc={() => setIsBulkCalcOpen(true)}
        company={settings?.company}
        branding={settings?.branding}
        social={settings?.social}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        isAdminLoggedIn={!!currentUser}
        onOpenAdminDashboard={() => setIsAdminDashboardOpen(true)}
      />

      {/* Public Store Modals & Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCartWithQty}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
          api.logActivity('checkout_started', { itemsCount: cartItems.length, total: cartTotal });
        }}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={() => {
          handleClearCart();
          fetchStoreData();
          showToast('Order confirmed! We will contact your phone number.');
        }}
      />

      <BulkCalculator
        isOpen={isBulkCalcOpen}
        onClose={() => setIsBulkCalcOpen(false)}
        products={products}
        onAddToCart={handleAddToCartWithQty}
      />

      {/* Dedicated Administrative Interface */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setIsAdminDashboardOpen(true);
          showToast(`Welcome back, ${user.name}!`);
        }}
      />

      {isAdminDashboardOpen && currentUser && (
        <AdminDashboard
          currentUser={currentUser}
          onLogout={() => {
            setAuthToken(null);
            setCurrentUser(null);
            setIsAdminDashboardOpen(false);
            showToast('You have signed out of Admin Portal.');
          }}
          onClose={() => setIsAdminDashboardOpen(false)}
          onRefreshPublicData={fetchStoreData}
        />
      )}

    </div>
  );
};
