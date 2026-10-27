import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  Truck, 
  CreditCard, 
  Building2, 
  MapPin, 
  ShieldCheck, 
  Phone, 
  MessageCircle, 
  Check, 
  Copy,
  Receipt
} from 'lucide-react';
import { CartItem } from '../types';
import { NIGERIA_STATES } from '../data/products';
import { api } from '../services/api';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onOrderSuccess: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  onOrderSuccess,
}) => {
  if (!isOpen) return null;

  const [step, setStep] = useState<'form' | 'success'>('form');
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [state, setState] = useState('Lagos');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [deliveryMethod, setDeliveryMethod] = useState<'lagos-express' | 'interstate-park' | 'pickup' | 'truckload'>('lagos-express');
  const [paymentMethod, setPaymentMethod] = useState<'transfer' | 'paystack' | 'cod' | 'whatsapp'>('transfer');
  const [orderNotes, setOrderNotes] = useState('');

  // Calculations
  const subtotal = items.reduce((sum, item) => {
    const price = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
    return sum + price * item.quantity;
  }, 0);

  const getShippingFee = () => {
    if (deliveryMethod === 'pickup') return 0;
    if (subtotal >= 150000 && (state === 'Lagos' || state === 'Abuja (FCT)')) return 0;
    if (deliveryMethod === 'lagos-express') return 4500;
    if (deliveryMethod === 'interstate-park') return 6500;
    if (deliveryMethod === 'truckload') return 18000;
    return 4500;
  };

  const shippingFee = getShippingFee();
  const grandTotal = subtotal + shippingFee;
  const orderId = `PSN-${Math.floor(100000 + Math.random() * 900000)}`;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleCopyAccount = (acc: string) => {
    navigator.clipboard.writeText(acc);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const orderPayload = {
        customer: {
          fullName,
          phone,
          email,
          state,
          city,
          address
        },
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          quantity: item.quantity,
          isWholesale: item.isWholesale,
          unitPrice: item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice,
          totalPrice: (item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice) * item.quantity,
          selectedColor: item.selectedColor
        })),
        deliveryMethod,
        paymentMethod,
        subtotal,
        shippingFee,
        grandTotal,
        notes: orderNotes
      };

      await api.createOrder(orderPayload);
      setStep('success');
    } catch (err: any) {
      setSubmitError(err.message || 'Failed to place order. Please check stock availability or connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateWhatsAppOrderReceipt = () => {
    let msg = `*CONFIRMED PSN ORDER RECEIPT - #${orderId}*\n\n`;
    msg += `*Customer:* ${fullName}\n*Phone:* ${phone}\n*Delivery State:* ${state}\n*Address:* ${address}, ${city}\n*Delivery Option:* ${deliveryMethod}\n*Payment Method:* ${paymentMethod}\n\n`;
    msg += `*ORDER ITEMS:*\n`;
    items.forEach((item, idx) => {
      const price = item.isWholesale ? item.product.wholesalePrice : item.product.retailPrice;
      msg += `${idx + 1}. ${item.product.name} x ${item.quantity} = ₦${(price * item.quantity).toLocaleString()}\n`;
    });
    msg += `\n*Subtotal:* ₦${subtotal.toLocaleString()}\n*Logistics Fee:* ₦${shippingFee.toLocaleString()}\n*GRAND TOTAL:* ₦${grandTotal.toLocaleString()}\n\nKindly confirm dispatch date.`;
    return `https://wa.me/2348031234567?text=${encodeURIComponent(msg)}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-psn-navy-900/70 backdrop-blur-sm animate-in fade-in">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 bg-psn-navy-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-psn-yellow/20 text-psn-yellow flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {step === 'form' ? 'Checkout & Order Finalization' : 'Order Received Successfully!'}
              </h3>
              <p className="text-xs text-slate-300">
                {step === 'form' ? 'Safe delivery across Lagos, Abuja & 36 Nigerian States' : `Your Invoice Reference is ${orderId}`}
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

        {step === 'form' ? (
          <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Customer Contact */}
            <div>
              <h4 className="text-xs font-black uppercase text-psn-blue tracking-wider mb-3 flex items-center gap-2">
                <span>1. Contact Details</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alhaji Babatunde Okonjo"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-psn-blue focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Phone / WhatsApp *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 0803 123 4567"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-psn-blue focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Email Address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. babatunde@gmail.com"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-psn-blue focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Destination */}
            <div>
              <h4 className="text-xs font-black uppercase text-psn-blue tracking-wider mb-3 flex items-center gap-2">
                <span>2. Delivery Destination in Nigeria</span>
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Destination State *</label>
                  <select
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-psn-blue focus:outline-none font-medium"
                  >
                    {NIGERIA_STATES.map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City / Town / LGA *</label>
                  <input
                    type="text"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Ikeja / Garki / Onitsha Main"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-psn-blue focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block mb-1">Street Address / Landmark *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="e.g. Plot 14, Commercial Avenue, Opp. First Bank"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-psn-blue focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Method Choice */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Select Logistics Option</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  deliveryMethod === 'lagos-express' ? 'border-psn-blue bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'lagos-express'}
                    onChange={() => setDeliveryMethod('lagos-express')}
                    className="mt-0.5 text-psn-blue"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Lagos Express Courier</span>
                    <span className="text-[11px] text-slate-500">Same-day / Next-day dispatch (₦4,500)</span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  deliveryMethod === 'interstate-park' ? 'border-psn-blue bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'interstate-park'}
                    onChange={() => setDeliveryMethod('interstate-park')}
                    className="mt-0.5 text-psn-blue"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Interstate Park Waybill</span>
                    <span className="text-[11px] text-slate-500">ABC, GIG, God Is Good (₦6,500)</span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  deliveryMethod === 'pickup' ? 'border-psn-blue bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'pickup'}
                    onChange={() => setDeliveryMethod('pickup')}
                    className="mt-0.5 text-psn-blue"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Warehouse Self-Pickup</span>
                    <span className="text-[11px] text-emerald-600 font-bold">FREE (Trade Fair or Alaba Hub)</span>
                  </div>
                </label>

                <label className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  deliveryMethod === 'truckload' ? 'border-psn-blue bg-blue-50/50' : 'border-slate-200 hover:bg-slate-50'
                }`}>
                  <input
                    type="radio"
                    name="deliveryMethod"
                    checked={deliveryMethod === 'truckload'}
                    onChange={() => setDeliveryMethod('truckload')}
                    className="mt-0.5 text-psn-blue"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">Dedicated Freight Truck</span>
                    <span className="text-[11px] text-slate-500">Bulk &amp; Carton Wholesale Haulage</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Preferred Payment Method</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                {[
                  { id: 'transfer', label: 'Bank Transfer', sub: 'Instant Verified' },
                  { id: 'paystack', label: 'Debit Card', sub: 'Paystack/Mastercard' },
                  { id: 'cod', label: 'Pay On Delivery', sub: 'Lagos Only' },
                  { id: 'whatsapp', label: 'WhatsApp Pay', sub: 'Chat Representative' }
                ].map(pm => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => setPaymentMethod(pm.id as any)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      paymentMethod === pm.id 
                        ? 'border-psn-blue bg-psn-blue text-white shadow-sm font-bold' 
                        : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <div className="text-xs font-bold">{pm.label}</div>
                    <div className={`text-[10px] ${paymentMethod === pm.id ? 'text-blue-100' : 'text-slate-400'}`}>{pm.sub}</div>
                  </button>
                ))}
              </div>

              {paymentMethod === 'transfer' && (
                <div className="mt-3 p-3.5 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900">
                  <div className="font-bold flex items-center justify-between mb-1.5">
                    <span>PSN Official Corporate Account:</span>
                    <span className="text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[10px] font-black">Verified Bank</span>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200 flex items-center justify-between">
                    <div>
                      <div className="font-extrabold text-slate-900">Zenith Bank PLC</div>
                      <div className="font-mono text-sm font-black text-psn-blue">1223849502</div>
                      <div className="text-[10px] text-slate-500">Plastic Store Nigeria Enterprise</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopyAccount('1223849502')}
                      className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-800 text-xs font-bold flex items-center gap-1 transition-colors"
                    >
                      {copiedAccount ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedAccount ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Total Summary */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal:</span>
                <span className="font-bold text-slate-900">₦{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Logistics / Delivery:</span>
                <span className="font-bold text-slate-900">
                  {shippingFee === 0 ? <span className="text-emerald-600">FREE</span> : `₦${shippingFee.toLocaleString()}`}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-baseline text-sm font-extrabold">
                <span className="text-slate-900">Grand Total Payable:</span>
                <span className="text-xl font-black text-psn-blue">₦{grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {submitError && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-start gap-2">
                <span className="font-bold">Error:</span> {submitError}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-psn-blue to-psn-blue-600 hover:from-psn-blue-600 hover:to-psn-blue-700 text-white font-black text-sm shadow-lg hover:shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isSubmitting ? 'Processing Order...' : `Confirm & Place Order (₦${grandTotal.toLocaleString()})`}</span>
            </button>
          </form>
        ) : (
          /* Order Confirmation View */
          <div className="p-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
              <Check className="w-8 h-8 stroke-[3]" />
            </div>

            <div>
              <h4 className="text-2xl font-black text-slate-900 mb-1">
                Thank You, {fullName || 'Valued Customer'}!
              </h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Your order <span className="font-bold text-psn-blue">#{orderId}</span> has been created. Our logistics team will call or message your phone number ({phone}) shortly.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 max-w-md mx-auto text-left text-xs space-y-2">
              <div className="flex justify-between border-b border-slate-200 pb-2 font-bold text-slate-700">
                <span>Invoice #{orderId}</span>
                <span className="text-emerald-600">Status: Processing</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Destination:</span>
                <span className="font-medium text-slate-800">{city}, {state}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Amount:</span>
                <span className="font-black text-slate-900 text-sm">₦{grandTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Payment:</span>
                <span className="font-medium text-slate-800 capitalize">{paymentMethod}</span>
              </div>
            </div>

            {/* Quick Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
              <a
                href={generateWhatsAppOrderReceipt()}
                target="_blank"
                rel="noreferrer"
                className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Send Receipt to WhatsApp Rep</span>
              </a>

              <button
                onClick={() => {
                  onOrderSuccess();
                  onClose();
                }}
                className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs transition-colors"
              >
                Return to Store
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
