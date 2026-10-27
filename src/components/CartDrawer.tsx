import React from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingCart, 
  Truck, 
  ArrowRight, 
  ShieldCheck, 
  MessageCircle, 
  Sparkles 
} from 'lucide-react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (productId: string, quantity: number, isWholesale: boolean) => void;
  onRemoveItem: (productId: string, isWholesale: boolean) => void;
  onClearCart: () => void;
  onProceedToCheckout: () => void;
}

const FREE_SHIPPING_THRESHOLD = 150000; // ₦150,000

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onProceedToCheckout,
}) => {
  if (!isOpen) return null;

  const totalAmount = items.reduce((sum, item) => {
    const price = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
    return sum + price * item.quantity;
  }, 0);

  const totalSavings = items.reduce((sum, item) => {
    if (item.isWholesale) {
      return sum + (item.product.retailPrice - item.product.wholesalePrice) * item.quantity;
    }
    return sum;
  }, 0);

  const freeShippingProgress = Math.min(100, Math.round((totalAmount / FREE_SHIPPING_THRESHOLD) * 100));
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - totalAmount);

  const generateWhatsAppCheckout = () => {
    let msg = `*NEW ORDER INQUIRY - PLASTIC STORE NIGERIA (PSN)*\n\n`;
    items.forEach((item, index) => {
      const price = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
      msg += `${index + 1}. *${item.product.name}*\n   - Qty: ${item.quantity} ${item.isWholesale ? '(Wholesale)' : '(Retail)'}\n   - Rate: ₦${price.toLocaleString()} each\n   - Total: ₦${(price * item.quantity).toLocaleString()}\n\n`;
    });
    msg += `*Order Subtotal:* ₦${totalAmount.toLocaleString()}\n`;
    if (totalSavings > 0) {
      msg += `*Total Wholesale Savings:* ₦${totalSavings.toLocaleString()}\n`;
    }
    msg += `\nPlease calculate delivery to my state and send bank payment details.`;
    return `https://wa.me/2348031234567?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-psn-navy-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-psn-blue/10 text-psn-blue flex items-center justify-center">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-base">Your Cart</h3>
                <span className="text-xs text-slate-500 font-medium">{items.length} unique item types</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {items.length > 0 && (
                <button
                  onClick={onClearCart}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors p-1"
                  title="Clear Cart"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-slate-200/60 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Free Shipping Progress bar */}
          <div className="bg-blue-50/50 p-3.5 border-b border-blue-100/60">
            <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
              <span className="flex items-center gap-1.5 text-psn-blue">
                <Truck className="w-4 h-4" />
                {totalAmount >= FREE_SHIPPING_THRESHOLD ? (
                  <span className="text-emerald-700">🎉 Free Delivery Unlocked for Lagos/Abuja!</span>
                ) : (
                  <span>Add ₦{remainingForFreeShipping.toLocaleString()} for Free Delivery</span>
                )}
              </span>
              <span className="text-slate-500">{freeShippingProgress}%</span>
            </div>
            <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-psn-blue to-emerald-500 transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items Container */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-300">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <p className="font-bold text-slate-700 text-base mb-1">Your cart is empty</p>
                <p className="text-xs text-slate-500 max-w-xs mb-6">
                  Add durable plastic buckets, royal event chairs, coolers, or industrial crates to start.
                </p>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-psn-blue text-white font-bold text-xs shadow-sm hover:bg-psn-blue-600 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item, idx) => {
                const unitPrice = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
                const itemTotal = unitPrice * item.quantity;
                const minQty = item.isWholesale ? item.product.wholesaleMinQty : 1;

                return (
                  <div key={`${item.product.id}-${item.isWholesale}-${idx}`} className="py-4 first:pt-0 flex gap-3.5 items-start">
                    {/* Thumbnail */}
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-xl border border-slate-100 shrink-0"
                    />

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <h4 className="text-xs font-bold text-slate-900 leading-tight line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => onRemoveItem(item.product.id, item.isWholesale)}
                          className="text-slate-400 hover:text-red-500 transition-colors p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Tag pill */}
                      <div className="flex items-center gap-2 mb-2">
                        {item.isWholesale ? (
                          <span className="text-[10px] font-extrabold bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                            Wholesale Rate
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                            Retail Single
                          </span>
                        )}
                        {item.selectedColor && (
                          <div className="flex items-center gap-1 text-[11px] text-slate-500">
                            <span 
                              className="w-2.5 h-2.5 rounded-full border border-slate-300"
                              style={{ backgroundColor: item.selectedColor }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Quantity & Price */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                          <button
                            onClick={() => {
                              if (item.quantity > minQty) {
                                onUpdateQuantity(item.product.id, item.quantity - 1, item.isWholesale);
                              } else {
                                onRemoveItem(item.product.id, item.isWholesale);
                              }
                            }}
                            className="w-6 h-6 rounded bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-xs"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center font-extrabold text-xs text-slate-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1, item.isWholesale)}
                            className="w-6 h-6 rounded bg-white hover:bg-slate-50 text-slate-700 flex items-center justify-center font-bold text-xs"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right">
                          <span className="text-xs font-black text-slate-900 block">
                            ₦{itemTotal.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ₦{unitPrice.toLocaleString()} each
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Checkout Summary */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-slate-50/70 space-y-3">
              {totalSavings > 0 && (
                <div className="flex justify-between items-center text-xs text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 font-bold">
                  <span>Wholesale Discount Applied:</span>
                  <span>-₦{totalSavings.toLocaleString()}</span>
                </div>
              )}

              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Subtotal</span>
                  <span className="font-semibold text-slate-800">₦{totalAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Logistics / Delivery</span>
                  <span className="font-medium text-emerald-600">Calculated at Checkout</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline">
                <span className="text-sm font-bold text-slate-900">Total Amount</span>
                <span className="text-xl font-black text-psn-blue">
                  ₦{totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="space-y-2 pt-1">
                <button
                  onClick={() => {
                    onClose();
                    onProceedToCheckout();
                  }}
                  className="w-full py-3.5 px-4 rounded-xl bg-psn-blue hover:bg-psn-blue-600 text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-95"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <a
                  href={generateWhatsAppCheckout()}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Order Directly via WhatsApp</span>
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
