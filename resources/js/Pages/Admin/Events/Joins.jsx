import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import {
    CalendarIcon,
    UserGroupIcon,
    EnvelopeIcon,
    PhoneIcon,
    CheckBadgeIcon,
    ClockIcon,
    MapPinIcon,
    EyeIcon,
    EyeSlashIcon,
    DocumentTextIcon,
    LinkIcon,
    UserIcon
} from "@heroicons/react/24/outline";

export default function Joins({ event, users }) {
    const admin = usePage().props.auth.admin;

    const formatDate = (dateString) => {
        if (!dateString) return "Not set";
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const getStatusColor = (isPublished) => {
        return isPublished
            ? "bg-green-100 text-green-800 border-green-200"
            : "bg-gray-100 text-gray-800 border-gray-200";
    };

    return (
        <AuthenticatedLayout
            admin={admin}
            header={
                <h2 className="text-2xl font-bold text-gray-900">
                    Event Participants
                </h2>
            }
        >
            <Head title="Joined Users" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 space-y-8">
                {/* Event Information Card - Complete Details */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6 flex items-center justify-between">

                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                <DocumentTextIcon className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-white">Event Details</h1>
                                <p className="text-gray-300 text-sm mt-1">Complete information about this event</p>
                            </div>
                        </div>

                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white text-sm hover:bg-white/20 transition"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back
                        </button>
                    </div>


                    <div className="p-8">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                            {/* Left Column - Basic Info */}
                            <div className="xl:col-span-2 space-y-6">
                                {/* Title & Slug */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Title</label>
                                        <p className="text-gray-900 font-bold text-lg leading-tight">{event.title}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Slug</label>
                                        <p className="text-gray-700 font-semibold text-sm font-mono bg-gray-200/50 px-3 py-1 rounded-lg inline-block">{event.slug}</p>
                                    </div>
                                </div>

                                {/* Excerpt & Content */}
                                <div className="space-y-6">
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Excerpt</label>
                                        <p className="text-gray-700 leading-relaxed">{event.excerpt || <span className="text-gray-400 italic">No excerpt provided</span>}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 block">Content</label>
                                        <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-white/50 p-4 rounded-lg border border-gray-200">
                                            {event.content || <span className="text-gray-400 italic">No content provided</span>}
                                        </div>
                                    </div>
                                </div>

                                {/* Date & Time */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
                                                <CalendarIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-blue-700 uppercase tracking-wider">Start Date & Time</label>
                                            </div>
                                        </div>
                                        <p className="text-gray-900 font-bold text-sm">{formatDate(event.start_at)}</p>
                                    </div>
                                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-purple-500 rounded-xl flex items-center justify-center">
                                                <CalendarIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-purple-700 uppercase tracking-wider">End Date & Time</label>
                                            </div>
                                        </div>
                                        <p className="text-gray-900 font-bold text-sm">{formatDate(event.end_at)}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Additional Info */}
                            <div className="space-y-6">
                                {/* Location */}
                                {event.location && (
                                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200 shadow-sm">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center">
                                                <MapPinIcon className="w-5 h-5 text-white" />
                                            </div>
                                            <div>
                                                <label className="text-xs font-bold text-orange-700 uppercase tracking-wider">Location</label>
                                            </div>
                                        </div>
                                        <p className="text-gray-900 font-bold">{event.location}</p>
                                    </div>
                                )}

                                {/* Status */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">Publication Status</label>
                                    <div className="flex items-center gap-3">
                                        <span className={`inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-bold border-2 ${event.is_published
                                                ? "bg-green-100 text-green-800 border-green-300 shadow-green-100 shadow-sm"
                                                : "bg-gray-200 text-gray-700 border-gray-300 shadow-gray-100 shadow-sm"
                                            }`}>
                                            {event.is_published ? (
                                                <EyeIcon className="w-5 h-5 mr-2" />
                                            ) : (
                                                <EyeSlashIcon className="w-5 h-5 mr-2" />
                                            )}
                                            {event.is_published ? "Published" : "Draft"}
                                        </span>
                                    </div>
                                </div>

                                {/* Image */}
                                {event.image && (
                                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200 shadow-sm">
                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 block">Event Image</label>
                                        <div className="rounded-xl overflow-hidden border-2 border-gray-300 shadow-inner">
                                            <img
                                                src={event.image}
                                                alt={event.title}
                                                className="w-full h-40 object-cover transform hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    </div>
                                )}


                            </div>
                        </div>
                    </div>
                </div>

                {/* Participants Section */}
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                                    <UserGroupIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white">Event Participants</h3>
                                    <p className="text-gray-300 text-sm mt-1">
                                        {users.total} user{users.total !== 1 ? 's' : ''} joined this event
                                    </p>
                                </div>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/20">
                                <span className="text-white font-bold text-1xl">
                                    Total: <span className="text-1xl">{users.total}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Participants Table */}
                    {users.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center shadow-inner">
                                <UserGroupIcon className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">No participants yet</h3>
                            <p className="text-gray-600 max-w-sm mx-auto mb-6 leading-relaxed">
                                Users haven't joined this event yet. Share the event to get participants.
                            </p>
                            <button className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-xl font-bold shadow-lg hover:bg-gray-900 transition-all duration-200 hover:shadow-xl transform hover:scale-105">
                                <EnvelopeIcon className="w-5 h-5 mr-2" />
                                Share Event
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">User</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Contact</th>
                                        <th className="px-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Join Date</th>
                                        <th className="px-8 py-4 text-center text-xs font-bold text-gray-700 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {users.data.map((item) => (
                                        <tr key={item.join_id} className="hover:bg-gray-50/80 transition-all duration-200 group">
                                            {/* User Info */}
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:scale-110 transition-transform duration-200">
                                                        {getInitials(item.user?.name)}
                                                    </div>
                                                    <div>
                                                        <div className="font-bold text-gray-900 text-base group-hover:text-gray-600 transition-colors">
                                                            {item.user?.name || "User deleted"}
                                                        </div>
                                                        <div className="flex items-center gap-1 mt-1">
                                                            <CheckBadgeIcon className="w-4 h-4 text-green-500" />
                                                            <span className="text-xs text-gray-500">Participant</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Contact Info */}
                                            <td className="px-8 py-5">
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3">
                                                        <EnvelopeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        <span className="text-gray-700 text-sm font-medium truncate max-w-xs">
                                                            {item.user?.email || "Email not available"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                        <span className="text-gray-700 text-sm font-medium">
                                                            {item.user?.mobile || "Not provided"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Join Date */}
                                            <td className="px-8 py-5">
                                                <div className="flex items-center gap-3 text-gray-700">
                                                    <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                    <div>
                                                        <div className="text-sm font-semibold">
                                                            {new Date(item.joined_at).toLocaleDateString('en-US', {
                                                                month: 'short',
                                                                day: 'numeric',
                                                                year: 'numeric'
                                                            })}
                                                        </div>
                                                        <div className="text-xs text-gray-500">
                                                            {new Date(item.joined_at).toLocaleTimeString('en-US', {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>

                                            {/* Status */}
                                            <td className="px-8 py-5">
                                                <div className="flex justify-center">
                                                    <span className={`inline-flex items-center px-4 py-2 rounded-xl text-sm font-bold border-2 ${item.status === "joined"
                                                            ? "bg-green-100 text-green-800 border-green-300 shadow-green-100 shadow-sm"
                                                            : "bg-gray-200 text-gray-700 border-gray-300 shadow-gray-100 shadow-sm"
                                                        }`}>
                                                        <span className={`w-2 h-2 rounded-full mr-2 ${item.status === "joined" ? "bg-green-500" : "bg-gray-500"
                                                            }`}></span>
                                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                    </span>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Pagination */}
                            {users.links && users.links.length > 2 && (
                                <div className="px-8 py-6 border-t border-gray-200 bg-gray-50">
                                    <div className="flex justify-center">
                                        <div className="flex gap-1 bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                                            {users.links.map((link, index) => (
                                                <button
                                                    key={index}
                                                    className={`
                                                    min-w-[44px] h-10 px-3 
                                                    flex items-center justify-center 
                                                    rounded-lg text-sm font-bold transition-all duration-200
                                                    ${link.active
                                                            ? "bg-gradient-to-r from-gray-600 to-gray-600 text-white shadow-lg shadow-indigo-500/30 transform scale-105"
                                                            : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                                                        }
                                                    ${!link.url ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:shadow-md"}
                                                `}
                                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                                    onClick={() => {
                                                        if (link.url) Inertia.get(link.url);
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}