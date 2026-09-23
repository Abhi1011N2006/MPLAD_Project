import React from 'react';

/**
 * Reusable Pagination Component matching User UI Reference
 * Format: [Previous] [1] [2] [3] [4] [5] [...] [24] [Next]
 */
export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  itemsPerPage,
  className = ''
}) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    // If total pages 7 or less, show all page numbers
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];

    if (currentPage <= 4) {
      // Near beginning: 1, 2, 3, 4, 5, '...', totalPages
      pages.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (currentPage >= totalPages - 3) {
      // Near end: 1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages
      pages.push(
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages
      );
    } else {
      // In middle: 1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages
      pages.push(
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages
      );
    }

    return pages;
  };

  const pages = getPageNumbers();

  const startItem = totalItems ? (currentPage - 1) * itemsPerPage + 1 : null;
  const endItem = totalItems ? Math.min(currentPage * itemsPerPage, totalItems) : null;

  return (
    <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold py-4 ${className}`}>
      {/* Page Info Counter */}
      {totalItems ? (
        <span className="text-slate-400 dark:text-slate-400 font-mono">
          Showing <strong className="text-slate-200">{startItem}–{endItem}</strong> of <strong className="text-slate-200">{totalItems}</strong> entries
        </span>
      ) : (
        <span className="text-slate-400 dark:text-slate-400 font-mono">
          Page <strong className="text-slate-200">{currentPage}</strong> of <strong className="text-slate-200">{totalPages}</strong>
        </span>
      )}

      {/* Pagination Container matching screenshot design */}
      <div className="inline-flex items-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm overflow-hidden select-none">
        {/* Previous Button */}
        <button
          onClick={() => {
            if (currentPage > 1) {
              onPageChange(currentPage - 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          disabled={currentPage === 1}
          className="px-3.5 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border-r border-slate-300 dark:border-slate-700"
          aria-label="Previous Page"
        >
          Previous
        </button>

        {/* Page Number Buttons */}
        {pages.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`dots-${index}`}
                className="px-3 py-2 text-slate-400 dark:text-slate-500 border-r border-slate-300 dark:border-slate-700 cursor-default"
              >
                ...
              </span>
            );
          }

          const isActive = page === currentPage;

          return (
            <button
              key={page}
              onClick={() => {
                onPageChange(page);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`px-3 py-2 transition-colors border-r border-slate-300 dark:border-slate-700 font-bold ${
                isActive
                  ? 'bg-blue-600 dark:bg-blue-600 text-white'
                  : 'text-blue-600 dark:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {page}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          onClick={() => {
            if (currentPage < totalPages) {
              onPageChange(currentPage + 1);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }
          }}
          disabled={currentPage === totalPages}
          className="px-3.5 py-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-blue-600 dark:text-sky-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Next Page"
        >
          Next
        </button>
      </div>
    </div>
  );
}
