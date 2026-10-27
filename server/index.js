import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import { db } from './db.js';
import { 
  generateToken, 
  authMiddleware, 
  optionalAuthMiddleware, 
  requireRole, 
  logAdminAction 
} from './auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads folder
const UPLOADS_DIR = path.join(__dirname, 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/uploads', express.static(UPLOADS_DIR));

// Configure Multer for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const sanitizedName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    const uniqueName = `${sanitizedName}_${Date.now()}${ext}`;
    cb(null, uniqueName);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml', 'image/gif'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file format. Only JPEG, PNG, WEBP, and SVG images are permitted.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter
});

// ==========================================
// 1. FILE UPLOAD ENDPOINT
// ==========================================
app.post('/api/upload', authMiddleware, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image file uploaded.' });
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  logAdminAction(req, 'FILE_UPLOAD', 'Uploads', `Uploaded file: ${req.file.originalname} -> ${fileUrl}`);

  return res.json({
    success: true,
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// ==========================================
// 2. AUTHENTICATION & ADMIN ACCOUNTS
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user || !user.active) {
    return res.status(401).json({ error: 'Invalid credentials or inactive account.' });
  }

  const isPasswordValid = bcrypt.compareSync(password, user.passwordHash);
  if (!isPasswordValid) {
    return res.status(401).json({ error: 'Invalid credentials or incorrect password.' });
  }

  // Update last login
  user.lastLogin = new Date().toISOString();
  db.save();

  const token = generateToken(user);
  db.addAuditLog({
    userId: user.id,
    userName: user.name,
    userRole: user.role,
    action: 'USER_LOGIN',
    target: 'Auth',
    details: `User ${user.email} successfully signed in to Admin Portal.`
  });

  return res.json({
    success: true,
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone
    }
  });
});

app.get('/api/auth/me', authMiddleware, (req, res) => {
  const user = db.getUserById(req.user.id);
  if (!user) {
    return res.status(404).json({ error: 'User profile not found.' });
  }

  return res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    phone: user.phone,
    lastLogin: user.lastLogin
  });
});

app.post('/api/auth/change-password', authMiddleware, (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required.' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
  }

  const user = db.getUserById(req.user.id);
  if (!bcrypt.compareSync(currentPassword, user.passwordHash)) {
    return res.status(400).json({ error: 'Current password is incorrect.' });
  }

  db.updateUserPassword(user.id, newPassword);
  logAdminAction(req, 'PASSWORD_CHANGED', 'User Account', 'Administrator updated account password.');

  return res.json({ success: true, message: 'Password updated successfully.' });
});

app.get('/api/auth/users', authMiddleware, requireRole('Administrator'), (req, res) => {
  const users = db.listUsers();
  return res.json(users);
});

app.post('/api/auth/users', authMiddleware, requireRole('Administrator'), (req, res) => {
  const { name, email, password, role, phone } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'A user with this email address already exists.' });
  }

  const newUser = db.createUser({ name, email, password, role, phone });
  logAdminAction(req, 'USER_CREATED', 'Admin Accounts', `Created new administrative account: ${email} (${role})`);

  return res.status(201).json(newUser);
});

// ==========================================
// 3. PRODUCTS & CATALOGUE MANAGEMENT
// ==========================================
app.get('/api/products', optionalAuthMiddleware, (req, res) => {
  const isStaff = !!req.user;
  const includeDrafts = req.query.includeDrafts === 'true' && isStaff;
  const { category, search } = req.query;

  const products = db.getProducts({
    includeDrafts,
    category,
    search
  });

  return res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }
  return res.json(product);
});

app.post('/api/products', authMiddleware, requireRole('Administrator', 'Product Manager'), (req, res) => {
  const { name, category, retailPrice } = req.body;
  if (!name || !category || retailPrice === undefined) {
    return res.status(400).json({ error: 'Product name, category, and retail price are required.' });
  }

  const created = db.createProduct(req.body, req.user.name);
  logAdminAction(req, 'PRODUCT_CREATED', `Product #${created.id}`, `Created product "${created.name}" (Retail: ₦${created.retailPrice})`);

  return res.status(201).json(created);
});

app.put('/api/products/:id', authMiddleware, requireRole('Administrator', 'Product Manager'), (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body, req.user.name);
  if (!updated) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  logAdminAction(req, 'PRODUCT_UPDATED', `Product #${updated.id}`, `Updated product "${updated.name}"`);
  return res.json(updated);
});

app.patch('/api/products/:id/stock', authMiddleware, requireRole('Administrator', 'Product Manager'), (req, res) => {
  const { stockCount, reason } = req.body;
  if (stockCount === undefined || isNaN(stockCount)) {
    return res.status(400).json({ error: 'Valid stockCount number is required.' });
  }

  const updated = db.updateProduct(
    req.params.id, 
    { stockCount: Number(stockCount), stockChangeReason: reason || 'Manual stock update' }, 
    req.user.name
  );
  if (!updated) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  logAdminAction(req, 'STOCK_ADJUSTED', `Product #${updated.id}`, `Adjusted stock for "${updated.name}" to ${updated.stockCount} units.`);
  return res.json(updated);
});

app.patch('/api/products/:id/publish', authMiddleware, requireRole('Administrator', 'Product Manager'), (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  const newStatus = !product.isPublished;
  const updated = db.updateProduct(req.params.id, { isPublished: newStatus }, req.user.name);

  logAdminAction(req, 'PRODUCT_PUBLISH_TOGGLED', `Product #${updated.id}`, `Set published status of "${updated.name}" to ${newStatus}`);
  return res.json(updated);
});

app.delete('/api/products/:id', authMiddleware, requireRole('Administrator', 'Product Manager'), (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'Product not found.' });
  }

  db.deleteProduct(req.params.id);
  logAdminAction(req, 'PRODUCT_DELETED', `Product #${req.params.id}`, `Deleted product "${product.name}" from catalogue.`);
  return res.json({ success: true, message: 'Product deleted.' });
});

// ==========================================
// 4. CATEGORIES
// ==========================================
app.get('/api/categories', (req, res) => {
  const categories = db.getCategories();
  return res.json(categories);
});

app.post('/api/categories', authMiddleware, requireRole('Administrator', 'Product Manager'), (req, res) => {
  const { label } = req.body;
  if (!label) {
    return res.status(400).json({ error: 'Category label is required.' });
  }
  const saved = db.saveCategory(req.body);
  logAdminAction(req, 'CATEGORY_CREATED', `Category #${saved.id}`, `Created category "${saved.label}"`);
  return res.status(201).json(saved);
});

app.put('/api/categories/:id', authMiddleware, requireRole('Administrator', 'Product Manager'), (req, res) => {
  const saved = db.saveCategory({ ...req.body, id: req.params.id });
  logAdminAction(req, 'CATEGORY_UPDATED', `Category #${saved.id}`, `Updated category "${saved.label}"`);
  return res.json(saved);
});

app.delete('/api/categories/:id', authMiddleware, requireRole('Administrator', 'Product Manager'), (req, res) => {
  const success = db.deleteCategory(req.params.id);
  if (!success) {
    return res.status(400).json({ error: 'Cannot delete this category.' });
  }
  logAdminAction(req, 'CATEGORY_DELETED', `Category #${req.params.id}`, `Deleted category #${req.params.id}`);
  return res.json({ success: true });
});

// ==========================================
// 5. ORDERS & CHECKOUT
// ==========================================
app.post('/api/orders', (req, res) => {
  try {
    const { customer, items, deliveryMethod, paymentMethod, subtotal, shippingFee, grandTotal, notes } = req.body;

    if (!customer || !customer.fullName || !customer.phone || !customer.state || !customer.address) {
      return res.status(400).json({ error: 'Incomplete customer details. Full name, phone, state, and address are required.' });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item.' });
    }

    const newOrder = db.createOrder(req.body);

    db.addAuditLog({
      userId: 'public-checkout',
      userName: customer.fullName,
      userRole: 'Customer',
      action: 'ORDER_PLACED',
      target: `Order #${newOrder.id}`,
      details: `New order placed for ${items.length} items. Total: ₦${grandTotal.toLocaleString()} to ${customer.city}, ${customer.state}.`
    });

    return res.status(201).json({
      success: true,
      order: newOrder
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }
});

app.get('/api/orders', authMiddleware, requireRole('Administrator', 'Order Manager'), (req, res) => {
  const { status, search } = req.query;
  const orders = db.getOrders({ status, search });
  return res.json(orders);
});

app.get('/api/orders/:id', authMiddleware, requireRole('Administrator', 'Order Manager'), (req, res) => {
  const order = db.getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({ error: 'Order not found.' });
  }
  return res.json(order);
});

app.patch('/api/orders/:id/status', authMiddleware, requireRole('Administrator', 'Order Manager'), (req, res) => {
  const { orderStatus, paymentStatus, notes } = req.body;
  const updated = db.updateOrderStatus(req.params.id, orderStatus, paymentStatus, req.user.name, notes);
  if (!updated) {
    return res.status(404).json({ error: 'Order not found.' });
  }

  logAdminAction(
    req, 
    'ORDER_STATUS_UPDATED', 
    `Order #${updated.id}`, 
    `Status set to "${updated.orderStatus}", Payment: "${updated.paymentStatus}".`
  );
  return res.json(updated);
});

// ==========================================
// 6. INVENTORY MANAGEMENT
// ==========================================
app.get('/api/inventory/logs', authMiddleware, requireRole('Administrator', 'Product Manager', 'Order Manager'), (req, res) => {
  const logs = db.getInventoryLogs(Number(req.query.limit) || 100);
  return res.json(logs);
});

app.get('/api/inventory/alerts', authMiddleware, (req, res) => {
  const alerts = db.getInventoryAlerts();
  return res.json(alerts);
});

// ==========================================
// 7. ACTIVITY TRACKING & ANALYTICS
// ==========================================
app.post('/api/activity', (req, res) => {
  const { type, metadata } = req.body;
  if (!type) {
    return res.status(400).json({ error: 'Activity type is required.' });
  }
  db.logActivity(type, metadata);
  return res.json({ success: true });
});

app.get('/api/analytics', authMiddleware, (req, res) => {
  const analytics = db.getAnalytics();
  return res.json(analytics);
});

// ==========================================
// 8. SITE SETTINGS & CONTENT CONTROL
// ==========================================
app.get('/api/settings', (req, res) => {
  const settings = db.getSettings();
  return res.json(settings);
});

app.put('/api/settings/homepage', authMiddleware, requireRole('Administrator'), (req, res) => {
  const updated = db.updateSettings('hero', req.body.hero || {});
  if (req.body.banners) {
    db.updateSettings('banners', req.body.banners);
  }
  if (req.body.sections) {
    db.updateSettings('sections', req.body.sections);
  }

  logAdminAction(req, 'HOMEPAGE_UPDATED', 'Homepage Settings', 'Administrator updated hero headlines, promotional banners or sections.');
  return res.json({ success: true, settings: db.getSettings() });
});

app.put('/api/settings/branding', authMiddleware, requireRole('Administrator'), (req, res) => {
  const updated = db.updateSettings('branding', req.body);
  logAdminAction(req, 'BRANDING_UPDATED', 'Branding Settings', 'Administrator updated PSN brand logos or favicon.');
  return res.json({ success: true, branding: updated });
});

app.put('/api/settings/company', authMiddleware, requireRole('Administrator'), (req, res) => {
  const updated = db.updateSettings('company', req.body);
  logAdminAction(req, 'COMPANY_SETTINGS_UPDATED', 'Company Information', 'Administrator updated company address, phone, WhatsApp or policies.');
  return res.json({ success: true, company: updated });
});

app.put('/api/settings/social', authMiddleware, requireRole('Administrator'), (req, res) => {
  const updated = db.updateSettings('social', req.body);
  logAdminAction(req, 'SOCIAL_SETTINGS_UPDATED', 'Social Media Links', 'Administrator updated company social links.');
  return res.json({ success: true, social: updated });
});

// ==========================================
// 9. AUDIT LOGS
// ==========================================
app.get('/api/audit-logs', authMiddleware, requireRole('Administrator'), (req, res) => {
  const logs = db.getAuditLogs(Number(req.query.limit) || 100);
  return res.json(logs);
});

// Start Server
app.listen(PORT, () => {
  console.log(`[PSN Backend Server] Running on http://localhost:${PORT}`);
  console.log(`[PSN Backend Server] Uploads directory: ${UPLOADS_DIR}`);
});
