import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShieldCheck, 
  Truck, 
  Package, 
  ShoppingCart, 
  MessageCircle, 
  Check, 
  Layers, 
  Info,
  ChevronRight
} from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, isWholesale: boolean, color: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  if (!product) return null;

  const [quantity, setQuantity] = useState(1);
  const [isWholesale, setIsWholesale] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.specs.availableColors[0] || '#1E56A0');

  const unitPrice = isWholesale ? product.wholesalePrice : product.retailPrice;
  const totalPrice = unitPrice * quantity;
  const savings = isWholesale ? (product.retailPrice - product.wholesalePrice) * quantity : 0;

  const handleWholesaleToggle = (wholesale: boolean) => {
    setIsWholesale(wholesale);
    if (wholesale && quantity < product.wholesaleMinQty) {
      setQuantity(product.wholesaleMinQty);
    } else if (!wholesale && quantity >= product.wholesaleMinQty) {
      setQuantity(1);
    }
  };

  const generateWhatsAppMessage = () => {
    const text = `Hello PSN, I want to order:\n*Product:* ${product.name}\n*Quantity:* ${quantity} ${isWholesale ? 'pieces (Wholesale)' : 'pieces'}\n*Selected Color:* ${selectedColor}\n*Total Price:* ₦${totalPrice.toLocaleString()}\nPlease confirm delivery to my location.`;
    return `https://wa.me/2348031234567?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-psn-navy-900/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-y-auto flex flex-col md:flex-row border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Image & Highlights */}
        <div className="md:w-1/2 p-6 bg-slate-50 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-100">
          <div>
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-white shadow-sm mb-4 border border-slate-200">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              {product.badge && (
                <span className="absolute top-3 left-3 bg-psn-navy-900 text-psn-yellow text-xs font-black px-2.5 py-1 rounded-md shadow-md uppercase">
                  {product.badge}
                </span>
              )}
            </div>

            {/* Color Swatches */}
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-700 block mb-2">Available Colors:</span>
              <div className="flex items-center gap-2">
                {product.specs.availableColors.map((color, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedColor(color)}
                    style={{ backgroundColor: color }}
                    className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center ${
                      selectedColor === color ? 'border-psn-blue ring-2 ring-psn-blue/30 scale-110' : 'border-white shadow-sm'
                    }`}
                  >
                    {selectedColor === color && (
                      <Check className={`w-3.5 h-3.5 ${color === '#FFFFFF' || color === '#E2E8F0' || color === '#F8FAFC' ? 'text-slate-900' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Quality Tag */}
          <div className="bg-emerald-50 rounded-xl p-3 border border-emerald-100 flex items-start gap-2 text-xs text-emerald-800">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">100% Virgin Polymer Guarantee:</span> Crack-free resistance against tropical heat, heavy impact, and chemical oxidation.
            </div>
          </div>
        </div>

        {/* Right Column: Details, Pricing & Order Controls */}
        <div className="md:w-1/2 p-6 flex flex-col justify-between space-y-5">
          <div>
            <div className="text-xs font-extrabold text-psn-blue uppercase tracking-wider mb-1">
              {product.categoryLabel}
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug mb-2">
              {product.name}
            </h2>

            {/* Ratings */}
            <div className="flex items-center gap-2 mb-3">
              <div className="flex text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <span className="text-sm font-bold text-slate-800">{product.rating}</span>
              <span className="text-xs text-slate-400">({product.reviewsCount} verified reviews)</span>
              <span className="ml-auto text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                {product.stockCount} in stock
              </span>
            </div>

            <p className="text-sm text-slate-600 leading-relaxed mb-4">
              {product.description}
            </p>

            {/* Specs Table */}
            <div className="bg-slate-50 rounded-xl p-3 text-xs space-y-1.5 mb-4 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">Material Grade:</span>
                <span className="font-semibold text-slate-800">{product.specs.material}</span>
              </div>
              {product.specs.capacity && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Volume / Capacity:</span>
                  <span className="font-semibold text-slate-800">{product.specs.capacity}</span>
                </div>
              )}
              {product.specs.dimensions && (
                <div className="flex justify-between">
                  <span className="text-slate-500">Dimensions:</span>
                  <span className="font-semibold text-slate-800">{product.specs.dimensions}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-slate-500">Carton Packaging:</span>
                <span className="font-semibold text-amber-700">{product.cartonQty} units / carton</span>
              </div>
            </div>

            {/* Retail vs Wholesale Selector Toggle */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center mb-4">
              <button
                onClick={() => handleWholesaleToggle(false)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                  !isWholesale
                    ? 'bg-white text-psn-navy-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Retail (₦{product.retailPrice.toLocaleString()})
              </button>
              <button
                onClick={() => handleWholesaleToggle(true)}
                className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1 ${
                  isWholesale
                    ? 'bg-amber-500 text-white shadow-sm'
                    : 'text-amber-800 hover:text-amber-900'
                }`}
              >
                <span>Wholesale (₦{product.wholesalePrice.toLocaleString()}/pc)</span>
              </button>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-slate-500 block font-medium">Quantity</span>
                {isWholesale && (
                  <span className="text-[10px] text-amber-700 font-bold">Min: {product.wholesaleMinQty} pcs</span>
                )}
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(isWholesale ? product.wholesaleMinQty : 1, quantity - 1))}
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-base transition-colors"
                >
                  -
                </button>
                <input
                  type="number"
                  min={isWholesale ? product.wholesaleMinQty : 1}
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(isWholesale ? product.wholesaleMinQty : 1, parseInt(e.target.value) || 1))}
                  className="w-14 text-center font-extrabold text-sm py-1.5 border border-slate-200 rounded-lg focus:outline-none focus:border-psn-blue"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200 font-bold text-slate-700 flex items-center justify-center text-base transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Live Pricing Summary */}
            <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3 flex items-center justify-between mb-4">
              <div>
                <span className="text-xs text-slate-500 block font-medium">Total Price</span>
                <span className="text-2xl font-black text-psn-blue">
                  ₦{totalPrice.toLocaleString()}
                </span>
              </div>
              {savings > 0 && (
                <div className="text-right">
                  <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">Bulk Savings</span>
                  <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                    Save ₦{savings.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2">
            <button
              onClick={() => {
                onAddToCart(product, quantity, isWholesale, selectedColor);
                onClose();
              }}
              className="w-full py-3.5 px-4 rounded-xl bg-psn-blue hover:bg-psn-blue-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add {quantity} {quantity === 1 ? 'Item' : 'Items'} to Cart</span>
            </button>

            <a
              href={generateWhatsAppMessage()}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-2 border border-emerald-200 transition-colors"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Direct WhatsApp Order / Quotation</span>
            </a>
          </div>

        </div>
      </div>
    </div>
  );
};
