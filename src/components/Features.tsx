import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  Sparkles, 
  Factory, 
  Printer, 
  RotateCcw,
  Award,
  Layers
} from 'lucide-react';

export const Features: React.FC = () => {
  const pillars = [
    {
      icon: ShieldCheck,
      title: '100% Virgin Polymer Only',
      desc: 'We never mix cheap brittle recycled scrap. Our plastics feature maximum elasticity and tensile strength that won’t crack under tropical Nigerian sun.',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      icon: Factory,
      title: 'Direct Factory Prices',
      desc: 'Cut out middlemen and open market markups. Enjoy unbeatable wholesale and carton rates whether ordering 1 piece or 5 trailer loads.',
      color: 'text-psn-blue',
      bg: 'bg-blue-50'
    },
    {
      icon: Truck,
      title: 'Express 36 States Delivery',
      desc: 'Same-day delivery within Lagos & Abuja. Interstate park waybills across Kano, Port Harcourt, Onitsha, Benin, and Jos with trusted transport lines.',
      color: 'text-amber-600',
      bg: 'bg-amber-50'
    },
    {
      icon: Printer,
      title: 'Custom Branding Available',
      desc: 'Need your church, hotel, school, or corporate logo stamped on chairs, buckets, or thermal coolers? We offer precision hot-stamping & printing.',
      color: 'text-purple-600',
      bg: 'bg-purple-50'
    }
  ];

  return (
    <section className="py-14 bg-slate-50 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-psn-blue/10 text-psn-blue text-xs font-bold uppercase tracking-wider mb-2">
            <Award className="w-3.5 h-3.5" />
            <span>The PSN Quality Benchmark</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Why Thousands of Nigerian Businesses &amp; Homes Trust PSN
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Engineered to endure daily rigorous Nigerian usage — from commercial boreholes to bustling event party grounds.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((item, index) => {
            const Icon = item.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} ${item.color} flex items-center justify-center mb-4`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
