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
    <nav aria-label="Phân trang sản phẩm" className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Trang trước"
        className="flex h-9 w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-[#b91c1c] hover:text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>

      {pages.map((page, index) => {
        const previousPage = pages[index - 1];
        const showDots = previousPage && page - previousPage > 1;

        return (
          <div key={page} className="flex items-center">
            {showDots && <span className="mx-1 text-gray-400 select-none">...</span>}

            <button
              type="button"
              onClick={() => onPageChange(page)}
              aria-label={`Trang ${page}`}
              aria-current={currentPage === page ? "page" : undefined}
              className={`h-9 min-w-9 min-h-[36px] rounded-lg px-3 text-sm font-bold cursor-pointer transition-colors ${
                currentPage === page
                  ? "bg-[#b91c1c] text-white shadow-xs"
                  : "border border-gray-200 bg-white text-gray-700 hover:border-[#b91c1c] hover:text-[#b91c1c]"
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
        className="flex h-9 w-9 min-h-[36px] min-w-[36px] items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 hover:border-[#b91c1c] hover:text-[#b91c1c] disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
