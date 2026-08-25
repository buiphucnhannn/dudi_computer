"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";
import AdminRouteGuard from "@/components/admin/AdminRouteGuard";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <AdminRouteGuard>
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
          <main className="flex-1 pt-16 p-4 sm:p-6 lg:p-8 bg-slate-50 w-full min-h-[calc(100vh-64px)]">
            {children}
          </main>
        </div>
      </div>
    </AdminRouteGuard>
  );
}

