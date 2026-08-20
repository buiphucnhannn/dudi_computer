"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/common/ToastContext";
import ProductComparisonBar from "@/components/product-detail/ProductComparisonBar";
import ProductComparisonModal from "@/components/product-detail/ProductComparisonModal";
import { productAPI } from "@/lib/api";

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

    // Tải danh sách sản phẩm thực tế từ Database API phục vụ modal so sánh
    productAPI.getAll({ limit: 100 })
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

  const getProductId = (product) => {
    return product?.slug || product?._id || product?.id;
  };

  const addToCompare = useCallback(
    (product) => {
      const prodId = getProductId(product);
      const exists = compareItems.some((item) => getProductId(item) === prodId);

      if (exists) {
        const filtered = compareItems.filter((item) => getProductId(item) !== prodId);
        saveItems(filtered);
        toast?.showToast?.("Đã bỏ sản phẩm khỏi danh sách so sánh", "info");
        return;
      }

      if (compareItems.length >= 3) {
        toast?.showToast?.("Chỉ có thể so sánh tối đa 3 sản phẩm cùng lúc", "warning");
        return;
      }

      const updated = [...compareItems, product];
      saveItems(updated);
      toast?.showToast?.("Đã thêm vào danh sách so sánh", "success");
    },
    [compareItems, toast]
  );

  const removeFromCompare = useCallback(
    (productId) => {
      const filtered = compareItems.filter((item) => getProductId(item) !== productId);
      saveItems(filtered);
    },
    [compareItems]
  );

  const clearCompare = useCallback(() => {
    saveItems([]);
  }, []);

  const isComparing = useCallback(
    (productId) => {
      return compareItems.some((item) => getProductId(item) === productId);
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
