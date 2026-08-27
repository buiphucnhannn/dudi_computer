"use client";

import { createContext, useContext, useState, useCallback, useRef } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

/**
 * Chuyển đổi thông điệp kỹ thuật hoặc thông báo chung chung thành câu chữ thân thiện, rõ ràng, dễ hiểu
 * Loại bỏ hoàn toàn thuật ngữ chuyên môn phức tạp để mang lại trải nghiệm người dùng tốt nhất
 */
function humanizeMessage(rawMsg, type = "info") {
  if (!rawMsg) {
    if (type === "error") return "Hệ thống chưa thể xử lý yêu cầu lúc này. Vui lòng kiểm tra lại và thử lại.";
    if (type === "success") return "Thao tác hoàn tất thành công!";
    return "Thông báo từ hệ thống.";
  }

  const str = String(rawMsg).trim();

  // 1. Lỗi mạng, kết nối & máy chủ
  if (/network\s*error|err_network|failed\s*to\s*fetch/i.test(str)) {
    return "Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng Internet của bạn.";
  }
  if (/timeout|econnaborted/i.test(str)) {
    return "Hệ thống phản hồi chậm do đường truyền mạng. Vui lòng tải lại hoặc thử lại sau giây lát.";
  }
  if (/status\s*code\s*401|unauthorized|jwt\s*expired|token\s*expired/i.test(str)) {
    return "Phiên làm việc của bạn đã hết hạn. Vui lòng đăng nhập lại để tiếp tục.";
  }
  if (/status\s*code\s*403|forbidden|banned/i.test(str)) {
    return "Tài khoản của bạn tạm thời không có quyền thực hiện thao tác này hoặc đã bị khóa.";
  }
  if (/status\s*code\s*404|not\s*found/i.test(str)) {
    return "Không tìm thấy dữ liệu yêu cầu hoặc nội dung này đã được gỡ bỏ.";
  }
  if (/status\s*code\s*500|status\s*code\s*502|status\s*code\s*503|internal\s*server\s*error/i.test(str)) {
    return "Máy chủ đang bảo trì hoặc gặp trục trặc tạm thời. Đội ngũ kỹ thuật đang khắc phục, bạn vui lòng thử lại sau ít phút.";
  }
  if (/cannot\s*read\s*properties|is\s*not\s*defined|syntaxerror/i.test(str)) {
    return "Giao diện gặp sự cố hiển thị tạm thời. Bạn hãy thử nhấn F5 để tải lại trang nhé.";
  }

  // 2. Lỗi Tài khoản, Đăng nhập & Đăng ký
  if (/invalid\s*credentials|sai\s*mật\s*khẩu|tài\s*khoản\s*hoặc\s*mật\s*khẩu\s*không\s*chính\s*xác/i.test(str)) {
    return "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra kỹ lại thông tin đăng nhập.";
  }
  if (/user\s*already\s*exists|email\s*already|duplicate\s*key|e11000/i.test(str)) {
    return "Email hoặc số điện thoại này đã được đăng ký tài khoản trước đó. Vui lòng sử dụng thông tin khác hoặc đăng nhập.";
  }
  if (/otp.*invalid|mã\s*otp\s*không\s*đúng|otp\s*expired|otp.*hết\s*hạn|mã\s*otp.*hết\s*hạn/i.test(str)) {
    return "Mã xác thực OTP không chính xác hoặc đã hết thời gian hiệu lực. Vui lòng bấm gửi lại mã mới.";
  }
  if (/password.*mismatch|mật\s*khẩu\s*không\s*khớp/i.test(str)) {
    return "Mật khẩu xác nhận nhập lại không khớp với mật khẩu mới. Vui lòng kiểm tra lại.";
  }
  if (/weak\s*password|mật\s*khẩu\s*quá\s*ngắn/i.test(str)) {
    return "Mật khẩu quá ngắn. Vui lòng nhập tối thiểu 6 ký tự để đảm bảo an toàn cho tài khoản.";
  }

  // 3. Lỗi Đơn hàng, Giỏ hàng & Thanh toán
  if (/out\s*of\s*stock|hết\s*hàng|không\s*đủ\s*số\s*lượng/i.test(str)) {
    return "Sản phẩm hiện đang tạm hết hàng hoặc số lượng trong kho không đủ để đặt thêm.";
  }
  if (/empty\s*cart|giỏ\s*hàng\s*trống/i.test(str)) {
    return "Giỏ hàng của bạn đang trống. Vui lòng chọn sản phẩm yêu thích trước khi thanh toán.";
  }
  if (/invalid\s*voucher|mã\s*giảm\s*giá.*không\s*hợp\s*lệ/i.test(str)) {
    return "Mã giảm giá không hợp lệ hoặc đã hết lượt áp dụng. Vui lòng kiểm tra lại.";
  }

  // 4. Lỗi Quản trị Danh mục, Nhãn hàng, Khuyến mãi & Tệp tin
  if (/danh\s*mục\s*con/i.test(str)) {
    return "Không thể xóa danh mục cha vì vẫn còn danh mục con trực thuộc. Vui lòng xóa hoặc chuyển các danh mục con trước.";
  }
  if (/còn\s*sản\s*phẩm/i.test(str)) {
    return "Không thể xóa vì vẫn còn sản phẩm đang thuộc danh mục hoặc nhãn hàng này. Vui lòng gỡ hoặc chuyển sản phẩm sang mục khác trước.";
  }
  if (/thời\s*gian\s*kết\s*thúc.*trước.*bắt\s*đầu|thời\s*gian.*không\s*hợp\s*lệ/i.test(str)) {
    return "Thời gian khuyến mãi chưa hợp lý. Ngày kết thúc phải diễn ra sau ngày bắt đầu.";
  }
  if (/file\s*too\s*large|kích\s*thước.*quá\s*lớn|limit_file_size/i.test(str)) {
    return "Dung lượng ảnh tải lên quá lớn. Vui lòng chọn tệp ảnh dưới 5MB.";
  }
  if (/invalid\s*file\s*type|định\s*dạng.*không\s*hỗ\s*trợ/i.test(str)) {
    return "Định dạng tệp không được hỗ trợ. Vui lòng chỉ tải lên hình ảnh có đuôi JPG, PNG, WEBP hoặc JPEG.";
  }

  // 5. Chuẩn hóa các câu lỗi chung chung
  if (str === "Lỗi" || str === "Lỗi xử lý" || str === "Thao tác thất bại" || str === "Có lỗi xảy ra" || str === "Đã có lỗi xảy ra") {
    return "Thao tác chưa thể hoàn tất lúc này. Vui lòng kiểm tra lại thông tin và thử lại.";
  }

  return str;
}

export function ToastProvider({ children }) {
  // STRICT SINGLE TOAST: Chỉ duy nhất 1 Toast tồn tại tại 1 thời điểm trên toàn màn hình
  const [toast, setToast] = useState(null);
  const timerRef = useRef(null);
  const lastToastRef = useRef({ message: "", time: 0 });

  const showToast = useCallback((options = {}, typeParam) => {
    let toastObj = {};

    if (typeof options === "string") {
      const type = typeParam || "success";
      const formattedMsg = humanizeMessage(options, type);
      const defaultTitle =
        type === "error"
          ? "Đã xảy ra lỗi"
          : type === "warning"
          ? "Cảnh báo cần lưu ý"
          : type === "info"
          ? "Thông tin hệ thống"
          : "Thao tác thành công";

      toastObj = {
        title: defaultTitle,
        message: formattedMsg,
        type: type,
        duration: type === "error" ? 5000 : 3500,
      };
    } else {
      const type = options.type || "success";
      const formattedMsg = humanizeMessage(options.message, type);
      let title = options.title;

      if (!title) {
        title =
          type === "error"
            ? "Đã xảy ra lỗi"
            : type === "warning"
            ? "Cảnh báo cần lưu ý"
            : type === "info"
            ? "Thông tin hệ thống"
            : "Thao tác thành công";
      }

      toastObj = {
        title: title,
        message: formattedMsg,
        type: type,
        duration: options.duration ?? (type === "error" ? 5000 : 3500),
      };
    }

    // CHỐNG DUPLICATE & TRÙNG LẶP: Nếu cùng 1 thông báo bắn liên tiếp trong 1.5s thì bỏ qua
    const now = Date.now();
    if (
      lastToastRef.current.message === toastObj.message &&
      now - lastToastRef.current.time < 1500
    ) {
      return;
    }
    lastToastRef.current = { message: toastObj.message, time: now };

    // Clear timer cũ nếu có
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    const id = Date.now() + Math.random().toString(36).substr(2, 5);
    const newToast = { id, ...toastObj };

    // Thay thế toast cũ ngay lập tức (Singleton Mode)
    setToast(newToast);

    if (newToast.duration > 0) {
      timerRef.current = setTimeout(() => {
        setToast(null);
        timerRef.current = null;
      }, newToast.duration);
    }
  }, []);

  const closeToast = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, closeToast }}>
      {children}

      {/* Floating Single Toast Container (Luôn chỉ 1 Toast ở góc trên bên phải, z-[99999]) */}
      {toast && (
        <div className="fixed top-5 right-4 sm:right-6 z-[99999] max-w-sm w-[calc(100vw-32px)] sm:w-96 pointer-events-none">
          <div
            key={toast.id}
            className={`pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border p-4 sm:p-4.5 flex items-start gap-3.5 animate-in slide-in-from-top-4 fade-in duration-200 transition-all ${
              toast.type === "success"
                ? "border-emerald-200/80 shadow-emerald-500/10"
                : toast.type === "error"
                ? "border-red-200/80 shadow-red-500/10"
                : toast.type === "warning"
                ? "border-amber-200/80 shadow-amber-500/10"
                : "border-purple-200/80 shadow-purple-500/10"
            }`}
          >
            {/* Icon Badge */}
            <div
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0 shadow-inner ${
                toast.type === "success"
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                  : toast.type === "error"
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : toast.type === "warning"
                  ? "bg-amber-50 text-amber-600 border border-amber-100"
                  : "bg-purple-50 text-[#8b5cf6] border border-purple-100"
              }`}
            >
              {toast.type === "success" && <CheckCircle2 className="w-5 h-5" />}
              {toast.type === "error" && <AlertCircle className="w-5 h-5" />}
              {toast.type === "warning" && <AlertTriangle className="w-5 h-5" />}
              {toast.type !== "success" &&
                toast.type !== "error" &&
                toast.type !== "warning" && <Info className="w-5 h-5" />}
            </div>

            {/* Text Body */}
            <div className="flex-1 min-w-0 pt-0.5">
              <h4 className="text-xs sm:text-sm font-bold text-gray-900 leading-tight">
                {toast.title}
              </h4>
              {toast.message && (
                <p className="text-xs sm:text-[13px] text-gray-600 mt-1 leading-relaxed text-justify [text-justify:inter-word] break-words">
                  {toast.message}
                </p>
              )}
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={closeToast}
              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors shrink-0 cursor-pointer mt-0.5"
              aria-label="Đóng thông báo"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </ToastContext.Provider>
  );
}
