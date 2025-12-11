import { useState, useEffect } from "react";
import { Link, router, usePage } from "@inertiajs/react";
import {
  Users,
  LayoutDashboard,
  MapPin,
  Shield,
  LogOut,
  Bell,
  Search,
  Calendar,
} from "lucide-react";

export default function AuthLayout({ admin, header, children }) {
  const { props } = usePage();

  const [sidebarOpen, setSidebarOpen] = useState(true);

  if (!admin) {
    router.visit("/admin/login");
    return null;
  }

  const items = [
    { name: "Dashboard", route: "admin.dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Users", route: "admin.users.index", icon: <Users size={20} /> },
    { name: "Chapters", route: "chapters.index", icon: <MapPin size={20} /> },
    { name: "Events", route: "admin.events.index", icon: <Calendar size={20} /> },
    { name: "Articles", route: "news.index", icon: <Calendar size={20} /> },
    { name: "Roles & Permissions", route: "admin.access.index", icon: <Shield size={20} /> },
  ];

  return (
    <div className="flex-1  overflow-y-auto bg-[#F8FAFC]">

      {/* SIDEBAR */}
      <aside
        className="
          fixed inset-y-0 left-0 z-50 w-64 bg-white 
          border-r border-slate-200 text-slate-600 
          flex flex-col shadow-md transition-all duration-300
        "
      >
        {/* TOP BRAND */}
        <div className="h-20 flex items-center px-8 border-b border-slate-100">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center mr-3 shadow-lg shadow-blue-200">
            <span className="text-white font-bold text-lg">N</span>
          </div>
          <span className="text-slate-800 font-bold text-lg tracking-tight">
            NewsCommunity
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          <p className="px-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            Platform
          </p>

          {items.map((item) => {
            const active = route().current(item.route);

            return (
              <Link
                key={item.name}
                href={route(item.route)}
                className={`
                  w-full flex items-center px-4 py-3 text-sm font-medium 
                  rounded-xl transition-all duration-200 group
                  ${active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "hover:bg-slate-50 hover:text-blue-600 text-slate-500"
                  }
                `}
              >
                <span
                  className={`
                    mr-3 transition-colors
                    ${active
                      ? "text-blue-100"
                      : "text-slate-400 group-hover:text-blue-500"
                    }
                  `}
                >
                  {item.icon}
                </span>

                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT */}
        <div className="p-4 border-t border-slate-100 mt-auto">
          <Link
            method="post"
            href={route("admin.logout")}
            as="button"
            className="
              w-full flex items-center px-4 py-3 text-sm font-medium 
              text-slate-500 hover:text-red-600 hover:bg-red-50 
              rounded-xl transition-colors
            "
          >
            <LogOut size={20} className="mr-3" />
            Sign Out
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-64">

        {/* TOP HEADER */}
        <header
  className="
    fixed top-0 left-64 right-0 
    h-20 bg-white/80 backdrop-blur-md 
    border-b border-slate-200 flex items-center 
    justify-between px-6 z-40
  "
>

          <h1 className="text-xl font-bold text-slate-800">
            {header}
          </h1>

          <div className="flex items-center gap-4">
            {/* SEARCH BAR */}
            <div className="hidden md:flex relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Global search..."
                className="
                  pl-10 pr-4 py-2 rounded-full bg-slate-100 
                  text-sm placeholder-slate-400 text-slate-700
                  focus:ring-2 focus:ring-blue-500 w-64 transition-all
                "
              />
            </div>

            {/* NOTIFICATION */}
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} className="stroke-[2]" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            {/* USER */}
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              <div className="text-right hidden md:block">
                <div className="text-sm font-semibold text-slate-800">{admin.name}</div>
                <div className="text-xs text-slate-500">Super Admin</div>
              </div>

              <img
                src="https://i.pravatar.cc/40"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
              />
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <div className="px-8 pt-[120px] pb-10 ">
          <div className="">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
