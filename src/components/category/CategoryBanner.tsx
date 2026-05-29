import React from 'react';
import { Link } from 'react-router-dom';

interface CategoryBannerProps {
  title: string;
  description: string;
  image: string;
  link: string;
  position?: 'left' | 'right';
}

const CategoryBanner: React.FC<CategoryBannerProps> = ({ 
  title, 
  description, 
  image, 
  link,
  position = 'left'
}) => {
  return (
    <div className="relative overflow-hidden bg-gray-100 rounded-lg">
      <div className={`flex flex-col md:flex-row ${position === 'right' ? 'md:flex-row-reverse' : ''}`}>
        {/* Image */}
        <div className="md:w-1/2">
          <img 
            src={image} 
            alt={title} 
            className="h-64 md:h-full w-full object-cover object-center"
          />
        </div>
        
        {/* Content */}
        <div className="md:w-1/2 p-6 md:p-10 flex flex-col justify-center">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
          <p className="text-gray-600 mb-6">{description}</p>
          <Link 
            to={link} 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors self-start"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CategoryBanner;