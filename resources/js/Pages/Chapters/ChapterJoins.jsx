import { Link, Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    ArrowLeftIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    MapPinIcon,
    LinkIcon,
    CheckBadgeIcon,
    ClockIcon,
    ShieldCheckIcon,
    StarIcon,
    UserGroupIcon
} from "@heroicons/react/24/outline";

export default function ChapterJoins({ auth, chapter, joins }) {

    const verifiedCount = joins.data.filter(u => u.email_verified_at).length;
    const premiumCount = joins.data.filter(u => u.premium).length;

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusColor = (premium, verified) => {
        if (premium) return "bg-gradient-to-r from-purple-500 to-purple-600";
        if (verified) return "bg-gradient-to-r from-green-500 to-green-600";
        return "bg-gradient-to-r from-gray-500 to-gray-600";
    };
    
    return (
        <AuthenticatedLayout
            admin={auth.admin}
            header={
                <h2 className="font-bold text-2xl text-gray-900 flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-gray-600 rounded-xl flex items-center justify-center">
                        <UserGroupIcon className="w-5 h-5 text-white" />
                    </div>
                    Chapter Members
                </h2>
            }
        >
            <Head title={`${chapter.title} - Members`} />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 space-y-8">

                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {chapter.title}
                        </h1>
                        <p className="text-gray-600 text-lg mt-1">Chapter Members Management</p>
                    </div>

                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            window.history.back();
                        }}
                        className="inline-flex items-center px-5 py-3 bg-gray-800 text-white rounded-xl font-semibold shadow-lg hover:bg-gray-900 transition-all duration-200 hover:shadow-xl transform hover:scale-105"
                    >
                        <ArrowLeftIcon className="w-4 h-4 mr-2" />
                        Back to Chapters
                    </Link>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Total Members */}
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-blue-700 text-sm font-bold uppercase tracking-wide">Total Members</p>
                                <p className="text-3xl font-black text-gray-900 mt-2">{joins.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                                <UserGroupIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-blue-200">
                            <p className="text-blue-600 text-sm font-semibold">All chapter members</p>
                        </div>
                    </div>

                    {/* Verified Members */}
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-green-700 text-sm font-bold uppercase tracking-wide">Verified</p>
                                <p className="text-3xl font-black text-gray-900 mt-2">{verifiedCount}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                                <ShieldCheckIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-green-200">
                            <p className="text-green-600 text-sm font-semibold">
                                {Math.round((verifiedCount / joins.total) * 100)}% verified
                            </p>
                        </div>
                    </div>

                    {/* Premium Members */}
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-purple-700 text-sm font-bold uppercase tracking-wide">Premium</p>
                                <p className="text-3xl font-black text-gray-900 mt-2">{premiumCount}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-500 rounded-xl flex items-center justify-center">
                                <StarIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-purple-200">
                            <p className="text-purple-600 text-sm font-semibold">
                                {Math.round((premiumCount / joins.total) * 100)}% premium
                            </p>
                        </div>
                    </div>

                    {/* Pending Members */}
                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 shadow-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-orange-700 text-sm font-bold uppercase tracking-wide">Pending</p>
                                <p className="text-3xl font-black text-gray-900 mt-2">
                                    {joins.total - verifiedCount}
                                </p>
                            </div>
                            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                                <ClockIcon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t border-orange-200">
                            <p className="text-orange-600 text-sm font-semibold">
                                {Math.round(((joins.total - verifiedCount) / joins.total) * 100)}% pending
                            </p>
                        </div>
                    </div>
                </div>

                {/* Members Table */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
                    {/* Table Header */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <UserIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Chapter Members</h3>
                                    <p className="text-gray-300 text-sm">
                                        {joins.from}-{joins.to} of {joins.total} members
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Member</th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Channel</th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                    <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Joined</th>
                                    <th className="px-8 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>

                            <tbody className="bg-white divide-y divide-gray-100">
                                {joins.data.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-8 py-16 text-center">
                                            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
                                                <UserGroupIcon className="w-10 h-10 text-gray-400" />
                                            </div>
                                            <h3 className="text-lg font-bold text-gray-900 mb-2">No members yet</h3>
                                            <p className="text-gray-600 max-w-sm mx-auto">
                                                No members have joined this chapter yet.
                                            </p>
                                        </td>
                                    </tr>
                                ) : (
                                    joins.data.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50/80 transition-all duration-200 group">
                                            {/* Member Info */}
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg ${getStatusColor(user.premium, user.email_verified_at)}`}>
                                                        {getInitials(user.name)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-base group-hover:text-indigo-600 transition-colors">
                                                            {user.name}
                                                        </div>
                                                        <div className="flex items-center gap-2 mt-1">
                                                            {user.premium && (
                                                                <StarIcon className="w-4 h-4 text-purple-500" />
                                                            )}
                                                            {user.email_verified_at && (
                                                                <ShieldCheckIcon className="w-4 h-4 text-green-500" />
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact Info */}
                                            <td className="px-8 py-5">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <EnvelopeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        <span className="text-gray-700 text-sm font-medium">
                                                            {user.email}
                                                        </span>
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center gap-3">
                                                            <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                            <span className="text-gray-700 text-sm font-medium">
                                                                {user.phone}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="px-8 py-5">
                                                <div className="flex flex-col gap-1">

                                                    {/* channel name pill */}
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
                                                        {user.channel_name || "N/A"}
                                                    </span>

                                                    {/* channel URL */}
                                                    {user.channel_url ? (
                                                        <a
                                                            href={user.channel_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-800 hover:underline"
                                                        >
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7m0 0v7m0-7L10 14" />
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10v11h11" />
                                                            Visit Channel
                                                        </a>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">No link</span>
                                                    )}

                                                </div>
                                            </td>


                                            {/* Status */}
                                            <td className="px-8 py-5">
                                                <div className="flex flex-wrap gap-2">
                                                    {user.premium && (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200">
                                                            <StarIcon className="w-3 h-3 mr-1" />
                                                            Premium
                                                        </span>
                                                    )}
                                                    {user.email_verified_at ? (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-200">
                                                            <ShieldCheckIcon className="w-3 h-3 mr-1" />
                                                            Verified
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-orange-100 text-orange-800 border border-orange-200">
                                                            <ClockIcon className="w-3 h-3 mr-1" />
                                                            Pending
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Join Date */}
                                            <td className="px-8 py-5">
                                                <div className="text-gray-700">
                                                    <div className="text-sm font-semibold">
                                                        {new Date(user.created_at).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric',
                                                            year: 'numeric'
                                                        })}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {new Date(user.created_at).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Actions */}
                                            <td className="px-8 py-5 text-right">
                                                <button
                                                    onClick={() => {
                                                        if (confirm("Are you sure you want to remove this member from the chapter?")) {
                                                            router.delete(route("chapters.joins.remove", user.id));
                                                        }
                                                    }}
                                                    className="inline-flex items-center px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 rounded-lg border border-red-200 hover:bg-red-100 hover:text-red-700 transition-all duration-200 hover:shadow-sm"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {joins.links && joins.links.length > 3 && (
                        <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                            <div className="flex items-center justify-between">
                                <div className="text-sm text-gray-700 font-semibold">
                                    Showing {joins.from} to {joins.to} of {joins.total} results
                                </div>
                                <div className="flex gap-1">
                                    {joins.links.map((link, index) => (
                                        <button
                                            key={index}
                                            className={`
                                                min-w-[44px] h-10 px-3 
                                                flex items-center justify-center 
                                                rounded-lg text-sm font-bold transition-all duration-200
                                                ${link.active
                                                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 transform scale-105"
                                                    : "text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 hover:text-gray-900"
                                                }
                                                ${!link.url ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:shadow-md"}
                                            `}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                            onClick={() => link.url && router.get(link.url)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}