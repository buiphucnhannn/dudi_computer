"use client";

import { useMemo, useState } from "react";
import ProductPageHeader from "@/components/admin/products/ProductPageHeader";
import ProductFilters from "@/components/admin/products/ProductFilters";
import ProductToolbar from "@/components/admin/products/ProductToolbar";
import ProductGrid from "@/components/admin/products/ProductGrid";
import ProductPagination from "@/components/admin/products/ProductPagination";

const initialProducts = [
  {
    id: 1,
    sku: "PCGAMING-001",
    name: "PC Gaming Z-Nova Core i5 13400F / 16GB / RTX 4060",
    price: 18590000,
    oldPrice: 21900000,
    stock: 12,
    rating: 4.8,
    badge: "-15%",
    category: "PC Gaming",
    brand: "MSI",
    status: "active",
    image:
      "https://lh3.googleusercontent.com/aida/AEtjO1WsPsl067-mmxL98xc03534G_8tceXqGoGPosm3o9JA8QBeWLIGULJcMaV1YSryDIdffMduDnRk5VmKUTRmrOY1Qz_fMyvRQm0OAwKPnBr86l_Xcgp4Z2odJsSmZ8jQA8zp_AB5RxCsYsbe53BTvozoFCHdNtLcWpA1RVoFVb09wA4vBzuBDnsaTL7WNGEeLM1lp07BJvVa1v8w_nWME06uxEwhV4SuKuRXTlHKgwiSPtE7dp029f5JOPM",
  },
  {
    id: 2,
    sku: "LAPMSI-892",
    name: "Laptop MSI Titan GT77 HX 13VI (Core i9 13980HX/64GB/RTX 4090)",
    price: 119990000,
    oldPrice: null,
    stock: 2,
    rating: null,
    badge: "MỚI",
    category: "Laptop",
    brand: "MSI",
    status: "active",
    image:
      "https://lh3.googleusercontent.com/aida/AEtjO1W-J4qpIbjdlAAZ0eQFi3kgXwuszfPSpA2E4DAoWHS3FRGMc7owNYVwzLc1dJ7SjB1wWy-QibrHtF0bdOlZFSlFd4ows2p6tfv7eL739D1yXX2JnuLnDwNLL31BA1Sio08WJM8t0nXcrvEBivt7vw1WBjecq-2Lyd1ptx59yObLFKqLeU8tQKe5Ge9buDhP8CQh__MKYuFYNA0hGn8-YlDtV5MFsZdaiqvmWDhjlcPhQs5PS6LkG3Nmn0M",
  },
  {
    id: 3,
    sku: "KB-RZR-009",
    name: "Bàn phím cơ Razer BlackWidow V4 Pro - Green Switch",
    price: 5890000,
    oldPrice: null,
    stock: 0,
    rating: null,
    badge: "HẾT HÀNG",
    category: "Linh kiện PC",
    brand: "Razer",
    status: "out-of-stock",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCXom4IrvBrKXRdlDfMNKP68bjms-X9WhdVSQ40B8Fq0ir23d0eVTMlIY6eP5eIg2hj5teIL-lZ6K6BZgOrq7QwPZSKsTDFRYqUXI3X-5ST9XFjIE78Ej7gW5JRx3df6zXsmWYniDMfTEYySS8ddz_TcRLuv_MDI_uy9fNlZwmq88d-lJnLqE8U5tjcD5BCyAuS98kfAIVfX3uS84iYtcBjhCa5yvKEDIpKwkP4Pj7_DdwX7_G0GhQM",
  },
  {
    id: 4,
    sku: "VGA-ASU-480",
    name: "Card màn hình ASUS ROG Strix GeForce RTX 4080 16GB GDDR6X",
    price: 38990000,
    oldPrice: null,
    stock: 8,
    rating: null,
    badge: null,
    category: "Linh kiện PC",
    brand: "ASUS",
    status: "active",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCkNbFh_4TjYSAcu92UKRN4bdlQH7uufAOT2k3BPWlK07mMAdXqus6Bn-zuNOu_tJInSXpzHVV7IeKiCWuPTCiTTKLEktZ-hzPi1BJB53Y3TXyCpecwZ3X2PJHql3lWJX62j2Ryn2FNdZsNB5A15VpSRh38HPjdmTZQyeabsWaHrl5KGwpqklIrk5T1xRqxzc95AWoDfVYmxh-V8N_51v3HtxQXrEhx0gedXlXrcBXJbcNp88w2BmCM",
  },
];

export default function AdminProductsPage() {
  const [products, setProducts] = useState(initialProducts);

  const [filters, setFilters] = useState({
    status: "",
    category: "",
    brand: "",
  });

  const [sort, setSort] = useState("price-desc");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 12;

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (filters.status) {
      result = result.filter((product) => product.status === filters.status);
    }

    if (filters.category) {
      result = result.filter(
        (product) => product.category === filters.category
      );
    }

    if (filters.brand) {
      result = result.filter((product) => product.brand === filters.brand);
    }

    result.sort((a, b) => {
      switch (sort) {
        case "price-asc":
          return a.price - b.price;
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "newest":
          return b.id - a.id;
        case "price-desc":
        default:
          return b.price - a.price;
      }
    });

    return result;
  }, [products, filters, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / pageSize));

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleClearFilters = () => {
    setFilters({
      status: "",
      category: "",
      brand: "",
    });
    setCurrentPage(1);
  };

  const handleDelete = (product) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa sản phẩm "${product.name}"?`
    );
    if (!confirmed) return;

    setProducts((prev) => prev.filter((item) => item.id !== product.id));
  };

  const handleEdit = (product) => {
    alert(`Chức năng chỉnh sửa thông tin sản phẩm: ${product.name}`);
  };

  const handleAddProduct = () => {
    alert("Mở giao diện thêm sản phẩm mới!");
  };

  const handleExport = () => {
    alert("Đang xuất dữ liệu danh sách sản phẩm thành file Excel/CSV...");
  };

  return (
    <div className="flex w-full flex-col px-6 py-8">
      {/* Header */}
      <ProductPageHeader
        onAddProduct={handleAddProduct}
        onExport={handleExport}
      />

      {/* Content */}
      <div className="relative flex flex-col gap-6 lg:flex-row">
        {/* Filters */}
        <ProductFilters
          filters={filters}
          setFilters={setFilters}
          onClear={handleClearFilters}
        />

        {/* Products */}
        <div className="flex min-w-0 flex-1 flex-col">
          <ProductToolbar
            total={filteredProducts.length}
            currentPage={currentPage}
            pageSize={pageSize}
            sort={sort}
            setSort={setSort}
            viewMode={viewMode}
            setViewMode={setViewMode}
          />

          <ProductGrid
            products={paginatedProducts}
            viewMode={viewMode}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          <ProductPagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}