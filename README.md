# PSN — Plastic Store Nigeria 🇳🇬

A full-stack e-commerce web application for **Plastic Store Nigeria (PSN)** — a B2B/B2C platform for premium, durable plastic household, commercial, and industrial products.

## 🚀 Features

### Storefront
- **Product Catalog** — Browse 50+ products across 8 categories (Buckets & Basins, Food Storage, Chairs & Tables, Storage Boxes, Waste Drums, Laundry & Utility, Industrial Crates)
- **Search & Filter** — Live search, category filter, material filter (HDPE, Polypropylene, Food-Grade), and sort controls
- **Dual Pricing** — Retail and wholesale pricing with carton quantity support
- **Wholesale Calculator** — Interactive bulk order calculator with tiered discounts; generates WhatsApp quote
- **Product Detail Modal** — Image gallery, specifications, color selector, and add-to-cart
- **Cart & Checkout** — Slide-out cart drawer with free delivery progress, full checkout with Nigerian state delivery and bank transfer / cash on delivery payment
- **Wishlist** — Save products for later
- **WhatsApp Integration** — Order confirmation and wholesale inquiry via WhatsApp

### Admin Portal
- **Secure Login** — JWT-authenticated admin portal (accessible via `?admin=true` or `Ctrl+Shift+A`)
- **Dashboard Overview** — Sales KPIs, revenue charts, recent orders, inventory alerts
- **Product Management** — Create, edit, publish/draft, delete products; image upload
- **Category Management** — Add/edit/remove product categories
- **Order Management** — View all orders, update order and payment status, filter by status
- **Inventory Tracking** — Stock level management, low-stock alerts, inventory movement log
- **Site Settings** — Edit homepage hero, branding (colours, fonts), company info, social links
- **Staff Management** — Create admin/staff accounts with role-based access
- **Audit Log** — Track all admin actions

## 🛠️ Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React 19, TypeScript, Vite 8        |
| Styling   | Tailwind CSS 3                      |
| Icons     | Lucide React                        |
| Backend   | Node.js, Express 5                  |
| Database  | SQLite (via `better-sqlite3` / JSON) |
| Auth      | JWT (`jsonwebtoken` + `bcryptjs`)   |
| Uploads   | Multer                              |

## 📦 Getting Started

### Prerequisites
- Node.js >= 18

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/PSN.git
cd PSN

# Install dependencies
npm install
```

### Development

Run both the Vite dev server and the Express API server in separate terminals:

```bash
# Terminal 1: Frontend (Vite dev server on http://localhost:5173)
npm run dev

# Terminal 2: Backend API (Express on http://localhost:5000)
npm run server
```

The Vite config proxies `/api` requests to `http://localhost:5000`, so the frontend and backend work together seamlessly.

### Production Build

```bash
npm run build
# Then serve the dist/ folder with any static host, pointing /api to the Express server
```

## 🔐 Default Admin Credentials

On first run, the server seeds a default admin account:

| Field    | Value                   |
|----------|-------------------------|
| Email    | `admin@psn.ng`          |
| Password | `PSN@Admin2024!`        |

> ⚠️ **Change these credentials immediately after first login.**

## 📁 Project Structure

```
PSN/
├── public/                  # Static assets (logo, images)
├── server/
│   ├── auth.js              # JWT auth middleware
│   ├── db.js                # SQLite database & seeding
│   ├── index.js             # Express API server
│   └── uploads/             # Uploaded product images
├── src/
│   ├── admin/
│   │   ├── AdminDashboard.tsx
│   │   └── AdminLoginModal.tsx
│   ├── components/          # All storefront UI components
│   ├── data/
│   │   └── products.ts      # Default product catalogue
│   ├── services/
│   │   └── api.ts           # Frontend API client
│   ├── types/
│   │   └── index.ts         # TypeScript interfaces
│   ├── App.tsx              # Root application component
│   ├── index.css            # Global styles + Tailwind
│   └── main.tsx             # React entry point
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

## 🌍 Deployment

The app is designed for a single-server Node.js deployment:

1. Build the frontend: `npm run build`
2. Serve `dist/` as static files from the Express server (add `app.use(express.static('dist'))` in production mode)
3. Set the `PORT` environment variable as needed

---

*Built with ❤️ for Nigerian businesses.*
