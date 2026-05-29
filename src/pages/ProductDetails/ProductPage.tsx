import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Star, Truck, ShieldCheck, RotateCcw,
  ChevronRight, Heart
} from 'lucide-react';
import VideoPlayer from '../../components/media/VideoPlayer';
import ColorSelector from '../../components/product/ColorSelector';
import ProductGrid from '../../components/product/ProductGrid';
import { useCart } from '../../contexts/CartContext';
import { localProducts } from '../../data/products';
import { useWishlist } from '../../contexts/WishlistContext';
import ShareButton from '../../components/media/ShareButton';
import { formatPrice } from '../../utils/formatPrice';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // ✅ ALL hooks must be called before any early returns
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  const product = localProducts.find(p => p.id === id);

  // ✅ Memoize related products to avoid re-sorting on every render
  const relatedProducts = useMemo(() =>
    localProducts
      .filter(p => p.id !== id && p.category === product?.category)
      .slice(0, 4),
    [id, product?.category]
  );

  // Derive selectedColor default after product is found
  const activeColor = selectedColor || product?.colors[0] || '';
  const currentImage = product?.colorImages[activeColor] || product?.image || '';

  // ✅ Early return AFTER all hooks
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

  const handleAddToCart = () => {
    addToCart(product, activeColor);
  };

  const handleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumbs */}
      <nav className="flex mb-8 text-sm" aria-label="Breadcrumb">
        <Link to="/" className="text-gray-500 hover:text-gray-700">Home</Link>
        <ChevronRight size={16} className="mx-2 text-gray-400 self-center" />
        <Link
          to={`/shop?category=${product.category}`}
          className="text-gray-500 hover:text-gray-700"
        >
          {product.category}
        </Link>
        {product.subcategory && (
          <>
            <ChevronRight size={16} className="mx-2 text-gray-400 self-center" />
            <Link
              to={`/shop?category=${product.category}&subcategory=${product.subcategory}`}
              className="text-gray-500 hover:text-gray-700"
            >
              {product.subcategory}
            </Link>
          </>
        )}
        <ChevronRight size={16} className="mx-2 text-gray-400 self-center" />
        <span className="text-gray-900 font-medium">{product.name}</span>
      </nav>

      {/* Product info section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Left: Product images */}
        <div className="space-y-4">
          <div className="rounded-lg overflow-hidden bg-gray-100 aspect-square">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

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
          {product.badge && (
            <div className="inline-block bg-orange-500 text-white text-sm font-medium px-3 py-1 rounded-full mb-4">
              {product.badge}
            </div>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={18} fill={i < Math.floor(product.rating ?? 4) ? 'currentColor' : 'none'} />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">
              {product.rating ?? 4.2} ({product.reviews?.length ?? 128} reviews)
            </span>
          </div>

          <div className="mb-6">
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.badge === 'Sale' && product.discount && (
              <span className="ml-2 text-lg text-gray-500 line-through">
                {formatPrice(product.price * (1 + product.discount / 100))}
              </span>
            )}
          </div>

          <p className="text-gray-600 mb-6">{product.description}</p>

          {/* Color selector */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">
              Color: <span className="text-gray-500">{activeColor}</span>
            </h3>
            <ColorSelector
              colors={product.colors}
              selectedColor={activeColor}
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
                aria-label="Decrease quantity"
              >
                -
              </button>
              <span className="flex-1 text-center">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:text-gray-800"
                aria-label="Increase quantity"
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
              onClick={handleWishlist}
              className="flex items-center justify-center border border-gray-300 hover:bg-gray-50 py-3 px-6 rounded-lg transition-colors"
            >
              <Heart
                size={20}
                className={`mr-2 transition-colors ${isInWishlist(product.id) ? 'text-red-500 fill-red-500' : 'text-gray-400'}`}
              />
              <span>Wishlist</span>
            </button>
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

      {/* Related products */}
      {relatedProducts.length > 0 && (
        <div className="mt-16">
          <ProductGrid title="You may also like" products={relatedProducts} />
        </div>
      )}
    </div>
  );
};

export default ProductPage;
