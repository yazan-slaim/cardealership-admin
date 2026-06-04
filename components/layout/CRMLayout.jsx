"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function CRMLayout({ children, user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900 font-sans">
      <Sidebar user={user} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden relative min-w-0">
        <TopNav user={user} setSidebarOpen={setSidebarOpen} />
        <main id="main-content-scroll" className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
