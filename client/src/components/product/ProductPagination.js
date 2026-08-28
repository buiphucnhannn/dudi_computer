import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProductPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  if (totalPages <= 1) {
    return null;
  }

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
      pages.push(i);
    }
  }

  return (
    <nav
      aria-label="Phân trang sản phẩm"
      className="mt-8 flex items-center justify-center gap-1.5 sm:gap-2 flex-wrap"
    >
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Trang trước"
        className="flex h-10 min-w-10 sm:h-9 sm:min-w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-[#dc2626] hover:text-[#dc2626] disabled:cursor-not-allowed disabled:opacity-40 transition-colors cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, index) => {
        const previousPage = pages[index - 1];
        const showDots = previousPage && page - previousPage > 1;

        return (
          <div key={page} className="flex items-center">
            {showDots && (
              <span className="mx-1 text-gray-400 select-none">...</span>
            )}

            <button
              type="button"
              onClick={() => onPageChange(page)}
              aria-label={`Trang ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={`h-10 min-w-10 sm:h-9 sm:min-w-9 rounded-lg px-2.5 sm:px-3 text-sm font-bold transition-all cursor-pointer ${
                currentPage === page
                  ? "bg-[#dc2626] text-white shadow-sm border border-[#dc2626]"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-[#dc2626] hover:text-[#dc2626]"
              }`}
            >
              {page}
            </button>
          </div>
        );
      })}

      <button
        type="button"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Trang sau"
        className="flex h-10 min-w-10 sm:h-9 sm:min-w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-[#dc2626] hover:text-[#dc2626] disabled:cursor-not-allowed disabled:opacity-40 transition-colors cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
