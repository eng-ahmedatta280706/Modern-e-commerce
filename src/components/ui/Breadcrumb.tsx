import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  showHome?: boolean;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, showHome = true }) => (
  <nav aria-label="Breadcrumb" className="flex items-center text-sm mb-6 flex-wrap gap-1">
    {showHome && (
      <>
        <Link to="/" className="text-gray-400 hover:text-gray-600 flex items-center gap-1">
          <Home size={14} />
          <span>Home</span>
        </Link>
        <ChevronRight size={14} className="text-gray-300" />
      </>
    )}
    {items.map((item, index) => {
      const isLast = index === items.length - 1;
      return (
        <React.Fragment key={item.label}>
          {isLast || !item.href ? (
            <span className={isLast ? 'text-gray-900 font-medium' : 'text-gray-400'}>
              {item.label}
            </span>
          ) : (
            <Link to={item.href} className="text-gray-500 hover:text-gray-700">
              {item.label}
            </Link>
          )}
          {!isLast && <ChevronRight size={14} className="text-gray-300" />}
        </React.Fragment>
      );
    })}
  </nav>
);

export default Breadcrumb;
