"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Volume2,
  VolumeX,
  RotateCcw,
  Shield,
  Zap,
  Clock,
  AlertTriangle,
} from "lucide-react";

// Helper chuyển đổi e.code thành nhãn ngắn gọn chính xác
const getKeyDisplayLabel = (code) => {
  const customLabels = {
    Escape: "Esc",
    Backspace: "Backspace",
    Tab: "Tab",
    CapsLock: "Caps Lock",
    Enter: "Enter",
    ShiftLeft: "Shift",
    ShiftRight: "Shift",
    ControlLeft: "Ctrl",
    ControlRight: "Ctrl",
    AltLeft: "Alt",
    AltRight: "Alt",
    MetaLeft: "Win",
    MetaRight: "Win",
    ContextMenu: "Menu",
    Space: "Space",
    PrintScreen: "PrtSc",
    ScrollLock: "ScrLk",
    Pause: "Pause",
    Insert: "Ins",
    Home: "Home",
    PageUp: "PgUp",
    Delete: "Del",
    End: "End",
    PageDown: "PgDn",
    ArrowUp: "↑",
    ArrowDown: "↓",
    ArrowLeft: "←",
    ArrowRight: "→",
    NumLock: "Num Lock",
    NumpadDivide: "/",
    NumpadMultiply: "*",
    NumpadSubtract: "-",
    NumpadAdd: "+",
    NumpadEnter: "Enter",
    NumpadDecimal: ".",
    Numpad0: "0",
    Numpad1: "1",
    Numpad2: "2",
    Numpad3: "3",
    Numpad4: "4",
    Numpad5: "5",
    Numpad6: "6",
    Numpad7: "7",
    Numpad8: "8",
    Numpad9: "9",
    Backquote: "`",
    Minus: "-",
    Equal: "=",
    BracketLeft: "[",
    BracketRight: "]",
    Backslash: "\\",
    Semicolon: ";",
    Quote: "'",
    Comma: ",",
    Period: ".",
    Slash: "/",
  };

  if (customLabels[code]) return customLabels[code];
  if (code.startsWith("Key")) return code.replace("Key", "");
  if (code.startsWith("Digit")) return code.replace("Digit", "");
  if (code.startsWith("F") && code.length <= 3) return code;
  return code;
};

// Nhãn ngắn cho Log phím
const getLogShortLabel = (code) => {
  if (code === "Space") return "Space";
  if (code === "Backspace") return "Back";
  if (code === "CapsLock") return "Caps";
  if (code.startsWith("Shift")) return "Shift";
  if (code.startsWith("Control")) return "Ctrl";
  if (code.startsWith("Alt")) return "Alt";
  if (code.startsWith("Meta")) return "Win";
  if (code === "ContextMenu") return "Menu";
  return getKeyDisplayLabel(code);
};

// Tổng số phím chuẩn (104 phím)
const TOTAL_KEYS_COUNT = 104;

export default function KeyboardTestContent() {
  const [activeKeys, setActiveKeys] = useState(new Set()); // Các phím đang đè (Pressing)
  const [testedKeys, setTestedKeys] = useState(new Set()); // Các phím đã test thành công (Tested)
  const [doubleKeys, setDoubleKeys] = useState(new Set()); // Các phím bị phát hiện đúp
  const [keyLog, setKeyLog] = useState([]); // Lịch sử phím gõ
  const [maxGhosting, setMaxGhosting] = useState(0); // Số phím cùng lúc lớn nhất
  const [doublePressCount, setDoublePressCount] = useState(0); // Cảnh báo đúp
  const [sfxEnabled, setSfxEnabled] = useState(true); // Bật/tắt âm switch
  
  // Trạng thái Touchpad (chuột trái, chuột giữa, chuột phải)
  const [touchpadTested, setTouchpadTested] = useState({ left: false, middle: false, right: false });
  const [touchpadActive, setTouchpadActive] = useState({ left: false, middle: false, right: false });
  const [touchpadPos, setTouchpadPos] = useState({ x: 50, y: 50, isHover: false });

  // Trạng thái phát hiện và khóa khi bật Unikey / Bộ gõ tiếng Việt
  const [unikeyDetected, setUnikeyDetected] = useState(false);
  const lastNonBackspaceTime = useRef(0);
  const unikeyDetectedRef = useRef(false);

  useEffect(() => {
    unikeyDetectedRef.current = unikeyDetected;
  }, [unikeyDetected]);

  // Rolling calculation cho KPM
  const [kpm, setKpm] = useState(0);
  const keystrokeTimestamps = useRef([]);
  const lastKeyReleaseTimes = useRef({});
  const audioCtxRef = useRef(null);

  // Tự động scale vừa khít khung hình Desktop / Laptop / Tablet
  const [scale, setScale] = useState(1);
  const [keyboardHeight, setKeyboardHeight] = useState(295);
  const containerRef = useRef(null);
  const innerKeyboardRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.clientWidth;
        const targetWidth = 1080;
        if (containerWidth > 0) {
          const s = Math.min(1, containerWidth / targetWidth);
          setScale(s);
          setKeyboardHeight(Math.round(295 * s));
        }
      }
    };

    handleResize();

    let resizeObserver;
    if (typeof ResizeObserver !== "undefined" && containerRef.current) {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(containerRef.current);
    } else {
      window.addEventListener("resize", handleResize);
    }

    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Âm thanh cơ học SFX (Web Audio API)
  const playSwitchSound = useCallback(() => {
    if (!sfxEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(750 + Math.random() * 150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.03);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.035);
    } catch (_) {}
  }, [sfxEnabled]);

  // Xử lý sự kiện bàn phím & Phát hiện Unikey / EVKey
  useEffect(() => {
    const VIETNAMESE_ACCENT_REGEX = /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđÀÁẠẢÃÂẦẤẬẨẪĂẰẮẶẲẴÈÉẸẺẼÊỀẾỆỂỄÌÍỊỈĨÒÓỌỎÕÔỒỐỘỔỖƠỜỚỢỞỠÙÚỤỦŨƯỪỨỰỬỮỲÝỴỶỸĐ]/i;

    const handleKeyDown = (e) => {
      const now = Date.now();
      const code = e.code;

      // 0. PHÁT HIỆN BỘ GÕ TIẾNG VIỆT (UNIKEY / EVKEY / WINDOWS IME)
      const isIMEComposition =
        e.isComposing ||
        e.keyCode === 229 ||
        e.key === "Process" ||
        (e.key && VIETNAMESE_ACCENT_REGEX.test(e.key));

      // Phát hiện lệnh Backspace giả lập tự động từ Unikey (< 45ms sau phím chữ)
      const isSyntheticBackspace =
        code === "Backspace" &&
        lastNonBackspaceTime.current > 0 &&
        now - lastNonBackspaceTime.current < 45;

      if (isIMEComposition || isSyntheticBackspace) {
        setUnikeyDetected(true);
        // Không ghi nhận phím này vào test để tránh loạn và đúp phím giả
        e.preventDefault();
        return;
      }

      // Nếu Unikey đang bị phát hiện -> Khóa hoàn toàn, không cho test
      if (unikeyDetectedRef.current) {
        e.preventDefault();
        return;
      }

      // Cập nhật mốc thời gian của phím chữ/số thực tế
      if (code && code !== "Backspace") {
        lastNonBackspaceTime.current = now;
      }

      // Chặn các phím mặc định của trình duyệt để test mượt mà & tránh lọt ký tự vào ô tìm kiếm
      const target = e.target;
      const isInsideInput = target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA");
      if (!isInsideInput) {
        e.preventDefault();
      }

      if (!code) return;

      // 1. Kiểm tra lỗi chattering (Khoảng cách nhả phím rồi ấn lại < 30ms cho phím vật lý thực)
      const lastRelease = lastKeyReleaseTimes.current[code];
      let isDouble = false;
      if (lastRelease && now - lastRelease < 30 && !e.repeat) {
        isDouble = true;
        setDoublePressCount((prev) => prev + 1);
        setDoubleKeys((prev) => new Set(prev).add(code));
      }

      // 2. Âm thanh switch cơ
      if (!e.repeat) {
        playSwitchSound();
      }

      // 3. Cập nhật phím đang nhấn & đã test
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.add(code);
        if (next.size > maxGhosting) {
          setMaxGhosting(next.size);
        }
        return next;
      });

      setTestedKeys((prev) => new Set(prev).add(code));

      // 4. Ghi log phím
      const shortLabel = getLogShortLabel(code);
      setKeyLog((prev) => [
        {
          id: now + "-" + Math.random(),
          label: shortLabel,
          code: code,
          isDouble,
          type: "key",
        },
        ...prev.slice(0, 47),
      ]);

      // 5. KPM
      keystrokeTimestamps.current.push(now);
    };

    const handleKeyUp = (e) => {
      if (unikeyDetectedRef.current) return;
      const now = Date.now();
      const code = e.code;
      if (code) {
        lastKeyReleaseTimes.current[code] = now;
      }
      setActiveKeys((prev) => {
        const next = new Set(prev);
        next.delete(code);
        return next;
      });
    };

    // Bắt sự kiện Composition IME toàn cầu
    const handleCompositionStart = () => {
      setUnikeyDetected(true);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("compositionstart", handleCompositionStart);
    window.addEventListener("compositionupdate", handleCompositionStart);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("compositionstart", handleCompositionStart);
      window.removeEventListener("compositionupdate", handleCompositionStart);
    };
  }, [maxGhosting, playSwitchSound]);

  // Bộ tính KPM định kỳ mỗi 500ms
  useEffect(() => {
    const kpmInterval = setInterval(() => {
      const now = Date.now();
      keystrokeTimestamps.current = keystrokeTimestamps.current.filter(
        (t) => now - t <= 5000
      );
      const count = keystrokeTimestamps.current.length;
      const currentKpm = Math.round((count / 5) * 60);
      setKpm(currentKpm);
    }, 500);

    return () => clearInterval(kpmInterval);
  }, []);

  // Xử lý sự kiện Mouse Clicks cho 3 nút TRÁI - GIỮA - PHẢI
  const handleMouseButtonDown = useCallback((type) => {
    playSwitchSound();
    setTouchpadActive((prev) => ({ ...prev, [type]: true }));
    setTouchpadTested((prev) => ({ ...prev, [type]: true }));

    const label = type === "left" ? "L-Click" : type === "middle" ? "M-Click" : "R-Click";
    setKeyLog((prev) => [
      {
        id: Date.now() + "-" + Math.random(),
        label: label,
        code: label,
        isDouble: false,
        type: "mouse",
      },
      ...prev.slice(0, 47),
    ]);
  }, [playSwitchSound]);

  const handleMouseButtonUp = useCallback((type) => {
    setTouchpadActive((prev) => ({ ...prev, [type]: false }));
  }, []);

  // Chặn context menu trình duyệt + Lắng nghe chuột toàn trang cho 3 nút TRÁI - GIỮA - PHẢI
  useEffect(() => {
    const preventContextMenu = (e) => {
      e.preventDefault();
    };

    const handleGlobalMouseDown = (e) => {
      // Bỏ qua nếu click vào link, button chức năng header/modal, input
      const target = e.target;
      const isInteractive = target.closest('a, button, input, select, textarea, [data-no-touchpad]');
      const isMouseBtn = target.closest('[data-mouse-test-btn]');
      if (isInteractive && !isMouseBtn) return;

      if (e.button === 0) handleMouseButtonDown("left");
      else if (e.button === 1) {
        e.preventDefault();
        handleMouseButtonDown("middle");
      } else if (e.button === 2) {
        e.preventDefault();
        handleMouseButtonDown("right");
      }
    };

    const handleGlobalMouseUp = (e) => {
      if (e.button === 0) handleMouseButtonUp("left");
      else if (e.button === 1) handleMouseButtonUp("middle");
      else if (e.button === 2) handleMouseButtonUp("right");
    };

    document.addEventListener("contextmenu", preventContextMenu);
    document.addEventListener("mousedown", handleGlobalMouseDown);
    document.addEventListener("mouseup", handleGlobalMouseUp);

    return () => {
      document.removeEventListener("contextmenu", preventContextMenu);
      document.removeEventListener("mousedown", handleGlobalMouseDown);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [handleMouseButtonDown, handleMouseButtonUp]);

  // Xử lý di chuyển chuột trên Touchpad
  const handleTouchpadMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
    const y = Math.max(0, Math.min(100, Math.round(((e.clientY - rect.top) / rect.height) * 100)));
    setTouchpadPos({ x, y, isHover: true });
  };

  // Hàm đóng cảnh báo Unikey và cho phép test tiếp
  const handleDismissUnikey = () => {
    setUnikeyDetected(false);
    unikeyDetectedRef.current = false;
    setDoublePressCount(0);
    setDoubleKeys(new Set());
    setActiveKeys(new Set());
  };

  // Hàm Reset làm mới toàn bộ
  const handleReset = () => {
    setActiveKeys(new Set());
    setTestedKeys(new Set());
    setDoubleKeys(new Set());
    setKeyLog([]);
    setMaxGhosting(0);
    setDoublePressCount(0);
    setKpm(0);
    setUnikeyDetected(false);
    unikeyDetectedRef.current = false;
    keystrokeTimestamps.current = [];
    lastKeyReleaseTimes.current = {};
    lastNonBackspaceTime.current = 0;
    setTouchpadTested({ left: false, middle: false, right: false });
    setTouchpadActive({ left: false, middle: false, right: false });
    setTouchpadPos({ x: 50, y: 50, isHover: false });
  };

  // Xử lý khi click / touch trực tiếp vào phím trên màn hình
  const handleVirtualKeyPress = useCallback(
    (code) => {
      playSwitchSound();
      setTestedKeys((prev) => new Set(prev).add(code));
      setActiveKeys((prev) => {
        const next = new Set(prev).add(code);
        if (next.size > maxGhosting) setMaxGhosting(next.size);
        return next;
      });
      setTimeout(() => {
        setActiveKeys((prev) => {
          const next = new Set(prev);
          next.delete(code);
          return next;
        });
      }, 150);

      setKeyLog((prev) => [
        {
          id: Date.now() + "-" + Math.random(),
          label: getLogShortLabel(code),
          code: code,
          isDouble: false,
          type: "keyboard",
        },
        ...prev.slice(0, 47),
      ]);
    },
    [playSwitchSound, maxGhosting]
  );

  // Render phím bấm chuẩn layout
  const renderKey = (code, mainLabel, subLabel = null, widthStyle = "w-[40px]", heightStyle = "h-[40px]") => {
    const isDown = activeKeys.has(code);
    const isTested = testedKeys.has(code);
    const isDouble = doubleKeys.has(code);

    let keyClasses = "bg-[#161c26] text-gray-300 border-[#222b3a] hover:border-gray-600";

    if (isDown) {
      // Đang đè: Đỏ cam rực rỡ
      keyClasses = "bg-[#eb1c24] text-white border-[#eb1c24] shadow-[0_0_12px_rgba(235,28,36,0.6)] transform scale-[0.97]";
    } else if (isTested) {
      // Đã test: Nền trắng tinh chữ đen đậm chuẩn
      keyClasses = "bg-white text-gray-900 border-white font-black shadow-sm";
    }

    if (isDouble && !isDown) {
      keyClasses += " ring-2 ring-red-500";
    }

    return (
      <div
        key={code}
        onClick={() => handleVirtualKeyPress(code)}
        className={`${widthStyle} ${heightStyle} rounded-lg border flex flex-col items-center justify-center text-xs font-bold select-none cursor-pointer active:scale-95 shrink-0 transition-all duration-75 ${keyClasses}`}
      >
        {subLabel && !isTested && (
          <span className="text-[10px] text-gray-400 leading-none mb-0.5 pointer-events-none">
            {subLabel}
          </span>
        )}
        <span className="leading-tight text-center px-0.5 truncate pointer-events-none">{mainLabel}</span>
      </div>
    );
  };

  const progressPercent = Math.min(
    100,
    Math.round((testedKeys.size / TOTAL_KEYS_COUNT) * 100)
  );

  return (
    <div className="bg-[#0b0e14] text-white min-h-[calc(100vh-140px)] py-5 sm:py-7 px-3 sm:px-6 lg:px-10 select-none font-sans relative" onContextMenu={(e) => e.preventDefault()}>
      {/* Modal Cảnh báo & Khóa khi bật bộ gõ tiếng Việt */}
      {unikeyDetected && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#121620] border-2 border-red-600 rounded-2xl p-6 sm:p-7 max-w-md w-full shadow-[0_0_40px_rgba(235,28,36,0.35)] text-white text-center relative overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Warning Icon Badge */}
            <div className="w-14 h-14 rounded-2xl bg-red-600/20 border border-red-500/40 text-[#eb1c24] flex items-center justify-center mx-auto mb-4 shadow-[0_0_15px_rgba(235,28,36,0.25)]">
              <AlertTriangle className="w-8 h-8" />
            </div>

            <h2 className="text-lg sm:text-xl font-black uppercase text-white tracking-tight mb-2">
              Vui lòng tắt bộ gõ tiếng Việt
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mb-6 leading-relaxed">
              Vui lòng tắt bộ gõ tiếng Việt hoặc chuyển sang chế độ Tiếng Anh (<strong>[ E ]</strong>) để kiểm tra bàn phím chính xác.
            </p>

            {/* Button Action */}
            <button
              onClick={handleDismissUnikey}
              data-no-touchpad
              className="w-full py-3 px-5 bg-[#eb1c24] hover:bg-red-600 text-white font-black text-sm rounded-xl shadow-lg shadow-red-600/30 transition-all hover:scale-[1.02] active:scale-95 cursor-pointer uppercase tracking-wide"
            >
              ĐÃ KHẮC PHỤC - TIẾP TỤC TEST
            </button>
          </div>
        </div>
      )}

      <div className="max-w-[1540px] mx-auto">
        {/* Banner cảnh báo phía trên */}
        {unikeyDetected && (
          <div className="mb-5 bg-red-950/80 border border-red-600 rounded-xl p-3.5 sm:p-4 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
              <p className="text-xs sm:text-sm text-gray-200 font-medium">
                Vui lòng tắt bộ gõ tiếng Việt (hoặc chuyển sang Tiếng Anh) để tiếp tục kiểm tra bàn phím.
              </p>
            </div>
            <button
              onClick={handleDismissUnikey}
              data-no-touchpad
              className="px-4 py-1.5 bg-white hover:bg-gray-100 text-red-900 font-bold text-xs rounded-lg transition-all shadow-xs shrink-0 cursor-pointer active:scale-95"
            >
              ĐÃ KHẮC PHỤC - TIẾP TỤC TEST
            </button>
          </div>
        )}

        {/* Top Control Bar */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5 flex-wrap sm:flex-nowrap">
          <Link
            href="/"
            data-no-touchpad
            className="inline-flex items-center gap-2 bg-[#131822] hover:bg-[#1c2433] text-gray-300 hover:text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-gray-800 transition-all cursor-pointer shadow-sm active:scale-95"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>QUAY LẠI</span>
          </Link>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              data-no-touchpad
              onClick={() => setSfxEnabled(!sfxEnabled)}
              className={`flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all cursor-pointer ${
                sfxEnabled
                  ? "bg-[#131822] text-gray-200 border-gray-800 hover:border-gray-600"
                  : "bg-red-950/40 text-red-400 border-red-900/60"
              }`}
            >
              {sfxEnabled ? <Volume2 className="w-4 h-4 text-green-400" /> : <VolumeX className="w-4 h-4" />}
              <span>SFX: {sfxEnabled ? "BẬT" : "TẮT"}</span>
            </button>

            <button
              data-no-touchpad
              onClick={handleReset}
              className="flex items-center gap-1.5 bg-[#131822] hover:bg-[#eb1c24] text-gray-200 hover:text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-gray-800 hover:border-[#eb1c24] transition-all cursor-pointer shadow-sm active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>LÀM MỚI</span>
            </button>
          </div>
        </div>

        {/* Main Grid: Bàn Phím + Touchpad (Trái) & Bảng Thống Kê (Phải) */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          {/* Cột trái: Khung Bàn Phím + Touchpad (xl:col-span-9) */}
          <div className="xl:col-span-9 bg-[#10141d] border border-gray-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-7 shadow-2xl flex flex-col justify-between h-full">
            {/* Header Tiêu đề & Thanh Progress */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-4 pb-3 border-b border-gray-800/60">
              <div>
                <h1 className="text-lg sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                  <span className="text-[#eb1c24] flex items-center justify-center">
                    <Shield className="w-5 h-5 sm:w-6 sm:h-6 fill-[#eb1c24]/20" />
                  </span>
                  <span className="bg-gradient-to-r from-white via-white to-gray-300 bg-clip-text text-transparent">
                    TEST BÀN PHÍM
                  </span>
                </h1>
                <p className="text-xs sm:text-[13px] text-gray-400 font-medium mt-0.5">
                  Chuẩn xác tuyệt đối <span className="text-red-500 mx-1">•</span> Chống giật lag
                </p>
              </div>

              <div className="flex items-center gap-3 self-end sm:self-auto">
                <span className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  {progressPercent}<span className="text-xs text-[#eb1c24] ml-0.5">%</span>
                </span>
                <div className="w-24 sm:w-36 bg-gray-800/80 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-[#eb1c24] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Bàn Phím 3 Cụm Chuẩn (Tự động co giãn scale vừa vặn khung hình Desktop/Laptop, tránh tình trạng kéo qua lại) */}
            <div
              ref={containerRef}
              className="w-full flex items-center justify-center overflow-hidden py-1"
            >
              <div
                style={{
                  height: `${keyboardHeight}px`,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  overflow: "hidden",
                }}
              >
                <div
                  ref={innerKeyboardRef}
                  style={{
                    transform: `scale(${scale})`,
                    transformOrigin: "top center",
                    width: "1080px",
                  }}
                  className="flex items-start gap-6 sm:gap-7 justify-center bg-[#0a0d13] p-3.5 sm:p-4 rounded-2xl border border-gray-800/60 shadow-inner shrink-0"
                >
                  {/* 1. Cụm Chính (Alphanumeric 60% Block - Chuẩn xác 684px tuyệt đối) */}
                  <div className="flex flex-col gap-1.5 w-[684px] shrink-0">
                  {/* Hàng 1 (Function Row: Esc, F1-F12 căn chuẩn khít 684px) */}
                  <div className="flex items-center h-[40px] w-full">
                    {renderKey("Escape", "Esc", null, "w-[40px]")}
                    <div className="w-[38px] shrink-0" />
                    <div className="flex items-center gap-1.5">
                      {renderKey("F1", "F1", null, "w-[40px]")}
                      {renderKey("F2", "F2", null, "w-[40px]")}
                      {renderKey("F3", "F3", null, "w-[40px]")}
                      {renderKey("F4", "F4", null, "w-[40px]")}
                    </div>
                    <div className="w-[36px] shrink-0" />
                    <div className="flex items-center gap-1.5">
                      {renderKey("F5", "F5", null, "w-[40px]")}
                      {renderKey("F6", "F6", null, "w-[40px]")}
                      {renderKey("F7", "F7", null, "w-[40px]")}
                      {renderKey("F8", "F8", null, "w-[40px]")}
                    </div>
                    <div className="w-[36px] shrink-0" />
                    <div className="flex items-center gap-1.5">
                      {renderKey("F9", "F9", null, "w-[40px]")}
                      {renderKey("F10", "F10", null, "w-[40px]")}
                      {renderKey("F11", "F11", null, "w-[40px]")}
                      {renderKey("F12", "F12", null, "w-[40px]")}
                    </div>
                  </div>

                  {/* Hàng 2 (Number Row - 684px) */}
                  <div className="flex items-center gap-1.5 w-full">
                    {renderKey("Backquote", "`", "~", "w-[40px]")}
                    {renderKey("Digit1", "1", "!", "w-[40px]")}
                    {renderKey("Digit2", "2", "@", "w-[40px]")}
                    {renderKey("Digit3", "3", "#", "w-[40px]")}
                    {renderKey("Digit4", "4", "$", "w-[40px]")}
                    {renderKey("Digit5", "5", "%", "w-[40px]")}
                    {renderKey("Digit6", "6", "^", "w-[40px]")}
                    {renderKey("Digit7", "7", "&", "w-[40px]")}
                    {renderKey("Digit8", "8", "*", "w-[40px]")}
                    {renderKey("Digit9", "9", "(", "w-[40px]")}
                    {renderKey("Digit0", "0", ")", "w-[40px]")}
                    {renderKey("Minus", "-", "_", "w-[40px]")}
                    {renderKey("Equal", "=", "+", "w-[40px]")}
                    {renderKey("Backspace", "Backspace", null, "w-[86px]")}
                  </div>

                  {/* Hàng 3 (QWERTY Row - 684px) */}
                  <div className="flex items-center gap-1.5 w-full">
                    {renderKey("Tab", "Tab", null, "w-[63px]")}
                    {renderKey("KeyQ", "Q", null, "w-[40px]")}
                    {renderKey("KeyW", "W", null, "w-[40px]")}
                    {renderKey("KeyE", "E", null, "w-[40px]")}
                    {renderKey("KeyR", "R", null, "w-[40px]")}
                    {renderKey("KeyT", "T", null, "w-[40px]")}
                    {renderKey("KeyY", "Y", null, "w-[40px]")}
                    {renderKey("KeyU", "U", null, "w-[40px]")}
                    {renderKey("KeyI", "I", null, "w-[40px]")}
                    {renderKey("KeyO", "O", null, "w-[40px]")}
                    {renderKey("KeyP", "P", null, "w-[40px]")}
                    {renderKey("BracketLeft", "[", "{", "w-[40px]")}
                    {renderKey("BracketRight", "]", "}", "w-[40px]")}
                    {renderKey("Backslash", "\\", "|", "w-[63px]")}
                  </div>

                  {/* Hàng 4 (Home Row - 684px) */}
                  <div className="flex items-center gap-1.5 w-full">
                    {renderKey("CapsLock", "Caps Lock", null, "w-[75px]")}
                    {renderKey("KeyA", "A", null, "w-[40px]")}
                    {renderKey("KeyS", "S", null, "w-[40px]")}
                    {renderKey("KeyD", "D", null, "w-[40px]")}
                    {renderKey("KeyF", "F", null, "w-[40px]")}
                    {renderKey("KeyG", "G", null, "w-[40px]")}
                    {renderKey("KeyH", "H", null, "w-[40px]")}
                    {renderKey("KeyJ", "J", null, "w-[40px]")}
                    {renderKey("KeyK", "K", null, "w-[40px]")}
                    {renderKey("KeyL", "L", null, "w-[40px]")}
                    {renderKey("Semicolon", ";", ":", "w-[40px]")}
                    {renderKey("Quote", "'", "\"", "w-[40px]")}
                    {renderKey("Enter", "Enter", null, "w-[97px]")}
                  </div>

                  {/* Hàng 5 (Shift Row - 684px) */}
                  <div className="flex items-center gap-1.5 w-full">
                    {renderKey("ShiftLeft", "Shift", null, "w-[97px]")}
                    {renderKey("KeyZ", "Z", null, "w-[40px]")}
                    {renderKey("KeyX", "X", null, "w-[40px]")}
                    {renderKey("KeyC", "C", null, "w-[40px]")}
                    {renderKey("KeyV", "V", null, "w-[40px]")}
                    {renderKey("KeyB", "B", null, "w-[40px]")}
                    {renderKey("KeyN", "N", null, "w-[40px]")}
                    {renderKey("KeyM", "M", null, "w-[40px]")}
                    {renderKey("Comma", ",", "<", "w-[40px]")}
                    {renderKey("Period", ".", ">", "w-[40px]")}
                    {renderKey("Slash", "/", "?", "w-[40px]")}
                    {renderKey("ShiftRight", "Shift", null, "w-[121px]")}
                  </div>

                  {/* Hàng 6 (Bottom Modifiers Row - 684px) */}
                  <div className="flex items-center gap-1.5 w-full">
                    {renderKey("ControlLeft", "Ctrl", null, "w-[52px]")}
                    {renderKey("MetaLeft", "Win", null, "w-[52px]")}
                    {renderKey("AltLeft", "Alt", null, "w-[52px]")}
                    {renderKey("Space", "Space", null, "w-[340px]")}
                    {renderKey("AltRight", "Alt", null, "w-[52px]")}
                    {renderKey("ContextMenu", "Menu", null, "w-[52px]")}
                    {renderKey("ControlRight", "Ctrl", null, "w-[48px]")}
                  </div>
                </div>

                {/* 2. Cụm Điều Hướng & Mũi Tên (Navigation Block - Cách biệt rõ ràng) */}
                <div className="flex flex-col gap-1.5 shrink-0">
                  {/* Hàng 1: PrtSc, ScrLk, Pause */}
                  <div className="flex items-center gap-1.5 h-[40px]">
                    {renderKey("PrintScreen", "PrtSc", null, "w-[40px]")}
                    {renderKey("ScrollLock", "ScrLk", null, "w-[40px]")}
                    {renderKey("Pause", "Pause", null, "w-[40px]")}
                  </div>

                  {/* Hàng 2: Ins, Home, PgUp */}
                  <div className="flex items-center gap-1.5">
                    {renderKey("Insert", "Ins", null, "w-[40px]")}
                    {renderKey("Home", "Home", null, "w-[40px]")}
                    {renderKey("PageUp", "PgUp", null, "w-[40px]")}
                  </div>

                  {/* Hàng 3: Del, End, PgDn */}
                  <div className="flex items-center gap-1.5">
                    {renderKey("Delete", "Del", null, "w-[40px]")}
                    {renderKey("End", "End", null, "w-[40px]")}
                    {renderKey("PageDown", "PgDn", null, "w-[40px]")}
                  </div>

                  {/* Hàng 4: Khoảng trống */}
                  <div className="h-[40px]" />

                  {/* Hàng 5: Mũi tên Lên */}
                  <div className="flex items-center justify-center h-[40px]">
                    <div className="w-[40px]" />
                    {renderKey("ArrowUp", "↑", null, "w-[40px]")}
                    <div className="w-[40px]" />
                  </div>

                  {/* Hàng 6: Trái, Xuống, Phải */}
                  <div className="flex items-center gap-1.5">
                    {renderKey("ArrowLeft", "←", null, "w-[40px]")}
                    {renderKey("ArrowDown", "↓", null, "w-[40px]")}
                    {renderKey("ArrowRight", "→", null, "w-[40px]")}
                  </div>
                </div>

                {/* 3. Cụm Bàn Phím Số (Numpad Block - Tự động căn chính giữa chiều cao bàn phím) */}
                <div className="flex flex-col gap-1.5 shrink-0 mt-[23px]">
                  {/* Hàng 1: NumLock, /, *, - */}
                  <div className="flex items-center gap-1.5">
                    {renderKey("NumLock", "Num", null, "w-[40px]")}
                    {renderKey("NumpadDivide", "/", null, "w-[40px]")}
                    {renderKey("NumpadMultiply", "*", null, "w-[40px]")}
                    {renderKey("NumpadSubtract", "-", null, "w-[40px]")}
                  </div>

                  {/* Hàng 2, 3, 4, 5: Numpad Grid */}
                  <div className="flex items-start gap-1.5">
                    {/* Cột 3 phím số */}
                    <div className="flex flex-col gap-1.5">
                      {/* 7, 8, 9 */}
                      <div className="flex items-center gap-1.5">
                        {renderKey("Numpad7", "7", null, "w-[40px]")}
                        {renderKey("Numpad8", "8", null, "w-[40px]")}
                        {renderKey("Numpad9", "9", null, "w-[40px]")}
                      </div>
                      {/* 4, 5, 6 */}
                      <div className="flex items-center gap-1.5">
                        {renderKey("Numpad4", "4", null, "w-[40px]")}
                        {renderKey("Numpad5", "5", null, "w-[40px]")}
                        {renderKey("Numpad6", "6", null, "w-[40px]")}
                      </div>
                      {/* 1, 2, 3 */}
                      <div className="flex items-center gap-1.5">
                        {renderKey("Numpad1", "1", null, "w-[40px]")}
                        {renderKey("Numpad2", "2", null, "w-[40px]")}
                        {renderKey("Numpad3", "3", null, "w-[40px]")}
                      </div>
                      {/* 0 và . */}
                      <div className="flex items-center gap-1.5">
                        {renderKey("Numpad0", "0", null, "w-[85px]")}
                        {renderKey("NumpadDecimal", ".", null, "w-[40px]")}
                      </div>
                    </div>

                    {/* Cột + và Enter cao 2 ô */}
                    <div className="flex flex-col gap-1.5">
                      {renderKey("NumpadAdd", "+", null, "w-[40px]", "h-[85px]")}
                      {renderKey("NumpadEnter", "Enter", null, "w-[40px]", "h-[85px]")}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

            {/* Khu Vực Touchpad Hiển Thị Trạng Thái */}
            <div className="pt-4 border-t border-gray-800/60 flex flex-col items-center justify-center mt-3">
              <div className="w-full max-w-[340px] sm:max-w-[380px] flex flex-col items-center">
                {/* Vùng cảm ứng Touchpad */}
                <div
                  onMouseMove={handleTouchpadMouseMove}
                  onMouseLeave={() => setTouchpadPos((p) => ({ ...p, isHover: false }))}
                  className={`w-full h-20 sm:h-22 border rounded-t-2xl flex items-center justify-center cursor-crosshair transition-all duration-150 select-none relative overflow-hidden group ${
                    touchpadActive.middle
                      ? "bg-[#eb1c24]/25 border-[#eb1c24]"
                      : "bg-[#141a24] hover:bg-[#18202d] text-gray-400 border-gray-800"
                  }`}
                >
                  {/* Tracking Dot khi rê chuột */}
                  {touchpadPos.isHover && (
                    <div
                      className="absolute w-3.5 h-3.5 rounded-full bg-[#eb1c24] pointer-events-none transform -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_#eb1c24] transition-transform duration-75"
                      style={{ left: `${touchpadPos.x}%`, top: `${touchpadPos.y}%` }}
                    />
                  )}
                  <span className="text-[11px] font-black text-gray-500 tracking-[0.25em] uppercase group-hover:text-gray-400 pointer-events-none">
                    TOUCHPAD
                  </span>
                </div>

                {/* 3 Nút Hiển Thị Trạng Thái Chuột: TRÁI - GIỮA - PHẢI */}
                <div className="grid grid-cols-3 gap-1.5 w-full pt-1.5">
                  <div
                    data-mouse-test-btn
                    onClick={() => {
                      handleMouseButtonDown("left");
                      setTimeout(() => handleMouseButtonUp("left"), 200);
                    }}
                    className={`py-2.5 rounded-b-xl text-xs font-extrabold border text-center transition-all select-none cursor-pointer active:scale-95 ${
                      touchpadActive.left
                        ? "bg-[#eb1c24] text-white border-[#eb1c24] scale-95 shadow-[0_0_10px_rgba(235,28,36,0.5)]"
                        : touchpadTested.left
                        ? "bg-white text-gray-900 border-white shadow-sm font-black"
                        : "bg-[#161c26] text-gray-300 border-[#222b3a] hover:border-gray-600"
                    }`}
                  >
                    TRÁI
                  </div>
                  <div
                    data-mouse-test-btn
                    onClick={() => {
                      handleMouseButtonDown("middle");
                      setTimeout(() => handleMouseButtonUp("middle"), 200);
                    }}
                    className={`py-2.5 rounded-b-xl text-xs font-extrabold border text-center transition-all select-none cursor-pointer active:scale-95 ${
                      touchpadActive.middle
                        ? "bg-[#eb1c24] text-white border-[#eb1c24] scale-95 shadow-[0_0_10px_rgba(235,28,36,0.5)]"
                        : touchpadTested.middle
                        ? "bg-white text-gray-900 border-white shadow-sm font-black"
                        : "bg-[#161c26] text-gray-300 border-[#222b3a] hover:border-gray-600"
                    }`}
                  >
                    GIỮA
                  </div>
                  <div
                    data-mouse-test-btn
                    onClick={() => {
                      handleMouseButtonDown("right");
                      setTimeout(() => handleMouseButtonUp("right"), 200);
                    }}
                    className={`py-2.5 rounded-b-xl text-xs font-extrabold border text-center transition-all select-none cursor-pointer active:scale-95 ${
                      touchpadActive.right
                        ? "bg-[#eb1c24] text-white border-[#eb1c24] scale-95 shadow-[0_0_10px_rgba(235,28,36,0.5)]"
                        : touchpadTested.right
                        ? "bg-white text-gray-900 border-white shadow-sm font-black"
                        : "bg-[#161c26] text-gray-300 border-[#222b3a] hover:border-gray-600"
                    }`}
                  >
                    PHẢI
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Thống Kê Realtime & Log Nhấn Phím (xl:col-span-3) */}
          <div className="xl:col-span-3 flex flex-col justify-between space-y-4 h-full">
            {/* Box 1: THỐNG KÊ REALTIME */}
            <div className="bg-[#10141d] border border-gray-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3.5">
                <Zap className="w-4 h-4 text-[#eb1c24]" />
                <span>THỐNG KÊ REALTIME</span>
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-2 gap-2.5 sm:gap-3 mb-3.5">
                {/* Tốc độ gõ */}
                <div className="bg-[#141a24] border border-gray-800/80 rounded-2xl p-3 sm:p-3.5 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    TỐC ĐỘ GÕ
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl sm:text-2xl font-black text-white">{kpm}</span>
                    <span className="text-[10px] font-bold text-gray-500">KPM</span>
                  </div>
                </div>

                {/* Đã nhấn */}
                <div className="bg-[#141a24] border border-gray-800/80 rounded-2xl p-3 sm:p-3.5 flex flex-col items-center justify-center text-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase">
                    ĐÃ NHẤN
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xl sm:text-2xl font-black text-white">
                      {testedKeys.size}
                    </span>
                    <span className="text-[10px] font-bold text-gray-500">/ 104</span>
                  </div>
                </div>

                {/* Box 2: MAX GHOSTING */}
                <div className="bg-gradient-to-r from-[#3a0d10] via-[#1a141b] to-[#141a24] border border-red-900/40 rounded-2xl p-3 sm:p-3.5 shadow-sm flex flex-col justify-center">
                  <span className="text-[10px] font-black text-red-400 uppercase tracking-wider block">
                    MAX GHOSTING
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-black text-[#eb1c24]">
                      {maxGhosting}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">phím</span>
                  </div>
                </div>

                {/* Box 3: CẢNH BÁO ĐÚP */}
                <div
                  className={`border rounded-2xl p-3 sm:p-3.5 transition-colors flex flex-col justify-center ${
                    doublePressCount > 0
                      ? "bg-red-950/40 border-red-800/80 shadow-md"
                      : "bg-[#141a24] border-gray-800/80"
                  }`}
                >
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wider block">
                    CẢNH BÁO ĐÚP
                  </span>
                  <div className="flex items-baseline gap-1.5 mt-0.5">
                    <span
                      className={`text-xl sm:text-2xl font-black ${
                        doublePressCount > 0 ? "text-[#eb1c24]" : "text-gray-300"
                      }`}
                    >
                      {doublePressCount}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">lỗi</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Box 4: LOG NHẤN PHÍM */}
            <div className="bg-[#10141d] border border-gray-800/80 rounded-2xl sm:rounded-3xl p-4 sm:p-5 shadow-xl flex-1 flex flex-col justify-between">
              <h2 className="text-xs font-black text-gray-400 uppercase tracking-wider flex items-center gap-2 mb-3">
                <Clock className="w-4 h-4 text-orange-400" />
                <span>LOG NHẤN PHÍM</span>
              </h2>

              <div className="bg-[#0b0e14] border border-gray-800/80 rounded-2xl p-3 flex-1 min-h-[140px] max-h-[220px] overflow-y-auto">
                {keyLog.length === 0 ? (
                  <div className="h-full min-h-[120px] flex flex-col items-center justify-center text-gray-500 text-xs font-medium text-center">
                    <span>Hãy gõ phím bất kỳ hoặc chạm vào phím để kiểm tra log...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 xl:grid-cols-6 gap-1.5">
                    {keyLog.map((log) => {
                      let badgeStyle = "bg-[#18202d] text-gray-200 border border-gray-700/60";
                      if (log.type === "mouse") {
                        badgeStyle = "bg-red-950/50 text-red-400 border border-red-800/80 font-bold";
                      } else if (log.isDouble) {
                        badgeStyle = "bg-red-600 text-white animate-pulse font-black";
                      }
                      return (
                        <div
                          key={log.id}
                          className={`h-8 rounded-lg flex items-center justify-center text-[10.5px] font-black transition-all shadow-xs truncate px-0.5 ${badgeStyle}`}
                          title={log.code}
                        >
                          {log.label}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
