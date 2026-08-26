"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/common/ToastContext";
import ProductComparisonBar from "@/components/product-detail/ProductComparisonBar";
import ProductComparisonModal from "@/components/product-detail/ProductComparisonModal";
import { productAPI } from "@/lib/api";

import { detectProductType, getProductTypeLabel } from "@/lib/specParser";

const CompareContext = createContext(null);

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    return {
      compareItems: [],
      addToCompare: () => {},
      removeFromCompare: () => {},
      clearCompare: () => {},
      isComparing: () => false,
      handleCompareNow: () => {},
    };
  }
  return context;
};

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const toast = useToast();

  useEffect(() => {
    try {
      const saved = localStorage.getItem("zcomputer_compare_products");
      if (saved) {
        setCompareItems(JSON.parse(saved));
      }
    } catch (_) {}

    // Tải danh sách toàn bộ sản phẩm thực tế từ Database API phục vụ modal so sánh
    productAPI.getAll({ limit: 500 })
      .then((res) => {
        if (res.data?.data?.products) {
          setAllProducts(res.data.data.products);
        } else if (Array.isArray(res.data?.data)) {
          setAllProducts(res.data.data);
        }
      })
      .catch((err) => {
        console.error("Lỗi khi tải sản phẩm so sánh:", err);
      });
  }, []);

  const saveItems = (items) => {
    setCompareItems(items);
    try {
      localStorage.setItem("zcomputer_compare_products", JSON.stringify(items));
    } catch (_) {}
  };

  const getProductIdentifiers = (val) => {
    if (!val) return [];
    if (typeof val === "string" || typeof val === "number") {
      return [String(val).trim()];
    }
    const ids = [];
    if (val._id) ids.push(String(val._id).trim());
    if (val.id) ids.push(String(val.id).trim());
    if (val.slug) ids.push(String(val.slug).trim());
    return ids;
  };

  const isSameProduct = (item, target) => {
    if (!item || !target) return false;
    const itemIds = getProductIdentifiers(item);
    const targetIds = getProductIdentifiers(target);
    return itemIds.some((id) => targetIds.includes(id));
  };

  const getProductId = (product) => {
    return product?.slug || product?._id || product?.id;
  };

  const addToCompare = useCallback(
    (product) => {
      setCompareItems((prev) => {
        const exists = prev.some((item) => isSameProduct(item, product));

        if (exists) {
          const filtered = prev.filter((item) => !isSameProduct(item, product));
          try {
            localStorage.setItem("zcomputer_compare_products", JSON.stringify(filtered));
          } catch (_) {}
          return filtered;
        }

        // Kiểm tra chỉ so sánh các sản phẩm CÙNG LOẠI
        if (prev.length > 0) {
          const currentType = detectProductType(prev[0]);
          const newType = detectProductType(product);

          if (currentType !== newType) {
            const currentLabel = getProductTypeLabel(currentType);
            toast?.showToast?.(
              `Chỉ có thể so sánh sản phẩm cùng loại (${currentLabel}). Vui lòng xóa danh sách hoặc chọn ${currentLabel}.`,
              "warning"
            );
            return prev;
          }
        }

        if (prev.length >= 3) {
          toast?.showToast?.("Chỉ có thể so sánh tối đa 3 sản phẩm cùng lúc", "warning");
          return prev;
        }

        const updated = [...prev, product];
        try {
          localStorage.setItem("zcomputer_compare_products", JSON.stringify(updated));
        } catch (_) {}
        return updated;
      });
    },
    [toast]
  );

  const removeFromCompare = useCallback(
    (productOrId) => {
      setCompareItems((prev) => {
        const filtered = prev.filter((item) => !isSameProduct(item, productOrId));
        try {
          localStorage.setItem("zcomputer_compare_products", JSON.stringify(filtered));
        } catch (_) {}
        return filtered;
      });
    },
    []
  );

  const clearCompare = useCallback(() => {
    setCompareItems([]);
    try {
      localStorage.setItem("zcomputer_compare_products", JSON.stringify([]));
    } catch (_) {}
  }, []);

  const isComparing = useCallback(
    (productOrId) => {
      return compareItems.some((item) => isSameProduct(item, productOrId));
    },
    [compareItems]
  );

  const handleCompareNow = useCallback(() => {
    if (compareItems.length < 2) {
      toast?.showToast?.("Vui lòng chọn ít nhất 2 sản phẩm để so sánh", "warning");
      return;
    }
    const slugs = compareItems
      .slice(0, 3)
      .map((item) => getProductId(item))
      .filter(Boolean)
      .join(",");
    router.push(`/compare?products=${encodeURIComponent(slugs)}`);
  }, [compareItems, router, toast]);

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isComparing,
        handleCompareNow,
      }}
    >
      {children}

      {/* Tái sử dụng trực tiếp ProductComparisonBar đã có sẵn */}
      <ProductComparisonBar
        products={compareItems}
        onRemove={removeFromCompare}
        onAddProduct={() => setIsModalOpen(true)}
        onClear={clearCompare}
        onCompare={handleCompareNow}
      />

      {/* Tái sử dụng trực tiếp ProductComparisonModal đã có sẵn để chọn thêm máy */}
      <ProductComparisonModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={allProducts}
        currentProduct={compareItems[0] || null}
        selectedProducts={compareItems}
        onAddProduct={(product) => {
          addToCompare(product);
          setIsModalOpen(false);
        }}
      />
    </CompareContext.Provider>
  );
};
