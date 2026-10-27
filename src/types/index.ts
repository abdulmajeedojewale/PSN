export type ProductCategory =
  | 'all'
  | 'buckets-basins'
  | 'food-storage'
  | 'chairs-tables'
  | 'storage-boxes'
  | 'waste-drums'
  | 'laundry-utility'
  | 'industrial-crates'
  | string;

export interface Category {
  id: string;
  label: string;
  icon: string;
  description: string;
  displayOrder: number;
}

export interface Product {
  id: string;
  sku?: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  retailPrice: number;
  wholesalePrice: number;
  cartonQty: number;
  wholesaleMinQty: number;
  description: string;
  specs: {
    material: string;
    capacity?: string;
    dimensions?: string;
    weight?: string;
    foodGrade?: boolean;
    uvResistant?: boolean;
    availableColors: string[];
  };
  features: string[];
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  stockCount: number;
  isPublished?: boolean;
  isFeatured?: boolean;
  badge?: 'Best Seller' | 'Wholesale Deal' | 'Heavy Duty' | 'New' | 'BPA Free' | string;
  imageUrl: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isWholesale: boolean;
  selectedColor?: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  isWholesale: boolean;
  unitPrice: number;
  totalPrice: number;
  selectedColor?: string;
  imageUrl?: string;
}

export interface CustomerDetails {
  fullName: string;
  phone: string;
  email?: string;
  state: string;
  city: string;
  address: string;
}

export interface Order {
  id: string;
  customer: CustomerDetails;
  deliveryMethod: string;
  paymentMethod: string;
  paymentStatus: string;
  orderStatus: 'New' | 'Processing' | 'Dispatched / In Transit' | 'Delivered' | 'Cancelled' | string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AdminRole = 'Administrator' | 'Product Manager' | 'Order Manager';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  phone?: string;
  active: boolean;
  createdAt?: string;
  lastLogin?: string | null;
}

export interface HeroSettings {
  headline: string;
  highlightText?: string;
  subheadline: string;
  badgeText: string;
  ctaPrimaryText: string;
  ctaPrimaryDestination: string;
  ctaSecondaryText: string;
  ctaSecondaryDestination: string;
  bannerImageUrl: string;
  displayStatus: 'published' | 'draft';
}

export interface BrandingSettings {
  logoUrl: string;
  logoWhiteUrl: string;
  logoIconUrl: string;
  logoHeight: number;
  siteTitle: string;
  faviconUrl: string;
}

export interface CompanyAddress {
  id: string;
  title: string;
  address: string;
  phone: string;
}

export interface CompanySettings {
  officialName: string;
  tagline: string;
  description: string;
  addresses: CompanyAddress[];
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  supportEmail: string;
  openingHours: string;
  deliveryNotice: string;
  freeDeliveryThreshold: number;
  footerCopyright: string;
}

export interface SocialLink {
  url: string;
  enabled: boolean;
}

export interface PromoBanner {
  id: string;
  headline: string;
  subheadline: string;
  buttonLabel: string;
  buttonAction: string;
  imageUrl: string;
  active: boolean;
  badge: string;
}

export interface SiteSettings {
  hero: HeroSettings;
  branding: BrandingSettings;
  company: CompanySettings;
  social: Record<string, SocialLink>;
  banners: PromoBanner[];
  sections: Record<string, boolean>;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  target: string;
  details: string;
}

export interface InventoryLog {
  id: string;
  productId: string;
  productName: string;
  type: string;
  quantityChange: number;
  previousStock: number;
  newStock: number;
  reason: string;
  adminUser: string;
  timestamp: string;
}

export interface AnalyticsSummary {
  totalRevenue: number;
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  publishedProducts: number;
  draftProducts: number;
  lowStockCount: number;
  outOfStockCount: number;
  funnel: {
    productViews: number;
    addedToCart: number;
    checkoutStarted: number;
    ordersCompleted: number;
  };
  recentActivity: Array<{
    id: string;
    type: string;
    metadata: any;
    timestamp: string;
  }>;
}
