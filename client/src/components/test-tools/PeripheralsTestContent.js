"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Video,
  Mic,
  Volume2,
  Headphones,
  Zap,
  Camera,
  Info,
  Activity,
  AlertCircle,
  Square,
  Circle,
  Download,
  RefreshCw,
  Play,
} from "lucide-react";

export default function PeripheralsTestContent() {
  // === WEBCAM STATES ===
  const videoRef = useRef(null);
  const canvasSnapshotRef = useRef(null);
  const [webcamStream, setWebcamStream] = useState(null);
  const [webcamError, setWebcamError] = useState("");
  const [webcamInfo, setWebcamInfo] = useState(null);
  const [snapshotUrl, setSnapshotUrl] = useState("");

  // === MICROPHONE STATES ===
  const [micStream, setMicStream] = useState(null);
  const [micError, setMicError] = useState("");
  const [micInfo, setMicInfo] = useState(null);
  const [micVolume, setMicVolume] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState("");
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const micAudioCtxRef = useRef(null);
  const micSourceRef = useRef(null);
  const micAnalyserRef = useRef(null);
  const micAnimFrameRef = useRef(0);
  const spectrumCanvasRef = useRef(null);
  const volumeTextRef = useRef(null);

  // === SPEAKER / AUDIO TEST STATES ===
  const [activeSpeakerMode, setActiveSpeakerMode] = useState("none"); // "none" | "left" | "right" | "both"
  const speakerAudioCtxRef = useRef(null);
  const speakerOscRef = useRef(null);
  const speakerPannerRef = useRef(null);

  const webcamStreamRef = useRef(null);
  const micStreamRef = useRef(null);

  // -------------------------------------------------------------
  // 1. WEBCAM HANDLERS
  // -------------------------------------------------------------
  const handleStartWebcam = async () => {
    try {
      setWebcamError("");
      setSnapshotUrl("");

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 1920 }, height: { ideal: 1080 } },
      });

      setWebcamStream(stream);
      webcamStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      const videoTrack = stream.getVideoTracks()[0];
      if (videoTrack) {
        const settings = videoTrack.getSettings();
        setWebcamInfo({
          name: videoTrack.label || "Webcam mặc định",
          resolution:
            settings.width && settings.height
              ? `${settings.width} x ${settings.height}`
              : "Không xác định",
          frameRate: settings.frameRate
            ? `${Math.round(settings.frameRate)} FPS`
            : "Không xác định",
          aspectRatio: settings.aspectRatio
            ? settings.aspectRatio.toFixed(2)
            : "Không xác định",
          facingMode:
            settings.facingMode === "user"
              ? "Camera trước"
              : settings.facingMode === "environment"
                ? "Camera sau"
                : "Không xác định",
        });
      }
    } catch (err) {
      let msg = err.message || "Không thể truy cập Webcam.";
      if (err.name === "NotAllowedError" || msg.toLowerCase().includes("permission denied")) {
        msg = "Trình duyệt đang chặn quyền. Vui lòng cho phép truy cập Camera để tiếp tục.";
      } else if (
        err.name === "NotFoundError" ||
        msg.toLowerCase().includes("requested device not found")
      ) {
        msg = "Không tìm thấy Camera nào được kết nối với thiết bị này.";
      } else if (
        err.name === "NotReadableError" ||
        msg.toLowerCase().includes("could not start video source")
      ) {
        msg = "Camera đang bị ứng dụng khác sử dụng. Vui lòng tắt ứng dụng đó và thử lại.";
      }
      setWebcamError(msg);
      setWebcamInfo(null);
    }
  };

  const handleStopWebcam = () => {
    if (webcamStreamRef.current) {
      webcamStreamRef.current.getTracks().forEach((track) => track.stop());
      webcamStreamRef.current = null;
    }
    setWebcamStream(null);
  };

  const handleTakeSnapshot = () => {
    if (videoRef.current && canvasSnapshotRef.current) {
      const video = videoRef.current;
      const canvas = canvasSnapshotRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        // Lật ảnh gương để giống hệt như preview
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setSnapshotUrl(canvas.toDataURL("image/png"));
      }
    }
  };

  // -------------------------------------------------------------
  // 2. MICROPHONE HANDLERS
  // -------------------------------------------------------------
  const handleStartMic = async () => {
    try {
      setMicError("");

      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }
      micAudioCtxRef.current = audioCtx;

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: false,
          autoGainControl: true,
        },
      });

      if (audioCtx.state === "suspended") {
        await audioCtx.resume();
      }

      setMicStream(stream);
      micStreamRef.current = stream;

      const audioTrack = stream.getAudioTracks()[0];
      if (audioTrack) {
        const settings = audioTrack.getSettings ? audioTrack.getSettings() : {};
        setMicInfo({
          name: audioTrack.label || "Default - Microphone Array",
          channelCount: settings.channelCount || 1,
          sampleRate: settings.sampleRate ? `${settings.sampleRate} Hz` : "48000 Hz",
          echoCancellation: "Có",
          noiseSuppression: "Có",
          autoGainControl: "Có",
        });
      }

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.75;
      micAnalyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      micSourceRef.current = source; // Ngăn V8 Garbage Collector thu hồi source node

      // Silent gain node để Chromium audio engine luôn pull data
      const silentGain = audioCtx.createGain();
      silentGain.gain.value = 0;
      analyser.connect(silentGain);
      silentGain.connect(audioCtx.destination);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      const renderSpectrum = () => {
        if (!micAudioCtxRef.current || micAudioCtxRef.current.state === "closed") return;

        analyser.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < dataArray.length; i++) {
          sum += dataArray[i];
        }

        if (volumeTextRef.current) {
          const avg = sum / dataArray.length;
          const percent = Math.min(100, Math.round((avg / 128) * 100));
          volumeTextRef.current.innerText = `${percent}%`;
        }

        if (spectrumCanvasRef.current) {
          const canvas = spectrumCanvasRef.current;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            const w = canvas.width;
            const h = canvas.height;
            ctx.clearRect(0, 0, w, h);

            const barCount = Math.floor(dataArray.length * 0.7);
            const barWidth = w / barCount - 1;
            let x = 0;

            for (let i = 0; i < barCount; i++) {
              const val = dataArray[i];
              const barHeight = Math.max(2, (val / 255) * h);
              const hue = (i / barCount) * 240;
              ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
              ctx.beginPath();
              if (ctx.roundRect) {
                ctx.roundRect(x, h - barHeight, Math.max(1, barWidth), barHeight, [2, 2, 0, 0]);
              } else {
                ctx.rect(x, h - barHeight, Math.max(1, barWidth), barHeight);
              }
              ctx.fill();
              x += barWidth + 1;
            }
          }
        }

        micAnimFrameRef.current = requestAnimationFrame(renderSpectrum);
      };

      micAnimFrameRef.current = requestAnimationFrame(renderSpectrum);
    } catch (err) {
      let msg = err.message || "Không thể truy cập Micro.";
      if (err.name === "NotAllowedError" || msg.toLowerCase().includes("permission denied")) {
        msg = "Trình duyệt đang chặn quyền. Vui lòng cho phép truy cập Micro để tiếp tục.";
      } else if (
        err.name === "NotFoundError" ||
        msg.toLowerCase().includes("requested device not found")
      ) {
        msg = "Không tìm thấy Micro nào được kết nối với thiết bị này.";
      } else if (
        err.name === "NotReadableError" ||
        msg.toLowerCase().includes("could not start audio source")
      ) {
        msg = "Micro đang bị ứng dụng khác sử dụng. Vui lòng tắt ứng dụng đó và thử lại.";
      }
      setMicError(msg);
      setMicInfo(null);
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      try {
        mediaRecorderRef.current.stop();
      } catch (_) {}
    }
    setIsRecording(false);
  };

  const handleToggleRecord = () => {
    if (!micStream) return;

    if (isRecording) {
      handleStopRecording();
    } else {
      audioChunksRef.current = [];
      setRecordedAudioUrl("");
      try {
        let options = {};
        if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported) {
          if (MediaRecorder.isTypeSupported("audio/webm;codecs=opus")) {
            options = { mimeType: "audio/webm;codecs=opus" };
          } else if (MediaRecorder.isTypeSupported("audio/webm")) {
            options = { mimeType: "audio/webm" };
          } else if (MediaRecorder.isTypeSupported("audio/mp4")) {
            options = { mimeType: "audio/mp4" };
          }
        }

        const recorder = options.mimeType
          ? new MediaRecorder(micStream, options)
          : new MediaRecorder(micStream);
        mediaRecorderRef.current = recorder;

        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) {
            audioChunksRef.current.push(e.data);
          }
        };

        recorder.onstop = () => {
          const type = recorder.mimeType || options.mimeType || "audio/webm";
          const audioBlob = new Blob(audioChunksRef.current, { type });
          const url = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(url);
        };

        recorder.start(100);
        setIsRecording(true);
      } catch (e) {
        console.error("Lỗi khởi tạo MediaRecorder:", e);
      }
    }
  };

  const handleStopMic = () => {
    if (isRecording) {
      handleStopRecording();
    }
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((track) => track.stop());
      micStreamRef.current = null;
    }
    setMicStream(null);
    if (micSourceRef.current) {
      try {
        micSourceRef.current.disconnect();
      } catch (_) {}
      micSourceRef.current = null;
    }
    if (micAnalyserRef.current) {
      try {
        micAnalyserRef.current.disconnect();
      } catch (_) {}
      micAnalyserRef.current = null;
    }
    if (micAudioCtxRef.current && micAudioCtxRef.current.state !== "closed") {
      try {
        micAudioCtxRef.current.close();
      } catch (_) {}
      micAudioCtxRef.current = null;
    }
    if (micAnimFrameRef.current) {
      cancelAnimationFrame(micAnimFrameRef.current);
      micAnimFrameRef.current = 0;
    }
    setMicVolume(0);
    if (volumeTextRef.current) {
      volumeTextRef.current.innerText = "0%";
    }
  };

  // -------------------------------------------------------------
  // 3. SPEAKER / STEREO TEST HANDLERS
  // -------------------------------------------------------------
  const handleStopSpeaker = () => {
    if (speakerOscRef.current) {
      try {
        speakerOscRef.current.stop();
        speakerOscRef.current.disconnect();
      } catch (_) {}
    }
    if (speakerAudioCtxRef.current && speakerAudioCtxRef.current.state !== "closed") {
      try {
        speakerAudioCtxRef.current.close();
      } catch (_) {}
    }
    setActiveSpeakerMode("none");
  };

  const handlePlaySpeaker = (mode) => {
    if (activeSpeakerMode !== "none") {
      handleStopSpeaker();
    }

    try {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      const audioCtx = new AudioCtxClass();
      speakerAudioCtxRef.current = audioCtx;

      const osc = audioCtx.createOscillator();
      osc.type = "sine";
      osc.frequency.setValueAtTime(440, audioCtx.currentTime); // Nốt La A4 (440Hz) chuẩn

      // Hỗ trợ StereoPannerNode
      if (audioCtx.createStereoPanner) {
        const panner = audioCtx.createStereoPanner();
        if (mode === "left") panner.pan.value = -1;
        else if (mode === "right") panner.pan.value = 1;
        else panner.pan.value = 0;

        osc.connect(panner);
        panner.connect(audioCtx.destination);
        speakerPannerRef.current = panner;
      } else {
        osc.connect(audioCtx.destination);
      }

      osc.start();
      speakerOscRef.current = osc;
      setActiveSpeakerMode(mode);
    } catch (e) {
      console.error("Lỗi phát âm thanh loa:", e);
    }
  };

  // Gán stream cho video element khi có cập nhật
  useEffect(() => {
    if (videoRef.current && webcamStream) {
      videoRef.current.srcObject = webcamStream;
    }
  }, [webcamStream]);

  // Cleanup DUY NHẤT khi người dùng rời khỏi trang
  useEffect(() => {
    return () => {
      handleStopWebcam();
      handleStopMic();
      handleStopSpeaker();
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#eb1c24]/100 selection:text-white font-sans relative overflow-x-hidden">
      {/* Background Ambient Lights */}
      <div className="absolute top-[10%] left-[10%] w-[30vw] h-[30vw] bg-[#eb1c24] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[10%] w-[30vw] h-[30vw] bg-orange-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-[1400px] py-12 relative z-10">
        {/* Header Bar */}
        <div className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-white/10 pb-6">
          <Link
            href="/"
            className="inline-flex items-center text-gray-400 hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10 hover:bg-white/10 text-sm font-bold tracking-widest uppercase cursor-pointer"
          >
            <ArrowLeft size={16} className="mr-2" /> Trở về
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Zap size={24} className="text-[#eb1c24]" />
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                TEST <span className="text-[#eb1c24]">THIẾT BỊ NGOẠI VI</span>
              </h1>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {/* ========================================================= */}
          {/* 1. KHU VỰC TEST WEBCAM */}
          {/* ========================================================= */}
          <div className="bg-[#0a0c10] border border-[#1e2430] rounded-[24px] p-6 shadow-2xl backdrop-blur-xl flex flex-col xl:flex-row gap-8">
            {/* Cột Trái: Video Preview */}
            <div className="flex-[5] flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-[#eb1c24]/20 flex items-center justify-center">
                  <Video size={20} className="text-[#eb1c24]" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                    Khu Vực Test Webcam
                  </h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                    Hiển thị thời gian thực
                  </p>
                </div>
              </div>

              <div className="bg-black/60 rounded-2xl overflow-hidden min-h-[380px] xl:min-h-[480px] border border-white/5 shadow-inner relative flex items-center justify-center">
                {webcamStream ? (
                  <>
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      style={{ transform: "scaleX(-1)" }}
                      className="w-full h-full object-cover absolute inset-0"
                    />
                    <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md text-[#eb1c24] text-xs font-black uppercase tracking-widest px-4 py-2 rounded-lg flex items-center gap-2 border border-[#eb1c24]/50 z-20">
                      <div className="w-2 h-2 rounded-full bg-[#eb1c24] animate-pulse shadow-[0_0_10px_rgba(235,28,36,0.8)]" />
                      Đang ghi hình
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 text-center">
                    <Camera size={64} className="text-white/10 mb-6" />
                    <button
                      onClick={handleStartWebcam}
                      className="bg-[#eb1c24] hover:bg-[#eb1c24]/90 text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(235,28,36,0.4)] hover:-translate-y-1 cursor-pointer"
                    >
                      <Video size={20} /> Kiểm tra Webcam của tôi
                    </button>
                    {webcamError && (
                      <p className="text-[#eb1c24] text-sm mt-6 flex items-center justify-center gap-2 bg-[#eb1c24]/10 px-4 py-2 rounded-lg border border-[#eb1c24]/50">
                        <AlertCircle size={16} /> {webcamError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cột Phải: Thông Tin Webcam & Chụp Ảnh */}
            <div className="flex-[3] flex flex-col gap-6">
              <div className="bg-[#11141a] rounded-2xl p-6 border border-white/5">
                <h3 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-2 text-white">
                  <Info size={18} className="text-gray-400" /> Thông tin Webcam
                </h3>

                {webcamInfo ? (
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Tên thiết bị</td>
                        <td className="py-3 text-right font-bold text-white max-w-[180px] truncate" title={webcamInfo.name}>
                          {webcamInfo.name}
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Độ phân giải</td>
                        <td className="py-3 text-right font-bold text-white">
                          {webcamInfo.resolution}
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Tốc độ khung hình</td>
                        <td className="py-3 text-right font-bold text-white">
                          {webcamInfo.frameRate}
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Tỷ lệ khung hình</td>
                        <td className="py-3 text-right font-bold text-white">
                          {webcamInfo.aspectRatio}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-500 font-medium">Vị trí Camera</td>
                        <td className="py-3 text-right font-bold text-white">
                          {webcamInfo.facingMode}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center text-gray-600 font-medium text-sm">
                    Thông tin sẽ hiển thị khi bạn bật Webcam
                  </div>
                )}
              </div>

              {webcamStream && (
                <div className="flex flex-col gap-3">
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={handleTakeSnapshot}
                      className="bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Camera size={18} /> Chụp ảnh
                    </button>
                    <button
                      onClick={handleStopWebcam}
                      className="bg-white/5 hover:bg-[#eb1c24]/10 border border-white/10 hover:border-[#eb1c24]/50 text-white hover:text-[#eb1c24] p-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      <Square size={18} /> Dừng Camera
                    </button>
                  </div>

                  <canvas ref={canvasSnapshotRef} className="hidden" />

                  {snapshotUrl && (
                    <div className="mt-2 relative rounded-xl border border-white/10 overflow-hidden bg-black/50 p-2">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={snapshotUrl} alt="Snapshot" className="w-full rounded-lg" />
                      <a
                        href={snapshotUrl}
                        download="webcam-snapshot.png"
                        className="absolute bottom-4 right-4 bg-[#eb1c24] hover:bg-[#eb1c24]/90 text-white px-4 py-2 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-lg cursor-pointer"
                      >
                        <Download size={14} /> Tải Xuống
                      </a>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* ========================================================= */}
          {/* 2. KHU VỰC TEST MICRO */}
          {/* ========================================================= */}
          <div className="bg-[#0a0c10] border border-[#1e2430] rounded-[24px] p-6 shadow-2xl backdrop-blur-xl flex flex-col xl:flex-row gap-8">
            {/* Cột Trái: Audio Visualizer & Record */}
            <div className="flex-[5] flex flex-col gap-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                  <Mic size={20} className="text-orange-500" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                    Khu Vực Test Micro
                  </h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                    Phân tích cường độ âm thanh
                  </p>
                </div>
              </div>

              <div className="bg-black/60 rounded-2xl overflow-hidden min-h-[300px] border border-white/5 shadow-inner relative flex flex-col items-center justify-center p-8">
                {micStream ? (
                  <div className="w-full max-w-2xl flex flex-col items-center gap-6">
                    <div className="w-full">
                      <div className="flex justify-between items-end mb-3">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                          Biểu đồ tần số âm thanh
                        </span>
                        <span ref={volumeTextRef} className="text-xl font-black text-white">
                          {Math.min(100, Math.round((micVolume / 128) * 100))}%
                        </span>
                      </div>
                      <div className="w-full h-32 bg-[#050505] rounded-2xl overflow-hidden border border-white/10 shadow-inner relative flex items-end justify-center p-2">
                        <canvas
                          ref={spectrumCanvasRef}
                          width={600}
                          height={120}
                          className="w-full h-full"
                        />
                      </div>
                    </div>

                    <div className="flex gap-4 w-full">
                      <button
                        onClick={handleToggleRecord}
                        className={`flex-1 py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-3 transition-all duration-300 border cursor-pointer ${isRecording
                            ? "bg-[#eb1c24] border-[#eb1c24]/50 text-white shadow-[0_0_30px_rgba(235,28,36,0.4)] animate-pulse"
                            : "bg-white/5 border-white/10 hover:bg-white/10 text-white"
                          }`}
                      >
                        {isRecording ? (
                          <Square size={18} />
                        ) : (
                          <Circle size={18} fill="currentColor" />
                        )}
                        {isRecording ? "Dừng Ghi Âm" : "Bắt Đầu Ghi Âm"}
                      </button>

                      <button
                        onClick={handleStopMic}
                        className="px-6 py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-white/5 border border-white/10 hover:bg-[#eb1c24]/10 hover:text-[#eb1c24] transition-all text-gray-300 cursor-pointer"
                      >
                        <RefreshCw size={18} /> Tắt Mic
                      </button>
                    </div>

                    {recordedAudioUrl && (
                      <div className="w-full bg-[#111] p-4 rounded-xl border border-white/10 mt-2">
                        <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">
                          Bản ghi gần nhất
                        </p>
                        <audio src={recordedAudioUrl} controls className="w-full h-12 rounded-lg custom-audio" />
                        <style jsx>{`
                          .custom-audio::-webkit-media-controls-panel {
                            background-color: #1a1a1a;
                          }
                          .custom-audio::-webkit-media-controls-current-time-display {
                            color: #fff;
                          }
                          .custom-audio::-webkit-media-controls-time-remaining-display {
                            color: #fff;
                          }
                        `}</style>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center text-center">
                    <Mic size={64} className="text-white/10 mb-6" />
                    <button
                      onClick={handleStartMic}
                      className="bg-orange-600 hover:bg-orange-500 text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider flex items-center gap-3 transition-all shadow-[0_0_20px_rgba(249,115,22,0.4)] hover:-translate-y-1 cursor-pointer"
                    >
                      <Mic size={20} /> Kiểm tra Micro của tôi
                    </button>
                    {micError && (
                      <p className="text-[#eb1c24] text-sm mt-6 flex items-center justify-center gap-2 bg-[#eb1c24]/10 px-4 py-2 rounded-lg border border-[#eb1c24]/50">
                        <AlertCircle size={16} /> {micError}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Cột Phải: Thông Tin Micro */}
            <div className="flex-[3] flex flex-col gap-6">
              <div className="bg-[#11141a] rounded-2xl p-6 border border-white/5 flex-1">
                <h3 className="text-lg font-black uppercase tracking-wider mb-4 flex items-center gap-2 text-white">
                  <Activity size={18} className="text-gray-400" /> Thông tin Micro
                </h3>

                {micInfo ? (
                  <table className="w-full text-sm">
                    <tbody>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Tên thiết bị</td>
                        <td
                          title={micInfo.name}
                          className="py-3 text-right font-bold text-white max-w-[180px] truncate"
                        >
                          {micInfo.name}
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Sample Rate</td>
                        <td className="py-3 text-right font-bold text-white">
                          {micInfo.sampleRate}
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Số Kênh (Channels)</td>
                        <td className="py-3 text-right font-bold text-white">
                          {micInfo.channelCount}
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Lọc tiếng vang</td>
                        <td className="py-3 text-right font-bold text-green-400">
                          {micInfo.echoCancellation}
                        </td>
                      </tr>
                      <tr className="border-b border-white/5">
                        <td className="py-3 text-gray-500 font-medium">Giảm tiếng ồn</td>
                        <td className="py-3 text-right font-bold text-green-400">
                          {micInfo.noiseSuppression}
                        </td>
                      </tr>
                      <tr>
                        <td className="py-3 text-gray-500 font-medium">Tự động khuếch đại</td>
                        <td className="py-3 text-right font-bold text-green-400">
                          {micInfo.autoGainControl}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                ) : (
                  <div className="py-12 text-center text-gray-600 font-medium text-sm">
                    Thông tin sẽ hiển thị khi bạn bật Micro
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ========================================================= */}
          {/* 3. KHU VỰC TEST LOA / TAI NGHE */}
          {/* ========================================================= */}
          <div className="bg-[#0a0c10] border border-[#1e2430] rounded-[24px] p-6 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 flex items-center justify-center">
                <Headphones size={20} className="text-pink-500" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">
                  Kiểm tra Loa / Tai nghe
                </h2>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                  Test tách kênh Stereo Trái/Phải
                </p>
              </div>
            </div>

            <div className="bg-black/60 rounded-2xl p-8 border border-white/5 shadow-inner">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                {/* Loa Trái */}
                <button
                  onClick={() =>
                    activeSpeakerMode === "left"
                      ? handleStopSpeaker()
                      : handlePlaySpeaker("left")
                  }
                  className={`py-8 rounded-2xl font-bold flex flex-col items-center justify-center gap-4 transition-all duration-300 border cursor-pointer ${activeSpeakerMode === "left"
                      ? "bg-[#eb1c24] border-[#eb1c24]/50 text-white shadow-[0_0_40px_rgba(235,28,36,0.4)] scale-[1.02]"
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-white"
                    }`}
                >
                  <Volume2
                    size={40}
                    className={activeSpeakerMode === "left" ? "animate-pulse" : ""}
                  />
                  <div className="text-center">
                    <span className="block text-xl uppercase tracking-widest font-black mb-1">
                      Loa Trái
                    </span>
                    <span className="text-xs font-medium opacity-70">Left Channel (L)</span>
                  </div>
                </button>

                {/* Loa Phải */}
                <button
                  onClick={() =>
                    activeSpeakerMode === "right"
                      ? handleStopSpeaker()
                      : handlePlaySpeaker("right")
                  }
                  className={`py-8 rounded-2xl font-bold flex flex-col items-center justify-center gap-4 transition-all duration-300 border cursor-pointer ${activeSpeakerMode === "right"
                      ? "bg-[#eb1c24] border-[#eb1c24]/50 text-white shadow-[0_0_40px_rgba(235,28,36,0.4)] scale-[1.02]"
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-gray-400 hover:text-white"
                    }`}
                >
                  <Volume2
                    size={40}
                    className={activeSpeakerMode === "right" ? "animate-pulse" : ""}
                  />
                  <div className="text-center">
                    <span className="block text-xl uppercase tracking-widest font-black mb-1">
                      Loa Phải
                    </span>
                    <span className="text-xs font-medium opacity-70">Right Channel (R)</span>
                  </div>
                </button>
              </div>

              {/* Phát Cả 2 Kênh */}
              <div className="mt-6 flex justify-center">
                <button
                  onClick={() =>
                    activeSpeakerMode === "both"
                      ? handleStopSpeaker()
                      : handlePlaySpeaker("both")
                  }
                  className={`px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 uppercase tracking-widest text-sm border cursor-pointer ${activeSpeakerMode === "both"
                      ? "bg-white/20 border-white/40 text-white shadow-lg"
                      : "bg-transparent border-white/20 hover:bg-white/10 text-gray-300 hover:text-white"
                    }`}
                >
                  {activeSpeakerMode === "both" ? <Square size={18} /> : <Play size={18} />}
                  {activeSpeakerMode === "both" ? "Dừng Phát" : "Phát Cả 2 Kênh Âm Thanh"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
