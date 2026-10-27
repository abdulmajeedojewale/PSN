import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      name: 'Chief Emeka Okoli',
      role: 'CEO, Royal Events & Rental Services',
      location: 'Ikeja & Lekki, Lagos',
      rating: 5,
      content: 'We ordered 250 pieces of the Royal Monobloc Chairs for our event center. Even after 40+ consecutive wedding weekends, not a single leg has cracked or bent. Their bulk discount saved us over ₦350,000 compared to local market vendors.',
      product: 'Royal Monobloc Event Chairs'
    },
    {
      name: 'Mrs. Folake Adebayo',
      role: 'Head of Operations, GoldLoaf Bakery',
      location: 'Wuse 2, Abuja',
      rating: 5,
      content: 'PSN delivered 60 stacking bread crates directly to our Abuja bakery via interstate waybill within 48 hours. The plastic is thick and food-grade certified. Will continue buying our industrial crates exclusively from them.',
      product: 'Bakery & Bread Stacking Crates'
    },
    {
      name: 'Alhaji Musa Danjuma',
      role: 'General Merchant & Distributor',
      location: 'Kano & Kaduna',
      rating: 5,
      content: 'The 100L water storage drums are the best quality I have seen in Northern Nigeria. The screw lid seals airtight and the handles are truly heavy-duty. Very honest pricing and fast truckload dispatch.',
      product: '100L Water Storage Drums'
    }
  ];

  return (
    <section className="py-16 bg-slate-50 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-wider mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
            <span>Customer Testimonials</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
            Trusted by Event Planners, Wholesalers &amp; Nigerian Homes
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Read real feedback from business owners and families who rely on PSN every day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, index) => (
            <div 
              key={index}
              className="bg-white rounded-3xl p-6 border border-slate-100 shadow-card flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-slate-200" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic mb-6">
                  "{r.content}"
                </p>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                      <span>{r.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    </h4>
                    <p className="text-[11px] text-slate-500">{r.role}</p>
                    <p className="text-[10px] text-psn-blue font-bold">{r.location}</p>
                  </div>
                  <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-medium text-right">
                    {r.product}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
