"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Bell, Zap, User, Search, Menu, Globe, Car, MessageSquare, Users, Loader2, UserPlus, Calendar, Info, CheckCheck } from "lucide-react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { signOut } from "next-auth/react";
import ThemeToggle from "@/components/ThemeToggle";

export default function TopNav({ user, setSidebarOpen, dealership }) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Search Bar States
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState({ cars: [], enquiries: [], clients: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const searchContainerRef = useRef(null);

  // Notification States
  const [notifications, setNotifications] = useState([]);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const notificationsRef = useRef(null);

  const toggleLanguage = () => {
    const isArabic = document.cookie.includes('NEXT_LOCALE=ar');
    const nextLocale = isArabic ? 'en' : 'ar';
    document.cookie = `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000`;
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = async (id) => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => (n._id === id ? { ...n, read: true } : n))
        );
      }
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ all: true }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      }
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };


  // Debounced search fetch
  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults({ cars: [], enquiries: [], clients: [] });
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
        const data = await res.json();
        setResults(data);
      } catch (err) {
        console.error("Search failed", err);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setShowDropdown(false);
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, []);

  const topLinks = [
    { name: "Inventory", href: "/stock" },
    { name: "Leads", href: "/enquiries" },
    { name: "Sales", href: "/sales" },
    { name: "Analytics", href: "/market" },
  ];

  return (
    <header className="h-20 bg-white dark:bg-[#111111] border-b border-gray-200 dark:border-white/10 flex items-center justify-between px-6 shrink-0 z-50 sticky top-0 transition-colors duration-200">
      
      {/* Mobile Menu & Brand */}
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSidebarOpen(prev => !prev)}
          className="lg:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-neutral-400 dark:hover:text-gray-100 bg-gray-100 dark:bg-[#171717] rounded-lg transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="font-bold text-lg text-[#0f4098] dark:text-blue-400 tracking-tight whitespace-nowrap hidden sm:flex items-center gap-2">
          {dealership?.logo && (
            <img src={dealership.logo} alt="Dealership Logo" className="h-6 object-contain" />
          )}
          {dealership?.name || "MOTIO"}
        </div>
      </div>

      {/* Search Bar */}
      <div className="hidden md:flex flex-1 max-w-md mx-6 relative" ref={searchContainerRef}>
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          placeholder="Search leads, brands, data..." 
          className="w-full bg-gray-100 dark:bg-[#171717] border-none rounded-lg py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 transition-colors"
        />

        {showDropdown && searchQuery.trim() !== "" && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-[#111111] border border-gray-200 dark:border-white/10 rounded-xl shadow-xl z-50 overflow-hidden max-h-[480px] flex flex-col w-[450px]">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8 text-gray-400 gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-500" />
                  <span className="text-sm font-medium">Searching database...</span>
                </div>
              ) : (
                <>
                  {/* Cars Group */}
                  {results.cars && results.cars.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 tracking-wider mb-2 flex items-center gap-1.5 uppercase">
                        <Car className="w-3.5 h-3.5 text-blue-500" />
                        Inventory ({results.cars.length})
                      </h4>
                      <div className="space-y-1.5">
                        {results.cars.map((car) => (
                          <Link
                            key={car._id}
                            href={`/stock/${car._id}/master`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-all border border-transparent hover:border-gray-100 dark:hover:border-white/20"
                          >
                            <div className="w-10 h-10 rounded bg-gray-100 dark:bg-[#171717] flex items-center justify-center text-gray-500 dark:text-neutral-400 text-xs overflow-hidden shrink-0 border border-gray-100 dark:border-white/10">
                              {car.images && car.images[0] ? (
                                <img src={car.images[0]} alt={car.title} className="w-full h-full object-cover" />
                              ) : (
                                <Car className="w-4 h-4" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate">{car.title || `${car.carMake} ${car.model}`}</p>
                              {car.vinNumber && (
                                <p className="text-[10px] text-gray-400 font-mono">VIN: {car.vinNumber}</p>
                              )}
                            </div>
                            {car.price && (
                              <span className="text-xs font-bold text-gray-900 bg-gray-100 px-2 py-1 rounded">
                                {Number(car.price).toLocaleString()} JOD
                              </span>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Enquiries / Leads Group */}
                  {results.enquiries && results.enquiries.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 tracking-wider mb-2 flex items-center gap-1.5 uppercase">
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                        Leads ({results.enquiries.length})
                      </h4>
                      <div className="space-y-1.5">
                        {results.enquiries.map((enq) => (
                          <Link
                            key={enq._id}
                            href={`/enquiries/${enq._id}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-xs font-bold text-emerald-600 shrink-0">
                                {(enq.firstName?.[0] || "") + (enq.lastName?.[0] || "")}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">
                                  {enq.firstName} {enq.lastName}
                                </p>
                                <p className="text-[10px] text-gray-400 truncate">
                                  {enq.carDetails?.make ? `${enq.carDetails.make} ${enq.carDetails.model || ""}` : "General enquiry"}
                                </p>
                              </div>
                            </div>
                            <span className={clsx(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                              enq.status === "new" ? "bg-blue-50 text-blue-600" :
                              enq.status === "in_progress" ? "bg-amber-50 text-amber-600" :
                              "bg-gray-100 text-gray-600"
                            )}>
                              {enq.status || "new"}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Clients Group */}
                  {results.clients && results.clients.length > 0 && (
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 tracking-wider mb-2 flex items-center gap-1.5 uppercase">
                        <Users className="w-3.5 h-3.5 text-indigo-500" />
                        Clients ({results.clients.length})
                      </h4>
                      <div className="space-y-1.5">
                        {results.clients.map((client) => (
                          <Link
                            key={client._id}
                            href={`/clients/${client._id}`}
                            onClick={() => setShowDropdown(false)}
                            className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                                {client.fullName?.[0] || ""}
                              </div>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-gray-800 truncate">{client.fullName}</p>
                                <p className="text-[10px] text-gray-400 truncate">{client.email || client.phoneNumber}</p>
                              </div>
                            </div>
                            <span className={clsx(
                              "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded",
                              client.status === "purchased" ? "bg-emerald-50 text-emerald-600" :
                              client.status === "negotiating" ? "bg-purple-50 text-purple-600" :
                              "bg-gray-100 text-gray-600"
                            )}>
                              {client.status || "new"}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* No Results Fallback */}
                  {(!results.cars || results.cars.length === 0) &&
                   (!results.enquiries || results.enquiries.length === 0) &&
                   (!results.clients || results.clients.length === 0) && (
                     <div className="text-center py-8 text-gray-400">
                       <p className="text-sm">No results found for <span className="font-semibold text-gray-600">"{searchQuery}"</span></p>
                       <p className="text-xs mt-1">Try searching for other keywords, VINs, or contact info.</p>
                     </div>
                   )}
                </>
              )}
            </div>
            <div className="bg-gray-50 border-t border-gray-100 px-4 py-2 flex items-center justify-between text-[10px] text-gray-400">
              <span>Press <kbd className="bg-white border border-gray-200 px-1 rounded">Esc</kbd> to close</span>
              <span>Quick Navigation Search</span>
            </div>
          </div>
        )}
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
                   isActive ? "text-[#0f4098]" : "text-gray-500 hover:text-gray-900"
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
        
        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4 ml-auto lg:ml-0">
          
          <ThemeToggle />

          <button onClick={toggleLanguage} className="p-2 text-gray-400 hover:text-[#0f4098] bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors relative flex items-center justify-center dark:bg-[#171717] dark:text-gray-300 dark:hover:text-blue-400 dark:hover:bg-white/10">
            <Globe className="w-5 h-5" />
          </button>
          
          {/* Notification Icon & Dropdown */}
          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="text-gray-400 hover:text-gray-600 transition-colors relative p-1 rounded-full hover:bg-gray-100"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>
            
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50 flex flex-col max-h-96">
                <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 rounded-t-xl">
                  <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider">Notifications</h3>
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllAsRead}
                      className="text-[10px] text-blue-600 hover:text-blue-800 font-semibold transition-colors flex items-center gap-1"
                    >
                      <CheckCheck className="w-3 h-3" /> Mark all read
                    </button>
                  )}
                </div>
                
                <div className="overflow-y-auto divide-y divide-gray-100 flex-1">
                  {notifications.length === 0 ? (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-sm">No notifications found.</p>
                    </div>
                  ) : (
                    notifications.map((item) => {
                      // Icon by type
                      let icon = <Info className="w-4 h-4 text-blue-500" />;
                      if (item.type === "lead") icon = <UserPlus className="w-4 h-4 text-emerald-500" />;
                      if (item.type === "task") icon = <Calendar className="w-4 h-4 text-amber-500" />;
                      if (item.type === "alert") icon = <Zap className="w-4 h-4 text-red-500" />;

                      // Relative time formatting
                      const timeStr = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now";

                      return (
                        <div 
                          key={item._id}
                          className={clsx(
                            "p-3 text-left transition-colors flex gap-3 relative cursor-pointer",
                            item.read ? "bg-white hover:bg-gray-50" : "bg-blue-50/55 hover:bg-blue-55"
                          )}
                          onClick={() => {
                            if (!item.read) markAsRead(item._id);
                            if (item.link) {
                              window.location.href = item.link;
                            }
                          }}
                        >
                          <div className="shrink-0 mt-0.5">{icon}</div>
                          <div className="flex-1 min-w-0 pr-4">
                            <p className={clsx("text-xs truncate", !item.read ? "font-bold text-gray-900" : "font-semibold text-gray-700")}>
                              {item.title}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5 line-clamp-2 leading-relaxed">
                              {item.message}
                            </p>
                            <span className="text-[9px] text-gray-400 mt-1 block">
                              {timeStr}
                            </span>
                          </div>
                          {!item.read && (
                            <span className="absolute top-1/2 -translate-y-1/2 right-3 w-1.5 h-1.5 bg-blue-600 rounded-full" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}
          </div>

          <button className="text-gray-400 hover:text-gray-600 transition-colors">
            <Zap className="w-5 h-5" />
          </button>
          
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-9 h-9 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
            >
              <User className="w-5 h-5" />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                <div className="px-4 py-2 border-b border-gray-100 mb-2">
                  <p className="text-sm font-semibold text-gray-900">{user?.name || "CRM Admin"}</p>
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
