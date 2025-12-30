import { useState, useEffect } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";

import {
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Ban,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
} from "lucide-react";

import { Card, Button, Badge, Input } from "@/Components/Common";

export default function UsersIndex({ users, filters }) {
  const { props } = usePage();
  const admin = props.auth?.admin;

  const [searchTerm, setSearchTerm] = useState(filters?.q || "");
  const [openDropdownId, setOpenDropdownId] = useState(null);

  // server-side search
  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route("admin.users.index"), { q: searchTerm });
  };

  const clearSearch = () => {
    setSearchTerm("");
    router.get(route("admin.users.index"));
  };

  // toggle active
  const toggleActive = (id) => {
    if (!confirm("Are you sure?")) return;
    router.post(route("admin.users.toggleActive", id));
  };

  return (
    <AuthenticatedLayout
      admin={admin}
      header={<h2 className="text-xl font-semibold text-gray-900">Users Management</h2>}
    >
      <Head title="Users" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4">

          {/* ------------------------ */}
          {/* 🔍 Search UI (Premium UI) */}
          {/* ------------------------ */}
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-6">

            {/* LEFT SECTION — Search + Filters */}
            <div className="flex gap-2 w-full sm:w-auto">

              {/* Search Input (Same Design) */}
              <Input
                placeholder="Search users..."
                icon={<Search size={18} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="min-w-[280px]"
              />

              {/* Filters Button */}
              <Button onClick={handleSearch} variant="secondary" icon={<Filter size={18} />}>
                Filters
              </Button>

              {/* Clear Button */}
              {searchTerm !== "" && (
                <Button variant="secondary" onClick={clearSearch}>
                  Clear
                </Button>
              )}
            </div>

            {/* RIGHT SECTION — Export + Search + Clear */}
            <div className="flex gap-2">

              {/* Export Button */}
              <Button variant="secondary" icon={<Download size={18} />}>
                Export
              </Button>

              {/* Search Button */}




            </div>
          </div>


          {/* ------------------------ */}
          {/* 📌 Table Card (Premium UI) */}
          {/* ------------------------ */}

          <Card className="overflow-visible p-0">
            <div className="overflow-x-auto rounded-t-2xl">
              <table className="w-full border-collapse text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100 text-xs uppercase text-slate-500 font-semibold tracking-wide">
                    <th className="p-4 pl-6">User</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Plan</th>
                    <th className="p-4">Channel</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4 text-right pr-6">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100">
                  {users.data.length > 0 ? (
                    users.data.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-50 transition-colors group relative">

                        {/* USER */}
                        <td className="p-4 pl-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                              {u.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="font-medium text-slate-900">{u.name}</div>
                              <div className="text-xs text-slate-500">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="p-4">
                          <Badge type={u.active ? "success" : "danger"}>
                            {u.active ? "Active" : "Inactive"}
                          </Badge>
                        </td>

                        {/* PLAN */}
                        <td className="p-4">
                          <span
                            className={`inline-flex px-2 py-1 rounded text-xs font-medium ${u.premium
                              ? "bg-purple-50 text-purple-700"
                              : "bg-slate-100 text-slate-600"
                              }`}
                          >
                            {u.premium ? "Premium" : "Standard"}
                          </span>
                        </td>

                        {/* CHANNEL */}
                        <td className="p-4 text-sm text-slate-600">
                          {u.channel_name || <span className="text-gray-400 italic">Not set</span>}
                        </td>

                        {/* JOINED */}
                        <td className="p-4 text-sm text-slate-500">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>

                        {/* ACTION DROPDOWN */}
                        <td className="p-4 text-right pr-6 relative ">
                          {/* Toggle Button */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setOpenDropdownId(openDropdownId === u.id ? null : u.id);
                            }}
                            className={`p-1.5 rounded-lg transition-all duration-200
      ${openDropdownId === u.id
                                ? "bg-blue-50 text-blue-600 shadow-sm"
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                              }`}
                          >
                            <MoreHorizontal size={20} />
                          </button>

                          {/* Dropdown Menu */}
                          {openDropdownId === u.id && (
                            <>
                              {/* Overley Click Close */}
                              <div
                                className="fixed inset-0 z-10"
                                onClick={() => setOpenDropdownId(null)}
                              />

                              {/* Menu Box */}
                              <div
                                className="
          absolute right-10 top-9 z-50 w-56
          bg-white rounded-xl shadow-xl border border-slate-100
          py-2 animate-in fade-in slide-in-from-top-2 duration-200
        "
                              >
                                {/* View Details */}
                                <button className="
          w-full text-left px-4 py-2.5 text-sm text-slate-700
          hover:bg-slate-50 hover:text-blue-600
          flex items-center gap-3 transition-all font-medium
        ">
                                  <Eye size={16} className="text-slate-500" />
                                  View Details
                                </button>

                                {/* Edit User */}
                                <button className="
          w-full text-left px-4 py-2.5 text-sm text-slate-700
          hover:bg-slate-50 hover:text-blue-600
          flex items-center gap-3 transition-all font-medium
        ">
                                  <Edit size={16} className="text-slate-500" />
                                  Edit User
                                </button>

                                {/* Divider */}
                                <div className="h-px bg-slate-100 my-1" />

                                {/* Activate / Deactivate */}
                                <button
                                  onClick={() => toggleActive(u.id)}
                                  className="
            w-full text-left px-4 py-2.5 text-sm 
            flex items-center gap-3 transition-all font-medium
            text-red-600 hover:text-red-700 hover:bg-red-50
          "
                                >
                                  <Ban size={16} />
                                  {u.active ? "Deactivate" : "Activate"}
                                </button>
                              </div>
                            </>
                          )}
                        </td>

                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* ------------------------ */}
            {/* Pagination */}
            {/* ------------------------ */}
            {users.links.length > 0 && (
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">

                {/* Showing X to Y of Z */}
                <span className="text-sm text-slate-500">
                  Showing{" "}
                  <span className="font-medium text-slate-900">{users.from}</span> to{" "}
                  <span className="font-medium text-slate-900">{users.to}</span> of{" "}
                  <span className="font-medium text-slate-900">{users.total}</span> results
                </span>

                {/* Pagination Buttons */}
                <div className="flex items-center gap-2">

                  {/* Prev Button */}
                  <button
                    onClick={() => users.prev_page_url && router.get(users.prev_page_url)}
                    disabled={!users.prev_page_url}
                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-slate-600"
                  >
                    <ChevronLeft size={16} />
                  </button>

                  {/* Page Numbers */}
                  <div className="flex items-center gap-1">
                    {users.links
                      .filter((l) => !isNaN(Number(l.label))) // numeric page buttons only
                      .map((link, idx) => (
                        <button
                          key={idx}
                          disabled={!link.url}
                          onClick={() => link.url && router.get(link.url)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${link.active
                            ? "bg-blue-600 text-white shadow-sm"
                            : "text-slate-600 hover:bg-white hover:shadow-sm"
                            } ${!link.url ? "opacity-40 cursor-not-allowed" : ""}`}
                        >
                          {link.label}
                        </button>
                      ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={() => users.next_page_url && router.get(users.next_page_url)}
                    disabled={!users.next_page_url}
                    className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent hover:border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-slate-600"
                  >
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

          </Card>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}



