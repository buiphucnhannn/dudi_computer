"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminHeader from "@/components/admin/AdminHeader";

export const metadata = {
  title: "Admin Dashboard | DUDI SOFTWARE",
};

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Container */}
      <div className="pl-[280px]">
        {/* Header */}
        <AdminHeader />

        {/* Main Content Area */}
        <main className="min-h-screen pt-16">{children}</main>
      </div>
    </div>
  );
}
