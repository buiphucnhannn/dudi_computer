"use client";

import { Check, RotateCcw, SlidersHorizontal } from "lucide-react";

const categories = [
  {
    name: "Laptop",
    count: 128,
  },
  {
    name: "PC Gaming",
    count: 64,
  },
  {
    name: "Linh kiện PC",
    count: 450,
  },
  {
    name: "Màn hình",
    count: 86,
  },
];

const brands = ["ASUS", "MSI", "GIGABYTE", "DELL", "HP"];

export default function ProductFilters({ filters, setFilters, onClear }) {
  const toggleBrand = (brand) => {
    setFilters((prev) => ({
      ...prev,
      brand: prev.brand === brand ? "" : brand,
    }));
  };

  return (
    <aside className="w-full shrink-0 lg:w-[280px]">
      <div className="sticky top-[88px] flex flex-col gap-6 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-150 pb-3.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-700" />
            <span className="text-sm font-bold uppercase tracking-wider text-slate-900">
              Bộ lọc
            </span>
          </div>

          <button
            onClick={onClear}
            className="flex items-center gap-1 text-xs font-semibold text-red-600 hover:text-red-700 cursor-pointer hover:underline"
          >
            <RotateCcw className="h-3 w-3" />
            <span>Xóa bộ lọc</span>
          </button>
        </div>

        {/* Status */}
        <div>
          <h3 className="mb-3 text-[11px] font-black uppercase tracking-wider text-slate-500">
            Trạng thái
          </h3>

          <div className="flex flex-col gap-2">
            <FilterCheckbox
              checked={filters.status === "active"}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: prev.status === "active" ? "" : "active",
                }))
              }
              label="Đang kinh doanh"
              count="342"
            />

            <FilterCheckbox
              checked={filters.status === "inactive"}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: prev.status === "inactive" ? "" : "inactive",
                }))
              }
              label="Ngừng kinh doanh"
              count="12"
            />

            <FilterCheckbox
              checked={filters.status === "out-of-stock"}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  status: prev.status === "out-of-stock" ? "" : "out-of-stock",
                }))
              }
              label="Hết hàng"
              count="5"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <h3 className="mb-3 text-[11px] font-black uppercase tracking-wider text-slate-500">
            Danh mục
          </h3>

          <div className="flex flex-col gap-1">
            {categories.map((category) => (
              <button
                key={category.name}
                onClick={() =>
                  setFilters((prev) => ({
                    ...prev,
                    category:
                      prev.category === category.name ? "" : category.name,
                  }))
                }
                className={`flex items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-semibold transition-all cursor-pointer ${
                  filters.category === category.name
                    ? "bg-slate-900 text-white shadow-xs"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                <span>{category.name}</span>
                <span
                  className={`text-[10.5px] ${
                    filters.category === category.name
                      ? "text-slate-300"
                      : "text-slate-400"
                  }`}
                >
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Brand */}
        <div>
          <h3 className="mb-3 text-[11px] font-black uppercase tracking-wider text-slate-500">
            Thương hiệu
          </h3>

          <div className="flex flex-wrap gap-1.5">
            {brands.map((brand) => {
              const active = filters.brand === brand;

              return (
                <button
                  key={brand}
                  onClick={() => toggleBrand(brand)}
                  className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    active
                      ? "bg-red-600 text-white shadow-xs"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {brand}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}

function FilterCheckbox({ checked, onClick, label, count }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center gap-2.5 text-left cursor-pointer"
    >
      <div
        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-colors ${
          checked
            ? "border-slate-900 bg-slate-900 text-white"
            : "border-slate-300 bg-white group-hover:border-slate-400"
        }`}
      >
        {checked && <Check className="h-3 w-3 stroke-[3]" />}
      </div>

      <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900">
        {label} <span className="text-slate-400">({count})</span>
      </span>
    </button>
  );
}