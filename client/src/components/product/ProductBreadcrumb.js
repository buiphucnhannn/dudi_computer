import { ChevronRight, Home } from "lucide-react";

export default function ProductBreadcrumb() {
  return (
    <div className="border-b border-gray-100 bg-white">
      <div className="mx-auto flex max-w-[1600px] items-center gap-2 px-4 py-4 text-sm lg:px-8 xl:px-10">
        <a
          href="/"
          className="flex items-center gap-1 text-gray-500 hover:text-[#dc2626]"
        >
          <Home className="h-4 w-4" />
          Trang chủ
        </a>

        <ChevronRight className="h-4 w-4 text-gray-400" />

        <span className="font-semibold text-gray-800">Tất cả sản phẩm</span>
      </div>
    </div>
  );
}
