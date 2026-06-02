import { Product } from '../types/Product';

// Sample product data
export const localProducts: Product[] = [
  {
    id: '1',
    name: 'Classic Cotton T-Shirt',
    price: 24.99,
    description: 'A comfortable classic t-shirt made from 100% organic cotton. Perfect for everyday wear.',
    image: 'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'Best Seller',
    colors: ['White', 'Black', 'Gray', 'Blue'],
    colorImages: {
      'White': 'https://images.pexels.com/photos/5384423/pexels-photo-5384423.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Black': 'https://images.pexels.com/photos/5384424/pexels-photo-5384424.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Blue': 'https://images.pexels.com/photos/5384425/pexels-photo-5384425.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    video: 'https://player.vimeo.com/external/577442929.hd.mp4?s=95231c8a7fe2066ffb640204591b01a6c326b97c&profile_id=174&oauth2_token_id=57447761',
    category: 'Men',
    subcategory: 'T-Shirts'
  },
  {
    id: '2',
    name: 'Slim Fit Jeans',
    price: 59.99,
    description: 'Modern slim fit jeans with a comfortable stretch. These versatile jeans can be dressed up or down.',
    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Blue', 'Black', 'Gray'],
    colorImages: {
      'Blue': 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Black': 'https://images.pexels.com/photos/1176618/pexels-photo-1176618.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Jeans'

  },
  {
    id: '3',
    name: 'Floral Summer Dress',
    price: 49.99,
    description: 'A beautiful floral dress perfect for summer days. Made from lightweight fabric for maximum comfort.',
    image: 'https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'New',
    colors: ['Blue', 'Pink', 'Yellow'],
    colorImages: {
      'Blue': 'https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Pink': 'https://images.pexels.com/photos/972996/pexels-photo-972996.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    video: 'https://player.vimeo.com/external/435674703.sd.mp4?s=01ad1ba21dc72c8a702cf8a16506ad28b398153e&profile_id=165&oauth2_token_id=57447761',
    category: 'Women',
    subcategory: 'Dresses'

  },
  {
    id: '4',
    name: 'Casual Blazer',
    price: 89.99,
    description: 'A versatile blazer that transitions easily from office to evening. Features a modern cut and premium fabric.',
    image: 'https://images.pexels.com/photos/6626903/pexels-photo-6626903.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'Sale',
    colors: ['Navy', 'Gray', 'Black'],
    colorImages: {
      'Navy': 'https://i.postimg.cc/gknJxQZt/Navy-Casual-Blazer-Men.webp',
      'Black': 'https://i.postimg.cc/TPkF57my/Black-Casual-Blazer-Men.jpg',
    },
    category: 'Men',
    subcategory: 'Blazers'

  },
  {
    id: '5',
    name: 'Leather Crossbody Bag',
    price: 79.99,
    description: 'A stylish leather crossbody bag with multiple compartments. Perfect for keeping your essentials organized.',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Brown', 'Black', 'Tan'],
    colorImages: {
      'Brown': 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Black': 'https://images.pexels.com/photos/1152078/pexels-photo-1152078.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Bags'

  },
  {
    id: '6',
    name: 'Wool Blend Sweater',
    price: 64.99,
    description: 'A cozy wool blend sweater perfect for cooler days. Features a classic design that never goes out of style.',
    image: 'https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'Best Seller',
    colors: ['Cream', 'Gray', 'Navy'],
    colorImages: {
      'Cream': 'https://images.pexels.com/photos/45982/pexels-photo-45982.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Gray': 'https://images.pexels.com/photos/45981/pexels-photo-45981.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Women',
    subcategory: 'Sweaters'

  },
  {
    id: '7',
    name: 'Running Shoes',
    price: 99.99,
    description: 'Lightweight and responsive running shoes designed for comfort and performance. Features breathable mesh upper.',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Black', 'White', 'Red', 'Blue'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'White': 'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    video: 'https://player.vimeo.com/external/400187427.sd.mp4?s=051a22cb9b992389613948d2ae1a244bee28a305&profile_id=165&oauth2_token_id=57447761',
    category: 'Shoes',
    subcategory: 'Running'

  },
  {
    id: '8',
    name: 'Silk Blouse',
    price: 69.99,
    description: 'An elegant silk blouse that adds sophistication to any outfit. Features a relaxed fit and premium fabric.',
    image: 'https://images.pexels.com/photos/6621173/pexels-photo-6621173.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'New',
    colors: ['White', 'Blush', 'Navy'],
    colorImages: {
      'White': 'https://images.pexels.com/photos/6621173/pexels-photo-6621173.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Navy': 'https://images.pexels.com/photos/6621184/pexels-photo-6621184.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Women',
    subcategory: 'Blouses'

  },
  {
    id: '9',
    name: 'Denim Jacket',
    price: 79.99,
    description: 'A classic denim jacket that never goes out of style. Perfect for layering and casual everyday wear.',
    image: 'https://i.postimg.cc/500Q905Z/Blue-Denim-Jacket-Men.avif',
    colors: ['Blue', 'Black', 'Light Blue'],
    colorImages: {
      'Light Blue': 'https://i.postimg.cc/500Q905Z/Blue-Denim-Jacket-Men.avif',
      'Black': 'https://i.postimg.cc/hvKD43qj/Black-Denim-Jacket-Men.jpg',
    },
    category: 'Women',
    subcategory: 'Jackets'
  },
  {
    id: '10',
    name: 'Knit Beanie',
    price: 19.99,
    description: 'A warm knit beanie for cold days. Made from soft, comfortable yarn that keeps you cozy all season.',
    image: 'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'Best Seller',
    colors: ['Gray', 'Black', 'Red', 'Navy'],
    colorImages: {
      'Gray': 'https://images.pexels.com/photos/984619/pexels-photo-984619.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Black': 'https://images.pexels.com/photos/984620/pexels-photo-984620.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Hats'

  },
  {
    id: '11',
    name: 'Casual Cotton T-Shirt',
    price: 19.99,
    description: 'Soft cotton t-shirt with a relaxed fit, perfect for everyday wear.',
    image: 'https://i.postimg.cc/NfG79sss/White-t-shirt-men.jpg',
    colors: ['White', 'Black', 'Green'],
    colorImages: {
      'White': 'https://i.postimg.cc/NfG79sss/White-t-shirt-men.jpg',
      'Black': 'https://i.postimg.cc/cJ6dr8jz/Casual-Cotton-T-Shirt-Black-Men.jpg',
      'Green': 'https://i.postimg.cc/RVP8qbBv/Casual-Cotton-T-Shirt-Green-Men.webp',
    },
    category: 'Men',
    subcategory: 'T-Shirts'

  },
  {
    id: '12',
    name: 'Elegant Evening Dress',
    price: 149.99,
    description: 'Flowy evening dress with a flattering silhouette, ideal for formal occasions.',
    image: 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Red', 'Blue'],
    colorImages: {
      'Red': 'https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Blue': 'https://images.pexels.com/photos/1488464/pexels-photo-1488464.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Women',
    subcategory: 'Dresses'

  },
  {
    id: '13',
    name: 'Sports Running Shoes',
    price: 89.99,
    description: 'Lightweight running shoes with breathable mesh and cushioned sole.',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['White', 'Gray'],
    colorImages: {
      'White': 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Gray': 'https://images.pexels.com/photos/2529149/pexels-photo-2529149.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Shoes',
    subcategory: 'Running'

  },
  {
    id: '14',
    name: 'Leather Handbag',
    price: 79.99,
    description: 'Stylish leather handbag with spacious compartments, perfect for daily use.',
    image: 'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Brown', 'Black'],
    colorImages: {
      'Brown': 'https://images.pexels.com/photos/322207/pexels-photo-322207.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Black': 'https://images.pexels.com/photos/322208/pexels-photo-322208.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Bags'

  },
  {
    id: '15',
    name: 'Wool Winter Coat',
    price: 199.99,
    description: 'Warm wool coat with a classic design, perfect for cold weather.',
    image: 'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Gray', 'Black'],
    colorImages: {
      'Gray': 'https://images.pexels.com/photos/428338/pexels-photo-428338.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Black': 'https://images.pexels.com/photos/428339/pexels-photo-428339.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Jackets'

  },
  {
    id: '16',
    name: 'Summer Sandals',
    price: 39.99,
    description: 'Comfortable sandals with adjustable straps, perfect for summer walks.',
    image: 'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Brown', 'Beige'],
    colorImages: {
      'Brown': 'https://images.pexels.com/photos/2529147/pexels-photo-2529147.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Beige': 'https://images.pexels.com/photos/2529146/pexels-photo-2529146.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Shoes',
    subcategory: 'Sandals'

  },
  {
    id: '17',
    name: 'Casual Hoodie',
    price: 49.99,
    description: 'Cozy hoodie with front pocket and adjustable hood, perfect for casual wear.',
    image: 'https://images.pexels.com/photos/404168/pexels-photo-404168.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Black', 'Gray', 'White'],
    colorImages: {
      'Black': 'https://i.postimg.cc/GhPQ2bBd/Casual-Black-Hoody.jpg',
      'Gray': 'https://i.postimg.cc/brhnc29D/Casual-Gray-Hoody.jpg',
      'White': 'https://i.postimg.cc/P59PnwtL/Casual-White-Hoodie.webp',
    },
    category: 'Men',
    subcategory: 'Hoodies'
  },
  {
    id: '18',
    name: 'Silk Scarf',
    price: 29.99,
    description: 'Elegant silk scarf with vibrant patterns, adds a touch of style to any outfit.',
    image: 'https://images.pexels.com/photos/322208/pexels-photo-322208.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Red', 'Blue'],
    colorImages: {
      'Red': 'https://i.postimg.cc/9MNG9Scb/Red-Silk-Scarf.webp',
      'Blue': 'https://i.postimg.cc/VvCK4MLw/Blue-Silk-Scarf.webp',
    },
    category: 'Accessories',
    subcategory: 'Scarves'

  },
  {
    id: '19',
    name: 'Formal Dress Shirt',
    price: 59.99,
    description: 'Classic dress shirt with a tailored fit, perfect for office or formal events.',
    image: 'https://images.pexels.com/photos/404169/pexels-photo-404169.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['White', 'Blue'],
    colorImages: {
      'White': 'https://images.pexels.com/photos/404169/pexels-photo-404169.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Blue': 'https://images.pexels.com/photos/404170/pexels-photo-404170.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Shirts'

  },
  {
    id: '20',
    name: 'Yoga Leggings',
    price: 39.99,
    description: 'Stretchy leggings designed for yoga and fitness, offering comfort and flexibility.',
    image: 'https://images.pexels.com/photos/3735641/pexels-photo-3735641.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Black', 'Purple'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/3735641/pexels-photo-3735641.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Purple': 'https://images.pexels.com/photos/3735642/pexels-photo-3735642.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Women',
    subcategory: 'Leggings'

  },
  {
    id: '101',
    name: 'AirFlex Running Shoes',
    brand: 'Nike',
    price: 129.99,
    description: 'Lightweight running shoes designed for speed, comfort and daily training.',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Black', 'White', 'Blue'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Shoes'
  },
  {
    id: '102',
    name: 'Ultraboost 5X',
    brand: 'Adidas',
    price: 149.99,
    description: 'Premium performance shoes with responsive cushioning and modern styling.',
    image: 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'New',
    colors: ['White', 'Black'],
    colorImages: {
      'White': 'https://images.pexels.com/photos/1464625/pexels-photo-1464625.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Shoes'
  },
  {
    id: '103',
    name: 'Club Fleece Hoodie',
    brand: 'Nike',
    price: 69.99,
    description: 'Soft fleece hoodie perfect for casual wear and cold weather.',
    image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Gray', 'Black'],
    colorImages: {
      'Gray': 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Hoodies'
  },
  {
    id: '104',
    name: 'Essentials Logo Tee',
    brand: 'Puma',
    price: 29.99,
    description: 'Comfortable cotton t-shirt with a modern athletic fit.',
    image: 'https://images.pexels.com/photos/9558776/pexels-photo-9558776.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['White', 'Black'],
    colorImages: {
      'White': 'https://images.pexels.com/photos/9558776/pexels-photo-9558776.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'T-Shirts'
  },
  {
    id: '105',
    name: 'Heritage Denim Jacket',
    brand: 'Levis',
    price: 89.99,
    description: 'Classic denim jacket made for everyday style and durability.',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'Best Seller',
    colors: ['Blue', 'Black'],
    colorImages: {
      'Blue': 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Jackets'
  },
  {
    id: '106',
    name: 'Classic Polo Shirt',
    brand: 'Lacoste',
    price: 59.99,
    description: 'Timeless polo shirt with premium fabric and elegant design.',
    image: 'https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Navy', 'White'],
    colorImages: {
      'Navy': 'https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Polo Shirts'
  },
  {
    id: '107',
    name: 'Cargo Utility Pants',
    brand: 'Dickies',
    price: 64.99,
    description: 'Functional cargo pants with multiple pockets and durable fabric.',
    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Khaki', 'Black'],
    colorImages: {
      'Khaki': 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Pants'
  },
  {
    id: '108',
    name: 'Court Vision Sneakers',
    brand: 'Nike',
    price: 119.99,
    description: 'Basketball-inspired sneakers with clean lines and everyday comfort.',
    image: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['White', 'Black'],
    colorImages: {
      'White': 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Shoes'
  },
  {
    id: '109',
    name: 'Tech Knit Joggers',
    brand: 'Under Armour',
    price: 54.99,
    description: 'Modern athletic joggers made with breathable stretch fabric.',
    image: 'https://images.pexels.com/photos/6311613/pexels-photo-6311613.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Black', 'Gray'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/6311613/pexels-photo-6311613.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Joggers'
  },
  {
    id: '110',
    name: 'Vintage Graphic Tee',
    brand: 'Vans',
    price: 34.99,
    description: 'Relaxed fit graphic t-shirt inspired by classic streetwear.',
    image: 'https://images.pexels.com/photos/9558761/pexels-photo-9558761.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Black', 'White'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/9558761/pexels-photo-9558761.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'T-Shirts'
  },
  {
    id: '111',
    name: 'Premium Leather Wallet',
    brand: 'Fossil',
    price: 49.99,
    description: 'Genuine leather wallet with multiple card slots and a slim profile.',
    image: 'https://images.pexels.com/photos/2079451/pexels-photo-2079451.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Brown', 'Black'],
    colorImages: {
      'Brown': 'https://images.pexels.com/photos/2079451/pexels-photo-2079451.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Wallets'
  },
  {
    id: '112',
    name: 'Explorer Backpack',
    brand: 'The North Face',
    price: 119.99,
    description: 'Durable backpack suitable for travel, school, and outdoor adventures.',
    image: 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'Best Seller',
    colors: ['Black', 'Gray'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/1545743/pexels-photo-1545743.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Bags'
  },
  {
    id: '113',
    name: 'Luxury Aviator Sunglasses',
    brand: 'Ray-Ban',
    price: 159.99,
    description: 'Classic aviator sunglasses offering timeless style and UV protection.',
    image: 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Gold', 'Silver'],
    colorImages: {
      'Gold': 'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Sunglasses'
  },
  {
    id: '114',
    name: 'Performance Training Shorts',
    brand: 'Under Armour',
    price: 39.99,
    description: 'Breathable athletic shorts designed for maximum mobility.',
    image: 'https://images.pexels.com/photos/6550878/pexels-photo-6550878.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Black', 'Gray'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/6550878/pexels-photo-6550878.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Shorts'
  },
  {
    id: '115',
    name: 'Classic White Sneakers',
    brand: 'Converse',
    price: 84.99,
    description: 'Minimalist sneakers that pair well with any casual outfit.',
    image: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'Sale',
    colors: ['White'],
    colorImages: {
      'White': 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Shoes',
    subcategory: 'Sneakers'
  },
  {
    id: '116',
    name: 'Elegant Evening Dress',
    brand: 'Zara',
    price: 99.99,
    description: 'Sophisticated evening dress designed for formal occasions.',
    image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'New',
    colors: ['Black', 'Red'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Women',
    subcategory: 'Dresses'
  },
  {
    id: '117',
    name: 'Oversized Knit Sweater',
    brand: 'H&M',
    price: 54.99,
    description: 'Warm oversized sweater with a relaxed modern silhouette.',
    image: 'https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Cream', 'Gray'],
    colorImages: {
      'Cream': 'https://images.pexels.com/photos/6311612/pexels-photo-6311612.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Women',
    subcategory: 'Sweaters'
  },
  {
    id: '118',
    name: 'High Waist Jeans',
    brand: 'Levis',
    price: 79.99,
    description: 'Flattering high-waist jeans with premium stretch denim.',
    image: 'https://images.pexels.com/photos/7691083/pexels-photo-7691083.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Blue', 'Black'],
    colorImages: {
      'Blue': 'https://images.pexels.com/photos/7691083/pexels-photo-7691083.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Women',
    subcategory: 'Jeans'
  },
  {
    id: '119',
    name: 'Leather Shoulder Bag',
    brand: 'Michael Kors',
    price: 189.99,
    description: 'Premium shoulder bag crafted from high-quality leather.',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'Best Seller',
    colors: ['Brown', 'Black'],
    colorImages: {
      'Brown': 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Bags'
  },
  {
    id: '120',
    name: 'Classic Analog Watch',
    brand: 'Casio',
    price: 74.99,
    description: 'Elegant analog watch with a timeless and versatile design.',
    image: 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Silver', 'Black'],
    colorImages: {
      'Silver': 'https://images.pexels.com/photos/190819/pexels-photo-190819.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Watches'
  },
  {
    id: '121',
    name: 'Signature Leather Belt',
    brand: 'Tommy Hilfiger',
    price: 44.99,
    description: 'Premium leather belt with a timeless buckle design.',
    image: 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Brown', 'Black'],
    colorImages: {
      'Brown': 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Belts'
  },
  {
    id: '122',
    name: 'Urban Bomber Jacket',
    brand: 'Zara',
    price: 119.99,
    description: 'Modern bomber jacket designed for everyday streetwear.',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'New',
    colors: ['Black', 'Olive'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Jackets'
  },
  {
    id: '123',
    name: 'Slim Fit Chinos',
    brand: 'Dockers',
    price: 64.99,
    description: 'Comfortable chinos suitable for business casual and daily wear.',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Khaki', 'Navy'],
    colorImages: {
      'Khaki': 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Pants'
  },
  {
    id: '124',
    name: 'Cashmere Blend Cardigan',
    brand: 'Uniqlo',
    price: 79.99,
    description: 'Soft cardigan made from a luxurious cashmere blend.',
    image: 'https://images.pexels.com/photos/6311611/pexels-photo-6311611.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Cream', 'Gray'],
    colorImages: {
      'Cream': 'https://images.pexels.com/photos/6311611/pexels-photo-6311611.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Women',
    subcategory: 'Sweaters'
  },
  {
    id: '125',
    name: 'Luxury Silk Scarf',
    brand: 'Burberry',
    price: 129.99,
    description: 'Elegant silk scarf featuring a sophisticated pattern.',
    image: 'https://images.pexels.com/photos/6347547/pexels-photo-6347547.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Beige', 'Black'],
    colorImages: {
      'Beige': 'https://images.pexels.com/photos/6347547/pexels-photo-6347547.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Scarves'
  },
  {
    id: '126',
    name: 'Athletic Zip Hoodie',
    brand: 'Adidas',
    price: 74.99,
    description: 'Lightweight zip hoodie perfect for workouts and casual wear.',
    image: 'https://images.pexels.com/photos/6311393/pexels-photo-6311393.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Gray', 'Black'],
    colorImages: {
      'Gray': 'https://images.pexels.com/photos/6311393/pexels-photo-6311393.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Hoodies'
  },
  {
    id: '127',
    name: 'Pleated Midi Skirt',
    brand: 'Mango',
    price: 69.99,
    description: 'Elegant pleated skirt ideal for formal and casual outfits.',
    image: 'https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Black', 'Beige'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Women',
    subcategory: 'Skirts'
  },
  {
    id: '128',
    name: 'Designer Baseball Cap',
    brand: 'New Era',
    price: 34.99,
    description: 'Classic baseball cap with premium embroidery.',
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Black', 'Navy'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Caps'
  },
  {
    id: '129',
    name: 'Premium Polo Shirt',
    brand: 'Ralph Lauren',
    price: 89.99,
    description: 'Iconic polo shirt crafted from breathable premium cotton.',
    image: 'https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'Best Seller',
    colors: ['White', 'Navy'],
    colorImages: {
      'White': 'https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Polo Shirts'
  },
  {
    id: '130',
    name: 'Leather Tote Bag',
    brand: 'Coach',
    price: 219.99,
    description: 'Spacious leather tote bag combining style and practicality.',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'Premium',
    colors: ['Brown', 'Black'],
    colorImages: {
      'Brown': 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Bags'
  },
  {
    id: '121',
    name: 'Signature Leather Belt',
    brand: 'Tommy Hilfiger',
    price: 44.99,
    description: 'Premium leather belt with a timeless buckle design.',
    image: 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Brown', 'Black'],
    colorImages: {
      'Brown': 'https://images.pexels.com/photos/45055/pexels-photo-45055.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Belts'
  },
  {
    id: '122',
    name: 'Urban Bomber Jacket',
    brand: 'Zara',
    price: 119.99,
    description: 'Modern bomber jacket designed for everyday streetwear.',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'New',
    colors: ['Black', 'Olive'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Jackets'
  },
  {
    id: '123',
    name: 'Slim Fit Chinos',
    brand: 'Dockers',
    price: 64.99,
    description: 'Comfortable chinos suitable for business casual and daily wear.',
    image: 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Khaki', 'Navy'],
    colorImages: {
      'Khaki': 'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Pants'
  },
  {
    id: '124',
    name: 'Cashmere Blend Cardigan',
    brand: 'Uniqlo',
    price: 79.99,
    description: 'Soft cardigan made from a luxurious cashmere blend.',
    image: 'https://images.pexels.com/photos/6311611/pexels-photo-6311611.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Cream', 'Gray'],
    colorImages: {
      'Cream': 'https://images.pexels.com/photos/6311611/pexels-photo-6311611.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Women',
    subcategory: 'Sweaters'
  },
  {
    id: '125',
    name: 'Luxury Silk Scarf',
    brand: 'Burberry',
    price: 129.99,
    description: 'Elegant silk scarf featuring a sophisticated pattern.',
    image: 'https://images.pexels.com/photos/6347547/pexels-photo-6347547.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Beige', 'Black'],
    colorImages: {
      'Beige': 'https://images.pexels.com/photos/6347547/pexels-photo-6347547.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Scarves'
  },
  {
    id: '126',
    name: 'Athletic Zip Hoodie',
    brand: 'Adidas',
    price: 74.99,
    description: 'Lightweight zip hoodie perfect for workouts and casual wear.',
    image: 'https://images.pexels.com/photos/6311393/pexels-photo-6311393.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Gray', 'Black'],
    colorImages: {
      'Gray': 'https://images.pexels.com/photos/6311393/pexels-photo-6311393.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Hoodies'
  },
  {
    id: '127',
    name: 'Pleated Midi Skirt',
    brand: 'Mango',
    price: 69.99,
    description: 'Elegant pleated skirt ideal for formal and casual outfits.',
    image: 'https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Black', 'Beige'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Women',
    subcategory: 'Skirts'
  },
  {
    id: '128',
    name: 'Designer Baseball Cap',
    brand: 'New Era',
    price: 34.99,
    description: 'Classic baseball cap with premium embroidery.',
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600',
    colors: ['Black', 'Navy'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Caps'
  },
  {
    id: '129',
    name: 'Premium Polo Shirt',
    brand: 'Ralph Lauren',
    price: 89.99,
    description: 'Iconic polo shirt crafted from breathable premium cotton.',
    image: 'https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'Best Seller',
    colors: ['White', 'Navy'],
    colorImages: {
      'White': 'https://images.pexels.com/photos/4066293/pexels-photo-4066293.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Men',
    subcategory: 'Polo Shirts'
  },
  {
    id: '130',
    name: 'Leather Tote Bag',
    brand: 'Coach',
    price: 219.99,
    description: 'Spacious leather tote bag combining style and practicality.',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600',
    badge: 'Premium',
    colors: ['Brown', 'Black'],
    colorImages: {
      'Brown': 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600',
    },
    category: 'Accessories',
    subcategory: 'Bags'
  },
  {
    id: '201',
    name: 'Adventure Graphic T-Shirt',
    brand: 'Nike Kids',
    price: 24.99,
    description: 'Comfortable cotton t-shirt featuring an adventure-themed graphic print. Perfect for everyday play and outdoor activities.',
    image: 'https://images.pexels.com/photos/9558761/pexels-photo-9558761.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.7,
    stock: 45,
    badge: 'Best Seller',
    tags: ['Kids', 'Boys', 'Cotton', 'Casual'],
    colors: ['Blue', 'Black', 'Red'],
    colorImages: {
      'Blue': 'https://images.pexels.com/photos/9558761/pexels-photo-9558761.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Black': 'https://images.pexels.com/photos/9558761/pexels-photo-9558761.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Red': 'https://images.pexels.com/photos/9558761/pexels-photo-9558761.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'T-Shirts',
    meta: {
      material: '100% Cotton',
      careInstructions: 'Machine wash cold',
      origin: 'Vietnam',
      releaseDate: '2026-01-10'
    }
  },
  {
    id: '202',
    name: 'Dino Print T-Shirt',
    brand: 'H&M Kids',
    price: 19.99,
    description: 'Fun dinosaur graphic t-shirt made from soft breathable cotton for active kids.',
    image: 'https://images.pexels.com/photos/5698849/pexels-photo-5698849.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.5,
    stock: 52,
    badge: 'New',
    tags: ['Kids', 'Boys', 'Dinosaur'],
    colors: ['Green', 'Gray'],
    colorImages: {
      'Green': 'https://images.pexels.com/photos/5698849/pexels-photo-5698849.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Gray': 'https://images.pexels.com/photos/5698849/pexels-photo-5698849.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'T-Shirts',
    meta: {
      material: 'Cotton Blend',
      careInstructions: 'Machine wash',
      origin: 'Bangladesh',
      releaseDate: '2026-02-15'
    }
  },
  {
    id: '203',
    name: 'Classic Blue Jeans',
    brand: 'Levis Kids',
    price: 39.99,
    description: 'Durable blue jeans with stretch fabric for comfort and mobility.',
    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.8,
    stock: 38,
    badge: 'Best Seller',
    tags: ['Kids', 'Boys', 'Jeans'],
    colors: ['Blue', 'Dark Blue'],
    colorImages: {
      'Blue': 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Dark Blue': 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Jeans',
    meta: {
      material: 'Denim',
      careInstructions: 'Machine wash cold',
      origin: 'Mexico'
    }
  },
  {
    id: '204',
    name: 'Junior Running Shoes',
    brand: 'Adidas Kids',
    price: 54.99,
    description: 'Lightweight running shoes designed for active kids with excellent cushioning.',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.9,
    stock: 29,
    badge: 'Premium',
    tags: ['Kids', 'Sports', 'Running'],
    colors: ['Black', 'White', 'Blue'],
    colorImages: {
      'Black': 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'White': 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Blue': 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Shoes',
    meta: {
      material: 'Mesh Fabric',
      careInstructions: 'Wipe clean',
      origin: 'Indonesia'
    }
  },
  {
    id: '205',
    name: 'Warm Fleece Hoodie',
    brand: 'Nike Kids',
    price: 44.99,
    description: 'Soft fleece hoodie that keeps kids warm and comfortable during cooler days.',
    image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.6,
    stock: 33,
    badge: 'Sale',
    tags: ['Kids', 'Hoodie', 'Winter'],
    colors: ['Gray', 'Black', 'Navy'],
    colorImages: {
      'Gray': 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Black': 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Navy': 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Hodes',
    meta: {
      material: 'Fleece Cotton',
      careInstructions: 'Machine wash cold',
      origin: 'Vietnam'
    }
  },
  {
    id: '206',
    name: 'Adventure Graphic T-Shirt',
    brand: 'Nike Kids',
    price: 24.99,
    description: 'Comfortable cotton t-shirt featuring an adventure-themed graphic print.',
    image: 'https://images.pexels.com/photos/9558761/pexels-photo-9558761.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.7,
    stock: 45,
    badge: 'Best Seller',
    tags: ['Kids', 'Boys', 'Cotton'],
    colors: ['Blue', 'Black', 'Red'],
    colorImages: {
      Blue: 'https://images.pexels.com/photos/9558761/pexels-photo-9558761.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Black: 'https://images.pexels.com/photos/9558761/pexels-photo-9558761.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Red: 'https://images.pexels.com/photos/9558761/pexels-photo-9558761.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'T-Shirts'
  },
  {
    id: '207',
    name: 'Dino Print T-Shirt',
    brand: 'H&M Kids',
    price: 19.99,
    description: 'Fun dinosaur graphic t-shirt made from breathable cotton.',
    image: 'https://images.pexels.com/photos/5698849/pexels-photo-5698849.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.5,
    stock: 52,
    badge: 'New',
    tags: ['Kids', 'Dinosaur'],
    colors: ['Green', 'Gray'],
    colorImages: {
      Green: 'https://images.pexels.com/photos/5698849/pexels-photo-5698849.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Gray: 'https://images.pexels.com/photos/5698849/pexels-photo-5698849.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'T-Shirts'
  },
  {
    id: '208',
    name: 'Super Hero Tee',
    brand: 'Zara Kids',
    price: 22.99,
    description: 'Soft cotton t-shirt with a colorful superhero design.',
    image: 'https://images.pexels.com/photos/3771813/pexels-photo-3771813.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.6,
    stock: 38,
    colors: ['Blue', 'White'],
    colorImages: {
      Blue: 'https://images.pexels.com/photos/3771813/pexels-photo-3771813.jpeg?auto=compress&cs=tinysrgb&w=1600',
      White: 'https://images.pexels.com/photos/3771813/pexels-photo-3771813.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'T-Shirts'
  },
  {
    id: '209',
    name: 'Space Explorer Tee',
    brand: 'GAP Kids',
    price: 21.99,
    description: 'Casual t-shirt inspired by space adventures.',
    image: 'https://images.pexels.com/photos/3771816/pexels-photo-3771816.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.4,
    stock: 42,
    colors: ['Navy', 'Gray'],
    colorImages: {
      Navy: 'https://images.pexels.com/photos/3771816/pexels-photo-3771816.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Gray: 'https://images.pexels.com/photos/3771816/pexels-photo-3771816.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'T-Shirts'
  },
  {
    id: '210',
    name: 'Skateboard Graphic Tee',
    brand: 'Puma Kids',
    price: 23.99,
    description: 'Modern graphic t-shirt for active boys.',
    image: 'https://images.pexels.com/photos/3771820/pexels-photo-3771820.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.8,
    stock: 36,
    badge: 'Sale',
    colors: ['Black', 'Orange'],
    colorImages: {
      Black: 'https://images.pexels.com/photos/3771820/pexels-photo-3771820.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Orange: 'https://images.pexels.com/photos/3771820/pexels-photo-3771820.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'T-Shirts'
  },
  {
    id: '211',
    name: 'Classic Blue Jeans',
    brand: 'Levis Kids',
    price: 39.99,
    description: 'Durable stretch denim jeans for everyday wear.',
    image: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.8,
    stock: 38,
    badge: 'Best Seller',
    colors: ['Blue', 'Dark Blue'],
    colorImages: {
      Blue: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Dark Blue': 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Jeans'
  },
  {
    id: '212',
    name: 'Slim Fit Jeans',
    brand: 'Carters',
    price: 34.99,
    description: 'Modern slim fit jeans with soft stretch fabric.',
    image: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.5,
    stock: 40,
    colors: ['Blue', 'Black'],
    colorImages: {
      Blue: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Black: 'https://images.pexels.com/photos/1082529/pexels-photo-1082529.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Jeans'
  },
  {
    id: '213',
    name: 'Junior Running Shoes',
    brand: 'Adidas Kids',
    price: 54.99,
    description: 'Lightweight running shoes designed for active kids.',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.9,
    stock: 29,
    badge: 'Premium',
    colors: ['Black', 'White', 'Blue'],
    colorImages: {
      Black: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
      White: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Blue: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Shoes'
  },
  {
    id: '214',
    name: 'Playground Sneakers',
    brand: 'Puma Kids',
    price: 49.99,
    description: 'Comfortable sneakers built for playground adventures.',
    image: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.7,
    stock: 33,
    colors: ['White', 'Blue'],
    colorImages: {
      White: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Blue: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Shoes'
  },
  {
    id: '215',
    name: 'Sport Active Shoes',
    brand: 'Nike Kids',
    price: 59.99,
    description: 'Versatile athletic shoes for school and sports.',
    image: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.8,
    stock: 27,
    badge: 'New',
    colors: ['Black', 'Red'],
    colorImages: {
      Black: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600',
      Red: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Shoes'
  },
  {
    id: '216',
    name: 'Winter Puffer Jacket',
    brand: 'The North Face Kids',
    price: 74.99,
    description: 'Warm insulated puffer jacket designed for cold winter days.',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.9,
    stock: 24,
    badge: 'Premium',
    colors: ['Black', 'Navy'],
    colorImages: {
      Black: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Navy: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Jackets'
  },
  {
    id: '217',
    name: 'Denim Kids Jacket',
    brand: 'Levis Kids',
    price: 54.99,
    description: 'Classic denim jacket perfect for casual everyday outfits.',
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.7,
    stock: 31,
    badge: 'Best Seller',
    colors: ['Blue', 'Light Blue'],
    colorImages: {
      Blue: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1600',
      'Light Blue': 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Jackets'
  },
  {
    id: '218',
    name: 'Rain Protection Jacket',
    brand: 'Columbia Kids',
    price: 59.99,
    description: 'Water-resistant jacket built for rainy weather and outdoor fun.',
    image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.6,
    stock: 28,
    colors: ['Yellow', 'Blue'],
    colorImages: {
      Yellow: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Blue: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Jackets'
  },
  {
    id: '219',
    name: 'Sport Zip Hoodie',
    brand: 'Nike Kids',
    price: 44.99,
    description: 'Lightweight hoodie with zip closure and sporty design.',
    image: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.8,
    stock: 35,
    badge: 'Sale',
    colors: ['Gray', 'Black'],
    colorImages: {
      Gray: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Black: 'https://images.pexels.com/photos/6311392/pexels-photo-6311392.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Hodes'
  },
  {
    id: '220',
    name: 'Cartoon Print Hoodie',
    brand: 'H&M Kids',
    price: 34.99,
    description: 'Soft hoodie featuring colorful cartoon-inspired artwork.',
    image: 'https://images.pexels.com/photos/6311613/pexels-photo-6311613.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.5,
    stock: 40,
    badge: 'New',
    colors: ['Blue', 'Red'],
    colorImages: {
      Blue: 'https://images.pexels.com/photos/6311613/pexels-photo-6311613.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Red: 'https://images.pexels.com/photos/6311613/pexels-photo-6311613.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Hodes'
  },
  {
    id: '221',
    name: 'Princess Party Dress',
    brand: 'Carters',
    price: 49.99,
    description: 'Elegant princess-inspired dress for birthdays and special occasions.',
    image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.9,
    stock: 22,
    badge: 'Premium',
    colors: ['Pink', 'White'],
    colorImages: {
      Pink: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1600',
      White: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Dresses'
  },
  {
    id: '222',
    name: 'Floral Summer Dress',
    brand: 'Zara Kids',
    price: 44.99,
    description: 'Lightweight floral dress perfect for sunny summer days.',
    image: 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.7,
    stock: 29,
    badge: 'Best Seller',
    colors: ['Yellow', 'Pink'],
    colorImages: {
      Yellow: 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Pink: 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Dresses'
  },
  {
    id: '223',
    name: 'Sparkle Birthday Dress',
    brand: 'H&M Kids',
    price: 54.99,
    description: 'Shimmering party dress designed for memorable celebrations.',
    image: 'https://images.pexels.com/photos/7691229/pexels-photo-7691229.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.8,
    stock: 18,
    badge: 'Premium',
    colors: ['Rose Gold', 'Silver'],
    colorImages: {
      'Rose Gold': 'https://images.pexels.com/photos/7691229/pexels-photo-7691229.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Silver: 'https://images.pexels.com/photos/7691229/pexels-photo-7691229.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Dresses'
  },
  {
    id: '224',
    name: 'Rainbow Tulle Dress',
    brand: 'Disney Kids',
    price: 42.99,
    description: 'Colorful tulle dress inspired by fairy tale adventures.',
    image: 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.6,
    stock: 34,
    colors: ['Rainbow', 'Pink'],
    colorImages: {
      Rainbow: 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Pink: 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Dresses'
  },
  {
    id: '225',
    name: 'Elegant Lace Dress',
    brand: 'Mango Kids',
    price: 59.99,
    description: 'Beautiful lace dress combining elegance and comfort.',
    image: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.8,
    stock: 20,
    badge: 'New',
    colors: ['Cream', 'White'],
    colorImages: {
      Cream: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1600',
      White: 'https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Dresses'
  },
  {
    id: '226',
    name: 'Butterfly Print Top',
    brand: 'Zara Kids',
    price: 24.99,
    description: 'Soft cotton top featuring a colorful butterfly print.',
    image: 'https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.7,
    stock: 35,
    badge: 'New',
    tags: ['Girls', 'Top', 'Casual'],
    colors: ['Pink', 'White'],
    colorImages: {
      Pink: 'https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&cs=tinysrgb&w=1600',
      White: 'https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Tops'
  },
  {
    id: '227',
    name: 'Rainbow Graphic Top',
    brand: 'H&M Kids',
    price: 22.99,
    description: 'Colorful rainbow graphic top made from breathable cotton.',
    image: 'https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.5,
    stock: 42,
    colors: ['Yellow', 'Pink'],
    colorImages: {
      Yellow: 'https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Pink: 'https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Tops'
  },
  {
    id: '228',
    name: 'Floral Ruffle Top',
    brand: 'Mango Kids',
    price: 26.99,
    description: 'Elegant floral top with ruffle sleeves for a stylish look.',
    image: 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.8,
    stock: 28,
    badge: 'Best Seller',
    colors: ['Floral Pink', 'White'],
    colorImages: {
      'Floral Pink': 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1600',
      White: 'https://images.pexels.com/photos/1755428/pexels-photo-1755428.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Tops'
  },
  {
    id: '229',
    name: 'Cute Unicorn Top',
    brand: 'Disney Kids',
    price: 23.99,
    description: 'Fun unicorn-themed top perfect for everyday wear.',
    image: 'https://images.pexels.com/photos/3771826/pexels-photo-3771826.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.6,
    stock: 39,
    colors: ['Purple', 'Pink'],
    colorImages: {
      Purple: 'https://images.pexels.com/photos/3771826/pexels-photo-3771826.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Pink: 'https://images.pexels.com/photos/3771826/pexels-photo-3771826.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Tops'
  },
  {
    id: '230',
    name: 'Casual Cotton Top',
    brand: 'GAP Kids',
    price: 21.99,
    description: 'Everyday cotton top offering comfort and simplicity.',
    image: 'https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.4,
    stock: 45,
    colors: ['Blue', 'White'],
    colorImages: {
      Blue: 'https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&cs=tinysrgb&w=1600',
      White: 'https://images.pexels.com/photos/6311648/pexels-photo-6311648.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Tops'
  },
  {
    id: '231',
    name: 'Princess Jewelry Set',
    brand: 'Disney Kids',
    price: 18.99,
    description: 'Colorful jewelry set including necklace, bracelet and ring.',
    image: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.7,
    stock: 50,
    badge: 'Best Seller',
    colors: ['Pink', 'Purple'],
    colorImages: {
      Pink: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Purple: 'https://images.pexels.com/photos/1927259/pexels-photo-1927259.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Accessories'
  },
  {
    id: '232',
    name: 'Mini Fashion Handbag',
    brand: 'Barbie',
    price: 24.99,
    description: 'Cute mini handbag designed for young fashion lovers.',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.6,
    stock: 38,
    badge: 'New',
    colors: ['Pink', 'Rose'],
    colorImages: {
      Pink: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Rose: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Accessories'
  },
  {
    id: '233',
    name: 'Colorful Hair Clips',
    brand: 'H&M Kids',
    price: 12.99,
    description: 'Set of colorful hair clips perfect for daily styling.',
    image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.5,
    stock: 65,
    colors: ['Multi Color'],
    colorImages: {
      'Multi Color': 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Accessories'
  },
  {
    id: '234',
    name: 'Glitter Sneakers',
    brand: 'Skechers Kids',
    price: 54.99,
    description: 'Comfortable glitter sneakers with stylish sparkling finish.',
    image: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.8,
    stock: 29,
    badge: 'Premium',
    colors: ['Pink', 'Silver'],
    colorImages: {
      Pink: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Silver: 'https://images.pexels.com/photos/1240892/pexels-photo-1240892.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Shoes'
  },
  {
    id: '235',
    name: 'Light Up Shoes',
    brand: 'Geox Kids',
    price: 59.99,
    description: 'Fun sneakers with LED lights that activate while walking.',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.9,
    stock: 26,
    badge: 'Best Seller',
    colors: ['Pink', 'Blue'],
    colorImages: {
      Pink: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Blue: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Shoes'
  },
  {
    id: '236',
    name: 'Pink Running Shoes',
    brand: 'Adidas Kids',
    price: 49.99,
    description: 'Lightweight running shoes designed for active girls.',
    image: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.7,
    stock: 33,
    colors: ['Pink', 'White'],
    colorImages: {
      Pink: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600',
      White: 'https://images.pexels.com/photos/19090/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Shoes'
  },
  {
    id: '237',
    name: 'Cute Sun Hat',
    brand: 'Carters',
    price: 16.99,
    description: 'Wide-brim summer hat providing protection and style.',
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.5,
    stock: 44,
    colors: ['Pink', 'White'],
    colorImages: {
      Pink: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600',
      White: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Heats'
  },
  {
    id: '238',
    name: 'Flower Straw Hat',
    brand: 'Disney Kids',
    price: 18.99,
    description: 'Decorative straw hat featuring floral details.',
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.6,
    stock: 36,
    badge: 'New',
    colors: ['Beige', 'Pink'],
    colorImages: {
      Beige: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Pink: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Heats'
  },
  {
    id: '239',
    name: 'Summer Beach Hat',
    brand: 'H&M Kids',
    price: 15.99,
    description: 'Lightweight beach hat ideal for sunny outdoor activities.',
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.4,
    stock: 48,
    colors: ['White', 'Cream'],
    colorImages: {
      White: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Cream: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Heats'
  },
  {
    id: '240',
    name: 'Fashion Bow Hat',
    brand: 'Zara Kids',
    price: 19.99,
    description: 'Stylish hat featuring a decorative bow design.',
    image: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600',
    rating: 4.7,
    stock: 31,
    badge: 'Sale',
    colors: ['Pink', 'Cream'],
    colorImages: {
      Pink: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600',
      Cream: 'https://images.pexels.com/photos/1124465/pexels-photo-1124465.jpeg?auto=compress&cs=tinysrgb&w=1600'
    },
    category: 'Kids',
    subcategory: 'Heats'
  },
];
