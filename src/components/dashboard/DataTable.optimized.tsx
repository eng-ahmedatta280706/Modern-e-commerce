import React, { memo, useMemo } from 'react';
import { ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import Pagination from '../ui/Pagination';

export interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  loading?: boolean;
  keyExtractor: (row: T) => string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onSort?: (key: string, dir: 'asc' | 'desc') => void;
  sortKey?: string;
  sortDir?: 'asc' | 'desc';
  emptyMessage?: string;
}

const SkeletonRow = memo<{ columnCount: number }>(({ columnCount }) => (
  <tr aria-hidden="true">
    {Array.from({ length: columnCount }).map((_, index) => (
      <td key={index} className="px-4 py-3">
        <div className="h-4 bg-gray-100 rounded animate-pulse w-full max-w-[140px]" />
      </td>
    ))}
  </tr>
));

SkeletonRow.displayName = 'DataTableSkeletonRow';

function DataTable<T>({
  columns,
  data,
  loading = false,
  keyExtractor,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onSort,
  sortKey,
  sortDir,
  emptyMessage = 'No data found.',
}: DataTableProps<T>) {
  const skeletonRows = useMemo(
    () => Array.from({ length: 5 }, (_, index) => index),
    [],
  );

  const handleSort = (key: string) => {
    if (!onSort) return;

    const direction =
      sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';

    onSort(key, direction);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Data table</caption>

          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map((column) => {
                const isSorted = sortKey === column.key;

                return (
                  <th
                    key={column.key}
                    scope="col"
                    className={`text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap ${
                      column.width ?? ''
                    } ${
                      column.sortable
                        ? 'cursor-pointer hover:text-gray-900 select-none'
                        : ''
                    }`}
                    aria-sort={
                      column.sortable && isSorted
                        ? sortDir === 'asc'
                          ? 'ascending'
                          : 'descending'
                        : column.sortable
                          ? 'none'
                          : undefined
                    }
                  >
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => handleSort(column.key)}
                        className="flex items-center gap-1 w-full text-left focus:outline-hidden focus:ring-2 focus:ring-brand-500 rounded-sm"
                      >
                        <span>{column.header}</span>
                        <span className="flex flex-col" aria-hidden="true">
                          <ChevronUp
                            size={10}
                            className={
                              isSorted && sortDir === 'asc'
                                ? 'text-brand-600'
                                : 'text-gray-300'
                            }
                          />
                          <ChevronDown
                            size={10}
                            className={
                              isSorted && sortDir === 'desc'
                                ? 'text-brand-600'
                                : 'text-gray-300'
                            }
                          />
                        </span>
                      </button>
                    ) : (
                      column.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50">
            {loading ? (
              skeletonRows.map((row) => (
                <SkeletonRow
                  key={row}
                  columnCount={columns.length}
                />
              ))
            ) : data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-16 text-center text-gray-400"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={keyExtractor(row)}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((column) => (
                    <td
                      key={column.key}
                      className="px-4 py-3 text-gray-700"
                    >
                      {column.render
                        ? column.render(row)
                        : (row as Record<string, unknown>)[
                            column.key
                          ] as React.ReactNode}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && onPageChange && (
        <div className="border-t border-gray-100 px-4 py-3">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}

export default DataTable;
