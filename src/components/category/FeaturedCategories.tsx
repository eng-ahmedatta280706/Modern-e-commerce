import React from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

interface Category {
  id: string;
  name: string;
  image: string;
  link: string;
}

const FeaturedCategories: React.FC = () => {
  const categories: Category[] = [
    {
      id: 'women',
      name: 'Women',
      image: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?auto=compress&cs=tinysrgb&w=1600',
      link: 'women'
    },
    {
      id: 'men',
      name: 'Men',
      image: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=1600',
      link: 'men'
    },
    {
      id: 'accessories',
      name: 'Accessories',
      image: 'https://images.pexels.com/photos/1078958/pexels-photo-1078958.jpeg?auto=compress&cs=tinysrgb&w=1600',
      link: 'accessories'
    },
    {
      id: 'shoes',
      name: 'Shoes',
      image: 'https://images.pexels.com/photos/292999/pexels-photo-292999.jpeg?auto=compress&cs=tinysrgb&w=1600',
      link: 'shoes'
    },
    {
      id: 'kids',
      name: 'Kids',
      image: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=1600',
      link: 'kids'
    },
    {
      id: 'sale',
      name: 'Sale',
      image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1600',
      link: 'sale'
    },
    {
      id: 'new-arrivals',
      name: 'New Arrivals',
      image: 'https://images.pexels.com/photos/298346/pexels-photo-298346.jpeg?auto=compress&cs=tinysrgb&w=1600',
      link: 'new-arrivals'
    },
    {
      id: 'sustainable',
      name: 'Sustainable',
      image: 'https://images.pexels.com/photos/298863/pexels-photo-298863.jpeg?auto=compress&cs=tinysrgb&w=1600',
      link: 'sustainable'
    }
  ];

  return (
    <section className="py-12 container mx-auto px-4 max-w-7xl ">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold">Shop By Category</h2>
      </div>

      <Swiper
        modules={[Autoplay]}
        loop
        speed={3000}
        autoplay={{ delay: 0, disableOnInteraction: false, pauseOnMouseEnter: true }}
        spaceBetween={10}
        slidesPerView={1}
        breakpoints={{
          640: { slidesPerView: 3, spaceBetween: 16 },
          1024: { slidesPerView: 4, spaceBetween: 24 },
        }}
      >
        {categories.map((category) => (
          <SwiperSlide key={category.id}>
            <Link
              to={`/category/${category.link}`}
              className="group relative block overflow-hidden rounded-lg w-full h-full"
            >
              <div className="aspect-square overflow-hidden w-[100%] h-[200px]">
                <img
                  src={category.image}
                  alt={category.name}
                  className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-6">
                <h3 className="text-xl font-bold text-white">{category.name}</h3>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default FeaturedCategories;