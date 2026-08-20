import FilterGroup from "./FilterGroup";

const categories = [
  { label: "Laptop Cũ", value: "laptop-cu" },
  { label: "PC Cũ", value: "pc-cu" },
  { label: "Màn Hình", value: "man-hinh" },
  { label: "Mainboard - Bo mạch chủ", value: "mainboard-bo-mach-chu" },
  { label: "PSU - Nguồn máy tính", value: "psu-nguon-may-tinh" },
  { label: "CPU - Bộ vi xử lý", value: "cpu-bo-vi-xu-ly" },
  { label: "VGA - Card màn hình", value: "vga-card-man-hinh" },
  { label: "RAM - Bộ nhớ trong", value: "ram-bo-nho-trong" },
  { label: "Ổ cứng HDD - SSD", value: "o-cung-hdd-ssd" },
  { label: "CASE - Vỏ máy tính", value: "case-vo-may-tinh" },
  { label: "Chuột", value: "chuot" },
  { label: "Bàn phím", value: "ban-phim" },
  { label: "Tản nhiệt Cooling", value: "tan-nhiet-cooling" },
];

const brands = [
  "Lenovo",
  "Dell",
  "ASUS",
  "HP",
  "Acer",
  "MSI",
  "Custom",
  "Samsung",
  "LG",
  "Gigabyte",
];

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
