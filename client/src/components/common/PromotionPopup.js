"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function PromotionPopup() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setOpen(true);
        }, 300);

        return () => clearTimeout(timer);
    }, []);

    if (!open) {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-fadeIn"
            onClick={() => setOpen(false)}
        >
            <div
                className="relative w-full max-w-[760px] sm:max-w-[800px]"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="absolute -right-2 -top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl font-bold text-[#dc2626] shadow-md transition hover:bg-[#dc2626] hover:text-white cursor-pointer"
                    aria-label="Đóng"
                >
                    ×
                </button>

                {/* Banner Link to Student Promotion */}
                <Link
                    href="/student-promotion"
                    onClick={() => setOpen(false)}
                    className="block overflow-hidden rounded-xl shadow-2xl transition-transform duration-300 hover:scale-[1.01] cursor-pointer"
                >
                    <img
                        src="/back-to-school-popup.webp"
                        alt="Back to School - Ưu đãi học sinh sinh viên"
                        className="block h-auto max-h-[85vh] w-full object-contain"
                    />
                </Link>
            </div>
        </div>
    );
}