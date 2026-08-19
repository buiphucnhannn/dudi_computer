import FilterGroup from "./FilterGroup";

const categories = ["Laptop Cũ", "PC Cũ", "Chuột", "Bàn phím", "Màn Hình"];

const brands = ["Lenovo", "Custom", "ASUS", "SURFACE"];

export default function ProductSidebar({ filters, onFilterChange }) {
  const handleCategoryChange = (category) => {
    onFilterChange({
      ...filters,
      category: filters.category === category ? "" : category,
    });
  };

  const handleBrandChange = (brand) => {
    const exists = filters.brands.includes(brand);

    const newBrands = exists
      ? filters.brands.filter((item) => item !== brand)
      : [...filters.brands, brand];

    onFilterChange({
      ...filters,
      brands: newBrands,
    });
  };

  const handlePromotionChange = (type) => {
    const exists = filters.promotions.includes(type);

    const newPromotions = exists
      ? filters.promotions.filter((item) => item !== type)
      : [...filters.promotions, type];

    onFilterChange({
      ...filters,
      promotions: newPromotions,
    });
  };

  return (
    <aside className="hidden w-60 shrink-0 lg:block">
      <div className="sticky top-24 space-y-4">
        <FilterGroup
          title="Danh mục"
          items={categories}
          selected={filters.category}
          type="single"
          onChange={handleCategoryChange}
        />

        <FilterGroup
          title="Ưu đãi"
          items={[
            {
              label: "Đang giảm giá",
              value: "discount",
            },
            {
              label: "Sản phẩm Hot Sale",
              value: "hot",
            },
          ]}
          selected={filters.promotions}
          type="multiple"
          onChange={handlePromotionChange}
        />

        <FilterGroup
          title="Thương hiệu"
          items={brands}
          selected={filters.brands}
          type="multiple"
          onChange={handleBrandChange}
        />
      </div>
    </aside>
  );
}
