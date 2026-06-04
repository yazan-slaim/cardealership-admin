"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Car, Users, PlusCircle, Bookmark, Star,
  MessageSquare, Briefcase, TrendingUp, Search,
  Globe, Database, Shield, Settings, HelpCircle, Plus
} from "lucide-react";
import clsx from "clsx";
import { useTranslations, useLocale } from "next-intl";

export default function Sidebar({ user, isOpen, setIsOpen }) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const menuGroups = [
    {
      label: t("Main"),
      links: [
        { name: t("Dashboard"), href: "/", icon: LayoutDashboard },
      ]
    },
    {
      label: t("Inventory Management"),
      links: [
        { name: t("Active Inventory"), href: "/stock", icon: Car },
        { name: t("Add Vehicle"), href: "/stock/post-product", icon: PlusCircle },
        { name: t("Car Brands"), href: "/carmake", icon: Bookmark },
        { name: t("Featured Stock"), href: "/featuredstock", icon: Star },
      ]
    },
    {
      label: t("CRM & Sales"),
      links: [
        { name: t("Lead Pipeline"), href: "/enquiries", icon: Briefcase },
        { name: t("Clients"), href: "/clients", icon: Users },
        { name: t("Reviews"), href: "/reviews", icon: MessageSquare },
      ]
    },
    {
      label: t("Intelligence"),
      links: [
        { name: t("Market Data"), href: "/market", icon: TrendingUp },
        { name: t("Forensics"), href: "/forensics", icon: Search },
      ]
    },
    {
      label: t("Platform"),
      links: [
        { name: t("Website Engine"), href: "/website", icon: Globe },
        { name: t("Sandbox Engine"), href: "/sandbox", icon: Database },
      ]
    }
  ];

  if (user?.role === "admin") {
    menuGroups[4].links.push({ name: t("Agents"), href: "/agents", icon: Shield });
  }

  const handleLinkClick = () => {
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={clsx(
          "bg-slate-50 flex flex-col h-screen shrink-0 overflow-y-auto custom-scrollbar transition-transform duration-300 z-40 border-r border-slate-200",
          // Desktop positioning
          "lg:translate-x-0 lg:static lg:flex lg:w-72",
          // Mobile slide-out drawer positioning
          "fixed top-0 bottom-0 w-72 shadow-xl lg:shadow-none",
          isRtl ? "right-0 border-l border-r-0" : "left-0",
          // Show/Hide transitions
          isOpen 
            ? "translate-x-0" 
            : (isRtl ? "translate-x-full" : "-translate-x-full")
        )}
      >
        <div className="flex flex-col flex-1 px-4 py-6">
          
          {/* New Listing Button */}
          <Link
             href="/stock/post-product"
             onClick={handleLinkClick}
             className="w-full bg-[#0f4098] hover:bg-blue-900 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold mb-6 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {t("Add Vehicle")}
          </Link>

          {/* Main Navigation */}
          <nav className="flex flex-col gap-6">
            {menuGroups.map((group, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <span className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  {group.label}
                </span>
                {group.links.map((link) => {
                  const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href + "/"));
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={handleLinkClick}
                      className={clsx(
                        "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors",
                        isActive
                          ? "bg-white text-[#0f4098] shadow-sm border border-slate-100"
                          : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                      )}
                    >
                      <Icon
                        className={clsx("w-4 h-4", isActive ? "text-[#0f4098]" : "text-slate-400")}
                      />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            ))}
          </nav>
        </div>
        
        {/* Bottom Navigation */}
        <div className="flex flex-col gap-1 px-4 py-6 mt-auto bg-slate-50 sticky bottom-0 border-t border-slate-200/50">
          <Link
            href="/settings"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors"
          >
            <Settings className="w-4 h-4 text-slate-400" /> {t("Settings")}
          </Link>
          <button
            onClick={() => {}}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors text-left"
          >
            <HelpCircle className="w-4 h-4 text-slate-400" /> {t("Support") || "Support"}
          </button>
        </div>
      </aside>
    </>
  );
}
