"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Zap, User, Search, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { signOut } from "next-auth/react";

export default function TopNav({ user, setSidebarOpen }) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const topLinks = [
    { name: "Inventory", href: "/stock" },
    { name: "Leads", href: "/enquiries" },
    { name: "Sales", href: "/sales" },
    { name: "Analytics", href: "/market" },
  ];

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-50 sticky top-0">
      
      {/* Mobile Menu & Brand */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(prev => !prev)}
          className="lg:hidden p-2 text-slate-500 hover:text-slate-900 bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="font-bold text-lg text-[#0f4098] tracking-tight whitespace-nowrap hidden sm:block">
          MOTIO
        </div>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          placeholder="Search leads, brands, data..." 
          className="w-full bg-slate-100 border-none rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-slate-700 placeholder-slate-400"
        />
      </div>

      {/* Right Navigation */}
      <div className="flex items-center gap-6">
        <nav className="hidden lg:flex gap-6">
          {topLinks.map((link) => {
             // For exact match on path (except special cases like /enquiries mapping to Leads)
             const isActive = pathname.startsWith(link.href);
             return (
               <Link 
                 key={link.name} 
                 href={link.href}
                 className={clsx(
                   "text-sm font-semibold transition-colors relative py-2",
                   isActive ? "text-[#0f4098]" : "text-slate-500 hover:text-slate-900"
                 )}
               >
                 {link.name}
                 {isActive && (
                   <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0f4098] rounded-t-full" />
                 )}
               </Link>
             );
          })}
        </nav>
        
        {/* Action Icons */}
        <div className="flex items-center gap-4 border-l border-slate-200 pl-6">
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Bell className="w-5 h-5" />
          </button>
          <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <Zap className="w-5 h-5" />
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-slate-100 mb-2">
                  <p className="text-sm font-semibold text-slate-900">{user?.name || "CRM Admin"}</p>
                </div>
                <button 
                  onClick={() => signOut()}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
