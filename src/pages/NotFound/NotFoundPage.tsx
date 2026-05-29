import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, ShoppingBag } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Large 404 */}
      <div className="relative mb-8">
        <span className="text-[160px] font-black text-gray-100 leading-none select-none">
          404
        </span>
        <div className="absolute inset-0 flex items-center justify-center">
          <ShoppingBag size={64} className="text-blue-600 opacity-80" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-3">Page Not Found</h1>
      <p className="text-gray-500 mb-8 max-w-md text-lg">
        The page you're looking for doesn't exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center justify-center gap-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
        <Link
          to="/"
          className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <Home size={18} />
          Back to Home
        </Link>
        <Link
          to="/shop"
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          <ShoppingBag size={18} />
          Browse Shop
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
