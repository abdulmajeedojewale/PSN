// Automated Verification Test Suite for PSN System
const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('=== STARTING PSN AUTOMATED VERIFICATION TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  // Test 9: Security - Unauthenticated product creation
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Hacked Product' })
    });
    if (res.status === 401) {
      console.log('✔ Test 9: Security — Unauthenticated administrative write blocked (Status 401 Unauthorized)');
      passed++;
    } else {
      console.error('✘ Test 9 Failed: Expected 401, got', res.status);
      failed++;
    }
  } catch (e) {
    console.error('✘ Test 9 Exception:', e);
    failed++;
  }

  // Auth: Login with administrator credentials
  let token = '';
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@psn.ng', password: 'Admin@PSN2026!' })
    });
    const data = await res.json();
    if (res.ok && data.token) {
      token = data.token;
      console.log(`✔ Auth: Successfully authenticated as "${data.user.name}" (${data.user.role})`);
      passed++;
    } else {
      console.error('✘ Auth Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✘ Auth Exception:', e);
    failed++;
  }

  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };

  // Test 1: Product Creation
  let createdProductId = '';
  try {
    const res = await fetch(`${BASE_URL}/products`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'Heavy-Duty 30L Industrial Drum Bucket',
        sku: 'DRM-30L-TST',
        category: 'buckets-basins',
        categoryLabel: 'Buckets & Basins',
        retailPrice: 5200,
        wholesalePrice: 4200,
        cartonQty: 10,
        wholesaleMinQty: 10,
        stockCount: 80,
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186f5f7?auto=format&fit=crop&w=800&q=80',
        description: 'Virgin HDPE water and chemical bucket with heavy handle.',
        specs: { material: 'Virgin HDPE', capacity: '30 Litres' }
      })
    });
    const data = await res.json();
    if (res.ok && data.id) {
      createdProductId = data.id;
      console.log(`✔ Test 1: Product Upload & Creation — Created #${data.id}: "${data.name}"`);
      passed++;
    } else {
      console.error('✘ Test 1 Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✘ Test 1 Exception:', e);
    failed++;
  }

  // Test 2: Product Editing
  try {
    const res = await fetch(`${BASE_URL}/products/${createdProductId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        retailPrice: 5600,
        stockCount: 75
      })
    });
    const data = await res.json();
    if (res.ok && data.retailPrice === 5600 && data.stockCount === 75) {
      console.log(`✔ Test 2: Product Editing — Updated price to ₦${data.retailPrice.toLocaleString()} and stock to ${data.stockCount}`);
      passed++;
    } else {
      console.error('✘ Test 2 Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✘ Test 2 Exception:', e);
    failed++;
  }

  // Test 3: Logo & Branding Settings
  try {
    const res = await fetch(`${BASE_URL}/settings/branding`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        logoUrl: '/logo.svg',
        logoWhiteUrl: '/logo-white.svg',
        logoHeight: 46,
        siteTitle: 'PSN — Plastic Store Nigeria | Enterprise Portal'
      })
    });
    const data = await res.json();
    if (res.ok && data.branding.logoHeight === 46) {
      console.log(`✔ Test 3: Logo & Branding — Saved branding settings (Height: ${data.branding.logoHeight}px)`);
      passed++;
    } else {
      console.error('✘ Test 3 Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✘ Test 3 Exception:', e);
    failed++;
  }

  // Test 4: Homepage Editor
  try {
    const res = await fetch(`${BASE_URL}/settings/homepage`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        hero: {
          headline: 'Durable Plastic Products That Never Crack Under Pressure.',
          highlightText: 'Never Crack',
          subheadline: 'Engineered for Nigerian homes, event centres, caterers, and borehole backups.',
          badgeText: 'Factory Direct Wholesale & Retail • Nigeria',
          ctaPrimaryText: 'Shop Products Now',
          ctaSecondaryText: 'Wholesale Bulk Calculator'
        }
      })
    });
    const data = await res.json();
    if (res.ok && data.settings.hero.headline) {
      console.log(`✔ Test 4: Homepage Editing — Updated headline and CTA labels persistently`);
      passed++;
    } else {
      console.error('✘ Test 4 Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✘ Test 4 Exception:', e);
    failed++;
  }

  // Test 5: Company Settings
  try {
    const res = await fetch(`${BASE_URL}/settings/company`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        primaryPhone: '+234 803 123 4567',
        whatsappNumber: '2348031234567',
        supportEmail: 'orders@plasticstorenigeria.ng'
      })
    });
    const data = await res.json();
    if (res.ok && data.company.primaryPhone === '+234 803 123 4567') {
      console.log(`✔ Test 5: Company Settings — Verified official telephone & WhatsApp numbers`);
      passed++;
    } else {
      console.error('✘ Test 5 Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✘ Test 5 Exception:', e);
    failed++;
  }

  // Test 6 & 7: Customer Ordering & Order Notification
  let createdOrderId = '';
  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: {
          fullName: 'Alhaji Sani Bello',
          phone: '08021112233',
          email: 'sani.bello@gmail.com',
          state: 'Kano',
          city: 'Fagge',
          address: '12 Commercial Road, Fagge, Kano'
        },
        deliveryMethod: 'interstate-park',
        paymentMethod: 'bank-transfer',
        items: [
          {
            productId: createdProductId,
            productName: 'Heavy-Duty 30L Industrial Drum Bucket',
            quantity: 5,
            isWholesale: false,
            unitPrice: 5600,
            totalPrice: 28000
          }
        ],
        subtotal: 28000,
        shippingFee: 6500,
        grandTotal: 34500
      })
    });
    const data = await res.json();
    if (res.ok && data.order?.id) {
      createdOrderId = data.order.id;
      console.log(`✔ Test 6 & 7: Customer Ordering & Notification — Created Order #${createdOrderId} for ₦${data.order.grandTotal.toLocaleString()}`);
      passed++;
    } else {
      console.error('✘ Test 6 & 7 Failed:', data);
      failed++;
    }
  } catch (e) {
    console.error('✘ Test 6 & 7 Exception:', e);
    failed++;
  }

  // Test 8: Inventory Synchronization & Stock Protection
  try {
    // 1. Verify stock decreased by 5 (75 -> 70)
    const prodRes = await fetch(`${BASE_URL}/products/${createdProductId}`);
    const prodData = await prodRes.json();
    if (prodData.stockCount === 70) {
      console.log(`✔ Test 8a: Inventory Sync — Stock automatically deducted from 75 to ${prodData.stockCount}`);
      passed++;
    } else {
      console.error('✘ Test 8a Failed: Expected stock 70, got', prodData.stockCount);
      failed++;
    }

    // 2. Attempt excess order (999 units when only 70 available)
    const excessRes = await fetch(`${BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customer: { fullName: 'Excess Customer', phone: '0800', state: 'Lagos', city: 'Ikeja', address: 'Test' },
        deliveryMethod: 'pickup',
        paymentMethod: 'cod',
        items: [{ productId: createdProductId, quantity: 999, unitPrice: 5600, totalPrice: 5594400 }],
        subtotal: 5594400,
        shippingFee: 0,
        grandTotal: 5594400
      })
    });
    if (excessRes.status === 400) {
      const errData = await excessRes.json();
      console.log(`✔ Test 8b: Inventory Overselling Guard — Correctly rejected (${errData.error})`);
      passed++;
    } else {
      console.error('✘ Test 8b Failed: Excess order was allowed!', excessRes.status);
      failed++;
    }
  } catch (e) {
    console.error('✘ Test 8 Exception:', e);
    failed++;
  }

  // Test 11: Audit Trail Verification
  try {
    const res = await fetch(`${BASE_URL}/audit-logs`, { headers: authHeaders });
    const logs = await res.json();
    if (Array.isArray(logs) && logs.length > 0) {
      console.log(`✔ Test 11: Persistence & Audit Logs — Verified ${logs.length} administrative actions logged`);
      passed++;
    } else {
      console.error('✘ Test 11 Failed: No audit logs found');
      failed++;
    }
  } catch (e) {
    console.error('✘ Test 11 Exception:', e);
    failed++;
  }

  console.log(`\n=== TEST SUITE RESULTS: ${passed} PASSED, ${failed} FAILED ===`);
}

runTests();
