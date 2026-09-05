import React, { memo, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  siblingCount?: number;
}

const range = (start: number, end: number): number[] => {
  if (end < start) return [];
  return Array.from({ length: end - start + 1 }, (_, index) => index + start);
};

const Pagination: React.FC<PaginationProps> = memo(
  ({
    currentPage,
    totalPages,
    onPageChange,
    siblingCount = 1,
  }) => {
    const safeTotalPages = Math.max(0, Math.floor(totalPages));
    const safeCurrentPage =
      safeTotalPages > 0
        ? Math.min(Math.max(Math.floor(currentPage), 1), safeTotalPages)
        : 1;

    const safeSiblingCount = Math.max(0, Math.floor(siblingCount));

    const pages = useMemo(() => {
      if (safeTotalPages <= 1) return [];

      const totalPageNumbers = safeSiblingCount * 2 + 5;
      const result: (number | '...')[] = [];

      if (safeTotalPages <= totalPageNumbers) {
        result.push(...range(1, safeTotalPages));
        return result;
      }

      const leftSibling = Math.max(
        safeCurrentPage - safeSiblingCount,
        1,
      );
      const rightSibling = Math.min(
        safeCurrentPage + safeSiblingCount,
        safeTotalPages,
      );

      const showLeftDots = leftSibling > 2;
      const showRightDots = rightSibling < safeTotalPages - 1;

      result.push(1);

      if (showLeftDots) result.push('...');

      result.push(...range(leftSibling, rightSibling));

      if (showRightDots) result.push('...');

      result.push(safeTotalPages);

      return result;
    }, [safeCurrentPage, safeSiblingCount, safeTotalPages]);

    if (safeTotalPages <= 1) return null;

    const goToPrevious = () => {
      if (safeCurrentPage > 1) {
        onPageChange(safeCurrentPage - 1);
      }
    };

    const goToNext = () => {
      if (safeCurrentPage < safeTotalPages) {
        onPageChange(safeCurrentPage + 1);
      }
    };

    return (
      <nav
        aria-label="Pagination"
        className="flex items-center justify-center gap-1 mt-8"
      >
        <button
          type="button"
          onClick={goToPrevious}
          disabled={safeCurrentPage === 1}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </button>

        {pages.map((page, index) =>
          page === '...' ? (
            <span
              key={`dots-${index}`}
              className="px-3 py-2 text-gray-400"
              aria-hidden="true"
            >
              …
            </span>
          ) : (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={safeCurrentPage === page ? 'page' : undefined}
              className={`min-w-9 h-9 px-3 rounded-lg text-sm font-medium transition-colors focus:outline-hidden focus:ring-2 focus:ring-brand-500 ${
                safeCurrentPage === page
                  ? 'bg-brand-600 text-white'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={goToNext}
          disabled={safeCurrentPage === safeTotalPages}
          className="p-2 rounded-lg border border-gray-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors focus:outline-hidden focus:ring-2 focus:ring-brand-500"
          aria-label="Next page"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </button>
      </nav>
    );
  },
);

Pagination.displayName = 'Pagination';

export default Pagination;
