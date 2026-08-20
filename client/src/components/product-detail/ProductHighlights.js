"use client";

import { ChevronDown, ListChecks } from "lucide-react";
import { parseProductSpecs } from "@/lib/specParser";

const buildHighlights = (product) => {
  const specs = parseProductSpecs(product);

  return [
    {
      label: "CPU",
      value: specs.cpu,
    },
    {
      label: "RAM",
      value: specs.ram,
    },
    {
      label: "Ổ CỨNG",
      value: specs.ssd,
    },
    {
      label: "VGA",
      value: specs.vga,
    },
    {
      label: "MAINBOARD",
      value: specs.mainboard,
    },
    {
      label: "NGUỒN",
      value: specs.psu,
    },
    {
      label: "TẢN NHIỆT",
      value: specs.cooler,
    },
    {
      label: "VỎ CASE",
      value: specs.caseBox,
    },
  ];
};

const ProductHighlights = ({ product }) => {
  const highlights = buildHighlights(product);

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
      {/* HEADER */}
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center">
          <ListChecks className="w-4 h-4 text-red-600" />
        </div>

        <h3 className="text-sm font-bold text-slate-900 uppercase">
          Cấu hình nổi bật
        </h3>
      </div>

      {/* SPECS */}
      <div className="grid grid-cols-1 gap-2">
        {highlights.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className="
              grid
              grid-cols-[90px_1fr]
              gap-2
              px-2.5
              py-2
              rounded-lg
              bg-white
              border border-slate-100
            "
          >
            <div className="text-[9px] font-semibold text-slate-500 uppercase">
              {item.label}
            </div>

            <div className="text-xs font-medium text-slate-900 leading-relaxed">
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
          text-red-600
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