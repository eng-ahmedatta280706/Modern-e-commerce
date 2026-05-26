import React from 'react';
import Hero from '../components/layout/Hero';
import ProductGrid from '../components/ui/ProductGrid';
import FeaturedCategories from '../components/ui/FeaturedCategories';
import CategoryBanner from '../components/ui/CategoryBanner';
import { localProducts } from '../data/products';

const HomePage: React.FC = () => {
  // Filter products for different sections
  const newArrivals = localProducts.filter(product => product.badge === 'New');
  const bestSellers = localProducts.filter(product => product.badge === 'Best Seller');
  
  return (
    <div>
      {/* Hero section */}
      <Hero />
      
      {/* Container for main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Featured categories */}
        <FeaturedCategories />
        
        {/* New arrivals */}
        <ProductGrid title="New Arrivals" products={newArrivals} />
        
        {/* Women's collection banner */}
        <div className="my-12">
          <CategoryBanner 
            title="Women's Collection"
            description="Discover our latest women's collection with styles for every occasion."
            image="https://images.pexels.com/photos/972995/pexels-photo-972995.jpeg?auto=compress&cs=tinysrgb&w=1600"
            link="/"
            position="left"
          />
        </div>
        
        {/* Best sellers */}
        <ProductGrid title="Best Sellers" products={bestSellers} />
        
        {/* Men's collection banner */}
        <div className="my-12">
          <CategoryBanner 
            title="Men's Collection"
            description="Explore our premium men's collection with comfortable and stylish options."
            image="https://images.pexels.com/photos/837140/pexels-photo-837140.jpeg?auto=compress&cs=tinysrgb&w=1600"
            link="/"
            position="right"
          />
        </div>
      </div>
    </div>
  );
};

export default HomePage;