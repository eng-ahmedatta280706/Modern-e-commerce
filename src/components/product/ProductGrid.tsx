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
        {title && <h2 className="section-title mb-6">{title}</h2>}
        <div className="text-center py-12 text-slate-500">
          <p className="text-lg">No products found.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-8 relative">
      {title && (
        <div className="flex items-end justify-between mb-6">
          <h2 className="section-title relative pl-3 border-l-4 border-brand-600 rtl:pl-0 rtl:pr-3 rtl:border-l-0 rtl:border-r-4">{title}</h2>
          {(viewAllLink ?? products.length > 8) && (
            <Link
              to={viewAllLink ?? '/shop'}
              className="text-brand-600 hover:text-brand-800 font-semibold text-md shrink-0"
            >
              View All  <i className="fa-solid fa-arrow-right-long"></i>
            </Link>
          )}
        </div>
      )}

      <div className="relative">
        <button
          ref={prevButtonRef}
          type="button"
          aria-label="Previous products"
          className="absolute -left-6 top-[40%] z-20 -translate-x-1/2 -translate-y-14 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition hover:border-gray-300 hover:bg-gray-50 md:-translate-x-1/2 lg:translate-x-5 2xl:-translate-x-1"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          ref={nextButtonRef}
          type="button"
          aria-label="Next products"
          className="absolute -right-6 top-[40%] z-20 translate-x-1/2 -translate-y-14 inline-flex h-11 w-11 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-700 shadow-md transition hover:border-gray-300 hover:bg-gray-50 md:translate-x-1/2 lg:-translate-x-1"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <Swiper
          modules={[Navigation]}
          spaceBetween={14}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: Math.min(2, columns) , spaceBetween: 20},
            768: { slidesPerView: Math.min(3, columns) , spaceBetween: 20},
            1024: { slidesPerView: Math.min(4, columns) , spaceBetween: 35},
            1280: { slidesPerView: columns , spaceBetween: 30},
          }}
          navigation={true}
          onBeforeInit={(swiper) => {
            const navigation = swiper.params.navigation;

            if (navigation && typeof navigation !== 'boolean') {
              navigation.prevEl = prevButtonRef.current;
              navigation.nextEl = nextButtonRef.current;
            }
          }}
          className="px-4 md:px-12 lg:px-11 swiper-blur"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id} className="sm:h-147 md:h-125 lg:h-120 xl:h-118 2xl:h-130">
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default ProductGrid;
