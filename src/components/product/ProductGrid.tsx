import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';
import type { Product } from '../../types/Product';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ProductGridProps {
  title?: string;
  products: Product[];
  viewAllLink?: string;
  columns?: 2 | 3 | 4 | 5;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  title,
  products,
  viewAllLink,
  columns = 5,
}) => {
  const prevButtonRef = useRef<HTMLButtonElement | null>(null);
  const nextButtonRef = useRef<HTMLButtonElement | null>(null);

  if (products.length === 0) {
    return (
      <section className="py-8">
        {title && <h2 className="text-2xl font-bold text-gray-900 mb-6">{title}</h2>}
        <div className="text-center py-12 text-gray-500">
          <p className="text-lg">No products found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 relative">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {(viewAllLink ?? products.length > 8) && (
            <Link
              to={viewAllLink ?? '/shop'}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View All
            </Link>
          )}
        </div>
      )}

      <div className="relative">
        <button
          ref={prevButtonRef}
          type="button"
          aria-label="Previous products"
          className="absolute -left-6 top-[40%] z-20 -translate-x-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition hover:border-gray-300 hover:bg-gray-50 md:-translate-x-1/2"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          ref={nextButtonRef}
          type="button"
          aria-label="Next products"
          className="absolute -right-6 top-[40%] z-20 translate-x-1/2 -translate-y-1/2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition hover:border-gray-300 hover:bg-gray-50 md:translate-x-1/2"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <Swiper
          modules={[Navigation]}
          spaceBetween={14}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: Math.min(2, columns) },
            768: { slidesPerView: Math.min(3, columns) },
            1024: { slidesPerView: Math.min(4, columns) },
            1280: { slidesPerView: columns },
          }}
          navigation={true}
          onBeforeInit={(swiper) => {
            const navigation = swiper.params.navigation;

            if (navigation && typeof navigation !== 'boolean') {
              navigation.prevEl = prevButtonRef.current;
              navigation.nextEl = nextButtonRef.current;
            }
          }}
          className="px-10 md:px-12 swiper-blur"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="h-auto">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductGrid;
