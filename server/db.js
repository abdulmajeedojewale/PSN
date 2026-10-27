import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import bcrypt from 'bcryptjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'psn_database.json');

// Ensure directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initial Seed Data
const INITIAL_CATEGORIES = [
  { id: 'all', label: 'All Products', icon: 'Layers', description: 'Browse our complete catalog', displayOrder: 0 },
  { id: 'buckets-basins', label: 'Buckets & Basins', icon: 'Droplets', description: 'Water storage drums, wash basins & mop buckets', displayOrder: 1 },
  { id: 'food-storage', label: 'Food Storage & Kitchen', icon: 'Utensils', description: 'Airtight food warmers, cooler boxes & organizers', displayOrder: 2 },
  { id: 'chairs-tables', label: 'Chairs & Tables', icon: 'Armchair', description: 'Event chairs, banquet tables & study desks', displayOrder: 3 },
  { id: 'storage-boxes', label: 'Storage & Organizers', icon: 'Box', description: 'Wheeled trunks, modular cabinets & wardrobes', displayOrder: 4 },
  { id: 'waste-drums', label: 'Waste Bins & Drums', icon: 'Trash2', description: '240L wheelie bins, pedal bins & 200L drums', displayOrder: 5 },
  { id: 'laundry-utility', label: 'Laundry & Utility', icon: 'Shirt', description: 'Hampers, fuel jerrycans & clothes airers', displayOrder: 6 },
  { id: 'industrial-crates', label: 'Industrial & Crates', icon: 'PackageCheck', description: 'Bakery bread crates, egg trays & bottle crates', displayOrder: 7 },
];

const INITIAL_PRODUCTS = [
  {
    id: 'psn-01',
    sku: 'DRM-100L-BLU',
    name: '100L Heavy-Duty Water Storage Drum with Airtight Lid',
    category: 'buckets-basins',
    categoryLabel: 'Buckets & Basins',
    retailPrice: 18500,
    wholesalePrice: 14800,
    cartonQty: 6,
    wholesaleMinQty: 6,
    stockCount: 120,
    inStock: true,
    isPublished: true,
    isFeatured: true,
    badge: 'Best Seller',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80',
    description: 'Engineered for Nigerian households and business water backup. Manufactured with 100% thick virgin HDPE that will not crack or warp under intense heat. Features steel-reinforced dual handles and tight screw-down twist lid.',
    specs: {
      material: 'Virgin High-Density Polyethylene (HDPE)',
      capacity: '100 Litres',
      dimensions: '58cm Diameter x 72cm Height',
      weight: '4.2 kg',
      foodGrade: true,
      uvResistant: true,
      availableColors: ['#1E56A0', '#059669', '#0B192C'],
    },
    features: [
      'Thick crack-proof wall construction',
      'Dual heavy-duty side grips for two-person carry',
      'UV-stabilized for outdoor and borehole use',
      'Food-grade safe for potable drinking water storage'
    ],
    rating: 4.9,
    reviewsCount: 148,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'psn-02',
    sku: 'CHR-MNB-WHT',
    name: 'Royal Monobloc Armless Party & Event Chair (180kg Capacity)',
    category: 'chairs-tables',
    categoryLabel: 'Chairs & Tables',
    retailPrice: 8500,
    wholesalePrice: 6800,
    cartonQty: 25,
    wholesaleMinQty: 25,
    stockCount: 850,
    inStock: true,
    isPublished: true,
    isFeatured: true,
    badge: 'Wholesale Deal',
    imageUrl: 'https://images.unsplash.com/photo-1580481077195-c9902fa35b34?auto=format&fit=crop&w=800&q=80',
    description: 'The standard of excellence for event rentals, churches, halls, and patios in Nigeria. Ribbed undercarriage reinforcement supports up to 180kg. Stackable up to 25 chairs high for easy warehousing and transport.',
    specs: {
      material: 'Virgin Polypropylene (PP) with Impact Modifiers',
      dimensions: '44cm W x 48cm D x 86cm H',
      weight: '2.4 kg',
      uvResistant: true,
      availableColors: ['#FFFFFF', '#1E56A0', '#059669', '#B45309'],
    },
    features: [
      'Heavy-ribbed under-seat support structure',
      'Stackable up to 25 units without tilting',
      'Weatherproof & UV-protected against sun fading',
      'Smooth easy-wipe gloss finish'
    ],
    rating: 4.8,
    reviewsCount: 312,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'psn-03',
    sku: 'TRK-120L-WHL',
    name: '120L Jumbo Wheeled Heavy-Duty Storage Trunk with Clip Latches',
    category: 'storage-boxes',
    categoryLabel: 'Storage & Organizers',
    retailPrice: 28000,
    wholesalePrice: 22500,
    cartonQty: 4,
    wholesaleMinQty: 4,
    stockCount: 75,
    inStock: true,
    isPublished: true,
    isFeatured: true,
    badge: 'Heavy Duty',
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    description: 'Rugged modular storage chest equipped with heavy-duty smooth-rolling recessed wheels and solid latch clamps. Ideal for cloth storage, boarding school students, travel cargo, and stockroom merchandise.',
    specs: {
      material: 'Heavy-Impact Polypropylene copolymer',
      capacity: '120 Litres',
      dimensions: '82cm L x 52cm W x 48cm H',
      weight: '5.1 kg',
      uvResistant: false,
      availableColors: ['#0B192C', '#1E56A0', '#475569'],
    },
    features: [
      'Recessed rear wheels for effortless dragging when full',
      'Reinforced locking latches with padlock holes',
      'Grooved lid for stable stacking up to 4 high',
      'Dust-proof and moisture-repellent perimeter seal'
    ],
    rating: 4.9,
    reviewsCount: 94,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'psn-04',
    sku: 'CLR-50L-ARC',
    name: '50L Arctic Heavy-Duty Insulated Ice Chest & Beverage Cooler',
    category: 'food-storage',
    categoryLabel: 'Food Storage & Kitchen',
    retailPrice: 48000,
    wholesalePrice: 39500,
    cartonQty: 2,
    wholesaleMinQty: 2,
    stockCount: 42,
    inStock: true,
    isPublished: true,
    isFeatured: true,
    badge: 'Best Seller',
    imageUrl: 'https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&w=800&q=80',
    description: 'High-performance polyurethane foam-insulated ice chest keeps drinks chilled and ice frozen for over 72 hours under hot tropical Nigerian climate. Features built-in cup holders, bottom drain plug, and steel hinge pins.',
    specs: {
      material: 'Double-walled Food-grade PE + High-density PU Foam',
      capacity: '50 Litres (Holds 70 cans + ice)',
      dimensions: '65cm L x 40cm W x 42cm H',
      weight: '6.8 kg',
      foodGrade: true,
      uvResistant: true,
      availableColors: ['#1E56A0', '#DC2626', '#059669'],
    },
    features: [
      '72-hour ice retention performance',
      'Leakproof threaded drain spout for quick cleaning',
      'Molded tie-down slots for transport in trucks and car boots',
      'BPA-free antimicrobial inner lining'
    ],
    rating: 5.0,
    reviewsCount: 88,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'psn-05',
    sku: 'WST-240L-PDL',
    name: '240L Heavy-Duty Mobile Wheelie Dustbin with Foot Pedal',
    category: 'waste-drums',
    categoryLabel: 'Waste Bins & Drums',
    retailPrice: 55000,
    wholesalePrice: 46000,
    cartonQty: 5,
    wholesaleMinQty: 5,
    stockCount: 30,
    inStock: true,
    isPublished: true,
    isFeatured: false,
    badge: 'Heavy Duty',
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&w=800&q=80',
    description: 'Municipal and industrial-standard wheelie waste bin designed for estates, restaurants, hospitals, and compounds. Solid steel axle with 200mm solid rubber wheels, heavy foot-pedal for hands-free hygienic operation.',
    specs: {
      material: 'Virgin HDPE UV-Stabilized',
      capacity: '240 Litres',
      dimensions: '58cm W x 73cm D x 106cm H',
      weight: '12.5 kg',
      uvResistant: true,
      availableColors: ['#059669', '#1E56A0', '#0B192C', '#DC2626'],
    },
    features: [
      'Solid steel pedal mechanism for effortless foot opening',
      'Solid puncture-proof rubber wheels on zinc-coated steel axle',
      'Compatible with LAWMA and municipal waste compactor lifters',
      'Resistant to acids, heat, chemicals and harsh sun'
    ],
    rating: 4.8,
    reviewsCount: 65,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'psn-06',
    sku: 'FLK-6PC-LUX',
    name: '6-Piece Luxury Thermal Insulated Food Flask & Casserole Warmer Set',
    category: 'food-storage',
    categoryLabel: 'Food Storage & Kitchen',
    retailPrice: 32000,
    wholesalePrice: 26000,
    cartonQty: 6,
    wholesaleMinQty: 6,
    stockCount: 60,
    inStock: true,
    isPublished: true,
    isFeatured: true,
    badge: 'BPA Free',
    imageUrl: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
    description: 'Keep jollof rice, soups, stews, and swallow steaming hot for 8 hours. Double-walled stainless steel interior with elegant gold-accented high-gloss outer plastic casing and twist-lock steam trap lids.',
    specs: {
      material: 'Virgin Food-Grade PP + Grade 304 Stainless Steel Core',
      capacity: '1L, 1.5L, 2.5L, 3.5L, 5L, 7.5L Set',
      weight: '4.5 kg set',
      foodGrade: true,
      availableColors: ['#FFFFFF', '#0B192C', '#FDB813'],
    },
    features: [
      'Thermal insulation keeps food hot or cold up to 8 hours',
      'Non-magnetic food grade 304 stainless steel basin',
      'Airtight silicone gasket prevents aroma loss and spillage',
      'Stunning centerpiece design for parties and Sunday dinners'
    ],
    rating: 4.9,
    reviewsCount: 176,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'psn-07',
    sku: 'BSN-50L-HVY',
    name: '50L Heavy-Duty Reinforced Multipurpose Washing Basin',
    category: 'buckets-basins',
    categoryLabel: 'Buckets & Basins',
    retailPrice: 6500,
    wholesalePrice: 5100,
    cartonQty: 12,
    wholesaleMinQty: 12,
    stockCount: 300,
    inStock: true,
    isPublished: true,
    isFeatured: false,
    badge: 'Best Seller',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    description: 'The classic unbending wash basin for laundry, market trading, catering dishwashing, and grain processing. Extra-thick flared rim provides a comfortable, pain-free grip even when filled to brim with water.',
    specs: {
      material: 'Impact Resistant Flexible Virgin Polyethylene',
      capacity: '50 Litres',
      dimensions: '56cm Diameter x 32cm Depth',
      weight: '1.8 kg',
      foodGrade: true,
      availableColors: ['#1E56A0', '#DC2626', '#059669', '#FDB813'],
    },
    features: [
      'Flanged anti-crack rim prevents hand fatigue',
      'Flexible polymer withstands heavy drops without shattering',
      'Smooth mirror interior for effortless cleaning',
      'Reinforced bottom concentric rings for zero sag'
    ],
    rating: 4.7,
    reviewsCount: 220,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'psn-08',
    sku: 'HMP-75L-RTN',
    name: '75L Elegant Rattan-Weave Laundry Hamper with Hinged Lid',
    category: 'laundry-utility',
    categoryLabel: 'Laundry & Utility',
    retailPrice: 15000,
    wholesalePrice: 12000,
    cartonQty: 8,
    wholesaleMinQty: 8,
    stockCount: 85,
    inStock: true,
    isPublished: true,
    isFeatured: false,
    badge: 'New',
    imageUrl: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?auto=format&fit=crop&w=800&q=80',
    description: 'Upgrade your bathroom or bedroom aesthetic. Breathable lattice woven pattern provides constant ventilation to prevent damp odor in laundry. Lightweight, snag-free plastic interior that won’t catch on lace or silk.',
    specs: {
      material: 'Polypropylene with Smooth Faux-Rattan Finish',
      capacity: '75 Litres',
      dimensions: '44cm W x 35cm D x 62cm H',
      weight: '2.1 kg',
      availableColors: ['#E2E8F0', '#0B192C', '#78350F'],
    },
    features: [
      'Aerated cross-weave prevents mold and mildew odors',
      'Hinged snap-on lid opens easily and stays upright',
      'Side cut-out carrying handles for easy transit to laundry room',
      'Waterproof and easy to wash with soapy water'
    ],
    rating: 4.8,
    reviewsCount: 110,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'psn-09',
    sku: 'CRT-BBD-5PK',
    name: 'Heavy-Duty Industrial Bakery & Bread Stacking Crate (Pack of 5)',
    category: 'industrial-crates',
    categoryLabel: 'Industrial & Crates',
    retailPrice: 25000,
    wholesalePrice: 20500,
    cartonQty: 5,
    wholesaleMinQty: 10,
    stockCount: 140,
    inStock: true,
    isPublished: true,
    isFeatured: false,
    badge: 'Wholesale Deal',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80',
    description: 'Standard interlocking delivery crates used by major bakeries, supermarkets, and agricultural distributors across Nigeria. Cross-stackable when loaded and nestable when empty to save 60% cargo space.',
    specs: {
      material: 'Industrial-Strength HDPE',
      dimensions: '69cm L x 54cm W x 16cm H each',
      weight: '2.2 kg per crate',
      foodGrade: true,
      availableColors: ['#1E56A0', '#FDB813', '#DC2626'],
    },
    features: [
      'Interlocking corners prevent cargo shifting in transit',
      'Vented base promotes rapid cooling of fresh loaves',
      'Withstands temperature range from -20°C to +75°C',
      'Easy integration with standard pallet and dolly systems'
    ],
    rating: 4.9,
    reviewsCount: 52,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'psn-10',
    sku: 'DRM-200L-IND',
    name: '200L Industrial Virgin Blue Polymer Chemical & Water Drum',
    category: 'waste-drums',
    categoryLabel: 'Waste Bins & Drums',
    retailPrice: 45000,
    wholesalePrice: 38000,
    cartonQty: 2,
    wholesaleMinQty: 4,
    stockCount: 50,
    inStock: true,
    isPublished: true,
    isFeatured: false,
    badge: 'Heavy Duty',
    imageUrl: 'https://images.unsplash.com/photo-1509744645300-a2098b11871a?auto=format&fit=crop&w=800&q=80',
    description: 'Factory-sealed heavy-gauge drum equipped with two 2-inch bung plugs (coarse and fine thread). Suitable for bulk liquid distribution, diesel, edible oils, drinking water, and factory chemical raw materials.',
    specs: {
      material: 'High Molecular Weight HDPE (HMW-HDPE)',
      capacity: '200 Litres (55 Gallons)',
      dimensions: '58cm Diameter x 93cm H',
      weight: '8.8 kg',
      foodGrade: true,
      uvResistant: true,
      availableColors: ['#1E56A0'],
    },
    features: [
      'UN-certified for safe transport of liquid commodities',
      'Corrosion and oxidation resistant',
      'Double bung openings for smooth siphon pump and tap dispensing',
      'Ultra thick blow-molded seamless body'
    ],
    rating: 5.0,
    reviewsCount: 47,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'psn-11',
    sku: 'JRY-25L-FLX',
    name: '25L Thick-Wall Fuel & Potable Water Jerrycan with Flexible Spout',
    category: 'laundry-utility',
    categoryLabel: 'Laundry & Utility',
    retailPrice: 5500,
    wholesalePrice: 4300,
    cartonQty: 10,
    wholesaleMinQty: 10,
    stockCount: 220,
    inStock: true,
    isPublished: true,
    isFeatured: false,
    badge: 'Best Seller',
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80',
    description: 'Anti-expansion molded jerrycan with screw cap, safety seal ring, and bonus detachable flexible pour spout. Reinforced ribbing prevents swelling during hot weather or generator fuel storage.',
    specs: {
      material: 'Fluorinated Virgin HDPE',
      capacity: '25 Litres',
      dimensions: '36cm L x 24cm W x 46cm H',
      weight: '1.4 kg',
      uvResistant: true,
      availableColors: ['#FDB813', '#1E56A0', '#DC2626'],
    },
    features: [
      'Anti-spill flexible pouring spout included',
      'Chemical-resistant for petrol, diesel, and kerosene',
      'Molded ergonomic top handle for steady pouring',
      'Calibrated liquid level embossed gauge markings'
    ],
    rating: 4.8,
    reviewsCount: 185,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'psn-12',
    sku: 'CBN-4DR-MOD',
    name: '4-Drawer Deluxe Modular Plastic Storage Cabinet / Wardrobe',
    category: 'storage-boxes',
    categoryLabel: 'Storage & Organizers',
    retailPrice: 38000,
    wholesalePrice: 31500,
    cartonQty: 2,
    wholesaleMinQty: 2,
    stockCount: 35,
    inStock: true,
    isPublished: true,
    isFeatured: false,
    badge: 'New',
    imageUrl: 'https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?auto=format&fit=crop&w=800&q=80',
    description: 'Spacious 4-tier storage organizer for bedrooms, children clothes, toys, office documents, or salon items. Features silent slide rollers, pull handles, top shelf display, and lock on the top drawer.',
    specs: {
      material: 'Eco Virgin PP Polymer',
      dimensions: '50cm W x 40cm D x 105cm H',
      weight: '8.2 kg',
      availableColors: ['#F8FAFC', '#0B192C', '#3B82F6'],
    },
    features: [
      'Locking key mechanism on top drawer for valuables',
      'Smooth glide stopper prevents drawers from falling out',
      'Termite-proof, damp-proof, and washable alternative to wood',
      'Tool-free snap-assembly in under 10 minutes'
    ],
    rating: 4.9,
    reviewsCount: 92,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'psn-13',
    sku: 'TBL-180-FLD',
    name: '6ft Heavy-Duty Plastic Folding Banquet & Event Table (180kg Load)',
    category: 'chairs-tables',
    categoryLabel: 'Chairs & Tables',
    retailPrice: 42000,
    wholesalePrice: 35000,
    cartonQty: 2,
    wholesaleMinQty: 4,
    stockCount: 65,
    inStock: true,
    isPublished: true,
    isFeatured: false,
    badge: 'Heavy Duty',
    imageUrl: 'https://images.unsplash.com/photo-1530018607912-eff2daa1bac4?auto=format&fit=crop&w=800&q=80',
    description: 'High-density blow-molded commercial polyethylene tabletop with powder-coated steel folding legs. Folds in half with ergonomic carry handle for event rentals, banquet catering, churches, and outdoor parties.',
    specs: {
      material: 'Virgin HDPE Tabletop + Steel Frame',
      dimensions: '180cm L x 74cm W x 74cm H',
      weight: '12.8 kg',
      uvResistant: true,
      availableColors: ['#FFFFFF', '#0B192C'],
    },
    features: [
      'Sturdy powder-coated rust-resistant folding leg frame',
      'Center fold with auto-gravity locking ring',
      'Honeycomb underside support structure supports 180kg weight',
      'Stain-resistant and waterproof easy-wipe tabletop'
    ],
    rating: 4.9,
    reviewsCount: 78,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
];

const INITIAL_SETTINGS = {
  hero: {
    headline: 'Durable Plastic Products That Never Crack Under Pressure.',
    highlightText: 'Never Crack',
    subheadline: 'Nigeria’s trusted supplier for high-grade unbreakable water drums, royal event chairs, thermal food warmers, industrial crates, and airtight home organizers. Manufactured with 100% virgin polymer for extreme longevity.',
    badgeText: 'Direct Factory Wholesale & Retail Hub • Nigeria',
    ctaPrimaryText: 'Shop Products Now',
    ctaPrimaryDestination: '#catalog',
    ctaSecondaryText: 'Wholesale Bulk Calculator',
    ctaSecondaryDestination: 'bulk-calculator',
    bannerImageUrl: '/images/hero-banner.jpg',
    displayStatus: 'published',
  },
  branding: {
    logoUrl: '/logo.svg',
    logoWhiteUrl: '/logo-white.svg',
    logoIconUrl: '/logo-icon.svg',
    logoHeight: 44,
    siteTitle: 'PSN — Plastic Store Nigeria | Durable Plastic Products Wholesale & Retail',
    faviconUrl: '/logo-icon.svg',
  },
  company: {
    officialName: 'Plastic Store Nigeria (PSN) Enterprise',
    tagline: 'Nigeria’s Premier Manufacturer & Direct Factory Supplier of Heavy-Gauge Polymers',
    description: 'Plastic Store Nigeria is the nation’s premier factory-direct distributor of heavy-duty polymer goods. Serving over 15,000 Nigerian homes, hotels, caterers, schools, and distributors across all 36 states.',
    addresses: [
      {
        id: 'lagos-hub-1',
        title: 'Lagos Central Distribution Hub',
        address: 'Trade Fair International Complex, Badagry Expressway, Lagos',
        phone: '+234 803 123 4567',
      },
      {
        id: 'lagos-hub-2',
        title: 'Alaba Wholesale Annex',
        address: 'Alaba International Market, Ojo, Lagos',
        phone: '+234 812 987 6543',
      },
      {
        id: 'abuja-depot',
        title: 'Abuja Regional Depot',
        address: 'Plot 14, Industrial Layout, Idu & Wuse 2, Abuja (FCT)',
        phone: '+234 901 234 5678',
      }
    ],
    primaryPhone: '+234 803 123 4567',
    secondaryPhone: '+234 812 987 6543',
    whatsappNumber: '2348031234567',
    supportEmail: 'orders@plasticstorenigeria.ng',
    openingHours: 'Mon - Sat: 8:00 AM - 6:00 PM (Lagos/Abuja Time)',
    deliveryNotice: 'Fast 36-State Delivery via Express Dispatch and ABC/GIG Logistics Parks',
    freeDeliveryThreshold: 150000,
    footerCopyright: '© 2026 Plastic Store Nigeria (PSN) Enterprise. All Rights Reserved.',
  },
  social: {
    whatsapp: { url: 'https://wa.me/2348031234567', enabled: true },
    instagram: { url: 'https://instagram.com/plasticstorenigeria', enabled: true },
    facebook: { url: 'https://facebook.com/plasticstorenigeria', enabled: true },
    tiktok: { url: 'https://tiktok.com/@plasticstoreng', enabled: true },
    youtube: { url: 'https://youtube.com/@plasticstorenigeria', enabled: false },
    twitter: { url: 'https://x.com/plasticstoreng', enabled: false },
  },
  banners: [
    {
      id: 'banner-01',
      headline: 'Trailer Load & Bulk Haulage Direct From Factory',
      subheadline: 'Save up to 32% on full cartons of chairs, buckets, and water drums.',
      buttonLabel: 'Calculate Bulk Savings',
      buttonAction: 'open-calc',
      imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80',
      active: true,
      badge: 'Wholesale Savings',
    }
  ],
  sections: {
    hero: true,
    features: true,
    catalog: true,
    promoBanner: true,
    durabilityGuide: true,
    testimonials: true,
  }
};

class Database {
  constructor() {
    this.data = {
      products: [],
      categories: [],
      orders: [],
      inventoryLogs: [],
      activityEvents: [],
      settings: {},
      users: [],
      auditLogs: []
    };
    this.init();
  }

  init() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(fileContent);
      } catch (err) {
        console.error('Error reading database file, recreating:', err);
        this.seedInitialData();
      }
    } else {
      this.seedInitialData();
    }
  }

  seedInitialData() {
    // Generate secure hashed password for the initial administrator
    // Salt rounds 10
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync('Admin@PSN2026!', salt);

    this.data = {
      products: INITIAL_PRODUCTS,
      categories: INITIAL_CATEGORIES,
      orders: [
        {
          id: 'PSN-782194',
          customer: {
            fullName: 'Chief Emeka Okoli',
            phone: '08035551234',
            email: 'emeka.events@gmail.com',
            state: 'Lagos',
            city: 'Ikeja',
            address: 'Plot 8, Kudirat Abiola Way, Oregun, Ikeja',
          },
          deliveryMethod: 'lagos-express',
          paymentMethod: 'bank-transfer',
          paymentStatus: 'Paid / Confirmed',
          orderStatus: 'Delivered',
          items: [
            {
              productId: 'psn-02',
              productName: 'Royal Monobloc Armless Party & Event Chair (180kg Capacity)',
              quantity: 50,
              isWholesale: true,
              unitPrice: 6800,
              totalPrice: 340000,
              selectedColor: '#FFFFFF'
            }
          ],
          subtotal: 340000,
          shippingFee: 0,
          grandTotal: 340000,
          notes: 'Deliver to event warehouse behind Mobil station.',
          createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        },
        {
          id: 'PSN-649021',
          customer: {
            fullName: 'Mrs. Folake Adebayo',
            phone: '08129994321',
            email: 'folake.bakery@yahoo.com',
            state: 'Abuja (FCT)',
            city: 'Wuse 2',
            address: 'Aminu Kano Crescent, Wuse 2, Abuja',
          },
          deliveryMethod: 'interstate-park',
          paymentMethod: 'bank-transfer',
          paymentStatus: 'Paid / Confirmed',
          orderStatus: 'Processing',
          items: [
            {
              productId: 'psn-09',
              productName: 'Heavy-Duty Industrial Bakery & Bread Stacking Crate (Pack of 5)',
              quantity: 20,
              isWholesale: true,
              unitPrice: 20500,
              totalPrice: 410000,
              selectedColor: '#1E56A0'
            }
          ],
          subtotal: 410000,
          shippingFee: 0,
          grandTotal: 410000,
          notes: 'Ship via ABC Transport Jabi Park.',
          createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
          updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        }
      ],
      inventoryLogs: [
        {
          id: 'inv-init-01',
          productId: 'psn-01',
          productName: '100L Heavy-Duty Water Storage Drum',
          type: 'Initial Stock',
          quantityChange: 120,
          previousStock: 0,
          newStock: 120,
          reason: 'Initial warehouse intake',
          adminUser: 'System',
          timestamp: new Date().toISOString()
        }
      ],
      activityEvents: [],
      settings: INITIAL_SETTINGS,
      users: [
        {
          id: 'usr-admin-01',
          name: 'PSN Lead Administrator',
          email: 'admin@psn.ng',
          passwordHash: passwordHash,
          role: 'Administrator', // 'Administrator' | 'Product Manager' | 'Order Manager'
          phone: '+234 803 123 4567',
          active: true,
          createdAt: new Date().toISOString(),
          lastLogin: null
        },
        {
          id: 'usr-pm-01',
          name: 'Store Catalog Manager',
          email: 'catalog@psn.ng',
          passwordHash: bcrypt.hashSync('Catalog@PSN2026!', salt),
          role: 'Product Manager',
          phone: '+234 812 345 6789',
          active: true,
          createdAt: new Date().toISOString(),
          lastLogin: null
        },
        {
          id: 'usr-om-01',
          name: 'Dispatch & Orders Officer',
          email: 'orders@psn.ng',
          passwordHash: bcrypt.hashSync('Orders@PSN2026!', salt),
          role: 'Order Manager',
          phone: '+234 809 876 5432',
          active: true,
          createdAt: new Date().toISOString(),
          lastLogin: null
        }
      ],
      auditLogs: [
        {
          id: 'aud-01',
          timestamp: new Date().toISOString(),
          userId: 'usr-admin-01',
          userName: 'System Init',
          userRole: 'Administrator',
          action: 'SYSTEM_INITIALIZATION',
          target: 'Database',
          details: 'Initialized PSN database with default catalog, settings and verified administrator accounts.'
        }
      ]
    };

    this.save();
  }

  save() {
    try {
      const tempFile = `${DB_FILE}.tmp`;
      fs.writeFileSync(tempFile, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tempFile, DB_FILE);
    } catch (err) {
      console.error('Failed to write database file:', err);
    }
  }

  // --- PRODUCTS ---
  getProducts(options = {}) {
    let result = [...this.data.products];
    if (!options.includeDrafts) {
      result = result.filter(p => p.isPublished !== false);
    }
    if (options.category && options.category !== 'all') {
      result = result.filter(p => p.category === options.category);
    }
    if (options.search) {
      const q = options.search.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) ||
        p.categoryLabel.toLowerCase().includes(q) ||
        (p.sku && p.sku.toLowerCase().includes(q)) ||
        (p.specs && p.specs.material && p.specs.material.toLowerCase().includes(q))
      );
    }
    return result;
  }

  getProductById(id) {
    return this.data.products.find(p => p.id === id);
  }

  createProduct(productData, adminUser = 'Admin') {
    const id = productData.id || `psn-${Date.now().toString(36)}`;
    const newProduct = {
      ...productData,
      id,
      inStock: (productData.stockCount || 0) > 0,
      stockCount: Number(productData.stockCount) || 0,
      retailPrice: Number(productData.retailPrice) || 0,
      wholesalePrice: Number(productData.wholesalePrice) || 0,
      cartonQty: Number(productData.cartonQty) || 1,
      wholesaleMinQty: Number(productData.wholesaleMinQty) || 1,
      isPublished: productData.isPublished !== false,
      rating: productData.rating || 5.0,
      reviewsCount: productData.reviewsCount || 0,
      features: Array.isArray(productData.features) ? productData.features : [],
      specs: {
        material: productData.specs?.material || 'Virgin Polymer',
        capacity: productData.specs?.capacity || '',
        dimensions: productData.specs?.dimensions || '',
        weight: productData.specs?.weight || '',
        foodGrade: !!productData.specs?.foodGrade,
        uvResistant: !!productData.specs?.uvResistant,
        availableColors: productData.specs?.availableColors || ['#1E56A0'],
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.products.unshift(newProduct);

    // Log inventory creation
    this.data.inventoryLogs.unshift({
      id: `inv-${Date.now()}`,
      productId: id,
      productName: newProduct.name,
      type: 'Initial Stock',
      quantityChange: newProduct.stockCount,
      previousStock: 0,
      newStock: newProduct.stockCount,
      reason: 'New product catalog entry created',
      adminUser,
      timestamp: new Date().toISOString()
    });

    this.save();
    return newProduct;
  }

  updateProduct(id, updates, adminUser = 'Admin') {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    const current = this.data.products[index];
    const prevStock = current.stockCount;
    const newStock = updates.stockCount !== undefined ? Number(updates.stockCount) : prevStock;

    if (newStock !== prevStock) {
      this.data.inventoryLogs.unshift({
        id: `inv-${Date.now()}`,
        productId: id,
        productName: updates.name || current.name,
        type: 'Restock / Manual Adjustment',
        quantityChange: newStock - prevStock,
        previousStock: prevStock,
        newStock: newStock,
        reason: updates.stockChangeReason || 'Administrative catalog update',
        adminUser,
        timestamp: new Date().toISOString()
      });
    }

    const updated = {
      ...current,
      ...updates,
      stockCount: newStock,
      inStock: newStock > 0,
      retailPrice: updates.retailPrice !== undefined ? Number(updates.retailPrice) : current.retailPrice,
      wholesalePrice: updates.wholesalePrice !== undefined ? Number(updates.wholesalePrice) : current.wholesalePrice,
      updatedAt: new Date().toISOString(),
    };

    this.data.products[index] = updated;
    this.save();
    return updated;
  }

  deleteProduct(id) {
    const index = this.data.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.data.products.splice(index, 1);
    this.save();
    return true;
  }

  // --- CATEGORIES ---
  getCategories() {
    return this.data.categories.sort((a, b) => a.displayOrder - b.displayOrder);
  }

  saveCategory(cat) {
    const existingIndex = this.data.categories.findIndex(c => c.id === cat.id);
    if (existingIndex > -1) {
      this.data.categories[existingIndex] = { ...this.data.categories[existingIndex], ...cat };
    } else {
      this.data.categories.push({
        ...cat,
        id: cat.id || cat.label.toLowerCase().replace(/[^a-z0-9]/g, '-'),
        displayOrder: this.data.categories.length
      });
    }
    this.save();
    return cat;
  }

  deleteCategory(id) {
    if (id === 'all') return false; // Prevent deleting 'all'
    const index = this.data.categories.findIndex(c => c.id === id);
    if (index === -1) return false;
    this.data.categories.splice(index, 1);
    this.save();
    return true;
  }

  // --- ORDERS ---
  getOrders(filter = {}) {
    let result = [...this.data.orders];
    if (filter.status && filter.status !== 'all') {
      result = result.filter(o => o.orderStatus.toLowerCase() === filter.status.toLowerCase());
    }
    if (filter.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(o => 
        o.id.toLowerCase().includes(q) ||
        o.customer.fullName.toLowerCase().includes(q) ||
        o.customer.phone.includes(q) ||
        o.customer.city.toLowerCase().includes(q) ||
        o.customer.state.toLowerCase().includes(q)
      );
    }
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  getOrderById(id) {
    return this.data.orders.find(o => o.id === id);
  }

  createOrder(orderData) {
    // Validate stock for all items
    for (const item of orderData.items) {
      const product = this.getProductById(item.productId || item.product?.id);
      if (!product) {
        throw new Error(`Product ${item.productName || item.product?.name || 'Item'} not found in catalogue.`);
      }
      if (product.stockCount < item.quantity) {
        throw new Error(`Insufficient stock for "${product.name}". Available: ${product.stockCount}, Requested: ${item.quantity}.`);
      }
    }

    // Deduct stock and record inventory movement
    for (const item of orderData.items) {
      const product = this.getProductById(item.productId || item.product?.id);
      const prevStock = product.stockCount;
      const newStock = Math.max(0, prevStock - item.quantity);
      product.stockCount = newStock;
      product.inStock = newStock > 0;
      product.updatedAt = new Date().toISOString();

      this.data.inventoryLogs.unshift({
        id: `inv-${Date.now()}-${product.id}`,
        productId: product.id,
        productName: product.name,
        type: 'Order Deduction',
        quantityChange: -item.quantity,
        previousStock: prevStock,
        newStock: newStock,
        reason: `Deduction for customer order #${orderData.id || 'NEW'}`,
        adminUser: 'Checkout System',
        timestamp: new Date().toISOString()
      });
    }

    const orderId = orderData.id || `PSN-${Math.floor(100000 + Math.random() * 900000)}`;
    const newOrder = {
      ...orderData,
      id: orderId,
      orderStatus: 'New',
      paymentStatus: orderData.paymentMethod === 'cod' ? 'Cash on Delivery Authorized' : 'Pending Verification',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.data.orders.unshift(newOrder);

    // Track analytics event
    this.logActivity('order_placed', {
      orderId,
      total: newOrder.grandTotal,
      itemsCount: newOrder.items.length
    });

    this.save();
    return newOrder;
  }

  updateOrderStatus(id, newStatus, paymentStatus, adminUser = 'Admin', notes = '') {
    const order = this.getOrderById(id);
    if (!order) return null;

    const previousStatus = order.orderStatus;
    order.orderStatus = newStatus || order.orderStatus;
    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }
    if (notes) {
      order.notes = `${order.notes ? order.notes + '\n' : ''}[${new Date().toLocaleTimeString()} by ${adminUser}]: ${notes}`;
    }
    order.updatedAt = new Date().toISOString();

    // If order was cancelled, restore inventory
    if (newStatus === 'Cancelled' && previousStatus !== 'Cancelled') {
      for (const item of order.items) {
        const product = this.getProductById(item.productId);
        if (product) {
          const prev = product.stockCount;
          product.stockCount += item.quantity;
          product.inStock = true;
          this.data.inventoryLogs.unshift({
            id: `inv-rest-${Date.now()}-${product.id}`,
            productId: product.id,
            productName: product.name,
            type: 'Order Cancellation Return',
            quantityChange: item.quantity,
            previousStock: prev,
            newStock: product.stockCount,
            reason: `Order #${id} cancelled, restored stock`,
            adminUser,
            timestamp: new Date().toISOString()
          });
        }
      }
    }

    this.save();
    return order;
  }

  // --- INVENTORY ---
  getInventoryLogs(limit = 100) {
    return this.data.inventoryLogs.slice(0, limit);
  }

  getInventoryAlerts() {
    const lowStockThreshold = 20;
    const lowStock = this.data.products.filter(p => p.stockCount > 0 && p.stockCount <= lowStockThreshold);
    const outOfStock = this.data.products.filter(p => p.stockCount <= 0);
    return {
      lowStock,
      outOfStock,
      lowStockCount: lowStock.length,
      outOfStockCount: outOfStock.length
    };
  }

  // --- SETTINGS ---
  getSettings() {
    return this.data.settings;
  }

  updateSettings(section, updates) {
    if (!this.data.settings[section]) {
      this.data.settings[section] = {};
    }
    this.data.settings[section] = {
      ...this.data.settings[section],
      ...updates
    };
    this.save();
    return this.data.settings[section];
  }

  // --- ACTIVITY & ANALYTICS ---
  logActivity(type, metadata = {}) {
    const event = {
      id: `act-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      type, // 'product_viewed' | 'added_to_cart' | 'checkout_started' | 'order_placed'
      metadata,
      timestamp: new Date().toISOString()
    };
    this.data.activityEvents.unshift(event);
    // Keep max 500 events
    if (this.data.activityEvents.length > 500) {
      this.data.activityEvents.length = 500;
    }
    this.save();
  }

  getAnalytics() {
    const totalOrders = this.data.orders.length;
    const totalRevenue = this.data.orders
      .filter(o => o.orderStatus !== 'Cancelled')
      .reduce((sum, o) => sum + (o.grandTotal || 0), 0);

    const pendingOrders = this.data.orders.filter(o => o.orderStatus === 'New' || o.orderStatus === 'Processing').length;
    const deliveredOrders = this.data.orders.filter(o => o.orderStatus === 'Delivered').length;

    const viewsCount = this.data.activityEvents.filter(e => e.type === 'product_viewed').length;
    const cartAddsCount = this.data.activityEvents.filter(e => e.type === 'added_to_cart').length;
    const checkoutStartsCount = this.data.activityEvents.filter(e => e.type === 'checkout_started').length;

    const publishedProducts = this.data.products.filter(p => p.isPublished !== false).length;
    const draftProducts = this.data.products.filter(p => p.isPublished === false).length;
    const alerts = this.getInventoryAlerts();

    return {
      totalRevenue,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      publishedProducts,
      draftProducts,
      lowStockCount: alerts.lowStockCount,
      outOfStockCount: alerts.outOfStockCount,
      funnel: {
        productViews: viewsCount,
        addedToCart: cartAddsCount,
        checkoutStarted: checkoutStartsCount,
        ordersCompleted: totalOrders
      },
      recentActivity: this.data.activityEvents.slice(0, 15)
    };
  }

  // --- USERS ---
  getUserByEmail(email) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  getUserById(id) {
    return this.data.users.find(u => u.id === id);
  }

  createUser(userData) {
    const salt = bcrypt.genSaltSync(10);
    const passwordHash = bcrypt.hashSync(userData.password, salt);
    const newUser = {
      id: `usr-${Date.now().toString(36)}`,
      name: userData.name,
      email: userData.email.toLowerCase(),
      passwordHash,
      role: userData.role || 'Order Manager',
      phone: userData.phone || '',
      active: true,
      createdAt: new Date().toISOString(),
      lastLogin: null
    };
    this.data.users.push(newUser);
    this.save();
    return {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      active: newUser.active,
      createdAt: newUser.createdAt
    };
  }

  updateUserPassword(userId, newPassword) {
    const user = this.getUserById(userId);
    if (!user) return false;
    const salt = bcrypt.genSaltSync(10);
    user.passwordHash = bcrypt.hashSync(newPassword, salt);
    this.save();
    return true;
  }

  listUsers() {
    return this.data.users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      role: u.role,
      phone: u.phone,
      active: u.active,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin
    }));
  }

  // --- AUDIT LOGS ---
  addAuditLog(entry) {
    const log = {
      id: `aud-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      userId: entry.userId || 'system',
      userName: entry.userName || 'System',
      userRole: entry.userRole || 'Admin',
      action: entry.action,
      target: entry.target || '',
      details: entry.details || ''
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 1000) {
      this.data.auditLogs.length = 1000;
    }
    this.save();
    return log;
  }

  getAuditLogs(limit = 100) {
    return this.data.auditLogs.slice(0, limit);
  }
}

export const db = new Database();
