"use client";

import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/redux/slices/authSlice";
import { useToast } from "@/components/common/ToastContext";
import { apiClient } from "@/lib/api";

export default function SessionWatcher() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const eventSourceRef = useRef(null);

  useEffect(() => {
    // 1. Lắng nghe BroadcastChannel giữa các tab trình duyệt
    let authChannel = null;
    try {
      authChannel = new BroadcastChannel("dudi_auth_channel");
      authChannel.onmessage = (event) => {
        if (event.data?.type === "ACCOUNT_BANNED") {
          handleImmediateKick(event.data?.reason || "Tài khoản của bạn đã bị khóa bởi Quản trị viên.");
        }
      };
    } catch {
      // Fallback nếu trình duyệt cũ không hỗ trợ BroadcastChannel
    }

    const handleImmediateKick = (reason) => {
      // Đóng kết nối SSE hiện tại
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }

      // Xóa Redux State và LocalStorage
      dispatch(logoutUser());
      if (typeof window !== "undefined") {
        localStorage.removeItem("dudi_user");
        localStorage.removeItem("zcomputer_user");
      }

      // Gửi request dọn sạch cookie session
      apiClient.post("/auth/logout").catch(() => {});

      // Điều hướng ngay lập tức về trang đăng nhập kèm cờ banned (Trang login sẽ hiện alert đỏ trang trọng)
      if (typeof window !== "undefined") {
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?banned=true";
        }
      }
    };

    // 2. Nếu người dùng đang đăng nhập, kết nối SSE Session Stream để nhận lệnh Kick Realtime
    if (isAuthenticated && user?._id) {
      try {
        const streamUrl =
          typeof window !== "undefined"
            ? `${process.env.NEXT_PUBLIC_API_URL || "/api/v1"}/auth/session-stream`
            : "/api/v1/auth/session-stream";

        const es = new EventSource(streamUrl, { withCredentials: true });
        eventSourceRef.current = es;

        // Lắng nghe sự kiện KICK do Server bắn xuống khi Admin bấm Khóa
        es.addEventListener("KICK", (e) => {
          let reason = "Tài khoản của bạn đã bị khóa bởi Quản trị viên.";
          try {
            const data = JSON.parse(e.data);
            if (data?.reason) reason = data.reason;
          } catch {}

          // Phát tín hiệu cho các tab khác cùng văng ra
          try {
            if (authChannel) {
              authChannel.postMessage({ type: "ACCOUNT_BANNED", reason });
            }
          } catch {}

          handleImmediateKick(reason);
        });

        es.onerror = () => {
          // Khi connection bị server ngắt (do user bị kick hoặc mất mạng)
          // EventSource sẽ tự reconnect, không cần throw error
        };
      } catch (err) {
        console.error("[SessionWatcher] Lỗi thiết lập kết nối realtime:", err);
      }
    }

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
        eventSourceRef.current = null;
      }
      if (authChannel) {
        authChannel.close();
      }
    };
  }, [isAuthenticated, user?._id, dispatch, showToast]);

  return null;
}
