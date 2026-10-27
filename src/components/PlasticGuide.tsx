import React, { useState } from 'react';
import { 
  HelpCircle, 
  CheckCircle, 
  XCircle, 
  Sun, 
  Droplet, 
  Flame, 
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

export const PlasticGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'materials' | 'comparison' | 'faq'>('comparison');

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Buyer Knowledge Center</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            How to Spot Unbreakable Virgin Plastics in Nigeria
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Many open-market plastics break in under 3 months due to recycled chalk fillers. Here is how PSN virgin polymers guarantee superior longevity.
          </p>

          {/* Tab Selector */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl mt-6">
            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'comparison' ? 'bg-white text-psn-navy-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Virgin vs Recycled Plastic
            </button>
            <button
              onClick={() => setActiveTab('materials')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'materials' ? 'bg-white text-psn-navy-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Polymer Guide (HDPE vs PP)
            </button>
            <button
              onClick={() => setActiveTab('faq')}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'faq' ? 'bg-white text-psn-navy-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Frequently Asked Questions
            </button>
          </div>
        </div>

        {/* Tab 1: Comparison */}
        {activeTab === 'comparison' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Cheap Recycled Plastic */}
            <div className="bg-red-50/50 border border-red-200 rounded-3xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                  <XCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">Cheap Market "Regrind" Plastics</h4>
                  <span className="text-xs text-red-600 font-semibold">Common roadside &amp; cheap bucket products</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Cracks under sun:</strong> Breaks into brittle shards when left in dry hot weather or rainy season.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Chemical leaching:</strong> Emits unpleasant plastic odor; dangerous for hot food or drinking water.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">✕</span>
                  <span><strong>Weak flexural strength:</strong> Event chairs sag or snap when adult weights sit on them.</span>
                </li>
              </ul>
            </div>

            {/* PSN 100% Virgin Plastic */}
            <div className="bg-emerald-50/60 border border-emerald-200 rounded-3xl p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <CheckCircle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-extrabold text-slate-900 text-base">PSN 100% Virgin Polymers</h4>
                  <span className="text-xs text-emerald-700 font-bold">Direct First-Generation Resin</span>
                </div>
              </div>

              <ul className="space-y-3 text-xs text-slate-700">
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>High Impact Elasticity:</strong> Absorbs drops, rough handling and transport bumps without fracturing.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>100% Food-Safe &amp; BPA-Free:</strong> Certified non-toxic for drinking water, soup, and hot stew storage.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span><strong>UV-Stabilized Lifespan:</strong> Formulated to resist tropical sunlight fading and chalking for 5+ years.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 2: Materials Guide */}
        {activeTab === 'materials' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="text-psn-blue font-black text-sm uppercase tracking-wide mb-1">HDPE (High-Density Polyethylene)</div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">Used in: 100L Drums, Jerrycans &amp; Heavy Basins</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extremely high tensile strength with remarkable chemical and weather resistance. Ideal for holding heavy water weight and borehole backup storage.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="text-emerald-600 font-black text-sm uppercase tracking-wide mb-1">PP (Polypropylene)</div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">Used in: Event Chairs, Food Warmers, Drawers</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Has exceptional resistance to fatigue and high melting point. Retains its rigidity when molded into monobloc chairs and microwave-safe food containers.
              </p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200">
              <div className="text-amber-600 font-black text-sm uppercase tracking-wide mb-1">PU Thermal Foam Lining</div>
              <h4 className="font-bold text-slate-900 text-sm mb-2">Used in: 50L Ice Chests &amp; Beverage Coolers</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Closed-cell polyurethane insulation traps freezing temperatures inside, keeping ice frozen and drinks cold for over 72 hours under heat.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: FAQs */}
        {activeTab === 'faq' && (
          <div className="max-w-3xl mx-auto space-y-3">
            {[
              {
                q: 'How does delivery work for states outside Lagos?',
                a: 'For interstate orders (Abuja, Port Harcourt, Kano, Onitsha, etc.), we send items via verified transport park waybills (ABC Transport, GIG Logistics, God Is Good, Ekeson, or Young Shall Grow). You will receive waybill tracking and phone number of the park manager.'
              },
              {
                q: 'What is the minimum quantity for wholesale carton rates?',
                a: 'Each product has a designated wholesale carton threshold (usually 6 to 25 pieces depending on size). You can mix colors within the same carton.'
              },
              {
                q: 'Can we inspect the products in person before ordering in bulk?',
                a: 'Yes! Our central distribution warehouse is located at Trade Fair Complex, Badagry Expressway, Lagos, and Alaba International Market. You can also pick up directly.'
              },
              {
                q: 'Can you print our church or company name on event chairs and buckets?',
                a: 'Yes, we provide precision silkscreen and hot-foil stamping for minimum orders of 50 pieces. Contact us on WhatsApp for logo customization details.'
              }
            ].map((faq, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-xs">
                <div className="font-extrabold text-slate-900 text-sm mb-1.5 flex items-center justify-between">
                  <span>{faq.q}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
};
