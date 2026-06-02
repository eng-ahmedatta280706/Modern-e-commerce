import {
  pgTable,
  text,
  varchar,
  integer,
  boolean,
  timestamp,
  numeric,
  jsonb,
  uuid,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// ─────────────────────────────────────────
// USERS TABLE
// ─────────────────────────────────────────
export const Users = pgTable(
  'users',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    password: varchar('password', { length: 255 }).notNull(),
    phone: varchar('phone', { length: 20 }).default(''),
    profilePic: varchar('profile_pic', { length: 500 }).default(''),
    role: varchar('role', { length: 20 }).default('customer'), // 'customer', 'seller', 'admin'

    // Seller Fields
    storeName: varchar('store_name', { length: 255 }).default(''),
    storeSlug: varchar('store_slug', { length: 255 }).unique(),
    storeBio: text('store_bio').default(''),
    storeLogo: varchar('store_logo', { length: 500 }).default(''),
    storeBanner: varchar('store_banner', { length: 500 }).default(''),
    sellerStatus: varchar('seller_status', { length: 20 }).default('pending'), // 'pending', 'approved', 'rejected', 'suspended'
    commissionRate: numeric('commission_rate', { precision: 5, scale: 2 }).default('10'),

    // Security
    isVerified: boolean('is_verified').default(false),
    isActive: boolean('is_active').default(true),
    passwordResetToken: varchar('password_reset_token', { length: 255 }),
    passwordResetExpires: timestamp('password_reset_expires'),
    refreshToken: varchar('refresh_token', { length: 500 }),
    lastLogin: timestamp('last_login'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index('users_email_idx').on(table.email),
    roleIdx: index('users_role_idx').on(table.role),
    sellerStatusIdx: index('users_seller_status_idx').on(table.sellerStatus),
  })
);

// ─────────────────────────────────────────
// ADDRESSES TABLE
// ─────────────────────────────────────────
export const Addresses = pgTable(
  'addresses',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => Users.id, { onDelete: 'cascade' }),
    label: varchar('label', { length: 100 }).default('Home'),
    street: varchar('street', { length: 255 }),
    city: varchar('city', { length: 100 }),
    state: varchar('state', { length: 100 }),
    country: varchar('country', { length: 100 }),
    zipCode: varchar('zip_code', { length: 20 }),
    isDefault: boolean('is_default').default(false),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('addresses_user_id_idx').on(table.userId),
  })
);

// ─────────────────────────────────────────
// WISHLIST TABLE
// ─────────────────────────────────────────
export const Wishlist = pgTable(
  'wishlist',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().references(() => Users.id, { onDelete: 'cascade' }),
    productId: uuid('product_id').notNull().references(() => Products.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
  },
  (table) => ({
    userProductUnique: uniqueIndex('wishlist_user_product_unique').on(table.userId, table.productId),
  })
);

// ─────────────────────────────────────────
// CATEGORIES TABLE
// ─────────────────────────────────────────
export const Categories = pgTable(
  'categories',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    name: varchar('name', { length: 255 }).notNull().unique(),
    slug: varchar('slug', { length: 255 }).unique(),
    description: text('description').default(''),
    image: varchar('image', { length: 500 }).default(''),
    parentId: uuid('parent_id').references(() => Categories.id, { onDelete: 'set null' }),
    isActive: boolean('is_active').default(true),
    order: integer('order').default(0),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    parentIdIdx: index('categories_parent_id_idx').on(table.parentId),
    isActiveIdx: index('categories_is_active_idx').on(table.isActive),
  })
);

// ─────────────────────────────────────────
// PRODUCTS TABLE
// ─────────────────────────────────────────
export const Products = pgTable(
  'products',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    sellerId: uuid('seller_id').notNull().references(() => Users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    slug: varchar('slug', { length: 255 }).unique(),
    description: text('description').notNull(),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    discount: numeric('discount', { precision: 5, scale: 2 }).default('0'),
    salePrice: numeric('sale_price', { precision: 10, scale: 2 }).default('0'),

    categoryId: uuid('category_id'),
    subcategoryId: uuid('subcategory_id'),
    tags: text('tags').array(),

    images: varchar('images', { length: 1000 }).array(),
    colorImages: jsonb('color_images'), // [{ color: string, image: string }]
    colors: text('colors').array(),
    sizes: text('sizes').array(),
    video: varchar('video', { length: 500 }).default(''),

    badge: varchar('badge', { length: 50 }).default(''), // 'New', 'Sale', 'Best Seller', ''

    stock: integer('stock').default(0),
    sold: integer('sold').default(0),

    numReviews: integer('num_reviews').default(0),
    rating: numeric('rating', { precision: 3, scale: 1 }).default('0'),

    isActive: boolean('is_active').default(true),
    isFeatured: boolean('is_featured').default(false),

    dimensions: jsonb('dimensions'), // { length, width, height, weight }
    meta: jsonb('meta'), // custom metadata

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    sellerIdx: index('products_seller_id_idx').on(table.sellerId),
    categoryIdx: index('products_category_id_idx').on(table.categoryId),
    priceIdx: index('products_price_idx').on(table.price),
    ratingIdx: index('products_rating_idx').on(table.rating),
  })
);

// ─────────────────────────────────────────
// REVIEWS TABLE
// ─────────────────────────────────────────
export const Reviews = pgTable(
  'reviews',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id').notNull().references(() => Products.id, { onDelete: 'cascade' }),
    userId: uuid('user_id').notNull().references(() => Users.id, { onDelete: 'cascade' }),
    name: varchar('name', { length: 255 }).notNull(),
    rating: integer('rating').notNull(), // 1-5
    comment: text('comment').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    productIdIdx: index('reviews_product_id_idx').on(table.productId),
    userIdIdx: index('reviews_user_id_idx').on(table.userId),
  })
);

// ─────────────────────────────────────────
// ORDERS TABLE
// ─────────────────────────────────────────
export const Orders = pgTable(
  'orders',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    customerId: uuid('customer_id').notNull().references(() => Users.id, { onDelete: 'cascade' }),

    // Shipping
    shippingAddress: jsonb('shipping_address'), // { name, email, phone, street, city, state, country, zipCode }
    shippingMethod: varchar('shipping_method', { length: 50 }).default('standard'), // 'standard', 'express', 'pickup'
    shippingCost: numeric('shipping_cost', { precision: 10, scale: 2 }).default('5'),

    // Payment
    paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // 'card', 'paypal', 'cod', 'stripe'
    paymentStatus: varchar('payment_status', { length: 50 }).default('pending'), // 'pending', 'paid', 'failed', 'refunded'
    stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),

    // Totals
    subtotal: numeric('subtotal', { precision: 10, scale: 2 }).notNull(),
    tax: numeric('tax', { precision: 10, scale: 2 }).default('0'),
    discount: numeric('discount', { precision: 10, scale: 2 }).default('0'),
    total: numeric('total', { precision: 10, scale: 2 }).notNull(),

    couponCode: varchar('coupon_code', { length: 100 }),

    // Status
    status: varchar('status', { length: 50 }).default('pending'), // 'pending', 'processing', 'shipped', 'delivered', 'cancelled', 'refunded'

    trackingNumber: varchar('tracking_number', { length: 255 }),
    notes: text('notes'),
    deliveredAt: timestamp('delivered_at'),
    cancelledAt: timestamp('cancelled_at'),

    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    customerIdIdx: index('orders_customer_id_idx').on(table.customerId),
    statusIdx: index('orders_status_idx').on(table.status),
    createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
  })
);

// ─────────────────────────────────────────
// ORDER ITEMS TABLE
// ─────────────────────────────────────────
export const OrderItems = pgTable(
  'order_items',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    orderId: uuid('order_id').notNull().references(() => Orders.id, { onDelete: 'cascade' }),
    productId: uuid('product_id').notNull().references(() => Products.id, { onDelete: 'restrict' }),
    sellerId: uuid('seller_id').notNull().references(() => Users.id, { onDelete: 'restrict' }),
    name: varchar('name', { length: 255 }).notNull(),
    image: varchar('image', { length: 500 }),
    price: numeric('price', { precision: 10, scale: 2 }).notNull(),
    quantity: integer('quantity').notNull(),
    selectedColor: varchar('selected_color', { length: 100 }),
    selectedSize: varchar('selected_size', { length: 100 }),
  },
  (table) => ({
    orderIdIdx: index('order_items_order_id_idx').on(table.orderId),
    sellerIdIdx: index('order_items_seller_id_idx').on(table.sellerId),
  })
);

// ─────────────────────────────────────────
// NOTIFICATIONS TABLE
// ─────────────────────────────────────────
export const Notifications = pgTable(
  'notifications',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    recipientId: uuid('recipient_id').notNull().references(() => Users.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 50 }).notNull(), // 'new_order', 'order_status', 'seller_approved', etc.
    title: varchar('title', { length: 255 }).notNull(),
    message: text('message').notNull(),
    link: varchar('link', { length: 500 }).default(''),
    isRead: boolean('is_read').default(false),
    data: jsonb('data').default({}),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    recipientIdIdx: index('notifications_recipient_id_idx').on(table.recipientId),
    isReadIdx: index('notifications_is_read_idx').on(table.isRead),
  })
);

// ─────────────────────────────────────────
// COUPONS TABLE
// ─────────────────────────────────────────
export const Coupons = pgTable(
  'coupons',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    code: varchar('code', { length: 100 }).notNull().unique(),
    type: varchar('type', { length: 50 }).notNull(), // 'percentage', 'fixed', 'shipping'
    value: numeric('value', { precision: 10, scale: 2 }).default('0'),
    minOrder: numeric('min_order', { precision: 10, scale: 2 }).default('0'),
    maxDiscount: numeric('max_discount', { precision: 10, scale: 2 }).default('0'),
    usageLimit: integer('usage_limit'),
    usedCount: integer('used_count').default(0),
    isActive: boolean('is_active').default(true),
    expiresAt: timestamp('expires_at'),
    createdById: uuid('created_by_id').references(() => Users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    codeIdx: uniqueIndex('coupons_code_unique').on(table.code),
    isActiveIdx: index('coupons_is_active_idx').on(table.isActive),
  })
);

// ─────────────────────────────────────────
// CART TABLE
// ─────────────────────────────────────────
export const Cart = pgTable(
  'cart',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').notNull().unique().references(() => Users.id, { onDelete: 'cascade' }),
    items: jsonb('items').default('[]'), // [{ productId, quantity, selectedColor, selectedSize }]
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at').defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index('cart_user_id_idx').on(table.userId),
  })
);

// ─────────────────────────────────────────
// RELATIONS
// ─────────────────────────────────────────
export const usersRelations = relations(Users, ({ many }) => ({
  products: many(Products),
  orders: many(Orders),
  addresses: many(Addresses),
  wishlist: many(Wishlist),
  notifications: many(Notifications),
  coupons: many(Coupons),
  reviews: many(Reviews),
  orderItems: many(OrderItems),
}));

export const productsRelations = relations(Products, ({ one, many }) => ({
  seller: one(Users, { fields: [Products.sellerId], references: [Users.id] }),
  reviews: many(Reviews),
  wishlist: many(Wishlist),
  orderItems: many(OrderItems),
}));

export const ordersRelations = relations(Orders, ({ one, many }) => ({
  customer: one(Users, { fields: [Orders.customerId], references: [Users.id] }),
  items: many(OrderItems),
}));

export const orderItemsRelations = relations(OrderItems, ({ one }) => ({
  order: one(Orders, { fields: [OrderItems.orderId], references: [Orders.id] }),
  product: one(Products, { fields: [OrderItems.productId], references: [Products.id] }),
  seller: one(Users, { fields: [OrderItems.sellerId], references: [Users.id] }),
}));

export const reviewsRelations = relations(Reviews, ({ one }) => ({
  product: one(Products, { fields: [Reviews.productId], references: [Products.id] }),
  user: one(Users, { fields: [Reviews.userId], references: [Users.id] }),
}));

export const addressesRelations = relations(Addresses, ({ one }) => ({
  user: one(Users, { fields: [Addresses.userId], references: [Users.id] }),
}));

export const wishlistRelations = relations(Wishlist, ({ one }) => ({
  user: one(Users, { fields: [Wishlist.userId], references: [Users.id] }),
  product: one(Products, { fields: [Wishlist.productId], references: [Products.id] }),
}));

export const notificationsRelations = relations(Notifications, ({ one }) => ({
  recipient: one(Users, { fields: [Notifications.recipientId], references: [Users.id] }),
}));

export const couponsRelations = relations(Coupons, ({ one }) => ({
  createdBy: one(Users, { fields: [Coupons.createdById], references: [Users.id] }),
}));

export const cartRelations = relations(Cart, ({ one }) => ({
  user: one(Users, { fields: [Cart.userId], references: [Users.id] }),
}));
