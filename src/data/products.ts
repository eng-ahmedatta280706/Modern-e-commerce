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

  }
];