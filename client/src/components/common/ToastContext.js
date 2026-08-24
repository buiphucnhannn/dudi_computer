"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(
    (options = {}) => {
      let toastObj = {};
      if (typeof options === "string") {
        toastObj = {
          title: options,
          message: "",
          type: "success",
          duration: 4000,
        };
      } else {
        toastObj = {
          title: options.title || "Thông báo",
          message: options.message || "",
          type: options.type || "success", // success | error | info | warning
          duration: options.duration ?? 4000,
        };
      }

      const id = Date.now() + Math.random().toString(36).substr(2, 9);
      const newToast = { id, ...toastObj };

      setToasts((prev) => [...prev, newToast]);

      if (newToast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((t) => t.id !== id));
        }, newToast.duration);
      }
    },
    []
  );

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Container */}
      <div className="fixed top-5 right-4 sm:right-6 z-[100] flex flex-col gap-3 max-w-sm w-[calc(100vw-32px)] sm:w-96 pointer-events-none">
        {toasts.map((toast) => {
          const isSuccess = toast.type === "success";
          const isError = toast.type === "error";

          return (
            <div
              key={toast.id}
              className={`pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border p-4 sm:p-4.5 flex items-start gap-3.5 animate-in slide-in-from-top-4 fade-in duration-300 transition-all ${
                isSuccess
                  ? "border-emerald-200/80 shadow-emerald-500/10"
                  : isError
                  ? "border-red-200/80 shadow-red-500/10"
                  : "border-purple-200/80 shadow-purple-500/10"
              }`}
            >
              {/* Icon Badge */}
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
                  isSuccess
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : isError
                    ? "bg-red-50 text-red-600 border border-red-100"
                    : "bg-purple-50 text-[#8b5cf6] border border-purple-100"
                }`}
              >
                {isSuccess && <CheckCircle2 className="w-5 h-5" />}
                {isError && <AlertCircle className="w-5 h-5" />}
                {!isSuccess && !isError && <Info className="w-5 h-5" />}
              </div>

              {/* Text Body */}
              <div className="flex-1 min-w-0 pt-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                  {toast.title}
                </h4>
                {toast.message && (
                  <p className="text-xs sm:text-[13px] text-gray-600 mt-1 leading-relaxed">
                    {toast.message}
                  </p>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors shrink-0 cursor-pointer mt-0.5"
                aria-label="Đóng thông báo"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
