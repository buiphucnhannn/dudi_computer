"use client";

import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, setCredentials } from "@/redux/slices/authSlice";
import { useToast } from "@/components/common/ToastContext";
import { apiClient } from "@/lib/api";

export default function SessionWatcher() {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const eventSourceRef = useRef(null);

  // Đồng bộ và xác thực Session trực tiếp từ HttpOnly Cookie của server khi tải app
  useEffect(() => {
    let isMounted = true;
    apiClient
      .get("/auth/profile")
      .then((res) => {
        if (isMounted && res.data?.data) {
          dispatch(setCredentials({ user: res.data.data }));
        }
      })
      .catch((err) => {
        if (isMounted && err.response?.status === 401) {
          if (isAuthenticated) {
            dispatch(logoutUser());
          }
        }
      });

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

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

      // Điều hướng ngay lập tức về trang đăng nhập kèm cờ banned
      if (typeof window !== "undefined") {
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login?banned=true";
        }
      }
    };

    // 2. Kết nối Server-Sent Events (SSE) Stream
    // Trì hoãn kết nối SSE 2s sau khi trang tải xong để không chặn Critical Request Chain
    const timer = setTimeout(() => {
      try {
        const baseUrl = process.env.NEXT_PUBLIC_API_URL || "/api/v1";
        const streamUrl =
          isAuthenticated && user?._id
            ? `${baseUrl}/auth/session-stream`
            : `${baseUrl}/system/events`;

        const es = new EventSource(streamUrl, { withCredentials: true });
        eventSourceRef.current = es;

        // A. Lắng nghe sự kiện KICK (Khi Admin khóa tài khoản)
        es.addEventListener("KICK", (e) => {
        let reason = "Tài khoản của bạn đã bị khóa bởi Quản trị viên.";
        try {
          const data = JSON.parse(e.data);
          if (data?.reason) reason = data.reason;
        } catch {}

        try {
          if (authChannel) {
            authChannel.postMessage({ type: "ACCOUNT_BANNED", reason });
          }
        } catch {}

        handleImmediateKick(reason);
      });

      // B. Lắng nghe sự kiện RESOURCE_UPDATE (Khi Admin Ẩn / Xóa / Kích hoạt sản phẩm, bài viết, danh mục)
      es.addEventListener("RESOURCE_UPDATE", (e) => {
        try {
          const data = JSON.parse(e.data);
          if (!data) return;

          // Bắn Custom Event cho toàn bộ trang
          if (typeof window !== "undefined") {
            window.dispatchEvent(new CustomEvent("app:resource-update", { detail: data }));
            
            const currentPath = window.location.pathname;
            const currentSearch = window.location.search;

            // 1. Nếu đang xem bài viết tin tức bị ẩn hoặc xóa
            if (data.resourceType === "news" || data.resourceType === "news_category") {
              if (data.action === "hide" || data.action === "delete") {
                const isMatchingNews =
                  currentPath.includes("/news/") || currentPath.includes("/tin-tuc/");
                const hasSlug = data.slug && (currentPath.includes(data.slug) || currentSearch.includes(data.slug));
                const hasId = data.id && (currentPath.includes(data.id) || currentSearch.includes(data.id));

                if (isMatchingNews && (hasSlug || hasId || data.resourceType === "news_category")) {
                  showToast(
                    "Bài viết này vừa được Quản trị viên tạm ngừng xuất bản hoặc chuyển sang bản nháp.",
                    "warning"
                  );
                  window.dispatchEvent(new CustomEvent("app:news-hidden", { detail: data }));
                }
              }
            }

            // 2. Nếu đang xem sản phẩm bị ẩn hoặc xóa
            if (data.resourceType === "product" || data.resourceType === "category") {
              if (data.action === "hide" || data.action === "delete") {
                const isMatchingProduct =
                  currentPath.includes("/product-detail") || currentPath.includes("/product/");
                const hasSlug = data.slug && (currentPath.includes(data.slug) || currentSearch.includes(data.slug));
                const hasId = data.id && (currentPath.includes(data.id) || currentSearch.includes(data.id));

                if (isMatchingProduct && (hasSlug || hasId || data.resourceType === "category")) {
                  showToast(
                    "Sản phẩm này vừa được Quản trị viên tạm ngừng kinh doanh hoặc gỡ khỏi hệ thống.",
                    "warning"
                  );
                  window.dispatchEvent(new CustomEvent("app:product-hidden", { detail: data }));
                }
              }
            }
          }
        } catch (err) {
          console.error("[SessionWatcher] Lỗi xử lý RESOURCE_UPDATE:", err);
        }
      });

        es.onerror = () => {
          // EventSource tự động reconnect khi mất kết nối
        };
      } catch (err) {
        console.error("[SessionWatcher] Lỗi thiết lập kết nối realtime:", err);
      }
    }, 2000);

    return () => {
      clearTimeout(timer);
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
