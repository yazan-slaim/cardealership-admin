"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Car, Users, PlusCircle, Bookmark, Star,
  MessageSquare, Briefcase, TrendingUp, Search,
  Globe, Database, Shield, Settings, HelpCircle, Plus,
  CalendarDays, FileText, Truck, Clock, Wrench,
} from "lucide-react";
import clsx from "clsx";
import { useTranslations, useLocale } from "next-intl";

/**
 * Returns the sidebar navigation groups based on the business type.
 */
function getMenuGroups(businessType, t) {
  if (businessType === "rental") {
    return [
      {
        label: t("Main"),
        links: [
          { name: t("Dashboard"), href: "/", icon: LayoutDashboard },
        ],
      },
      {
        label: t("Fleet Management"),
        links: [
          { name: t("Fleet"), href: "/fleet", icon: Truck },
          { name: t("Add Vehicle"), href: "/fleet/post-product", icon: PlusCircle },
          { name: t("Maintenance"), href: "/fleet/maintenance", icon: Wrench },
        ],
      },
      {
        label: t("Bookings"),
        links: [
          { name: t("All Bookings"), href: "/bookings", icon: CalendarDays },
          { name: t("Active Rentals"), href: "/bookings/active", icon: Clock },
        ],
      },
      {
        label: t("Customers & Revenue"),
        links: [
          { name: t("Customers"), href: "/clients", icon: Users },
          { name: t("Invoices"), href: "/invoices", icon: FileText },
          { name: t("Enquiries"), href: "/enquiries", icon: Briefcase },
          { name: t("Reviews"), href: "/reviews", icon: MessageSquare },
        ],
      },
      {
        label: t("Platform"),
        links: [
          { name: t("Website Engine"), href: "/website", icon: Globe },
        ],
      },
    ];
  }

  // Default: dealership
  return [
    {
      label: t("Main"),
      links: [
        { name: t("Dashboard"), href: "/", icon: LayoutDashboard },
      ],
    },
    {
      label: t("Inventory Management"),
      links: [
        { name: t("Active Inventory"), href: "/stock", icon: Car },
        { name: t("Add Vehicle"), href: "/stock/post-product", icon: PlusCircle },
        { name: t("Car Brands"), href: "/carmake", icon: Bookmark },
        { name: t("Featured Stock"), href: "/featuredstock", icon: Star },
      ],
    },
    {
      label: t("CRM & Sales"),
      links: [
        { name: t("Lead Pipeline"), href: "/enquiries", icon: Briefcase },
        { name: t("Clients"), href: "/clients", icon: Users },
        { name: t("Reviews"), href: "/reviews", icon: MessageSquare },
      ],
    },
    {
      label: t("Intelligence"),
      links: [
        { name: t("Market Data"), href: "/market", icon: TrendingUp },
        { name: t("Forensics"), href: "/forensics", icon: Search },
      ],
    },
    {
      label: t("Platform"),
      links: [
        { name: t("Website Engine"), href: "/website", icon: Globe },
        { name: t("Sandbox Engine"), href: "/sandbox", icon: Database },
      ],
    },
  ];
}

/**
 * Returns the primary CTA button config based on business type.
 */
function getPrimaryCTA(businessType, t) {
  if (businessType === "rental") {
    return { href: "/fleet/post-product", label: t("Add Vehicle") };
  }
  return { href: "/stock/post-product", label: t("Add Vehicle") };
}

export default function Sidebar({ user, isOpen, setIsOpen, dealership }) {
  const pathname = usePathname();
  const t = useTranslations("Sidebar");
  const locale = useLocale();
  const isRtl = locale === 'ar';

  const businessType = dealership?.businessType || "dealership";
  const menuGroups = getMenuGroups(businessType, t);
  const cta = getPrimaryCTA(businessType, t);

  // Add admin-only links
  if (user?.role === "admin") {
    const platformGroup = menuGroups.find((g) => g.label === t("Platform"));
    if (platformGroup) {
      platformGroup.links.push({ name: t("Agents"), href: "/agents", icon: Shield });
    }
  }

  const handleLinkClick = () => {
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Sidebar Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside 
        className={clsx(
          "bg-gray-50 dark:bg-[#0a0a0a] flex flex-col h-screen shrink-0 overflow-y-auto custom-scrollbar transition-transform duration-300 z-40 border-r border-gray-200 dark:border-white/10",
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
          
          {/* Primary CTA Button */}
          <Link
             href={cta.href}
             onClick={handleLinkClick}
             className="w-full bg-[#0f4098] hover:bg-blue-900 text-white rounded-lg py-2.5 px-4 flex items-center justify-center gap-2 text-sm font-semibold mb-6 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            {cta.label}
          </Link>

          {/* Main Navigation */}
          <nav className="flex flex-col gap-6">
            {menuGroups.map((group, i) => (
              <div key={i} className="flex flex-col gap-1.5">
                <span className="px-3 text-[11px] font-bold text-gray-400 uppercase tracking-widest mb-1">
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
                          ? "bg-white dark:bg-[#171717] text-[#0f4098] dark:text-white shadow-sm border border-gray-100 dark:border-white/10"
                          : "text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white"
                      )}
                    >
                      <Icon
                        className={clsx("w-4 h-4", isActive ? "text-[#0f4098]" : "text-gray-400")}
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
        <div className="flex flex-col gap-1 px-4 py-6 mt-auto bg-gray-50 dark:bg-[#0a0a0a] sticky bottom-0 border-t border-gray-200/50 dark:border-white/10">
          <Link
            href="/settings"
            onClick={handleLinkClick}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <Settings className="w-4 h-4 text-gray-400" /> {t("Settings")}
          </Link>
          <button
            onClick={() => {}}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white transition-colors text-left"
          >
            <HelpCircle className="w-4 h-4 text-gray-400" /> {t("Support") || "Support"}
          </button>
        </div>
      </aside>
    </>
  );
}
