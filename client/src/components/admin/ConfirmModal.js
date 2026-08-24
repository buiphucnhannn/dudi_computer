"use client";

import { useEffect } from "react";
import { AlertTriangle, Trash2, Ban, Unlock, CheckCircle2, X } from "lucide-react";

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Xác nhận hành động",
  message = "Bạn có chắc chắn muốn thực hiện hành động này?",
  confirmText = "Xác nhận",
  cancelText = "Hủy bỏ",
  type = "danger", // 'danger' | 'warning' | 'info' | 'success'
  loading = false,
}) {
  // Lắng nghe phím ESC để đóng modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen && !loading) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "danger":
        return <Trash2 className="w-6 h-6 text-red-600" />;
      case "warning":
        return <Ban className="w-6 h-6 text-amber-600" />;
      case "success":
        return <Unlock className="w-6 h-6 text-emerald-600" />;
      default:
        return <AlertTriangle className="w-6 h-6 text-blue-600" />;
    }
  };

  const getBgIcon = () => {
    switch (type) {
      case "danger":
        return "bg-red-50 border-red-100";
      case "warning":
        return "bg-amber-50 border-amber-100";
      case "success":
        return "bg-emerald-50 border-emerald-100";
      default:
        return "bg-blue-50 border-blue-100";
    }
  };

  const getConfirmBtnStyle = () => {
    switch (type) {
      case "danger":
        return "bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25";
      case "warning":
        return "bg-amber-600 hover:bg-amber-700 text-white shadow-lg shadow-amber-600/25";
      case "success":
        return "bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/25";
      default:
        return "bg-slate-900 hover:bg-slate-800 text-white shadow-lg shadow-slate-900/25";
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop Layer riêng biệt - Bấm bất kỳ đâu ra ngoài để đóng ngay */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
        onClick={() => {
          if (!loading) onClose();
        }}
        aria-hidden="true"
      />

      {/* Modal Card Content */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150 p-6"
      >
        {/* Close button X */}
        <button
          onClick={onClose}
          disabled={loading}
          className="absolute top-4 right-4 p-1.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition cursor-pointer disabled:opacity-50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-2xl border ${getBgIcon()} shrink-0 mt-0.5`}>
            {getIcon()}
          </div>
          <div className="space-y-1.5 min-w-0 flex-1">
            <h3 className="text-base font-black text-slate-900 leading-snug">
              {title}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed break-words">
              {message}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition cursor-pointer disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer disabled:opacity-50 flex items-center gap-1.5 ${getConfirmBtnStyle()}`}
          >
            {loading && (
              <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>{loading ? "Đang xử lý..." : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
