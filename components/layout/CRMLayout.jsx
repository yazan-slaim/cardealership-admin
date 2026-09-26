"use client";
import { useState } from "react";
import Sidebar from "./Sidebar";
import TopNav from "./TopNav";

export default function CRMLayout({ children, user, dealership }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-[#0a0a0a] text-gray-900 dark:text-white font-sans transition-colors duration-200">
      <Sidebar user={user} dealership={dealership} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex flex-col flex-1 overflow-hidden relative min-w-0">
        <TopNav user={user} dealership={dealership} setSidebarOpen={setSidebarOpen} />
        <main id="main-content-scroll" className="flex-1 overflow-y-auto p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
