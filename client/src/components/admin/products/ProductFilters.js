import { useMemo, Fragment } from "react";
import { Search, X, SlidersHorizontal, RotateCcw, Tag, Layers } from "lucide-react";

export default function ProductFilters({
  filters,
  setFilters,
  onClear,
  categoryCounts = {},
  categories = [],
  brandList = [],
  statusCounts = {},
  searchQuery = "",
  setSearchQuery,
}) {
  const categoryTree = useMemo(() => {
    if (!Array.isArray(categories) || categories.length === 0) {
      return [];
    }

    const roots = [];
    const childrenMap = new Map();

    categories.forEach((c) => {
      if (!c) return;
      const catObj = typeof c === "string" ? { name: c, slug: c } : c;
      const parentId = catObj.parent?._id?.toString() || catObj.parent?.toString();
      const parentSlug = catObj.parentSlug?.toLowerCase();

      if (!parentId && !parentSlug) {
        roots.push(catObj);
      } else {
        const key = parentId || parentSlug;
        if (!childrenMap.has(key)) {
          childrenMap.set(key, []);
        }
        childrenMap.get(key).push(catObj);
      }
    });

    roots.sort((a, b) => (a.order || 99) - (b.order || 99));

    const tree = [];
    const processedChildren = new Set();

    roots.forEach((root) => {
      const rootId = root._id?.toString() || root.id;
      const rootSlug = (root.slug || "").toLowerCase();

      const directChildren = [
        ...(rootId ? (childrenMap.get(rootId) || []) : []),
        ...(rootSlug ? (childrenMap.get(rootSlug) || []) : []),
        ...(root.name ? (childrenMap.get(root.name.toLowerCase()) || []) : []),
      ];

      const uniqueChildren = [];
      const seenChild = new Set();
      directChildren.forEach((ch) => {
        const chName = ch.name;
        if (chName && !seenChild.has(chName.toLowerCase())) {
          seenChild.add(chName.toLowerCase());
          uniqueChildren.push(ch);
          processedChildren.add(chName.toLowerCase());
        }
      });

      uniqueChildren.sort((a, b) => (a.order || 99) - (b.order || 99));

      tree.push({
        root,
        children: uniqueChildren,
      });
    });

    const orphans = [];
    categories.forEach((c) => {
      const catName = typeof c === "string" ? c : c.name;
      if (
        catName &&
        !processedChildren.has(catName.toLowerCase()) &&
        !roots.some((r) => r.name?.toLowerCase() === catName.toLowerCase())
      ) {
        orphans.push(typeof c === "string" ? { name: catName, slug: catName } : c);
      }
    });

    if (orphans.length > 0) {
      tree.push({
        root: { name: "Danh mục khác", slug: "khac", isOrphanGroup: true },
        children: orphans,
      });
    }

    return tree;
  }, [categories]);

  const fallbackCategories = Object.keys(categoryCounts).map((cat) => ({
    name: cat,
  }));

  const statusOptions = [
    { key: "", label: "Tất cả tình trạng" },
    { key: "active", label: "Đang kinh doanh" },
    { key: "low-stock", label: "Sắp hết hàng (≤ 3)" },
    { key: "out-of-stock", label: "Hết hàng (0)" },
  ];

  const hasActiveFilter = Boolean(
    filters.category || filters.brand || filters.status || searchQuery
  );

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-xs">
      {/* Top Filter Controls: Grid layout to never wrap unexpectedly */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-2.5 items-center">
        {/* Search Input (5 cols on lg) */}
        <div className="lg:col-span-4 xl:col-span-4 relative flex items-center rounded-xl bg-slate-50 px-3 py-2 border border-slate-200 focus-within:border-slate-300 focus-within:bg-white focus-within:ring-2 focus-within:ring-slate-900/10 transition">
          <Search className="h-4 w-4 text-slate-400 shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery?.(e.target.value)}
            placeholder="Tìm tên sản phẩm, SKU, hãng..."
            className="ml-2 w-full bg-transparent text-xs font-medium text-slate-800 placeholder:text-slate-400 outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery?.("")}
              className="text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
              title="Xóa tìm kiếm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Dropdown (3 cols on lg) */}
        <div className="lg:col-span-3 xl:col-span-3 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <Layers className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={filters.category || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, category: e.target.value }))}
            className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer truncate"
          >
            <option value="">Tất cả danh mục</option>
            {categoryTree.length > 0 ? (
              categoryTree.map((group) => {
                const root = group.root;
                const children = group.children || [];
                const isOrphan = Boolean(root.isOrphanGroup);

                return (
                  <Fragment key={root._id || root.slug || root.name}>
                    {!isOrphan && (
                      <option
                        value={root.name}
                        className="font-bold text-slate-900 bg-slate-100 py-1"
                      >
                        {root.name}
                      </option>
                    )}

                    {children.map((child) => (
                      <option
                        key={child._id || child.slug || child.name}
                        value={child.name}
                        className="font-normal text-slate-700 bg-white py-1"
                      >
                        &nbsp;&nbsp;&nbsp;— {child.name}
                      </option>
                    ))}
                  </Fragment>
                );
              })
            ) : (
              fallbackCategories.map((c) => (
                <option key={c.name} value={c.name}>
                  {c.name}
                </option>
              ))
            )}
          </select>
        </div>

        {/* Brand Dropdown (2 cols on lg) */}
        <div className="lg:col-span-2 xl:col-span-2 flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
          <Tag className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={filters.brand || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, brand: e.target.value }))}
            className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer truncate"
          >
            <option value="">Tất cả hãng</option>
            {brandList.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status Dropdown (2 or 3 cols) */}
        <div className={`flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 ${
          hasActiveFilter ? "lg:col-span-2 xl:col-span-2" : "lg:col-span-3 xl:col-span-3"
        }`}>
          <SlidersHorizontal className="h-3.5 w-3.5 text-slate-400 shrink-0" />
          <select
            value={filters.status || ""}
            onChange={(e) => setFilters((prev) => ({ ...prev, status: e.target.value }))}
            className="w-full bg-transparent text-xs font-bold text-slate-800 outline-none cursor-pointer truncate"
          >
            {statusOptions.map((s) => (
              <option key={s.key} value={s.key}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        {/* Clear Filters Button (1 col, only when active) */}
        {hasActiveFilter && (
          <div className="lg:col-span-1 xl:col-span-1 flex justify-end">
            <button
              onClick={onClear}
              className="flex w-full items-center justify-center gap-1 px-2.5 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition cursor-pointer border border-red-200 whitespace-nowrap"
              title="Đặt lại tất cả bộ lọc"
            >
              <RotateCcw className="h-3.5 w-3.5 shrink-0" />
              <span>Xóa</span>
            </button>
          </div>
        )}
      </div>

      {/* Quick Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 border-t border-slate-100 no-scrollbar">
        <button
          onClick={() => setFilters((prev) => ({ ...prev, category: "" }))}
          className={`shrink-0 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
            !filters.category
              ? "bg-[#eb1c24] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200"
          }`}
        >
          Tất cả
        </button>

        {categories.map((c) => {
          const isActive = filters.category === c.name;
          return (
            <button
              key={c.name}
              onClick={() =>
                setFilters((prev) => ({
                  ...prev,
                  category: isActive ? "" : c.name,
                }))
              }
              className={`shrink-0 flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition cursor-pointer ${
                isActive
                  ? "bg-red-600 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <span>{c.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}