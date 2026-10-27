import React, { useState } from 'react';
import { 
  X, 
  Calculator, 
  Percent, 
  TrendingDown, 
  Package, 
  Truck, 
  MessageCircle, 
  ShoppingCart,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { Product } from '../types';

interface BulkCalculatorProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onAddToCart: (product: Product, quantity: number, isWholesale: boolean) => void;
}

export const BulkCalculator: React.FC<BulkCalculatorProps> = ({
  isOpen,
  onClose,
  products,
  onAddToCart,
}) => {
  if (!isOpen) return null;

  const [selectedProductId, setSelectedProductId] = useState<string>(products[0]?.id || '');
  const [quantity, setQuantity] = useState<number>(50);

  const product = products.find(p => p.id === selectedProductId) || products[0];

  // Pricing calculations
  const retailTotal = product ? product.retailPrice * quantity : 0;
  
  // Tiered discount based on quantity
  let discountMultiplier = 1;
  let tierLabel = 'Standard Bulk Rate';

  if (quantity >= 500) {
    discountMultiplier = 0.88; // Extra 12% off wholesale for truckloads
    tierLabel = 'Full Truckload / Factory Floor Rate (Max Savings)';
  } else if (quantity >= 200) {
    discountMultiplier = 0.92; // Extra 8% off
    tierLabel = 'Tier 3 Mega Wholesale (8% extra off)';
  } else if (quantity >= 100) {
    discountMultiplier = 0.95; // Extra 5% off
    tierLabel = 'Tier 2 Bulk (5% extra off)';
  }

  const effectiveUnitPrice = product ? Math.round(product.wholesalePrice * discountMultiplier) : 0;
  const bulkTotal = effectiveUnitPrice * quantity;
  const savings = retailTotal - bulkTotal;
  const savingsPercent = retailTotal > 0 ? Math.round((savings / retailTotal) * 100) : 0;
  const cartons = product ? Math.ceil(quantity / product.cartonQty) : 0;

  const generateWhatsAppQuote = () => {
    if (!product) return '';
    const msg = `*BULK / WHOLESALE RFQ - PLASTIC STORE NIGERIA*\n\n` +
      `*Product:* ${product.name}\n` +
      `*Quantity:* ${quantity} units (${cartons} cartons)\n` +
      `*Retail Standard Value:* ₦${retailTotal.toLocaleString()}\n` +
      `*Bulk Factory Rate:* ₦${bulkTotal.toLocaleString()}\n` +
      `*Total Savings:* ₦${savings.toLocaleString()} (${savingsPercent}% discount)\n` +
      `*Tier:* ${tierLabel}\n\n` +
      `Please confirm stock availability and freight haulage charges.`;
    return `https://wa.me/2348031234567?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-psn-navy-900/75 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-gradient-to-r from-psn-navy-900 to-psn-blue text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-psn-navy-900 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg flex items-center gap-2">
                <span>Wholesale &amp; Bulk Discount Calculator</span>
                <span className="bg-amber-400/20 text-amber-300 text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-amber-300/30">
                  Instant Savings
                </span>
              </h3>
              <p className="text-xs text-slate-300">
                Direct factory pricing for caterers, event planners, hotels, schools &amp; retailers
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-200 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Select Product */}
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Select Plastic Product to Calculate
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full text-xs sm:text-sm p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-psn-blue focus:outline-none font-semibold text-slate-800"
            >
              {products.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — (Retail: ₦{p.retailPrice.toLocaleString()} | Carton of {p.cartonQty})
                </option>
              ))}
            </select>
          </div>

          {/* Product Glance */}
          {product && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-xl border border-slate-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-slate-900 line-clamp-1">{product.name}</div>
                <div className="text-[11px] text-slate-500">{product.specs.material} • {product.specs.capacity || product.categoryLabel}</div>
                <div className="text-xs font-bold text-psn-blue mt-1">
                  1 Carton = {product.cartonQty} pcs | Min Wholesale = {product.wholesaleMinQty} pcs
                </div>
              </div>
            </div>
          )}

          {/* Quantity Controls & Quick Presets */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold text-slate-700">Enter Required Quantity (Pieces):</label>
              <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                ≈ {cartons} Full Cartons
              </span>
            </div>

            <input
              type="number"
              min={product ? product.wholesaleMinQty : 1}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full text-lg font-black text-slate-900 p-3 bg-white border-2 border-slate-200 focus:border-psn-blue rounded-xl focus:outline-none text-center"
            />

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-2 mt-2.5">
              {[25, 50, 100, 250, 500, 1000].map((qty) => (
                <button
                  key={qty}
                  onClick={() => setQuantity(qty)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    quantity === qty
                      ? 'bg-psn-blue text-white shadow-sm'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {qty} pcs {qty >= 500 ? '🚛' : ''}
                </button>
              ))}
            </div>
          </div>

          {/* Savings Highlight Display */}
          <div className="bg-gradient-to-br from-emerald-500 to-teal-700 rounded-2xl p-5 text-white shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-extrabold text-emerald-100 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-300" />
                {tierLabel}
              </span>
              <span className="text-xs font-black bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                {savingsPercent}% Total Discount
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 border-t border-white/20 pt-4 text-left">
              <div>
                <span className="text-[11px] text-emerald-100 block">Retail Standard</span>
                <span className="text-sm font-semibold line-through text-white/80">
                  ₦{retailTotal.toLocaleString()}
                </span>
              </div>

              <div>
                <span className="text-[11px] text-emerald-100 block">Bulk Factory Rate</span>
                <span className="text-lg sm:text-xl font-black text-amber-300">
                  ₦{bulkTotal.toLocaleString()}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1 bg-white/10 rounded-xl p-2.5 backdrop-blur-sm">
                <span className="text-[10px] text-emerald-100 block font-bold uppercase">You Save Directly</span>
                <span className="text-base font-black text-white">
                  ₦{savings.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-emerald-100 border-t border-white/15 pt-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>Unit cost drops to ₦{effectiveUnitPrice.toLocaleString()} per piece (includes factory packaging).</span>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => {
                if (product) {
                  onAddToCart(product, quantity, true);
                  onClose();
                }
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-psn-blue hover:bg-psn-blue-600 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add Bulk Order to Cart</span>
            </button>

            <a
              href={generateWhatsAppQuote()}
              target="_blank"
              rel="noreferrer"
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Export RFQ to WhatsApp</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
