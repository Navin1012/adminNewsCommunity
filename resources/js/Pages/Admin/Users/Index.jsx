import { useState, useMemo } from 'react';
import { router } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import {
  ArrowPathIcon,
  MagnifyingGlassIcon,
  Squares2X2Icon,
  TableCellsIcon,
  UserIcon,
  VideoCameraIcon,
  LinkIcon,
  DevicePhoneMobileIcon,
  CreditCardIcon,
  StarIcon,
  CheckBadgeIcon,
  CalendarDaysIcon,
  UserGroupIcon
} from "@heroicons/react/24/outline";

export default function UsersIndex({ users, filters }) {
  const { props } = usePage();
  const admin = props.auth?.admin;

  const [q, setQ] = useState(filters?.q || '');
  const [statusFilter, setStatusFilter] = useState('all');
  const [premiumFilter, setPremiumFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'

  // Filter users based on search and filters
  const filteredUsers = useMemo(() => {
    let filtered = users.data;

    if (q) {
      const query = q.toLowerCase();
      filtered = filtered.filter(u =>
        u.name?.toLowerCase().includes(query) ||
        u.email?.toLowerCase().includes(query) ||
        u.channel_name?.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(u =>
        statusFilter === 'active' ? u.active : !u.active
      );
    }

    if (premiumFilter !== 'all') {
      filtered = filtered.filter(u =>
        premiumFilter === 'premium' ? u.premium : !u.premium
      );
    }

    return filtered;
  }, [users.data, q, statusFilter, premiumFilter]);

  const toggleActive = (id) => {
    if (!confirm("Are you sure you want to toggle this user's active status?")) return;
    router.post(route('admin.users.toggleActive', id));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    router.get(route('admin.users.index'), { q, status: statusFilter, premium: premiumFilter });
  };

  const clearFilters = () => {
    setQ('');
    setStatusFilter('all');
    setPremiumFilter('all');
    router.get(route('admin.users.index'));
  };

  const StatusBadge = ({ active, premium }) => (
    <div className="flex gap-1">
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${active
        ? "bg-green-100 text-green-800 border border-green-200"
        : "bg-red-100 text-red-800 border border-red-200"
        }`}>
        {active ? "Active" : "Inactive"}
      </span>
      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${premium
        ? "bg-gradient-to-r from-yellow-100 to-amber-100 text-amber-800 border border-amber-200"
        : "bg-gray-100 text-gray-600 border border-gray-200"
        }`}>
        {premium ? "Premium" : "Standard"}
      </span>
    </div>
  );

  return (
    <AuthenticatedLayout
      admin={admin}
      header={<h2 className="font-semibold text-xl text-gray-900">Users Management</h2>}
    >
      <Head title="Users" />

      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Search & Filters Section – Premium SaaS UI */}
          <div className="mb-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-8">

            {/* Top Bar: Label + Stats + View Switch */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">

              {/* Section Title */}
              <div className="space-y-1">
                <h3 className="text-xl font-bold text-gray-900 tracking-tight">
                  Search & Filters
                </h3>
              </div>

              {/* Stats + View Mode */}
              <div className="flex items-center gap-5">

                {/* Count Badge */}
                <div className="px-5 py-2 rounded-2xl border border-gray-200 bg-gradient-to-r from-gray-50 to-white shadow-inner text-sm text-gray-700 flex items-center gap-1">
                  Showing
                  <span className="font-semibold text-gray-900">{filteredUsers.length}</span>
                  of
                  <span className="font-semibold text-gray-900">{users.total}</span>
                </div>

                {/* View Switch */}
                <div className="flex bg-gray-100 rounded-xl p-1 shadow-inner">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2.5 rounded-lg transition-all duration-300 flex items-center justify-center
            ${viewMode === 'grid'
                        ? "bg-white shadow-md text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    <Squares2X2Icon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`p-2.5 rounded-lg transition-all duration-300 flex items-center justify-center
            ${viewMode === 'table'
                        ? "bg-white shadow-md text-blue-600"
                        : "text-gray-600 hover:text-gray-900"
                      }`}
                  >
                    <TableCellsIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSearch} className="space-y-6">

              <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">

                {/* Search Input */}
                <div className="lg:col-span-2 relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    value={q}
                    onChange={(e) => setQ(e.target.value)}
                    placeholder="Search by name, email or channel…"
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-gradient-to-r from-gray-50 to-white 
                     border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent
                     shadow-inner transition text-gray-900"
                  />
                </div>

                {/* Status Dropdown */}
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200
                   focus:ring-2 focus:ring-blue-500 focus:border-transparent 
                   shadow-inner transition text-gray-900"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active Users</option>
                  <option value="inactive">Inactive Users</option>
                </select>

                {/* Premium Dropdown */}
                <select
                  value={premiumFilter}
                  onChange={(e) => setPremiumFilter(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200
                   focus:ring-2 focus:ring-purple-500 focus:border-transparent 
                   shadow-inner transition text-gray-900"
                >
                  <option value="all">All Plans</option>
                  <option value="premium">Premium</option>
                  <option value="standard">Standard</option>
                </select>

              </div>

              {/* Footer Buttons */}
              <div className="flex flex-col sm:flex-row justify-between gap-4">

                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-6 py-3 rounded-xl bg-white border border-gray-200 text-gray-700 
                    flex items-center gap-2 font-medium shadow-sm 
                    hover:bg-gray-100 hover:shadow-md active:scale-[0.98] transition-all"
                >
                  <ArrowPathIcon className="w-5 h-5 text-gray-600" />
                  Clear Filters
                </button>

                {/* Apply Button */}
                <button
                  type="submit"
                  className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200"
                >
                  <MagnifyingGlassIcon className="w-5 h-5" />
                  Apply Filters
                </button>

              </div>

            </form>
          </div>

          {/* Content Area */}
          {viewMode === 'grid' ? (

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">

              {filteredUsers.map((u) => (
                <div
                  key={u.id}
                  className="
        bg-white/90 backdrop-blur-xl 
        rounded-3xl 
        border border-gray-200 
        shadow-[0_8px_30px_rgb(0,0,0,0.05)]
        hover:shadow-[0_12px_45px_rgb(0,0,0,0.08)]
        hover:border-blue-300 
        transition-all duration-300 
        p-7 group
      "
                >

                  {/* HEADER */}
                  <div className="flex items-start gap-4 mb-6">

                    {/* USER ICON */}
                    <div
                      className="
      w-14 h-14 bg-gradient-to-br  text-white
                                  bg-gray-800 hover:bg-gray-900 to-purple-600 
      rounded-2xl text-white flex items-center justify-center 
      text-xl font-bold shadow-lg group-hover:scale-105 transition
    "
                    >
                      <UserIcon className="w-6 h-6" />
                    </div>

                    {/* NAME + EMAIL + STATUS BADGE */}
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-900 text-lg truncate group-hover:text-blue-600 transition">
                        {u.name}
                      </h3>

                      <p className="text-sm text-gray-500 truncate">{u.email}</p>

                      {/* STATUS BADGE MOVED HERE */}
                      <div className="mt-2">
                        <StatusBadge active={u.active} premium={u.premium} />
                      </div>
                    </div>

                  </div>


                  {/* USER DETAILS LIST */}
                  <div className="space-y-4 mb-6">

                    {/* Channel Name */}
                    <div className="flex items-start gap-3 text-[15px]">
                      <VideoCameraIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-500 font-medium">Channel</span>
                        <div className="text-gray-900 font-semibold mt-0.5 truncate">
                          {u.channel_name || "Not Set"}
                        </div>
                      </div>
                    </div>

                    {/* Channel URL */}
                    <div className="flex items-start gap-3 text-[15px]">
                      <LinkIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-500 font-medium">Channel URL</span>
                        <div className="text-gray-900 font-semibold mt-0.5 truncate">
                          {u.channel_url || "Not Set"}
                        </div>
                      </div>
                    </div>

                    {/* Mobile Number */}
                    <div className="flex items-start gap-3 text-[15px]">
                      <DevicePhoneMobileIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-500 font-medium">Mobile</span>
                        <div className="text-gray-900 font-semibold mt-0.5 truncate">
                          {u.mobile_number || "Not Provided"}
                        </div>
                      </div>
                    </div>

                    {/* Payment Status */}
                    <div className="flex items-start gap-3 text-[15px]">
                      <CreditCardIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-500 font-medium">Payment</span>
                        <div className={`font-semibold mt-0.5 truncate ${u.payment_status === 'paid' ? 'text-green-600' :
                            u.payment_status === 'pending' ? 'text-yellow-600' :
                              'text-red-600'
                          }`}>
                          {u.payment_status || "Not Set"}
                        </div>
                      </div>
                    </div>

                    {/* Premium Status */}
                    <div className="flex items-start gap-3 text-[15px]">
                      <StarIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-500 font-medium">Premium</span>
                        <div className={`font-semibold mt-0.5 truncate ${u.premium ? 'text-amber-600' : 'text-gray-600'
                          }`}>
                          {u.premium ? "Premium User" : "Free User"}
                        </div>
                      </div>
                    </div>

                    {/* Email Verification */}
                    <div className="flex items-start gap-3 text-[15px]">
                      <CheckBadgeIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-500 font-medium">Email</span>
                        <div className={`font-semibold mt-0.5 truncate ${u.email_verified_at ? 'text-green-600' : 'text-red-600'
                          }`}>
                          {u.email_verified_at ? "Verified" : "Not Verified"}
                        </div>
                      </div>
                    </div>

                    {/* Join Date */}
                    <div className="flex items-start gap-3 text-[15px]">
                      <CalendarDaysIcon className="w-5 h-5 text-gray-600 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <span className="text-gray-500 font-medium">Joined</span>
                        <div className="text-gray-900 font-semibold mt-0.5">
                          {new Date(u.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* ACTION BUTTON */}
                  <button
                    onClick={() => toggleActive(u.id)}
                    className={`
          w-full flex items-center justify-center gap-2 
          py-3.5 rounded-xl font-semibold text-sm
          shadow-md hover:shadow-lg transition
          ${u.active
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                      }
        `}
                  >
                    {u.active ? "Deactivate User" : "Activate User"}
                  </button>

                </div>
              ))}

            </div>

          ) : (
            /* Table View */
            <div className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-100/60 backdrop-blur-sm border-b border-gray-200">
                      {["User", "Status", "Channel", "Mobile", "Joined", "Actions"].map((head) => (
                        <th
                          key={head}
                          className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider"
                        >
                          {head}
                        </th>
                      ))}
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200">
                    {filteredUsers.map((u) => (
                      <tr
                        key={u.id}
                        className="group transition-all hover:bg-gray-50/80 hover:shadow-sm"
                      >
                        {/* USER INFO */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 bg-gradient-to-br bg-gray-800 hover:bg-gray-900 to-purple-600  rounded-xl flex items-center justify-center text-white font-semibold shadow-sm">
                              <UserIcon className="w-5 h-5" />
                            </div>

                            <div>
                              <div className="font-semibold text-gray-900 group-hover:text-gray-800 transition-colors">
                                {u.name}
                              </div>
                              <div className="text-sm text-gray-500">{u.email}</div>
                            </div>
                          </div>
                        </td>

                        {/* STATUS */}
                        <td className="px-6 py-4">
                          <StatusBadge active={u.active} premium={u.premium} />
                        </td>

                        {/* CHANNEL */}
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {u.channel_name || (
                            <span className="text-gray-400 italic">Not set</span>
                          )}
                        </td>

                        {/* MOBILE */}
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {u.mobile_number || (
                            <span className="text-gray-400 italic">Not set</span>
                          )}
                        </td>

                        {/* JOIN DATE */}
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {new Date(u.created_at).toLocaleDateString()}
                        </td>

                        {/* ACTION BUTTON */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => toggleActive(u.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all
                  ${u.active
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-green-100 text-green-700 hover:bg-green-200"
                              }`}
                          >
                            {u.active ? "Deactivate" : "Activate"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          )}

          {/* Pagination */}
          {users.links && users.links.length > 3 && (
            <div className="mt-10 flex justify-center">
              <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200 px-3 py-2">

                {users.links.map((link, idx) => (
                  <button
                    key={idx}
                    onClick={() => link.url && router.get(link.url)}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`
            min-w-[40px] h-10 px-4 
            flex items-center justify-center 
            rounded-xl text-sm font-medium transition-all 
            ${link.active
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      }
            ${!link.url ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"}
          `}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredUsers.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl shadow-md border border-gray-200 animate-fadeIn">

              {/* Icon Box */}
              <div className="w-28 h-28 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-inner">
                <UserGroupIcon className="w-14 h-14 text-gray-400" />
              </div>

              {/* Title */}
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No users found
              </h3>

              {/* Subtitle */}
              <p className="text-gray-600 max-w-sm mx-auto mb-8 leading-relaxed">
                {q || statusFilter !== 'all' || premiumFilter !== 'all'
                  ? "Try adjusting your search terms or filters to find results."
                  : "No users have been registered yet."}
              </p>

              {/* Clear Filters Button */}
              {(q || statusFilter !== 'all' || premiumFilter !== 'all') && (
                <button
                  onClick={clearFilters}
                  className="px-7 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-md hover:shadow-lg font-medium"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </AuthenticatedLayout>
  );
}