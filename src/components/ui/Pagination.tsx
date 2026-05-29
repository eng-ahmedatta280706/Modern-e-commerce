import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const range = (start: number, end: number) =>
  Array.from({ length: end - start + 1 }, (_, i) => i + start);

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  siblingCount = 1,
}) => {
  if (totalPages <= 1) return null;

  const totalPageNumbers = siblingCount * 2 + 5; // siblings + first + last + current + 2 dots

  const pages: (number | '...')[] = [];

  if (totalPages <= totalPageNumbers) {
    pages.push(...range(1, totalPages));
  } else {
    const leftSibling = Math.max(currentPage - siblingCount, 1);
    const rightSibling = Math.min(currentPage + siblingCount, totalPages);
    const showLeftDots = leftSibling > 2;
    const showRightDots = rightSibling < totalPages - 1;

    pages.push(1);
    if (showLeftDots) pages.push('...');
    pages.push(...range(leftSibling, rightSibling));
    if (showRightDots) pages.push('...');
    pages.push(totalPages);
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>

      {pages.map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-3 py-2 text-gray-400">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page as number)}
            aria-current={currentPage === page ? 'page' : undefined}
            className={`min-w-[36px] h-9 px-3 rounded-lg text-sm font-medium transition-colors ${
              currentPage === page
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
};

export default Pagination;
