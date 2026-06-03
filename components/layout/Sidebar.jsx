"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Car, Users, PlusCircle, Bookmark, Star,
  MessageSquare, Briefcase, TrendingUp, Search,
  Globe, Database, Shield, Settings
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
          "bg-slate-50 flex flex-col h-[calc(100vh-64px)] shrink-0 overflow-y-auto custom-scrollbar transition-transform duration-300 z-40",
          // Desktop positioning
          "lg:translate-x-0 lg:static lg:flex lg:w-64 lg:border-x lg:border-slate-200",
          // Mobile slide-out drawer positioning
          "fixed top-16 bottom-0 w-64 shadow-xl lg:shadow-none",
          isRtl ? "right-0 border-l border-r-0" : "left-0 border-r border-l-0",
          // Show/Hide transitions
          isOpen 
            ? "translate-x-0" 
            : (isRtl ? "translate-x-full" : "-translate-x-full")
        )}
      >
        <nav className="flex flex-col gap-6 px-4 py-6 flex-1">
          {menuGroups.map((group, i) => (
            <div key={i} className="flex flex-col gap-1">
              <span className="px-4 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
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
                      "flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    )}
                  >
                    <Icon
                      className={clsx("w-5 h-5", isActive ? "text-blue-600" : "text-slate-400")}
                    />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          ))}
        </nav>
        
        <div className="flex flex-col gap-1 px-4 py-4 mt-auto border-t border-slate-200 bg-slate-50 sticky bottom-0">
          <Link
            href="/settings"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-100 hover:text-slate-900"
          >
            <Settings className="w-5 h-5 text-slate-400" /> {t("Settings")}
          </Link>
        </div>
      </aside>
    </>
  );
}
