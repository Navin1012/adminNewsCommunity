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
    EyeSlashIcon
} from "@heroicons/react/24/outline";

export default function Joins({ event, users }) {
    const admin = usePage().props.auth.admin;

    const formatDate = (dateString) => {
        if (!dateString) return "No date scheduled";
        return new Date(dateString).toLocaleDateString('en-US', {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
                {/* Event Information Card */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200 p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
                                    <CalendarIcon className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">{event.title}</h1>
                                    <p className="text-gray-600 mt-1">{event.excerpt || "No description available"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <CalendarIcon className="w-5 h-5 text-blue-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Event Date</p>
                                        <p className="font-semibold text-gray-900">{formatDate(event.start_at)}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    <UserGroupIcon className="w-5 h-5 text-green-600" />
                                    <div>
                                        <p className="text-sm text-gray-600">Participants</p>
                                        <p className="font-semibold text-gray-900">{users.length} joined</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                    {event.is_published ? (
                                        <EyeIcon className="w-5 h-5 text-green-600" />
                                    ) : (
                                        <EyeSlashIcon className="w-5 h-5 text-gray-600" />
                                    )}
                                    <div>
                                        <p className="text-sm text-gray-600">Status</p>
                                        <p className={`font-semibold ${
                                            event.is_published ? 'text-green-600' : 'text-gray-600'
                                        }`}>
                                            {event.is_published ? "Published" : "Draft"}
                                        </p>
                                    </div>
                                </div>

                                {event.location && (
                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                                        <MapPinIcon className="w-5 h-5 text-red-600" />
                                        <div>
                                            <p className="text-sm text-gray-600">Location</p>
                                            <p className="font-semibold text-gray-900 truncate">{event.location}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Event Image */}
                        {event.image && (
                            <div className="lg:w-48 lg:h-48 rounded-2xl overflow-hidden border border-gray-200">
                                <img
                                    src={event.image}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                </div>

                {/* Participants Section */}
                <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200 overflow-hidden">
                    {/* Header */}
                    <div className="px-8 py-6 border-b border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <UserGroupIcon className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900">Event Participants</h3>
                                    <p className="text-gray-600 text-sm mt-1">
                                        {users.length} user{users.length !== 1 ? 's' : ''} joined this event
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-xl border border-blue-100">
                                <span className="text-blue-900 font-semibold">
                                    Total: {users.length}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Participants Grid */}
                    <div className="p-8">
                        {users.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-inner">
                                    <UserGroupIcon className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">No participants yet</h3>
                                <p className="text-gray-600 max-w-sm mx-auto">
                                    Users haven't joined this event yet. Share the event to get participants.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {users.map((item) => (
                                    <div
                                        key={item.join_id}
                                        className="bg-white rounded-2xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
                                    >
                                        {/* User Header */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg">
                                                {getInitials(item.user?.name)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 text-lg truncate group-hover:text-blue-600 transition-colors">
                                                    {item.user?.name || "User deleted"}
                                                </h4>
                                                <p className="text-gray-500 text-sm truncate">
                                                    {item.user?.email || "Email not available"}
                                                </p>
                                            </div>
                                        </div>

                                        {/* User Details */}
                                        <div className="space-y-3">
                                            {/* Mobile */}
                                            <div className="flex items-center gap-3 text-sm">
                                                <PhoneIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-600">Mobile:</span>
                                                <span className="text-gray-900 font-medium">
                                                    {item.user?.mobile || "Not provided"}
                                                </span>
                                            </div>

                                            {/* Join Status */}
                                            <div className="flex items-center gap-3 text-sm">
                                                <CheckBadgeIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-600">Status:</span>
                                                <span className={`font-semibold ${
                                                    item.status === "joined" 
                                                        ? "text-green-600" 
                                                        : "text-red-600"
                                                }`}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
                                            </div>

                                            {/* Join Date */}
                                            <div className="flex items-center gap-3 text-sm">
                                                <ClockIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />
                                                <span className="text-gray-600">Joined:</span>
                                                <span className="text-gray-900 font-medium">
                                                    {new Date(item.joined_at).toLocaleDateString('en-US', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        year: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                                item.status === "joined"
                                                    ? "bg-green-100 text-green-800 border border-green-200"
                                                    : "bg-red-100 text-red-800 border border-red-200"
                                            }`}>
                                                <span className={`w-2 h-2 rounded-full mr-2 ${
                                                    item.status === "joined" ? "bg-green-500" : "bg-red-500"
                                                }`}></span>
                                                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}