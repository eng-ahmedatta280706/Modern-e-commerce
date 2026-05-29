import React from 'react';
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

function DataTable<T>({
  columns, data, loading, keyExtractor,
  currentPage = 1, totalPages = 1, onPageChange,
  onSort, sortKey, sortDir, emptyMessage = 'No data found.',
}: DataTableProps<T>) {
  const handleSort = (key: string) => {
    if (!onSort) return;
    const dir = sortKey === key && sortDir === 'asc' ? 'desc' : 'asc';
    onSort(key, dir);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              {columns.map(col => (
                <th
                  key={col.key}
                  className={`text-left px-4 py-3 font-semibold text-gray-600 whitespace-nowrap ${col.width ?? ''} ${col.sortable ? 'cursor-pointer hover:text-gray-900 select-none' : ''}`}
                  onClick={() => col.sortable && handleSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.header}
                    {col.sortable && (
                      <span className="flex flex-col">
                        <ChevronUp size={10} className={sortKey === col.key && sortDir === 'asc' ? 'text-blue-600' : 'text-gray-300'} />
                        <ChevronDown size={10} className={sortKey === col.key && sortDir === 'desc' ? 'text-blue-600' : 'text-gray-300'} />
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center">
                  <Loader2 size={28} className="animate-spin mx-auto text-blue-600" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 text-center text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map(row => (
                <tr key={keyExtractor(row)} className="hover:bg-gray-50 transition-colors">
                  {columns.map(col => (
                    <td key={col.key} className="px-4 py-3 text-gray-700">
                      {col.render ? col.render(row) : (row as Record<string, unknown>)[col.key] as React.ReactNode}
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
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      )}
    </div>
  );
}

export default DataTable;
