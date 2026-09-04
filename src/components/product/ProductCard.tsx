import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Product } from '../../types/Product';
import ColorSelector from './ColorSelector';
import AddCart from '../ui/AddCart';
import Badge from '../ui/Badge';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { formatPrice } from '../../utils/formatPrice';

interface ProductCardProps {
  product: Product;
  isWishlist?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, isWishlist }) => {
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [isHovered, setIsHovered] = useState(false);
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const currentImage = product.colorImages[selectedColor] || product.image;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedColor);
  };

  const handleWishlist = (e: React.MouseEvent<HTMLButtonElement>) => {
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
        <div className="relative overflow-hidden rounded-2xl bg-slate-100 mb-4 aspect-3/4 shadow-card transition-all duration-300 group-hover:shadow-card-hover
        sm:w-75 md:w-68 lg:w-85 xl:w-58 2xl:w-75">
          <img
            src={currentImage}
            alt={product.name}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />

          {/* Badge */}
          {product.badge && (
            <Badge text={product.badge} />
          )}

          <div
            className={`absolute bottom-0 left-0 right-0 bg-white/85 backdrop-blur-sm py-3 px-4 transition-all duration-300 flex items-center justify-between ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-full'
              }`}
          >
            {/* Wishlist Button */}
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

            <AddCart
              product={product}
              color={selectedColor}
              onClick={handleAddToCart} />
          </div>
        </div>

        {/* Product Info */}
        <div className="px-1">
          <h3 className="font-medium text-ink mb-1 line-clamp-1 transition-colors group-hover:text-brand-600">
            {product.name}
          </h3>
          <p className="font-semibold text-ink mb-2">{formatPrice(product.price)}</p>

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
