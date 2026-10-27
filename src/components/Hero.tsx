import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Layers, 
  MessageCircle, 
  ArrowRight, 
  Percent, 
  CheckCircle2 
} from 'lucide-react';
import { ProductCategory, HeroSettings } from '../types';

interface HeroProps {
  onExplore: () => void;
  onOpenBulkCalc: () => void;
  onSelectCategory: (category: ProductCategory) => void;
  heroSettings?: HeroSettings;
  whatsappNumber?: string;
}

export const Hero: React.FC<HeroProps> = ({ 
  onExplore, 
  onOpenBulkCalc,
  onSelectCategory,
  heroSettings,
  whatsappNumber = '2348031234567'
}) => {
  const headline = heroSettings?.headline || 'Durable Plastic Products That Never Crack Under Pressure.';
  const highlightWord = heroSettings?.highlightText || 'Never Crack';
  const subheadline = heroSettings?.subheadline || 'Nigeria’s trusted supplier for high-grade unbreakable water drums, royal event chairs, thermal food warmers, industrial crates, and airtight home organizers. Manufactured with 100% virgin polymer for extreme longevity.';
  const badgeText = heroSettings?.badgeText || 'Direct Factory Wholesale & Retail Hub • Nigeria';
  const ctaPrimary = heroSettings?.ctaPrimaryText || 'Shop Products Now';
  const ctaSecondary = heroSettings?.ctaSecondaryText || 'Wholesale Bulk Calculator';
  const bannerImg = heroSettings?.bannerImageUrl || '/images/hero-banner.jpg';

  // Format headline with highlight if word exists
  const renderHeadline = () => {
    if (highlightWord && headline.includes(highlightWord)) {
      const parts = headline.split(highlightWord);
      return (
        <>
          {parts[0]}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-psn-yellow via-amber-300 to-emerald-400">
            {highlightWord}
          </span>
          {parts[1]}
        </>
      );
    }
    return headline;
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-psn-navy-900 via-psn-navy-800 to-psn-blue-dark text-white pt-8 pb-16 sm:py-16">
      {/* Background Subtle Polymer Hex Pattern */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#FDB813_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
      
      {/* Decorative Glow Orbs */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-psn-blue/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-psn-yellow/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-psn-yellow text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{badgeText}</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.15] text-white">
              {renderHeadline()}
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {subheadline}
            </p>

            {/* Value bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-sm text-slate-200">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Heavy-gauge 100% Virgin HDPE &amp; PP</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Up to 30% Off on Cartons &amp; Truckloads</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Express Delivery to All 36 States</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Custom Logo Stamping for Events</span>
              </div>
            </div>

            {/* Call to Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={onExplore}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-psn-yellow to-amber-500 hover:from-amber-400 hover:to-amber-500 text-psn-navy-900 font-extrabold text-sm shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 active:scale-95"
              >
                <span>{ctaPrimary}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenBulkCalc}
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold text-sm transition-all duration-200 flex items-center gap-2 active:scale-95"
              >
                <Percent className="w-4 h-4 text-psn-yellow" />
                <span>{ctaSecondary}</span>
              </button>

              <a
                href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Hello PSN! I want to inquire about ordering plastic products.')}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm transition-all duration-200 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span className="hidden sm:inline">WhatsApp Order</span>
              </a>
            </div>
          </div>

          {/* Right Column: Hero Visual Card Showcase */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-gradient-to-b from-white/10 to-white/5 backdrop-blur-xl p-3 shadow-2xl">
              
              {/* Product Visual Showcase Banner */}
              <div className="relative h-72 sm:h-84 rounded-2xl overflow-hidden group bg-slate-900">
                <img 
                  src={bannerImg}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80";
                  }}
                  alt="PSN Durable Plastic Ware Showcase"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700" 
                />
                
                {/* Floating Badge on Image */}
                <div className="absolute top-4 left-4 bg-psn-navy-900/90 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-lg border border-white/10 font-bold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>100% Food-Grade Virgin Polymer</span>
                </div>

                <div className="absolute bottom-4 right-4 bg-psn-yellow text-psn-navy-900 text-xs px-3 py-1.5 rounded-lg font-black shadow-lg">
                  Factory Direct Pricing
                </div>
              </div>

              {/* Quick Stat Highlights */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-center">
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-xl sm:text-2xl font-black text-psn-yellow">36</div>
                  <div className="text-[11px] text-slate-300 font-medium">States Delivered</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-xl sm:text-2xl font-black text-emerald-400">100%</div>
                  <div className="text-[11px] text-slate-300 font-medium">Virgin Polymer</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3">
                  <div className="text-xl sm:text-2xl font-black text-white">15K+</div>
                  <div className="text-[11px] text-slate-300 font-medium">Satisfied Buyers</div>
                </div>
              </div>

            </div>

            {/* Floating Customer Quote Badge */}
            <div className="hidden sm:flex absolute -bottom-6 -left-6 bg-white text-slate-800 rounded-2xl p-4 shadow-floating border border-slate-100 items-center gap-3 max-w-xs animate-float">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-black shrink-0">
                ★ 4.9
              </div>
              <div className="text-xs">
                <p className="font-bold text-slate-900">"Strongest water drums in Lagos"</p>
                <p className="text-slate-500">Alaba &amp; Trade Fair Wholesale Hub</p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
