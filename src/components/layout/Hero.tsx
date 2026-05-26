import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { localProducts } from "../../data/products"; // استيراد المنتجات المحلية

interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  badge?: string;
  colors?: string[];
  colorImages?: Record<string, string>;
  video?: string;
  category: string;
}

interface HeroCarouselProps {
  products?: Product[]; // قد تأتي من السيرفر أو لا
}

const HeroCarousel: React.FC<HeroCarouselProps> = ({ products }) => {
  const displayProducts = products && products.length > 0 ? products : localProducts;

  if (!displayProducts || displayProducts.length === 0) {
    return (
      <div className="relative bg-gray-900 text-white h-[400px] flex items-center justify-center">
        <p className="text-lg md:text-xl">There are no products available.</p>
      </div>
    );
  }

  return (
    <div className="relative bg-gray-900 text-white">
      <Swiper
        modules={[Pagination, Autoplay]}
        slidesPerView={1}
        loop={true}
        pagination={{ clickable: false }}
        autoplay={{ delay: 4000 }}
        className="h-[600px]"
      >
        {displayProducts.map((product) => (
          <SwiperSlide key={product.id}>
            {/* خلفية الصورة */}
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
            </div>

            {/* المحتوى */}
            <div className="relative container mx-auto px-4 py-24 md:py-32 flex flex-col items-start">
              {product.badge && (
                <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm mb-4">
                  {product.badge}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-bold mb-4">{product.name}</h1>
              <p className="text-lg md:text-xl mb-4">{product.description}</p>
              <p className="text-xl font-semibold mb-8">${product.price.toFixed(2)}</p>
              <Link
                to={`/product/${product.id}`}
                className="bg-white text-gray-900 hover:bg-gray-200 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Shop {product.category}
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;