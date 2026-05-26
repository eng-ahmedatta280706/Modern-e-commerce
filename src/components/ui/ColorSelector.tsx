import React from 'react';

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onChange: (color: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const ColorSelector: React.FC<ColorSelectorProps> = ({ 
  colors, 
  selectedColor, 
  onChange,
  size = 'sm'
}) => {
  // Map color names to actual color values
  const colorMap: {[key: string]: string} = {
    black: '#000000',
    white: '#FFFFFF',
    red: '#EF4444',
    blue: '#3B82F6',
    green: '#10B981',
    yellow: '#F59E0B',
    purple: '#8B5CF6',
    pink: '#EC4899',
    gray: '#6B7280',
    navy: '#1E3A8A',
    brown: '#92400E',
    beige: '#E5E7EB',
  };
  
  // Determine size class
  const sizeClass = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  }[size];
  
  return (
    <div className="flex items-center space-x-2">
      <div className="text-xs text-gray-500 mr-1">Colors:</div>
      <div className="flex space-x-1">
        {colors.map((color) => (
          // const bgColor
          <button
            key={color}
            aria-label={`Color ${color}`}
            className={`rounded-full border ${selectedColor === color ? 'ring-2 ring-offset-1 ring-blue-500' : 'ring-2'} transition-all duration-200`}
            style={{
              backgroundColor: colorMap[color.toLowerCase()] || color,
              borderColor: color.toLowerCase() === 'white' ? '#e5e7eb' : 'transparent'
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onChange(color);
            }}
          >
            <div className={`${sizeClass} rounded-full`}></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;