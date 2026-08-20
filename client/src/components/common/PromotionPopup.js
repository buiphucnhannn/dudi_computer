"use client";

import { useEffect, useState } from "react";

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
            className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setOpen(false)}
        >
            <div
                className="relative w-full max-w-[760px] sm:max-w-[800px]"
                onClick={(event) => event.stopPropagation()}
            >
                <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="absolute right-2 top-2 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white text-xl font-bold text-[#dc2626] shadow-md transition hover:bg-[#dc2626] hover:text-white"
                    aria-label="Đóng"
                >
                    ×
                </button>

                {/* Banner */}
                <div className="overflow-hidden rounded-xl shadow-2xl">
                    <img
                        src="/back-to-school-popup.webp"
                        alt="Back to School"
                        className="block h-auto max-h-[85vh] w-full object-contain"
                    />
                </div>
            </div>
        </div>
    );
}