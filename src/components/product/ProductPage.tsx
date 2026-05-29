import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star, Truck, ShieldCheck, RotateCcw,
  ChevronRight, Heart
} from 'lucide-react';
import VideoPlayer from '../media/VideoPlayer';
import ColorSelector from './ColorSelector';
import ProductGrid from './ProductGrid';
import { useCart } from '../../contexts/CartContext';
import { localProducts } from '../../data/products';
import { useWishlist } from '../../contexts/WishlistContext';
import ShareButton from '../media/ShareButton';
import Breadcrumb from '../ui/Breadcrumb';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  // const colors = localProducts.reduce((acc, product) => {
  //   product.colors.forEach(color => {
  //     if (!acc.includes(color)) {
  //       acc.push(color);
  //     }
  //   });
  //   return acc;
  // }, [] as string[]);
  const colors : string[] = localProducts.find(p => p.id === id)?.colors || [];
  const product = localProducts.find(p => p.id === id);
  const { addToCart } = useCart();

  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // If product not found
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Product not found</h1>
        <Link to="/" className="text-blue-600 hover:text-blue-800">
          Return to home page
        </Link>
      </div>
    );
  }

  // State for selected color and quantity
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [quantity, setQuantity] = useState(1);

  // Get current image based on selected color
  const currentImage = product.colorImages[selectedColor] || product.image;

  // Related products (just random products for demo)
  const relatedProducts = localProducts
    .filter(p => p.id !== id)
    .sort(() => 0.5 - Math.random())
    .slice(0, 4);

  const handleAddToCart = () => {
    addToCart(product, selectedColor);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <Breadcrumb
        items={[
          { label: product.category, href: `/category/${product.category.toLowerCase()}/${product.subcategory?.toLowerCase() ?? ''}` },
          { label: product.subcategory ?? '', href: `/category/${product.category.toLowerCase()}/${product.subcategory?.toLowerCase() ?? ''}` },
          { label: product.name }
        ]}
      />

      {/* Product info section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Product images */}
        <div className="space-y-4 max-h-[700px] overflow-hidden">
          {/* Main image */}
          <div className="rounded-lg overflow-hidden bg-gray-100">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Video player (if video exists) */}
          {product.video && (
            <div className="mt-6">
              <h3 className="font-medium mb-3">Product Video</h3>
              <VideoPlayer
                videoUrl={product.video}
                thumbnailUrl={product.image}
              />
            </div>
          )}
        </div>

        {/* Right: Product details */}
        <div>
          {/* Product badge */}
          {product.badge && (
            <div className="inline-block bg-orange-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
              {product.badge}
            </div>
          )}

          {/* Product name and price */}
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          {/* Ratings */}
          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < 4 ? "currentColor" : "none"} />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              4.2 (128 reviews)
            </span>
          </div>

          {/* Price */}
          <div className="mb-6">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>

            {/* Original price if on sale */}
            {product.badge === 'Sale' && (
              <span className="ml-2 text-lg text-gray-500 line-through">
                ${(product.price * 1.2).toFixed(2)}
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Color selector */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Color</h3>
            <ColorSelector
              colors={colors}
              selectedColor={selectedColor}
              onChange={setSelectedColor}
              size="md"
            />
          </div>

          {/* Quantity selector */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Quantity</h3>
            <div className="flex items-center border border-gray-300 rounded-lg w-32">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                -
              </button>
              <span className="flex-1 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:text-gray-800"
              >
                +
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors flex items-center justify-center"
            >
              Add to Cart
            </button>
            <button
              onClick={() => {
                if (isInWishlist(product.id)) {
                  removeFromWishlist(product.id);
                } else {
                  addToWishlist(product);
                }
              }}
              className="flex items-center justify-center border border-gray-300 hover:bg-gray-50 py-3 px-6 rounded-lg transition-colors"
            >
              <Heart
                size={20}
                className={`mr-2 transition-colors ${isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-gray-400"
                  }`}
              />
              <span>Wishlist</span>
            </button>
            {/* <button className="hidden sm:flex items-center justify-center border border-gray-300 hover:bg-gray-50 p-3 rounded-[100%] transition-colors">
            </button> */}
            <ShareButton url={window.location.href} title={product.name} />
          </div>

          {/* Shipping and returns */}
          <div className="border-t border-gray-200 pt-6 space-y-4">
            <div className="flex items-start">
              <Truck className="text-gray-400 mr-3 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">Free Shipping</h4>
                <p className="text-sm text-gray-600">Free standard shipping on orders over $50</p>
              </div>
            </div>
            <div className="flex items-start">
              <ShieldCheck className="text-gray-400 mr-3 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">Quality Guarantee</h4>
                <p className="text-sm text-gray-600">Satisfaction guaranteed on all our products</p>
              </div>
            </div>
            <div className="flex items-start">
              <RotateCcw className="text-gray-400 mr-3 flex-shrink-0" size={20} />
              <div>
                <h4 className="font-medium text-gray-900">Easy Returns</h4>
                <p className="text-sm text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related products section */}
      <div className="mt-16">
        <ProductGrid title="You may also like" products={relatedProducts} />
      </div>
    </div>
  );
};

export default ProductPage;