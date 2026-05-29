require('dotenv').config();
import mongoose from 'mongoose';
import { deleteMany, create } from '../models/User';
import { deleteMany as _deleteMany, insertMany } from '../models/Product';
import { deleteMany as __deleteMany, insertMany as _insertMany } from '../models/Category';
import { deleteMany as ___deleteMany, insertMany as __insertMany } from '../models/Coupon';
import connectDB from '../config/db';

const CATEGORIES = [
  { name: 'Women',        slug: 'women',        order: 1, image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?w=800' },
  { name: 'Men',          slug: 'men',           order: 2, image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?w=800' },
  { name: 'Kids',         slug: 'kids',          order: 3, image: 'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?w=800' },
  { name: 'Accessories',  slug: 'accessories',   order: 4, image: 'https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg?w=800' },
  { name: 'Shoes',        slug: 'shoes',         order: 5, image: 'https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?w=800' },
  { name: 'Sale',         slug: 'sale',          order: 6, image: 'https://images.pexels.com/photos/5632400/pexels-photo-5632400.jpeg?w=800' },
  { name: 'New Arrivals', slug: 'new-arrivals',  order: 0, image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?w=800' },
];

const COUPONS = [
  { code: 'SAVE10',     type: 'percentage', value: 10,  minOrder: 30,  maxDiscount: 50,  usageLimit: null },
  { code: 'DISCOUNT50', type: 'fixed',      value: 50,  minOrder: 150, maxDiscount: 0,   usageLimit: 100  },
  { code: 'FREESHIP',   type: 'shipping',   value: 0,   minOrder: 0,   maxDiscount: 0,   usageLimit: null },
  { code: 'WELCOME20',  type: 'percentage', value: 20,  minOrder: 0,   maxDiscount: 40,  usageLimit: 1    },
];

const seedProducts = (sellerId) => [
  {
    seller: sellerId,
    name: 'Classic Cotton T-Shirt',
    description: 'A comfortable classic t-shirt made from 100% organic cotton. Perfect for everyday wear.',
    price: 24.99,
    discount: 0,
    category: 'Men',
    subcategory: 'T-Shirts',
    colors: ['White', 'Black', 'Gray', 'Blue'],
    badge: 'Best Seller',
    stock: 150,
    images: ['https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?w=800'],
    colorImages: [
      { color: 'White', image: 'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?w=800' },
      { color: 'Black', image: 'https://images.pexels.com/photos/5384424/pexels-photo-5384424.jpeg?w=800' },
    ],
    tags: ['cotton', 'casual', 'men'],
    isFeatured: true,
  },
  {
    seller: sellerId,
    name: 'Floral Summer Dress',
    description: 'A beautiful floral dress perfect for summer days. Made from lightweight fabric.',
    price: 49.99,
    discount: 0,
    category: 'Women',
    subcategory: 'Dresses',
    colors: ['Blue', 'Pink', 'Yellow'],
    badge: 'New',
    stock: 80,
    images: ['https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?w=800'],
    tags: ['floral', 'summer', 'women', 'dress'],
    isFeatured: true,
  },
  {
    seller: sellerId,
    name: 'Casual Blazer',
    description: 'A versatile blazer that transitions easily from office to evening.',
    price: 89.99,
    discount: 20,
    category: 'Men',
    subcategory: 'Blazers',
    colors: ['Navy', 'Gray', 'Black'],
    badge: 'Sale',
    stock: 45,
    images: ['https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?w=800'],
    tags: ['blazer', 'formal', 'men'],
    isFeatured: false,
  },
  {
    seller: sellerId,
    name: 'Running Shoes',
    description: 'Lightweight and responsive running shoes designed for comfort and performance.',
    price: 99.99,
    discount: 0,
    category: 'Shoes',
    subcategory: 'Running',
    colors: ['Black', 'White', 'Red', 'Blue'],
    badge: '',
    stock: 200,
    images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?w=800'],
    tags: ['shoes', 'running', 'sport'],
    isFeatured: true,
  },
  {
    seller: sellerId,
    name: 'Leather Crossbody Bag',
    description: 'A stylish leather crossbody bag with multiple compartments.',
    price: 79.99,
    discount: 0,
    category: 'Accessories',
    subcategory: 'Bags',
    colors: ['Brown', 'Black'],
    badge: '',
    stock: 60,
    images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?w=800'],
    tags: ['bag', 'leather', 'accessories'],
    isFeatured: false,
  },
];

const seed = async () => {
  await connectDB();

  console.log('🌱 Seeding database...\n');

  // ── Clean existing data ───────────────────────────────
  await Promise.all([
    deleteMany({}),
    _deleteMany({}),
    __deleteMany({}),
    ___deleteMany({}),
  ]);
  console.log('✅ Cleared existing data');

  // ── Admin ─────────────────────────────────────────────
  const admin = await create({
    name:     process.env.ADMIN_NAME     || 'Super Admin',
    email:    process.env.ADMIN_EMAIL    || 'admin@stylestore.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@12345',
    role:     'admin',
    isVerified: true,
    isActive:   true,
  });
  console.log(`✅ Admin created:    ${admin.email}`);

  // ── Demo Seller ───────────────────────────────────────
  const seller = await create({
    name:         'Demo Seller',
    email:        'seller@stylestore.com',
    password:     'Seller@12345',
    role:         'seller',
    storeName:    'StyleStore Official',
    storeBio:     'Official StyleStore brand — quality clothing for everyone.',
    sellerStatus: 'approved',
    commissionRate: 10,
    isVerified: true,
    isActive:   true,
  });
  console.log(`✅ Seller created:   ${seller.email}  (status: approved)`);

  // ── Demo Customer ─────────────────────────────────────
  const customer = await create({
    name:       'Demo Customer',
    email:      'customer@stylestore.com',
    password:   'Customer@12345',
    role:       'customer',
    isVerified: true,
    isActive:   true,
  });
  console.log(`✅ Customer created: ${customer.email}`);

  // ── Categories ────────────────────────────────────────
  await _insertMany(CATEGORIES);
  console.log(`✅ ${CATEGORIES.length} categories seeded`);

  // ── Products ──────────────────────────────────────────
  const products = await insertMany(seedProducts(seller._id));
  console.log(`✅ ${products.length} products seeded`);

  // ── Coupons ───────────────────────────────────────────
  const couponsWithCreator = COUPONS.map(c => ({ ...c, createdBy: admin._id }));
  await __insertMany(couponsWithCreator);
  console.log(`✅ ${COUPONS.length} coupons seeded`);

  // ── Summary ───────────────────────────────────────────
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🎉 Seeding complete!\n');
  console.log('Login credentials:');
  console.log(`  Admin    → admin@stylestore.com    / Admin@12345`);
  console.log(`  Seller   → seller@stylestore.com   / Seller@12345`);
  console.log(`  Customer → customer@stylestore.com / Customer@12345`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  process.exit(0);
};

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
