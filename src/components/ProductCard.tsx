import React from 'react';
import { 
  ShoppingCart, 
  Eye, 
  Heart, 
  Star, 
  Check, 
  Package, 
  ShieldCheck 
} from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onAddToCart: (product: Product, isWholesale: boolean) => void;
  isWishlisted: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onAddToCart,
  isWishlisted,
  onToggleWishlist,
}) => {
  const getBadgeStyle = (badge?: string) => {
    switch (badge) {
      case 'Best Seller':
        return 'bg-amber-500 text-white';
      case 'Wholesale Deal':
        return 'bg-psn-blue text-white';
      case 'Heavy Duty':
        return 'bg-emerald-600 text-white';
      case 'BPA Free':
        return 'bg-teal-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Top Image Box */}
      <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden cursor-pointer" onClick={() => onSelect(product)}>
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Badge */}
        {product.badge && (
          <span className={`absolute top-3 left-3 text-[11px] font-extrabold uppercase px-2.5 py-1 rounded-md shadow-sm ${getBadgeStyle(product.badge)}`}>
            {product.badge}
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted 
              ? 'bg-red-50 text-red-500 shadow-md' 
              : 'bg-white/80 backdrop-blur-sm text-slate-500 hover:text-red-500 hover:bg-white'
          }`}
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick View Hover Pill */}
        <div className="absolute inset-x-0 bottom-3 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(product);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-psn-navy-900/90 text-white text-xs font-semibold backdrop-blur-md shadow-lg hover:bg-psn-navy-800 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick Specs</span>
          </button>
        </div>
      </div>

      {/* Body Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Capacity Tag */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="font-semibold text-psn-blue uppercase tracking-wider text-[10px]">
              {product.categoryLabel}
            </span>
            {product.specs.capacity && (
              <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium text-[11px]">
                {product.specs.capacity}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 
            onClick={() => onSelect(product)}
            className="font-bold text-slate-900 text-sm leading-snug line-clamp-2 hover:text-psn-blue cursor-pointer transition-colors mb-2"
          >
            {product.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex text-amber-400">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
            </div>
            <span className="text-xs font-bold text-slate-800">{product.rating}</span>
            <span className="text-[11px] text-slate-400">({product.reviewsCount})</span>
            {product.specs.foodGrade && (
              <span className="ml-auto text-[10px] font-bold text-emerald-600 flex items-center gap-0.5 bg-emerald-50 px-1.5 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3" /> Food Safe
              </span>
            )}
          </div>
        </div>

        {/* Pricing & Add to Cart Section */}
        <div className="pt-3 border-t border-slate-100">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <span className="text-xs text-slate-400 block font-medium">Retail Price</span>
              <span className="text-lg font-extrabold text-psn-navy-900">
                ₦{product.retailPrice.toLocaleString()}
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-amber-700 block font-bold uppercase tracking-wide">
                Wholesale ({product.wholesaleMinQty}+ pcs)
              </span>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                ₦{product.wholesalePrice.toLocaleString()} /pc
              </span>
            </div>
          </div>

          {/* Button Group */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onAddToCart(product, false)}
              className="w-full py-2 px-2.5 rounded-xl bg-psn-blue hover:bg-psn-blue-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-95"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>Add 1 pc</span>
            </button>

            <button
              onClick={() => onAddToCart(product, true)}
              className="w-full py-2 px-2.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-extrabold text-xs flex items-center justify-center gap-1 transition-all border border-amber-300 active:scale-95"
              title={`Add 1 full carton (${product.cartonQty} pieces) at wholesale rate`}
            >
              <Package className="w-3.5 h-3.5 text-amber-700" />
              <span>Bulk ({product.cartonQty}x)</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
