import React from 'react';

interface PaginationProps {
  pagination: {
    current_page: number;
    last_page: number;
    from: number;
    to: number;
    total: number;
  };
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { current_page, last_page, from, to, total } = pagination;

  const getPageNumbers = () => {
    const pages = [];
    const maxPages = 5;
    let startPage = Math.max(1, current_page - Math.floor(maxPages / 2));
    const endPage = Math.min(last_page, startPage + maxPages - 1);

    if (endPage - startPage < maxPages - 1) {
      startPage = Math.max(1, endPage - maxPages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
      <div className="flex justify-between flex-1 sm:hidden">
        <button
          onClick={() => onPageChange(Math.max(1, current_page - 1))}
          disabled={current_page === 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Anterior
        </button>
        <button
          onClick={() => onPageChange(Math.min(last_page, current_page + 1))}
          disabled={current_page === last_page}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Siguiente
        </button>
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{from}</span> a{' '}
            <span className="font-medium">{to}</span> de{' '}
            <span className="font-medium">{total}</span> resultados
          </p>
        </div>
        <div className="flex space-x-1">
          {current_page > 1 && (
            <button
              onClick={() => onPageChange(current_page - 1)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Anterior
            </button>
          )}
          {getPageNumbers().map(page => (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                page === current_page
                  ? "bg-red-800/80 text-white"
                  : "text-gray-700 bg-white border border-gray-300 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          ))}
          {current_page < last_page && (
            <button
              onClick={() => onPageChange(current_page + 1)}
              className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
