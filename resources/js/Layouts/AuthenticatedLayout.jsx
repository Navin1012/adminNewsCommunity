import { useState, useEffect } from "react";
import { router, Link, usePage } from "@inertiajs/react";
import NavLink from "@/Components/NavLink";
import {
  HomeIcon,
  UsersIcon,
  CalendarDaysIcon,
  ShieldCheckIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  RectangleGroupIcon,
} from "@heroicons/react/24/outline";

export default function AuthenticatedLayout({ admin, header, children }) {
  const { props } = usePage();

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [toast, setToast] = useState({ message: null, type: null });

  /* Flash */
  useEffect(() => {
    if (props.flash?.success) setToast({ message: props.flash.success, type: "success" });
    if (props.flash?.error) setToast({ message: props.flash.error, type: "error" });
  }, [props.flash]);

  useEffect(() => {
    if (toast.message) setTimeout(() => setToast({ message: null, type: null }), 3000);
  }, [toast]);

  if (!admin) {
    router.visit("/admin/login");
    return null;
  }

  const navigationItems = [
    { name: "Dashboard", route: "admin.dashboard", href: route("admin.dashboard"), icon: <HomeIcon className="w-5 h-5" /> },
    { name: "Users", route: "admin.users.index", href: route("admin.users.index"), icon: <UsersIcon className="w-5 h-5" /> },
    { name: "Events", route: "admin.events.index", href: route("admin.events.index"), icon: <CalendarDaysIcon className="w-5 h-5" /> },
    { name: "Chapters", route: "chapters.index", href: route("chapters.index"), icon: <RectangleGroupIcon className="w-5 h-5" /> },
    { name: "Role Management", route: "admin.access.index", href: route("admin.access.index"), icon: <ShieldCheckIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="h-screen flex bg-[#f5f7fb]">

      {/* Toast */}
      {toast.message && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-4 rounded-xl shadow-xl backdrop-blur-2xl 
          text-white font-medium transition-all duration-300
          ${toast.type === "success" ? "bg-green-500/90" : "bg-red-500/90"}`}>
          {toast.message}
        </div>
      )}

      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-[80px] left-0 h-[calc(100vh-80px)]
          bg-white border-r border-gray-200 flex flex-col shadow-md z-30
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? "w-64" : "w-20"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >

        {/* Navigation */}
        <nav className="px-3 py-4 flex flex-col gap-3">
          {/* Menu Items */}
          {navigationItems.map((item) => (
            <NavLink
              key={item.name}
              href={item.href}
              active={route().current(item.route)}
              className="
                flex items-center gap-3 px-4 py-3 rounded-xl
                text-gray-700 hover:bg-gray-100 transition-all font-medium
              "
              activeClassName="
                bg-gradient-to-r from-gray-800 to-gray-900
                text-white font-semibold shadow-md
              "
            >
              <div className="w-6 h-6">{item.icon}</div>
              {sidebarOpen && <span>{item.name}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="mt-auto px-3 py-4 border-t">
          <Link
            href={route("admin.logout")}
            method="post"
            as="button"
            className="flex items-center gap-3 px-4 py-3 rounded-xl w-full
            text-gray-700 hover:bg-red-100 hover:text-red-600 transition-all font-medium"
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
            {sidebarOpen && "Log Out"}
          </Link>
        </div>
      </aside>

      {/* Main Section */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300
        ${sidebarOpen ? "md:ml-64" : "md:ml-20"}`}
      >

        {/* HEADER */}
        <header
          className={`
            fixed top-0 right-0 left-0 md:left-0
            h-[80px] flex items-center z-40
            bg-white/60 backdrop-blur-2xl border-b border-gray-200 shadow-sm
            transition-all duration-300
          `}
        >
          <div className="flex items-center justify-between w-full px-6">

            {/* Left Area */}
            <div className="flex items-center gap-4">
              {/* Mobile Menu */}
              <button
                className="inline-flex items-center p-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200"
                onClick={() => setMobileOpen(!mobileOpen)}
              >
                {mobileOpen ? (
                  // X ICON
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  // BARS ICON
                  <Bars3Icon className="w-5 h-5" />
                )}
              </button>

              {/* Brand Title */}
              <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-900 bg-clip-text text-transparent">
                News Community
              </span>
            </div>

            {/* Page Title */}
            <h1 className="hidden md:block text-xl md:text-2xl font-semibold text-gray-900">
              {header}
            </h1>

            {/* User */}
            <div className="hidden md:flex items-center gap-4">


              <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200">
                Hi, {admin.name}
              </span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-6 py-6 mt-[80px]">
          <div className="bg-white shadow-lg rounded-2xl border border-gray-200 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}