import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AccessUserForm from "@/Components/AccessUserForm";
import { Head, usePage, router } from "@inertiajs/react";
import {
    PlusIcon,
    PencilIcon,
    TrashIcon,
    UserGroupIcon,
    EyeIcon,
    EyeSlashIcon,
    MagnifyingGlassIcon,
    FunnelIcon,
    ArrowPathIcon
} from "@heroicons/react/24/outline";

export default function AccessIndex({ roles }) {
    const admin = usePage().props?.auth?.admin;

    // modal states
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [roleFilter, setRoleFilter] = useState('all');

    const openCreate = () => {
        setEditingUser(null);
        setShowModal(true);
    };

    const openEdit = (user) => {
        setEditingUser(user);
        setShowModal(true);
    };

    const toggleActive = (id) => {
        if (!confirm("Are you sure you want to change status?")) return;
        router.post(route("admin.access.toggle", id));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.access.index'), {
            q: searchQuery,
            status: statusFilter,
            role: roleFilter
        });
    };

    const clearFilters = () => {
        setSearchQuery('');
        setStatusFilter('all');
        setRoleFilter('all');
        router.get(route('admin.access.index'));
    };

    const filteredRoles = (roles?.data || []).filter(role => {
        let matches = true;

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            matches =
                role.name?.toLowerCase().includes(query) ||
                role.email?.toLowerCase().includes(query) ||
                role.employee_code?.toLowerCase().includes(query) ||
                role.designation?.toLowerCase().includes(query);
        }

        if (statusFilter !== "all") {
            matches = matches && (statusFilter === "active" ? role.active : !role.active);
        }

        if (roleFilter !== "all") {
            matches = matches && role.role === roleFilter;
        }

        return matches;
    });


    const handleSubmit = (formData) => {
        const routeName = editingUser
            ? route("admin.access.update", editingUser.id)
            : route("admin.access.store");

        router.post(routeName, formData, {
            onSuccess: () => {
                setShowModal(false);
                setEditingUser(null);
            }
        });
    };

    return (
        <AuthenticatedLayout
            admin={admin}
            header={<h2 className="text-2xl font-bold text-gray-900">Role Access Management</h2>}
        >
            <Head title="Role Access" />

            <div className="py-6 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-8">


                    {/* Search & Filter Section */}
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 p-6 mb-8">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Search & Filter</h3>
                                <p className="text-gray-600 text-sm mt-1">Find specific employees using search and filters</p>
                            </div>
                            <div className="text-sm text-gray-600 bg-gray-50 px-4 py-2 rounded-xl border border-gray-200">
                                Showing <span className="font-semibold text-gray-900">{filteredRoles.length}</span> of{' '}
                                <span className="font-semibold text-gray-900">{roles.length}</span> employees
                            </div>
                        </div>

                        <form onSubmit={handleSearch} className="space-y-4">
                            <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
                                {/* Search Input */}
                                <div className="lg:col-span-2 relative">
                                    <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search employees by name, email, or code..."
                                        className="w-full pl-12 pr-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900"
                                    />
                                </div>

                                {/* Status Filter */}
                                <div>
                                    <select
                                        value={statusFilter}
                                        onChange={(e) => setStatusFilter(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="active">Active</option>
                                        <option value="inactive">Inactive</option>
                                    </select>
                                </div>

                                {/* Role Filter */}
                                <div>
                                    <select
                                        value={roleFilter}
                                        onChange={(e) => setRoleFilter(e.target.value)}
                                        className="w-full px-4 py-3 rounded-xl bg-white border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition text-gray-900"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="manager">Manager</option>
                                        <option value="employee">Employee</option>
                                    </select>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={clearFilters}
                                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium flex items-center justify-center gap-2"
                                    >
                                        <ArrowPathIcon className="w-4 h-4" />
                                        Clear
                                    </button>
                                    <button
                                        type="submit"
                                       className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200"
            >
                                        <MagnifyingGlassIcon className="w-4 h-4" />
                                        Search
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>

                    {/* Create Button */}
                    <div className="flex justify-end">
                        <button
                            onClick={openCreate}
                            className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200"
            >
                            <PlusIcon className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform" />
                            Add New Employee
                        </button>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-50/60 backdrop-blur-sm border-b border-gray-200">
                                    {["Employee Code", "Name", "Email", "Phone", "Role", "Status", "Designation", "Actions"].map((head) => (
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
                                {filteredRoles.map((r) => (
                                    <tr
                                        key={r.id}
                                        className="group transition-all hover:bg-gray-50/80 hover:shadow-sm"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {r.employee_code || (
                                                    <span className="text-gray-400 italic">Not set</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 bg-gradient-to-br bg-gray-800 text-white to-purple-600 rounded-lg flex items-center justify-center  font-semibold text-sm">
                                                    {r.name?.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {r.name}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {r.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {r.phone_number || (
                                                <span className="text-gray-400 italic">Not set</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold capitalize ${r.role === 'manager'
                                                    ? 'bg-purple-100 text-purple-800 border border-purple-200'
                                                    : 'bg-blue-100 text-blue-800 border border-blue-200'
                                                }`}>
                                                {r.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${r.active
                                                    ? "bg-green-100 text-green-800 border border-green-200"
                                                    : "bg-red-100 text-red-800 border border-red-200"
                                                }`}>
                                                <span className={`w-2 h-2 rounded-full mr-2 ${r.active ? "bg-green-500" : "bg-red-500"
                                                    }`}></span>
                                                {r.active ? "Active" : "Inactive"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {r.designation || (
                                                <span className="text-gray-400 italic">Not set</span>
                                            )}
                                        </td>

                                        {/* Action buttons */}
                                        <td className="px-6 py-4">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => toggleActive(r.id)}
                                                    className={`p-2 rounded-lg transition-all duration-200 hover:scale-110 ${r.active
                                                            ? "text-red-500 hover:bg-red-50"
                                                            : "text-green-500 hover:bg-green-50"
                                                        }`}
                                                    title={r.active ? "Deactivate" : "Activate"}
                                                >
                                                    {r.active ? (
                                                        <EyeSlashIcon className="w-4 h-4" />
                                                    ) : (
                                                        <EyeIcon className="w-4 h-4" />
                                                    )}
                                                </button>

                                                <button
                                                    onClick={() => openEdit(r)}
                                                    className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-all duration-200 hover:scale-110"
                                                    title="Edit"
                                                >
                                                    <PencilIcon className="w-4 h-4" />
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        if (confirm("Are you sure you want to delete this employee?"))
                                                            router.delete(route("admin.access.delete", r.id));
                                                    }}
                                                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 hover:scale-110"
                                                    title="Delete"
                                                >
                                                    <TrashIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Empty State */}
                    {filteredRoles.length === 0 && (
                        <div className="text-center py-16">
                            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-inner">
                                <UserGroupIcon className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                {roles.length === 0 ? 'No employees found' : 'No matching employees'}
                            </h3>
                            <p className="text-gray-600 max-w-sm mx-auto mb-8">
                                {roles.length === 0
                                    ? 'Get started by adding your first employee to the system.'
                                    : 'Try adjusting your search terms or filters to find what you are looking for.'
                                }
                            </p>
                            {roles.length === 0 && (
                                <button
                                    onClick={openCreate}
                                    className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200"
                                >
                                    <PlusIcon className="w-5 h-5 mr-2" />
                                    Add First Employee
                                </button>
                            )}
                            {(searchQuery || statusFilter !== 'all' || roleFilter !== 'all') && (
                                <button
                                    onClick={clearFilters}
                                    className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-medium ml-4"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>

                {/* MODAL POPUP */}
                {showModal && (
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto hide-scrollbar animate-popup"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <AccessUserForm
                                user={editingUser}
                                submitText={editingUser ? "Update User" : "Create User"}
                                onSubmit={handleSubmit}
                                onCancel={() => setShowModal(false)}
                            />
                        </div>

                        <style>{`
                            .hide-scrollbar::-webkit-scrollbar { width: 0; }
                            .hide-scrollbar { scrollbar-width: none; }
                            @keyframes popup {
                                from { opacity: 0; transform: translateY(20px) scale(0.96); }
                                to { opacity: 1; transform: translateY(0) scale(1); }
                            }
                            .animate-popup {
                                animation: popup .25s ease-out;
                            }
                        `}</style>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}