import React from 'react';

interface ColorSelectorProps {
  colors: string[];
  selectedColor: string;
  onChange: (color: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

const colorMap: Record<string, string> = {
  black: '#000000',
  white: '#FFFFFF',
  red: '#EF4444',
  blue: '#3B82F6',
  green: '#10B981',
  yellow: '#F59E0B',
  purple: '#8B5CF6',
  pink: '#EC4899',
  gray: '#6B7280',
  grey: '#6B7280',
  navy: '#1E3A8A',
  brown: '#92400E',
  beige: '#E5E7EB',
  tan: '#D2B48C',
  cream: '#FFFDD0',
  blush: '#FFB6C1',
  orange: '#F97316',
  'light blue': '#93C5FD',
};

const sizeClass = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
};

const ColorSelector: React.FC<ColorSelectorProps> = ({
  colors,
  selectedColor,
  onChange,
  size = 'sm',
}) => (
  <div className="flex items-center space-x-2">
    <div className="text-xs text-gray-500 mr-1">Colors:</div>
    <div className="flex space-x-1 flex-wrap gap-1">
      {colors.map(color => {
        const hex = colorMap[color.toLowerCase()] ?? color;
        const isWhite = color.toLowerCase() === 'white';
        return (
          <button
            key={color}
            title={color}
            aria-label={`Select color ${color}`}
            aria-pressed={selectedColor === color}
            // use data attributes so styling can be moved to an external CSS file
            data-color={hex}
            data-is-white={isWhite ? 'true' : 'false'}
            className={`color-swatch rounded-full border transition-all duration-200 ${
              selectedColor === color
                ? 'ring-2 ring-offset-1 ring-blue-500'
                : 'ring-1 ring-gray-200'
            }`}
            onClick={e => {
              e.preventDefault();
              e.stopPropagation();
              onChange(color);
            }}
          >
            <div className={`${sizeClass[size]} rounded-full`} style={{ backgroundColor: hex }} />
          </button>
        );
      })}
    </div>
  </div>
);

export default ColorSelector;
