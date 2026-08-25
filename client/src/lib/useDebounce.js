"use client";

import { useState, useEffect } from "react";

/**
 * Hook custom debounce giá trị sau khoảng thời gian delay
 * @param {any} value Giá trị cần debounce (ví dụ: searchTerm)
 * @param {number} delay Thời gian chờ (mặc định 1500ms = 1.5s)
 * @returns {any} Giá trị sau khi đã debounce
 */
export function useDebounce(value, delay = 1500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
