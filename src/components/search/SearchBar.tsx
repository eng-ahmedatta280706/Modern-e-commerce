import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useDebounce } from '../../hooks/useDebounce';
import { useTranslate } from '../../hooks/userTranslate';

interface SearchBarProps {
  className?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ className = '' , value, placeholder ,onChange }) => {
  const [query, setQuery] = useState(value || '');
  const navigate = useNavigate();
  const { t } = useTranslate();
  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (debouncedQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(debouncedQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`relative w-full ${className} mb-2`}>
      <input
        type="text"
        value={query}
        onChange={e => {
          setQuery(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={placeholder || t('search.placeholder') || 'Search...'}
        className="w-full py-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-brand-500 text-sm"
        aria-label="Search products"
      />
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery('');
            onChange('');
          }}
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
