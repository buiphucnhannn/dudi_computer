"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Monitor,
  MousePointerClick,
  Zap,
  RotateCcw,
  Expand,
  CheckCircle2,
  X,
} from "lucide-react";

// Danh sách các bài test màn hình LCD chuẩn
const LCD_PATTERNS = [
  { id: "white", name: "Trắng (Đốm đen)", type: "color", hex: "#FFFFFF", text: "black" },
  { id: "black", name: "Đen (Hở sáng)", type: "color", hex: "#000000", text: "white" },
  { id: "red", name: "Đỏ (Pixel chết)", type: "color", hex: "#FF0000", text: "white" },
  { id: "green", name: "Xanh lá (Pixel chết)", type: "color", hex: "#00FF00", text: "black" },
  { id: "blue", name: "Xanh dương (Pixel chết)", type: "color", hex: "#0000FF", text: "white" },
  { id: "gradient-bw", name: "Dải Gradient (Đen-Trắng)", type: "gradient-bw" },
  { id: "grid", name: "Lưới (Độ méo hình)", type: "grid" },
  { id: "text", name: "Độ Nét Chữ (Sharpness)", type: "text" },
];

// Component Test Cảm Ứng Toàn Màn Hình (Touch Screen Test)
function TouchTestMode({ onExit }) {
  const [started, setStarted] = useState(false);
  const [testedCells, setTestedCells] = useState(new Set());
  const [grid, setGrid] = useState({ rows: 0, cols: 0, boxWidth: 0, boxHeight: 0 });
  const activePointers = useRef(new Map());
  const isCompleted = grid.rows > 0 && testedCells.size === grid.rows * grid.cols;

  // Khởi tạo kích thước lưới phù hợp với độ phân giải màn hình
  useEffect(() => {
    const calculateGrid = () => {
      const boxSize = window.innerWidth < 768 ? 40 : 50;
      const cols = Math.ceil(window.innerWidth / boxSize);
      const rows = Math.ceil(window.innerHeight / boxSize);
      const boxWidth = window.innerWidth / cols;
      const boxHeight = window.innerHeight / rows;

      setGrid({ rows, cols, boxWidth, boxHeight });
      setTestedCells(new Set());
    };

    calculateGrid();
    window.addEventListener("resize", calculateGrid);
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onExit();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", calculateGrid);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [onExit]);

  // Xử lý vẽ cảm ứng có nội suy để vuốt nhanh không bị sót ô
  const handlePointerMove = (e) => {
    if (!started) return;
    if (e.pointerType === "mouse" && e.buttons !== 1) return;

    const clientX = e.clientX;
    const clientY = e.clientY;
    const pointerId = e.pointerId;

    setTestedCells((prev) => {
      const next = new Set(prev);
      let changed = false;

      const markAt = (x, y) => {
        if (x < 0 || y < 0 || x >= window.innerWidth || y >= window.innerHeight) return;
        const col = Math.floor(x / grid.boxWidth);
        const row = Math.floor(y / grid.boxHeight);
        const index = row * grid.cols + col;
        if (!next.has(index)) {
          next.add(index);
          changed = true;
        }
      };

      markAt(clientX, clientY);

      // Nội suy giữa 2 toạ độ điểm trước và sau để không bị đứt đoạn khi vuốt nhanh
      const prevPos = activePointers.current.get(pointerId);
      if (prevPos) {
        const dx = clientX - prevPos.x;
        const dy = clientY - prevPos.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const stepSize = Math.min(grid.boxWidth, grid.boxHeight) / 3;

        if (dist > stepSize) {
          const steps = Math.floor(dist / stepSize);
          for (let i = 1; i < steps; i++) {
            markAt(prevPos.x + (i / steps) * dx, prevPos.y + (i / steps) * dy);
          }
        }
      }

      return changed ? next : prev;
    });

    activePointers.current.set(pointerId, { x: clientX, y: clientY });
  };

  const handlePointerUp = (e) => {
    activePointers.current.delete(e.pointerId);
    try {
      e.target.releasePointerCapture(e.pointerId);
    } catch (_) {}
  };

  // Tính phần trăm hoàn thành
  const totalCells = grid.rows * grid.cols;
  const progressPercent = totalCells > 0 ? Math.round((testedCells.size / totalCells) * 100) : 0;

  return (
    <div
      className="fixed inset-0 bg-[#0a0a0a] overflow-hidden select-none touch-none z-[99999]"
      onPointerDown={(e) => {
        if (started) {
          try {
            e.target.setPointerCapture(e.pointerId);
          } catch (_) {}
          handlePointerMove(e);
        } else {
          setStarted(true);
        }
      }}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Lưới ô vuông kiểm tra cảm ứng */}
      <div
        className="absolute inset-0 flex flex-wrap content-start pointer-events-none"
        style={{ width: "100%", height: "100%" }}
      >
        {Array.from({ length: totalCells }).map((_, index) => {
          const isTested = testedCells.has(index);
          return (
            <div
              key={index}
              style={{ width: `${grid.boxWidth}px`, height: `${grid.boxHeight}px` }}
              className={`relative border border-white/10 transition-colors duration-75 ${
                isTested
                  ? "bg-[#eb1c24] shadow-[0_0_15px_rgba(235,28,36,0.4)_inset]"
                  : "bg-transparent"
              }`}
            >
              <div className="absolute -top-[2px] -left-[2px] w-[4px] h-[4px] bg-white/40 rounded-full z-10 pointer-events-none" />
            </div>
          );
        })}
      </div>

      {/* Floating HUD: Phần trăm hoàn thành & Nút thoát */}
      {started && !isCompleted && (
        <div className="absolute top-4 right-4 z-50 flex items-center gap-3 bg-black/70 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 pointer-events-auto">
          <span className="text-xs font-bold text-white tracking-wider">
            {progressPercent}%
          </span>
          <div className="w-20 bg-gray-800 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-orange-500 to-[#eb1c24] h-full transition-all duration-150"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onExit();
            }}
            className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
            title="Thoát test (ESC)"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Hướng dẫn ban đầu trước khi bắt đầu chạm */}
      {!started && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none p-4 z-50">
          <div className="text-white text-sm md:text-base lg:text-lg space-y-4 max-w-2xl bg-[#111]/95 p-8 rounded-2xl backdrop-blur-md shadow-[0_0_50px_rgba(235,28,36,0.2)] border border-[#eb1c24]/30">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
              <MousePointerClick className="w-5 h-5 text-[#eb1c24]" />
              Hướng dẫn Test Cảm Ứng
            </h3>
            <p>1. Vuốt ngón tay qua từng ô vuông trên màn hình.</p>
            <p>
              2. Ô vuông đổi <strong className="text-[#eb1c24]">màu đỏ</strong> là đã vượt qua bài test. Ô vuông nào vẫn hiển thị màu nền, dù bạn đã chạm vào nhiều lần, thì ô vuông đó có vấn đề.
            </p>
            <p>
              3. Sau khi chạm vào tất cả các ô vuông, hệ thống sẽ tự động hoàn tất và hiển thị kết quả.
            </p>
            <p className="text-green-400 font-bold">
              👉 Hãy chạm vào bất kỳ chỗ nào để bắt đầu. Chúc may mắn nhé!
            </p>
          </div>
        </div>
      )}

      {/* Popup hoàn tất khi đã vuốt kín màn hình */}
      {isCompleted && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/85 backdrop-blur-md z-[100000] pointer-events-auto p-4">
          <div className="bg-[#111] border border-[#eb1c24]/50 shadow-[0_0_80px_rgba(235,28,36,0.3)] rounded-[2.5rem] p-8 md:p-12 flex flex-col items-center max-w-lg mx-4 text-center animate-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={44} className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
            </div>
            <h2 className="text-3xl font-black text-white mb-3 uppercase tracking-tight">
              Tuyệt Vời!
            </h2>
            <p className="text-gray-300 text-sm md:text-base mb-8 leading-relaxed">
              Màn hình cảm ứng của bạn hoạt động hoàn hảo, không phát hiện điểm liệt nào trên toàn bộ bề mặt ({totalCells}/{totalCells} ô vuông).
            </p>
            <div className="flex flex-col sm:flex-row w-full gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setTestedCells(new Set());
                }}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-6 py-3.5 rounded-xl font-bold transition-all border border-white/10 cursor-pointer"
              >
                Test Lại Lần Nữa
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onExit();
                }}
                className="flex-1 bg-[#eb1c24] hover:bg-[#eb1c24]/90 text-white px-6 py-3.5 rounded-xl font-bold shadow-[0_0_30px_rgba(235,28,36,0.4)] hover:-translate-y-0.5 transition-all uppercase tracking-wider cursor-pointer"
              >
                Hoàn Tất & Thoát
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Component Thẻ Đo Thông Tin Màn Hình (Screen Information Card)
function ScreenInfoCard() {
  const [screenInfo, setScreenInfo] = useState(null);
  const [measuringKey, setMeasuringKey] = useState(0);

  useEffect(() => {
    let animId;
    setScreenInfo(null);

    let frameCount = 0;
    let startTime = performance.now();
    const frameSamples = [];

    const measureHz = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - startTime >= 1000) {
        frameSamples.push(frameCount);
        frameCount = 0;
        startTime = currentTime;

        if (frameSamples.length < 2) {
          animId = requestAnimationFrame(measureHz);
        } else {
          const rawAverage = Math.round(
            frameSamples.reduce((a, b) => a + b, 0) / frameSamples.length
          );

          // Nhận diện tần số quét tiêu chuẩn
          const standardRates = [60, 75, 90, 100, 120, 144, 165, 240, 360, 500];
          let matchedHz = rawAverage;
          for (const rate of standardRates) {
            if (Math.abs(rawAverage - rate) <= 4) {
              matchedHz = rate;
              break;
            }
          }

          setScreenInfo({
            width: window.screen.width,
            height: window.screen.height,
            pixelRatio: window.devicePixelRatio || 1,
            rawHz: rawAverage,
            hz: matchedHz,
          });
        }
      } else {
        animId = requestAnimationFrame(measureHz);
      }
    };

    animId = requestAnimationFrame(measureHz);
    return () => cancelAnimationFrame(animId);
  }, [measuringKey]);

  // Phân loại độ phân giải chuẩn
  const getResolutionStandard = (w, h, ratio) => {
    const totalPixels = Math.round(w * ratio) * Math.round(h * ratio);
    if (totalPixels >= 33177600) return "8K";
    if (totalPixels >= 14745600) return "5K";
    if (totalPixels >= 8294400) return "4K UHD";
    if (totalPixels >= 4953600) return "Ultrawide 2K+";
    if (totalPixels >= 3686400) return "2K (QHD)";
    if (totalPixels >= 2073600) return "Full HD";
    if (totalPixels >= 1440000) return "HD+";
    if (totalPixels >= 921600) return "HD";
    return "Custom";
  };

  return (
    <div className="relative group">
      {/* Viền sáng tím tím mờ ảo phía sau */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
      
      <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl relative overflow-hidden h-full flex flex-col items-center">
        <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 relative">
          <Zap size={40} className="text-purple-500 relative z-10" />
        </div>

        <div className="flex items-center gap-3 mb-4">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-white">
            Thông Tin Màn Hình
          </h2>
          <button
            onClick={() => setMeasuringKey((prev) => prev + 1)}
            className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors group/btn cursor-pointer"
            title="Đo lại thông số"
          >
            <RotateCcw
              size={18}
              className="text-gray-300 group-hover/btn:rotate-180 transition-transform duration-500"
            />
          </button>
        </div>

        {screenInfo ? (
          <div className="flex flex-col gap-3 w-full mt-4 text-left bg-white/5 p-5 rounded-2xl flex-grow justify-center shadow-inner border border-white/5">
            {/* Chuẩn màn hình */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <span className="text-gray-400 text-sm font-medium">Chuẩn</span>
              <span className="text-white font-bold bg-white/10 px-2.5 py-0.5 rounded text-sm tracking-wide">
                {getResolutionStandard(screenInfo.width, screenInfo.height, screenInfo.pixelRatio)}
              </span>
            </div>

            {/* Độ phân giải vật lý */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3 pt-1">
              <span className="text-gray-400 text-sm font-medium">Vật lý (Thực)</span>
              <span className="text-white font-bold tracking-tight">
                {Math.round(screenInfo.width * screenInfo.pixelRatio)} × {Math.round(screenInfo.height * screenInfo.pixelRatio)}
              </span>
            </div>

            {/* Tần số quét */}
            <div className="flex justify-between items-center border-b border-white/10 pb-3 pt-1">
              <span className="text-gray-400 text-sm font-medium">Tần số quét</span>
              <div className="text-right">
                <span className="text-purple-400 font-black text-xl block leading-tight">
                  {screenInfo.hz} Hz
                </span>
                {screenInfo.hz !== screenInfo.rawHz && (
                  <span className="text-gray-500 text-[11px]">
                    Đo được: ~{screenInfo.rawHz} Hz
                  </span>
                )}
              </div>
            </div>

            {/* Tỉ lệ thu phóng */}
            <div className="flex justify-between items-center pt-1">
              <span className="text-gray-400 text-sm font-medium">Scale (Thu phóng)</span>
              <span className="text-white font-bold">
                {Math.round(100 * screenInfo.pixelRatio)}%
              </span>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center my-auto flex-grow gap-4 py-8">
            <div className="w-8 h-8 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
            <p className="text-gray-400 leading-relaxed max-w-sm animate-pulse text-sm">
              Đang phân tích màn hình...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ScreenTestContent() {
  const [isLcdActive, setIsLcdActive] = useState(false);
  const [isTouchActive, setIsTouchActive] = useState(false);
  const [patternIndex, setPatternIndex] = useState(0);

  // Kích hoạt Fullscreen cho bài test LCD
  const handleStartLcdTest = async () => {
    if (document.fullscreenElement) {
      if (document.exitFullscreen) {
        await document.exitFullscreen();
        setIsLcdActive(false);
      }
    } else {
      try {
        await document.documentElement.requestFullscreen();
        setIsLcdActive(true);
        setPatternIndex(0);
      } catch (_) {
        setIsLcdActive(true);
      }
    }
  };

  // Kích hoạt Fullscreen cho bài test Cảm ứng
  const handleStartTouchTest = async () => {
    if (document.fullscreenElement) {
      setIsTouchActive(true);
    } else {
      try {
        await document.documentElement.requestFullscreen();
        setIsTouchActive(true);
      } catch (_) {
        setIsTouchActive(true);
      }
    }
  };

  const nextPattern = useCallback(() => {
    setPatternIndex((prev) => (prev + 1) % LCD_PATTERNS.length);
  }, []);

  const prevPattern = useCallback(() => {
    setPatternIndex((prev) => (prev - 1 + LCD_PATTERNS.length) % LCD_PATTERNS.length);
  }, []);

  // Xử lý phím điều khiển khi ở chế độ Fullscreen LCD
  const handleKeyDown = useCallback(
    (e) => {
      if (!isLcdActive) return;

      if (e.key === "ArrowRight" || e.key === " " || e.key === "Enter") {
        nextPattern();
      } else if (e.key === "ArrowLeft") {
        prevPattern();
      } else if (e.key === "Escape") {
        setIsLcdActive(false);
        if (document.fullscreenElement && document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    },
    [isLcdActive, nextPattern, prevPattern]
  );

  // Lắng nghe thoát Fullscreen từ trình duyệt
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFull = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );

      if (!isFull) {
        setIsLcdActive(false);
        setIsTouchActive(false);
        document.body.style.overflow = "";
        window.scrollTo({ top: 0, behavior: "instant" });
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", handleFullscreenChange);
      document.removeEventListener("mozfullscreenchange", handleFullscreenChange);
      document.removeEventListener("MSFullscreenChange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  // Lock scroll khi ở chế độ LCD
  useEffect(() => {
    if (isLcdActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLcdActive]);

  // 1. MÀN HÌNH TEST LCD TOÀN MÀN HÌNH
  if (isLcdActive) {
    const currentPattern = LCD_PATTERNS[patternIndex];
    let customContent = null;
    const containerStyle = {
      cursor: "pointer",
      width: "100%",
      height: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      userSelect: "none",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 999999,
    };

    if (currentPattern.type === "color") {
      containerStyle.backgroundColor = currentPattern.hex;
      containerStyle.color = currentPattern.text;
    } else if (currentPattern.type === "gradient-bw") {
      containerStyle.background = "linear-gradient(to right, #000000, #FFFFFF)";
    } else if (currentPattern.type === "grid") {
      containerStyle.backgroundColor = "white";
      containerStyle.backgroundImage = `
        linear-gradient(to right, black 1px, transparent 1px),
        linear-gradient(to bottom, black 1px, transparent 1px)
      `;
      containerStyle.backgroundSize = "50px 50px";
    } else if (currentPattern.type === "text") {
      containerStyle.backgroundColor = "white";
      containerStyle.color = "black";
      customContent = (
        <div
          onClick={(e) => e.stopPropagation()}
          className="max-w-4xl px-4 sm:px-8 text-justify flex flex-col gap-4 sm:gap-6 bg-white p-6 sm:p-10 rounded-2xl shadow-2xl w-[90%] sm:w-auto max-h-[90vh] overflow-y-auto border border-gray-200"
        >
          <h4 className="text-base font-black text-gray-900 border-b pb-2 uppercase tracking-wide">
            Kiểm tra độ sắc nét và chống nhòe viền chữ
          </h4>
          <p style={{ fontSize: "10px" }} className="text-gray-800">
            Size 10px: The quick brown fox jumps over the lazy dog. Máy tính ZComputer chất lượng đỉnh cao.
          </p>
          <p style={{ fontSize: "12px" }} className="text-gray-800">
            Size 12px: The quick brown fox jumps over the lazy dog. Máy tính ZComputer chất lượng đỉnh cao.
          </p>
          <p style={{ fontSize: "14px", fontWeight: "bold" }} className="text-gray-900">
            Size 14px Bold: The quick brown fox jumps over the lazy dog.
          </p>
          <p style={{ fontSize: "18px" }} className="text-gray-800">
            Size 18px: Màn hình của bạn có bị nhòe hay mờ viền chữ không?
          </p>
          <p style={{ fontSize: "24px" }} className="text-gray-900 font-bold">
            Size 24px: Màn hình sắc nét giúp bảo vệ mắt khi làm việc lâu dài.
          </p>
        </div>
      );
    }

    return (
      <div style={containerStyle} onClick={nextPattern}>
        {customContent}

        {/* Floating Top Controls */}
        <div
          onClick={(e) => e.stopPropagation()}
          className="fixed top-4 right-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 z-50 text-white"
        >
          <span className="text-xs font-bold tracking-wider">
            {patternIndex + 1}/{LCD_PATTERNS.length} : {currentPattern.name}
          </span>
          <button
            onClick={() => {
              setIsLcdActive(false);
              if (document.fullscreenElement && document.exitFullscreen) {
                document.exitFullscreen();
              }
              window.scrollTo({ top: 0, behavior: "instant" });
            }}
            className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors cursor-pointer text-gray-300 hover:text-white"
            title="Thoát test (ESC)"
          >
            <X size={16} />
          </button>
        </div>

        {/* Floating Bottom Hint */}
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-xs text-gray-200 font-medium pointer-events-none z-50">
          Nhấp chuột hoặc phím Space/Mũi tên để đổi màu • ESC để thoát
        </div>
      </div>
    );
  }

  // 2. MÀN HÌNH TEST CẢM ỨNG
  if (isTouchActive) {
    return (
      <TouchTestMode
        onExit={() => {
          setIsTouchActive(false);
          if (document.fullscreenElement && document.exitFullscreen) {
            document.exitFullscreen();
          }
          window.scrollTo({ top: 0, behavior: "instant" });
        }}
      />
    );
  }

  // 3. MÀN HÌNH CHÍNH CÔNG CỤ TEST MÀN HÌNH
  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#eb1c24]/100 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Texture chuẩn Unsplash zcomputer.vn */}
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-[0.15] mix-blend-screen pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/90 to-[#050505] pointer-events-none" />

      {/* Hiệu ứng nền đỏ đỏ đen nháy nháy (Ambient Pulse Glowing Light) chuẩn zcomputer.vn */}
      <div className="absolute top-[20%] left-[5%] w-[40vw] h-[40vw] bg-[#eb1c24] rounded-full blur-[150px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-[10%] right-[10%] w-[30vw] h-[30vw] bg-orange-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-5xl py-12 relative z-10">
        {/* Nút Trở về */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-[#eb1c24] transition-colors bg-white/5 hover:bg-white/10 px-4 py-2 rounded-lg backdrop-blur border border-white/5 font-semibold text-sm cursor-pointer"
          >
            <ArrowLeft size={18} className="mr-2" /> Trở về
          </Link>
        </div>

        {/* Tiêu đề trang */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            Bộ Công Cụ Kiểm Tra
          </h1>
          <p className="text-gray-400 mt-4 max-w-xl mx-auto text-sm md:text-base leading-relaxed">
            Test độ chuẩn của màn hình LCD và độ nhạy của màn hình cảm ứng một cách chuyên nghiệp.
          </p>
        </div>

        {/* 3 Khối Card Chức Năng Chính */}
        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {/* Card 1: KIỂM TRA MÀN HÌNH (LCD) - Với viền sáng đỏ cam chuyển động */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-[#eb1c24] to-orange-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl relative overflow-hidden h-full flex flex-col items-center">
              <div className="w-24 h-24 bg-[#eb1c24]/10 rounded-full flex items-center justify-center mb-6 relative">
                <Monitor size={40} className="text-[#eb1c24] relative z-10" />
              </div>

              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 text-white">
                Kiểm Tra Màn Hình (LCD)
              </h2>
              <p className="text-gray-400 mb-10 leading-relaxed max-w-sm text-sm">
                Phát hiện điểm ảnh chết (Dead Pixel), hở sáng viền, méo hình và độ nhòe chữ nhanh chóng.
              </p>

              <button
                onClick={handleStartLcdTest}
                className="mt-auto w-full inline-flex items-center justify-center gap-3 bg-[#eb1c24] hover:bg-[#eb1c24]/90 text-white px-8 py-4 rounded-xl font-black transition-all shadow-[0_0_30px_rgba(235,28,36,0.3)] hover:-translate-y-1 uppercase tracking-wider cursor-pointer"
              >
                <Expand size={20} /> Bắt Đầu Test LCD
              </button>
            </div>
          </div>

          {/* Card 2: KIỂM TRA CẢM ỨNG (TOUCH) - Với viền sáng xanh dương */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            <div className="bg-[#0a0a0a]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl relative overflow-hidden h-full flex flex-col items-center">
              <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center mb-6 relative">
                <MousePointerClick size={40} className="text-blue-500 relative z-10" />
              </div>

              <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight mb-4 text-white">
                Kiểm Tra Cảm Ứng (Touch)
              </h2>
              <p className="text-gray-400 mb-10 leading-relaxed max-w-sm text-sm">
                Tìm ra điểm mù, điểm liệt cảm ứng trên toàn bộ bề mặt màn hình bằng bài test vuốt lưới ô vuông.
              </p>

              <button
                onClick={handleStartTouchTest}
                className="mt-auto w-full inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-xl font-black transition-all shadow-[0_0_30px_rgba(37,99,235,0.3)] hover:-translate-y-1 uppercase tracking-wider cursor-pointer"
              >
                <Expand size={20} /> Bắt Đầu Test Cảm Ứng
              </button>
            </div>
          </div>

          {/* Card 3: THÔNG TIN MÀN HÌNH */}
          <ScreenInfoCard />
        </div>

        {/* Khối Hướng Dẫn Chung */}
        <div className="mt-12 bg-[#111] border border-white/5 rounded-2xl p-6 md:p-8 text-left w-full max-w-4xl mx-auto shadow-inner">
          <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-base flex items-center gap-2">
            <CheckCircle2 size={20} className="text-[#eb1c24]" /> Hướng dẫn chung
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-400">
            <div className="flex flex-col gap-5">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#eb1c24] mt-1.5 shrink-0" />
                <p>
                  <strong className="text-gray-200">Lau sạch màn hình</strong> trước khi test để tránh nhầm bụi với điểm chết.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-[#eb1c24] mt-1.5 shrink-0" />
                <p>
                  <strong className="text-gray-200">Trong bài test LCD:</strong> Click chuột hoặc dùng Phím mũi tên để chuyển màu.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                <p>
                  <strong className="text-gray-200">Trong bài test Cảm Ứng:</strong> Vuốt sao cho toàn bộ các ô vuông chuyển sang màu đỏ.
                </p>
              </div>
              <div className="flex gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mt-1.5 shrink-0" />
                <p>
                  <strong className="text-gray-200">Phím ESC</strong> luôn là nút thần thánh để thoát chế độ test bất kỳ lúc nào.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
