"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function CRMLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-slate-50 text-slate-900">
      <TopNav user={user} setSidebarOpen={setSidebarOpen} />
      <div className="flex flex-1 overflow-hidden relative">
        <Sidebar user={user} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
        <main id="main-content-scroll" className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
