import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { useTranslate } from '../../hooks/userTranslate';

interface SearchBarProps {
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { t } = useTranslate();
  const debouncedQuery = useDebounce(query, 400);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className}`}>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder={t('header.searchPlaceholder')}
        className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        aria-label="Search products"
      />
      {query && (
        <button
          type="button"
          onClick={() => setQuery('')}
          className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          aria-label="Clear search"
        >
          <X size={14} />
        </button>
      )}
      <button
        type="submit"
        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        aria-label="Submit search"
      >
        <Search size={18} />
      </button>
    </form>
  );
};

export default SearchBar;
