import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../../types/Product';
import ColorSelector from './ColorSelector';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';

interface ProductCardProps {
  product: Product;
  isWishlist?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isWishlist }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // الصورة حسب اللون المختار
  const currentImage = product.colorImages[selectedColor] || product.image;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedColor);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div
      className="group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg bg-gray-100 mb-4 aspect-[3/4]">
          <img
            src={currentImage}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
          />

          {/* بادج إذا موجود */}
          {product.badge && (
            <div className="absolute top-2 left-2 bg-orange-500 text-white text-xs font-medium px-2 py-1 rounded">
              {product.badge}
            </div>
          )}

          <div
            className={`absolute bottom-0 left-0 right-0 bg-slate-300 bg-opacity-90 py-3 px-4 transition-all duration-300 flex justify-between ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
              }`}
          >
            {/* زر Wishlist */}
            {isWishlist !== true && (
              <button
                onClick={handleWishlist}
                className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                aria-label="Add to wishlist"
              >
                <Heart
                  size={20}
                  className={`transition-colors hover:text-red-500 duration-200 ${isInWishlist(product.id) ? "text-red-500 fill-red-500" : "text-gray-700"
                    }`}
                />
              </button>
            )}

            {/* زر Add to Cart */}
            <button
              onClick={handleAddToCart}
              className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded-full transition-colors"
            >
              <ShoppingCart size={16} />
              <span className="text-sm">Add to Cart</span>
            </button>
          </div>
        </div>

        {/* معلومات المنتج */}
        <div>
          <h3 className="font-medium text-gray-900 mb-1 transition-colors group-hover:text-blue-600">
            {product.name}
          </h3>
          <p className="font-medium text-gray-900 mb-2">${product.price.toFixed(2)}</p>

          <ColorSelector
            colors={product.colors}
            selectedColor={selectedColor}
            onChange={setSelectedColor}
          />
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
