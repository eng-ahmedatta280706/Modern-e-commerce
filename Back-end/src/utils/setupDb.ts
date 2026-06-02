import { db } from "../configs/db.js";

export async function initializeDatabase() {
  try {
    console.log("🔄 Initializing database schema...");

    // Create users table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        phone VARCHAR(20) DEFAULT '',
        profile_pic VARCHAR(500) DEFAULT '',
        role VARCHAR(20) DEFAULT 'customer',

        store_name VARCHAR(255) DEFAULT '',
        store_slug VARCHAR(255) UNIQUE,
        store_bio TEXT DEFAULT '',
        store_logo VARCHAR(500) DEFAULT '',
        store_banner VARCHAR(500) DEFAULT '',
        seller_status VARCHAR(20) DEFAULT 'pending',
        commission_rate NUMERIC(5, 2) DEFAULT 10,

        is_verified BOOLEAN DEFAULT false,
        is_active BOOLEAN DEFAULT true,
        password_reset_token VARCHAR(255),
        password_reset_expires TIMESTAMP,
        refresh_token VARCHAR(500),
        last_login TIMESTAMP,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
      CREATE INDEX IF NOT EXISTS users_role_idx ON users(role);
      CREATE INDEX IF NOT EXISTS users_seller_status_idx ON users(seller_status);
    `);

    // Create addresses table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS addresses (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        label VARCHAR(100) DEFAULT 'Home',
        street VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        country VARCHAR(100),
        zip_code VARCHAR(20),
        is_default BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      CREATE INDEX IF NOT EXISTS addresses_user_id_idx ON addresses(user_id);
    `);

    // Create categories table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS categories (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name VARCHAR(255) NOT NULL UNIQUE,
        slug VARCHAR(255) UNIQUE,
        description TEXT DEFAULT '',
        image VARCHAR(500) DEFAULT '',
        parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
        is_active BOOLEAN DEFAULT true,
        "order" INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      CREATE INDEX IF NOT EXISTS categories_parent_id_idx ON categories(parent_id);
      CREATE INDEX IF NOT EXISTS categories_is_active_idx ON categories(is_active);
    `);

    // Create products table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS products (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        slug VARCHAR(255) UNIQUE,
        description TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        discount NUMERIC(5, 2) DEFAULT 0,
        sale_price NUMERIC(10, 2) DEFAULT 0,

        category_id UUID,
        subcategory_id UUID,
        tags TEXT[],

        images VARCHAR(1000)[],
        color_images JSONB,
        colors TEXT[],
        sizes TEXT[],
        video VARCHAR(500) DEFAULT '',

        badge VARCHAR(50) DEFAULT '',

        stock INTEGER DEFAULT 0,
        sold INTEGER DEFAULT 0,

        num_reviews INTEGER DEFAULT 0,
        rating NUMERIC(3, 1) DEFAULT 0,

        is_active BOOLEAN DEFAULT true,
        is_featured BOOLEAN DEFAULT false,

        dimensions JSONB,
        meta JSONB,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      CREATE INDEX IF NOT EXISTS products_seller_id_idx ON products(seller_id);
      CREATE INDEX IF NOT EXISTS products_category_id_idx ON products(category_id);
      CREATE INDEX IF NOT EXISTS products_price_idx ON products(price);
      CREATE INDEX IF NOT EXISTS products_rating_idx ON products(rating);
    `);

    // Create reviews table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS reviews (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        rating INTEGER NOT NULL,
        comment TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      CREATE INDEX IF NOT EXISTS reviews_product_id_idx ON reviews(product_id);
      CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON reviews(user_id);
    `);

    // Create wishlist table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS wishlist (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        UNIQUE(user_id, product_id)
      );
    `);

    // Create orders table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,

        shipping_address JSONB,
        shipping_method VARCHAR(50) DEFAULT 'standard',
        shipping_cost NUMERIC(10, 2) DEFAULT 5,

        payment_method VARCHAR(50) NOT NULL,
        payment_status VARCHAR(50) DEFAULT 'pending',
        stripe_payment_intent_id VARCHAR(255),

        subtotal NUMERIC(10, 2) NOT NULL,
        tax NUMERIC(10, 2) DEFAULT 0,
        discount NUMERIC(10, 2) DEFAULT 0,
        total NUMERIC(10, 2) NOT NULL,

        coupon_code VARCHAR(100),

        status VARCHAR(50) DEFAULT 'pending',

        tracking_number VARCHAR(255),
        notes TEXT,
        delivered_at TIMESTAMP,
        cancelled_at TIMESTAMP,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      CREATE INDEX IF NOT EXISTS orders_customer_id_idx ON orders(customer_id);
      CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status);
      CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders(created_at);
    `);

    // Create order_items table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
        product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
        seller_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
        name VARCHAR(255) NOT NULL,
        image VARCHAR(500),
        price NUMERIC(10, 2) NOT NULL,
        quantity INTEGER NOT NULL,
        selected_color VARCHAR(100),
        selected_size VARCHAR(100)
      );

      CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON order_items(order_id);
      CREATE INDEX IF NOT EXISTS order_items_seller_id_idx ON order_items(seller_id);
    `);

    // Create notifications table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS notifications (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        link VARCHAR(500) DEFAULT '',
        is_read BOOLEAN DEFAULT false,
        data JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      CREATE INDEX IF NOT EXISTS notifications_recipient_id_idx ON notifications(recipient_id);
      CREATE INDEX IF NOT EXISTS notifications_is_read_idx ON notifications(is_read);
    `);

    // Create coupons table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS coupons (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        code VARCHAR(100) NOT NULL UNIQUE,
        type VARCHAR(50) NOT NULL,
        value NUMERIC(10, 2) DEFAULT 0,
        min_order NUMERIC(10, 2) DEFAULT 0,
        max_discount NUMERIC(10, 2) DEFAULT 0,
        usage_limit INTEGER,
        used_count INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        expires_at TIMESTAMP,
        created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      CREATE UNIQUE INDEX IF NOT EXISTS coupons_code_unique ON coupons(code);
      CREATE INDEX IF NOT EXISTS coupons_is_active_idx ON coupons(is_active);
    `);

    // Create cart table
    await db.execute(`
      CREATE TABLE IF NOT EXISTS cart (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
        items JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );

      CREATE INDEX IF NOT EXISTS cart_user_id_idx ON cart(user_id);
    `);

    console.log("✅ Database schema initialized successfully");
    return true;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

// Call from startup or manually
export async function setupDatabase() {
  return await initializeDatabase();
}
