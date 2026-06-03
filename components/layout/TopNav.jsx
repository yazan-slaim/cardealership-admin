"use client";
import { useState, useRef, useEffect, useTransition } from "react";
import Link from "next/link";
import { Bell, Zap, User, ScanBarcode, Plus, LogOut, Globe, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import DataIngestionModal from "../inventory/DataIngestionModal";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import { useTranslations, useLocale } from "next-intl";
import { setLocale } from "@/app/actions/locale";

export default function TopNav({ user, setSidebarOpen }) {
  const pathname = usePathname();
  const t = useTranslations("TopNav");
  const sidebarT = useTranslations("Sidebar");
  const locale = useLocale();
  const [isPending, startTransition] = useTransition();
  const [modalOpen, setModalOpen] = useState(false);
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

  const links = [
    { name: sidebarT("Active Inventory"), href: "/stock" },
    { name: sidebarT("Lead Pipeline"), href: "/enquiries" },
    { name: sidebarT("Market Data"), href: "/market" },
  ];

  const handleLanguageToggle = () => {
    const nextLocale = locale === "en" ? "ar" : "en";
    startTransition(async () => {
      await setLocale(nextLocale);
      window.location.reload();
    });
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-6 shrink-0 z-50 relative">
        <div className="flex items-center gap-2 md:gap-8">
          <button 
            onClick={() => setSidebarOpen(prev => !prev)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <div className="font-bold text-base md:text-lg text-blue-900 tracking-tight flex items-center">
            {t("Brand")}
          </div>
          <nav className="hidden md:flex gap-6">
            {links.map((link) => {
               const isActive = pathname.startsWith(link.href);
               return (
                 <Link 
                   key={link.name} 
                   href={link.href}
                   className={clsx(
                     "text-sm font-medium transition-colors hover:text-slate-900",
                     isActive ? "text-slate-900" : "text-slate-500"
                   )}
                 >
                   {link.name}
                 </Link>
               );
            })}
          </nav>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <Link 
            href="/stock/post-product"
            className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg p-2 sm:px-4 sm:py-2 font-semibold text-sm flex items-center gap-2 transition-colors"
            title={t("Post Car")}
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">{t("Post Car")}</span>
          </Link>
          <button 
            onClick={() => setModalOpen(true)}
            className="bg-blue-900 hover:bg-blue-800 text-white rounded-lg p-2 sm:px-4 sm:py-2 font-semibold text-sm flex items-center gap-2 transition-colors"
            title={t("Scan VIN")}
          >
            <ScanBarcode className="w-4 h-4" />
            <span className="hidden sm:inline">{t("Scan VIN")}</span>
          </button>
          
          <button 
            onClick={handleLanguageToggle}
            disabled={isPending}
            className="relative text-slate-500 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-full transition-colors flex items-center gap-2 text-sm font-bold uppercase disabled:opacity-50"
          >
            <Globe className="w-5 h-5" />
            {locale === "en" ? "عربي" : "EN"}
          </button>

          <button className="relative text-slate-500 hover:text-slate-900 hover:bg-slate-100 p-2 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 flex flex-col">
                <div className="px-4 py-2 border-b border-slate-100 mb-2">
                  <p className="text-sm font-semibold text-slate-900">{user?.name || t("CRM Admin")}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email || "admin@precision.com"}</p>
                </div>
                
                <button 
                  onClick={() => signOut()}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                >
                  <LogOut className="w-4 h-4" /> {t("Sign Out")}
                </button>
              </div>
            )}
          </div>
        </div>
      </header>
      
      <DataIngestionModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
