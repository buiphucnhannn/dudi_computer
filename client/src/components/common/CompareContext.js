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

  const isSameProduct = (item, target) => {
    if (!item || !target) return false;
    if (typeof target === "object") {
      const targetSlug = target.slug;
      const targetId = target._id || target.id;
      const itemSlug = item.slug;
      const itemId = item._id || item.id;
      return Boolean(
        (targetSlug && itemSlug && targetSlug === itemSlug) ||
        (targetId && itemId && String(targetId) === String(itemId)) ||
        (targetSlug && itemId && targetSlug === String(itemId)) ||
        (targetId && itemSlug && String(targetId) === itemSlug)
      );
    }
    const targetStr = String(target);
    return Boolean(
      (item.slug && item.slug === targetStr) ||
      (item._id && String(item._id) === targetStr) ||
      (item.id && String(item.id) === targetStr)
    );
  };

  const getProductId = (product) => {
    return product?.slug || product?._id || product?.id;
  };

  const addToCompare = useCallback(
    (product) => {
      const exists = compareItems.some((item) => isSameProduct(item, product));

      if (exists) {
        const filtered = compareItems.filter((item) => !isSameProduct(item, product));
        saveItems(filtered);
        return;
      }

      // Kiểm tra chỉ so sánh các sản phẩm CÙNG LOẠI
      if (compareItems.length > 0) {
        const currentType = detectProductType(compareItems[0]);
        const newType = detectProductType(product);

        if (currentType !== newType) {
          const currentLabel = getProductTypeLabel(currentType);
          const newLabel = getProductTypeLabel(newType);
          toast?.showToast?.(
            `Chỉ có thể so sánh sản phẩm cùng loại (${currentLabel}). Vui lòng xóa danh sách hoặc chọn ${currentLabel}.`,
            "warning"
          );
          return;
        }
      }

      if (compareItems.length >= 3) {
        toast?.showToast?.("Chỉ có thể so sánh tối đa 3 sản phẩm cùng lúc", "warning");
        return;
      }

      const updated = [...compareItems, product];
      saveItems(updated);
    },
    [compareItems, toast]
  );

  const removeFromCompare = useCallback(
    (productOrId) => {
      const filtered = compareItems.filter((item) => !isSameProduct(item, productOrId));
      saveItems(filtered);
    },
    [compareItems]
  );

  const clearCompare = useCallback(() => {
    saveItems([]);
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
