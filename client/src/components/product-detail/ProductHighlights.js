"use client";

import { ChevronDown, ListChecks } from "lucide-react";
import { parseProductSpecs } from "@/lib/specParser";

const ProductHighlights = ({ product }) => {
  if (!product) return null;

  const specsData = parseProductSpecs(product);
  const highlights = specsData.highlights || [];

  if (highlights.length === 0) return null;

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
          <ListChecks className="w-4 h-4 text-[#eb1c24]" />
        </div>

        <h3 className="text-sm font-bold text-slate-900 uppercase">
          Cấu hình nổi bật
        </h3>
      </div>

      {/* SPECS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {highlights.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="
              grid
              grid-cols-[100px_1fr]
              gap-2
              px-3
              py-2
              rounded-lg
              bg-white
              border border-slate-100
              items-center
            "
          >
            <div className="text-[10px] font-bold text-slate-500 uppercase truncate">
              {item.label}
            </div>

            <div className="text-xs font-semibold text-slate-900 leading-snug truncate" title={item.value}>
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* DETAIL */}
      <a
        href="#specifications"
        className="
          mt-3
          flex
          items-center
          justify-center
          gap-1
          w-full
          py-2
          rounded-lg
          bg-red-50
          text-[#eb1c24]
          text-xs
          font-semibold
          hover:bg-red-100
          transition-colors
        "
      >
        Xem chi tiết thông số
        <ChevronDown className="w-3.5 h-3.5" />
      </a>
    </div>
  );
};

export default ProductHighlights;