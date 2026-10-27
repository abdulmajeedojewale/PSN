import React from 'react';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Truck, 
  ArrowRight, 
  MessageCircle, 
  Heart,
  Lock,
  Globe,
  Share2
} from 'lucide-react';
import { ProductCategory, CompanySettings, BrandingSettings, SocialLink } from '../types';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onOpenBulkCalc: () => void;
  company?: CompanySettings;
  branding?: BrandingSettings;
  social?: Record<string, SocialLink>;
  onOpenAdminLogin: () => void;
  isAdminLoggedIn?: boolean;
  onOpenAdminDashboard?: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onOpenBulkCalc,
  company,
  branding,
  social,
  onOpenAdminLogin,
  isAdminLoggedIn,
  onOpenAdminDashboard
}) => {
  const officialName = company?.officialName || 'Plastic Store Nigeria (PSN) Enterprise';
  const description = company?.description || 'Plastic Store Nigeria (PSN) is the nation’s premier factory-direct manufacturer & distributor of heavy-duty, unbending polymer goods.';
  const primaryPhone = company?.primaryPhone || '+234 803 123 4567';
  const whatsappNum = company?.whatsappNumber || '2348031234567';
  const supportEmail = company?.supportEmail || 'orders@plasticstorenigeria.ng';
  const footerCopyright = company?.footerCopyright || '© 2026 Plastic Store Nigeria (PSN) Enterprise. All Rights Reserved.';
  const logoWhite = branding?.logoWhiteUrl || '/logo-white.svg';

  return (
    <footer className="bg-psn-navy-900 text-slate-300 pt-16 pb-8 border-t border-psn-navy-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-psn-navy-700/60">
          
          {/* Brand Info (Span 2) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <img 
                src={logoWhite} 
                alt={officialName} 
                className="h-10 sm:h-12 w-auto object-contain"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/logo.svg';
                }}
              />
            </div>
            
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              {description}
            </p>

            <div className="pt-2 flex flex-col gap-2 text-xs">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4 shrink-0" />
                <span>100% Virgin Food-Grade &amp; Industrial HDPE / PP</span>
              </div>
              <div className="flex items-center gap-2 text-psn-yellow font-bold">
                <Truck className="w-4 h-4 shrink-0" />
                <span>Nationwide Waybill &amp; Park Delivery Network</span>
              </div>
            </div>

            {/* Social icons if enabled */}
            {social && (
              <div className="flex items-center gap-3 pt-2">
                {social.instagram?.enabled && (
                  <a href={social.instagram.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors" title="Instagram">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                    </svg>
                  </a>
                )}
                {social.facebook?.enabled && (
                  <a href={social.facebook.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors" title="Facebook">
                    <svg className="w-4 h-4 fill-none stroke-current stroke-2" viewBox="0 0 24 24">
                      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                    </svg>
                  </a>
                )}
                {social.whatsapp?.enabled && (
                  <a href={social.whatsapp.url} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-300 hover:text-white transition-colors">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Quick Categories */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => onSelectCategory('buckets-basins')}
                  className="hover:text-psn-yellow transition-colors text-left"
                >
                  Buckets &amp; Basins
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('chairs-tables')}
                  className="hover:text-psn-yellow transition-colors text-left"
                >
                  Event Chairs &amp; Tables
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('food-storage')}
                  className="hover:text-psn-yellow transition-colors text-left"
                >
                  Coolers &amp; Food Warmers
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('waste-drums')}
                  className="hover:text-psn-yellow transition-colors text-left"
                >
                  Water Drums &amp; Waste Bins
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('industrial-crates')}
                  className="hover:text-psn-yellow transition-colors text-left"
                >
                  Bakery &amp; Egg Crates
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onSelectCategory('storage-boxes')}
                  className="hover:text-psn-yellow transition-colors text-left"
                >
                  Modular Wardrobes &amp; Trunks
                </button>
              </li>
            </ul>
          </div>

          {/* Wholesale & Commercial */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              Wholesale &amp; Business
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={onOpenBulkCalc}
                  className="text-amber-400 font-bold hover:text-amber-300 transition-colors flex items-center gap-1"
                >
                  <span>Wholesale Calculator</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello PSN, I want to request the full wholesale price catalogue.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Request Price List PDF
                </a>
              </li>
              <li>
                <a 
                  href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello PSN, I want to inquire about custom branding on chairs/buckets.')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Custom Logo Stamping
                </a>
              </li>
              <li>
                <span className="text-slate-400">Truckload &amp; Export Haulage</span>
              </li>
              <li>
                <span className="text-slate-400">Reseller Partnership Program</span>
              </li>
            </ul>
          </div>

          {/* Warehouse Hubs & Contact */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-black uppercase tracking-wider">
              Warehouse Locations
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              {company?.addresses && company.addresses.length > 0 ? (
                company.addresses.map((addr) => (
                  <div key={addr.id} className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-psn-yellow shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">{addr.title}:</span>
                      {addr.address}
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-psn-yellow shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Lagos Central Hub:</span>
                      Trade Fair Complex, Badagry Expressway &amp; Alaba Int'l Market, Lagos.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-psn-yellow shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-white block">Abuja Depot:</span>
                      Plot 14, Industrial Layout, Idu &amp; Wuse 2, Abuja (FCT).
                    </div>
                  </div>
                </>
              )}

              <div className="flex items-center gap-2 pt-1 text-emerald-400 font-bold">
                <Phone className="w-4 h-4 shrink-0" />
                <a href={`tel:${primaryPhone}`} className="hover:underline">
                  {primaryPhone}
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>{footerCopyright}</p>
          
          <div className="flex items-center gap-4">
            <span>CAC Registered Enterprise</span>
            <span>•</span>
            <span className="flex items-center gap-1 text-slate-400">
              Made for Nigeria with <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            </span>
            <span>•</span>
            {/* Discreet Mobile Access Trigger */}
            <button
              onClick={() => {
                if (isAdminLoggedIn && onOpenAdminDashboard) {
                  onOpenAdminDashboard();
                } else {
                  onOpenAdminLogin();
                }
              }}
              className="text-slate-600 hover:text-slate-400 flex items-center gap-1 transition-colors text-[11px]"
              title="Staff Portal Access (Ctrl + Shift + A)"
            >
              <Lock className="w-3 h-3" />
              <span>{isAdminLoggedIn ? 'Staff Portal' : 'Staff Access'}</span>
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
