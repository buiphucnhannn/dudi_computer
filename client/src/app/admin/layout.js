"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 overflow-x-hidden">
      {/* Sidebar */}
      <AdminSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Container */}
      <div className="flex min-h-screen flex-col lg:pl-[280px]">
        {/* Header */}
        <AdminHeader
          onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        />

        {/* Main Content Area */}
        <main className="flex-1 pt-16">{children}</main>
      </div>
    </div>
  );
}
