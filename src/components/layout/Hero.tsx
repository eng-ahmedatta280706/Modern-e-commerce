import React from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import { localProducts } from "../../data/products"; // استيراد المنتجات المحلية
import { formatPrice } from "../../utils/formatPrice";

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
  const featuredProducts = displayProducts.slice(0, 5);

  if (!featuredProducts || featuredProducts.length === 0) {
    return (
      <div className="relative bg-ink text-white h-[400px] flex items-center justify-center">
        <p className="text-lg md:text-xl">There are no products available.</p>
      </div>
    );
  }

  return (
    <div className="relative bg-ink text-white">
      <Swiper
        modules={[Autoplay]}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 4000 }}
        className="h-[600px]"
      >
        {featuredProducts.map((product) => (
          <SwiperSlide key={product.id} className="relative h-full">
            {/* خلفية الصورة */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-linear-to-r from-black/75 via-black/45 to-transparent rtl:bg-linear-to-l"></div>
            </div>

            {/* المحتوى */}
            <div className="relative z-10 container px-4 py-24 md:py-32">
              <div className="flex flex-col items-start max-w-2xl text-left rtl:items-end rtl:text-right">
                {product.badge && (
                  <span className="bg-accent-500 text-white px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-4">
                    {product.badge}
                  </span>
                )}
                <h1 className="text-4xl md:text-6xl font-extrabold mb-4 leading-[1.05] text-white">{product.name}</h1>
                <p className="text-base md:text-lg mb-5 text-white/80 max-w-lg">{product.description}</p>
                <p className="text-2xl font-bold mb-8 text-white">{formatPrice(product.price)}</p>
                <Link
                  to={`/product/${product.id}`}
                  className="inline-flex items-center gap-2 bg-white text-ink hover:bg-brand-600 hover:text-white px-7 py-3.5 rounded-xl font-semibold shadow-lg transition-all duration-200"
                >
                  Shop {product.category}
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HeroCarousel;