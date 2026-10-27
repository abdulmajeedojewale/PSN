import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  Phone, 
  Truck, 
  Sparkles, 
  Menu, 
  X, 
  Calculator,
  ShieldCheck,
  ArrowRight,
  Lock,
  LayoutDashboard
} from 'lucide-react';
import { ProductCategory, Product, BrandingSettings, CompanySettings, Category } from '../types';
import { CATEGORIES as DEFAULT_CATEGORIES } from '../data/products';

interface NavbarProps {
  selectedCategory: ProductCategory;
  onSelectCategory: (cat: ProductCategory) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenBulkCalc: () => void;
  products: Product[];
  onSelectProduct: (p: Product) => void;
  branding?: BrandingSettings;
  company?: CompanySettings;
  categoriesList?: Category[];
  onOpenAdminLogin: () => void;
  isAdminLoggedIn?: boolean;
  onOpenAdminDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  cartCount,
  cartTotal,
  onOpenCart,
  wishlistCount,
  onOpenBulkCalc,
  products,
  onSelectProduct,
  branding,
  company,
  categoriesList,
  onOpenAdminLogin,
  isAdminLoggedIn,
  onOpenAdminDashboard,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  const displayCategories = categoriesList && categoriesList.length > 0 ? categoriesList : DEFAULT_CATEGORIES;

  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.specs && p.specs.material && p.specs.material.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const logoSrc = branding?.logoUrl || '/logo.svg';
  const logoHeight = branding?.logoHeight || 44;
  const whatsappNum = company?.whatsappNumber || '2348031234567';
  const phoneText = company?.primaryPhone || '+234 803 123 4567';

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md shadow-sm transition-all duration-200">
      {/* Top Banner Ribbon */}
      <div className="bg-psn-navy-900 text-slate-200 text-xs py-2 px-4 border-b border-psn-navy-700">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-semibold text-psn-yellow">
              <Truck className="w-3.5 h-3.5" /> Nationwide Delivery:
            </span>
            <span className="hidden sm:inline text-slate-300">
              Lagos, Abuja, Port Harcourt, Kano &amp; All 36 States
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <div className="hidden md:flex items-center gap-1.5 text-emerald-400">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>100% Virgin Food-Grade &amp; Industrial Polymers</span>
            </div>
            <a 
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello PSN, I am interested in plastic products wholesale/retail.')}`}
              target="_blank" 
              rel="noreferrer"
              className="flex items-center gap-1.5 text-psn-yellow hover:text-white transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp: {phoneText}</span>
            </a>

            {/* Discreet Admin Portal Button in Ribbon if Logged In */}
            {isAdminLoggedIn && (
              <button
                onClick={onOpenAdminDashboard}
                className="bg-amber-400 text-psn-navy-900 px-2 py-0.5 rounded font-black text-[10px] flex items-center gap-1 shadow-sm hover:bg-amber-300"
              >
                <LayoutDashboard className="w-3 h-3" />
                <span>Admin Portal</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              onSelectCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center focus:outline-none group text-left"
          >
            <img 
              src={logoSrc} 
              alt="Plastic Store Nigeria Logo" 
              style={{ height: `${logoHeight}px` }}
              className="w-auto object-contain transition-transform group-hover:scale-[1.02]" 
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/logo.svg';
              }}
            />
          </button>
        </div>

        {/* Instant Search Bar */}
        <div className="relative flex-1 max-w-xl hidden md:block">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                onSearchChange(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              placeholder="Search 100L drums, event chairs, coolers, basins, crates..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-100 hover:bg-slate-50 focus:bg-white text-sm text-slate-800 rounded-full border border-slate-200 focus:border-psn-blue focus:ring-2 focus:ring-psn-blue/20 outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 pointer-events-none" />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-3 text-xs bg-slate-200 text-slate-600 rounded-full w-5 h-5 flex items-center justify-center hover:bg-slate-300"
              >
                ✕
              </button>
            )}
          </div>

          {/* Autocomplete Dropdown */}
          {showSearchDropdown && searchResults.length > 0 && (
            <div 
              className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-floating border border-slate-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2"
              onMouseLeave={() => setShowSearchDropdown(false)}
            >
              <div className="p-2 border-b border-slate-100 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider flex justify-between">
                <span>Matching Products</span>
                <span>{searchResults.length} results</span>
              </div>
              <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      onSelectProduct(item);
                      setShowSearchDropdown(false);
                    }}
                    className="p-3 hover:bg-blue-50/50 flex items-center justify-between cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={item.imageUrl} 
                        alt={item.name} 
                        className="w-12 h-12 object-cover rounded-lg border border-slate-200" 
                      />
                      <div>
                        <div className="text-sm font-bold text-slate-800 line-clamp-1">{item.name}</div>
                        <div className="text-xs text-slate-500">{item.categoryLabel} • {item.specs?.material}</div>
                      </div>
                    </div>
                    <div className="text-right pl-3">
                      <div className="text-sm font-extrabold text-psn-blue">₦{item.retailPrice.toLocaleString()}</div>
                      <div className="text-[11px] text-amber-600 font-semibold">Bulk: ₦{item.wholesalePrice.toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Header Action Buttons */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Bulk Quote Calculator Trigger */}
          <button
            onClick={onOpenBulkCalc}
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-bold transition-all shadow-sm active:scale-95"
            title="Calculate Carton & Wholesale Savings"
          >
            <Calculator className="w-3.5 h-3.5 text-amber-600" />
            <span>Wholesale Calc</span>
          </button>

          {/* Cart Drawer Trigger */}
          <button
            onClick={onOpenCart}
            className="relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full bg-psn-blue hover:bg-psn-blue-600 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-95"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {cartCount > 0 ? (
              <span className="flex items-center justify-center bg-psn-yellow text-slate-900 font-extrabold text-xs w-5 h-5 rounded-full ml-0.5 animate-bounce">
                {cartCount}
              </span>
            ) : (
              <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">0</span>
            )}
            {cartTotal > 0 && (
              <span className="hidden lg:inline text-xs font-bold text-blue-100 border-l border-white/20 pl-2">
                ₦{cartTotal.toLocaleString()}
              </span>
            )}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-700 hover:text-psn-blue rounded-lg"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Category Pills Bar (Horizontal Scrollable) */}
      <div className="border-t border-slate-100 bg-slate-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 py-2 overflow-x-auto no-scrollbar scroll-smooth">
            {displayCategories.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id as ProductCategory)}
                  className={`whitespace-nowrap px-3.5 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-psn-blue text-white shadow-sm font-bold scale-[1.02]'
                      : 'bg-white text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200/60'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search products, chairs, buckets..."
              className="w-full pl-10 pr-4 py-2 bg-slate-100 text-sm rounded-lg border border-slate-200 focus:outline-none focus:border-psn-blue"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                onOpenBulkCalc();
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold"
            >
              <Calculator className="w-4 h-4 text-amber-600" />
              <span>Wholesale Calc</span>
            </button>
            <a
              href={`https://wa.me/${whatsappNum}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold"
            >
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp Direct</span>
            </a>
          </div>

          {/* Discreet Mobile Staff Portal link */}
          <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs text-slate-400">
            <span>Staff Portal Access</span>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                if (isAdminLoggedIn && onOpenAdminDashboard) {
                  onOpenAdminDashboard();
                } else {
                  onOpenAdminLogin();
                }
              }}
              className="flex items-center gap-1 text-slate-500 hover:text-psn-blue font-semibold"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{isAdminLoggedIn ? 'Open Portal' : 'Login'}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
