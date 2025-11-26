import { Link, Head } from "@inertiajs/react";
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
    XMarkIcon,
    EyeIcon
} from "@heroicons/react/24/outline";

export default function ChapterJoins({ auth, chapter, joins }) {
    const verifiedCount = joins.filter(u => u.email_verified_at).length;
    const premiumCount = joins.filter(u => u.premium).length;

    return (
        <AuthenticatedLayout
            admin={auth.admin}
            header={
                <h2 className="font-semibold text-xl text-gray-800 flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    Chapter Members
                </h2>
            }
        >
            <Head title={`${chapter.title} - Members`} />

            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="flex flex-col gap-4 mb-8 md:flex-row md:items-center md:justify-between">

                    {/* Left */}
                    <div className="flex-1">


                        <h1 className="mt-3 text-2xl font-bold text-gray-900">
                            {chapter.title}
                            <span className="text-gray-500"> – Joined Members</span>
                        </h1>

                        <p className="mt-1 text-sm text-gray-600">
                            Manage and view all members who have joined this chapter
                        </p>
                    </div>


                    <Link
                        onClick={(e) => {
                            e.preventDefault();
                            window.history.back();
                        }}
                        className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200"
                    >
                        <ArrowLeftIcon className="w-5 h-5" />
                        <span>Back to Chapters</span>
                    </Link>


                </div>


                {/* Stats Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-blue-100 rounded-md p-3">
                                    <UserIcon className="h-6 w-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Members</dt>
                                    <dd className="text-2xl font-semibold text-gray-900">{joins.length}</dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
                                    <CheckBadgeIcon className="h-6 w-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Verified</dt>
                                    <dd className="text-2xl font-semibold text-green-600">{verifiedCount}</dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-purple-100 rounded-md p-3">
                                    <CheckBadgeIcon className="h-6 w-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Premium</dt>
                                    <dd className="text-2xl font-semibold text-purple-600">{premiumCount}</dd>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                        <div className="px-4 py-5 sm:p-6">
                            <div className="flex items-center">
                                <div className="flex-shrink-0 bg-orange-100 rounded-md p-3">
                                    <ClockIcon className="h-6 w-6 text-orange-600" />
                                </div>
                                <div className="ml-4">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Pending</dt>
                                    <dd className="text-2xl font-semibold text-orange-600">{joins.length - verifiedCount}</dd>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Members Table */}
                <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Member
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Contact
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Channel
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Joined
                                    </th>

                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {joins.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center">
                                            <div className="flex flex-col items-center justify-center">
                                                <UserIcon className="w-16 h-16 text-gray-400 mb-4" />
                                                <h3 className="text-lg font-medium text-gray-900 mb-2">No members joined yet</h3>
                                                <p className="text-gray-500 mb-4">Members will appear here once they join this chapter.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    joins.map((user, index) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-150">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0 h-10 w-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center">
                                                        <UserIcon className="h-5 w-5 text-blue-600" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div className="flex items-center text-sm text-gray-900">
                                                        <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                        {user.email}
                                                    </div>
                                                    {user.phone && (
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <PhoneIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                            {user.phone}
                                                        </div>
                                                    )}
                                                    {user.address && (
                                                        <div className="flex items-center text-sm text-gray-500">
                                                            <MapPinIcon className="h-4 w-4 text-gray-400 mr-2" />
                                                            <span className="truncate max-w-xs">{user.address}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-1">
                                                    <div className="text-sm font-medium text-gray-900">{user.channel_name || 'N/A'}</div>
                                                    {user.channel_url && (
                                                        <a
                                                            href={user.channel_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center text-xs text-blue-600 hover:text-blue-800 transition-colors"
                                                        >
                                                            <LinkIcon className="h-3 w-3 mr-1" />
                                                            Visit Channel
                                                        </a>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="space-y-2">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.premium
                                                        ? 'bg-purple-100 text-purple-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {user.premium ? 'Premium' : 'Standard'}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.email_verified_at
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-yellow-100 text-yellow-800'
                                                        }`}>
                                                        {user.email_verified_at ? 'Verified' : 'Pending'}
                                                    </span>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.payment_status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : user.payment_status === 'pending'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-red-100 text-red-800'
                                                        }`}>
                                                        {user.payment_status || 'N/A'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                <div className="flex items-center">
                                                    <ClockIcon className="h-4 w-4 text-gray-400 mr-1" />
                                                    {new Date(user.created_at).toLocaleDateString()}
                                                </div>
                                                <div className="text-xs text-gray-400 mt-1">
                                                    {new Date(user.created_at).toLocaleTimeString()}
                                                </div>
                                            </td>

                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Summary Footer */}
                {joins.length > 0 && (
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <div>
                            Showing <span className="font-medium">{joins.length}</span> member{joins.length !== 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center">
                                <div className="w-3 h-3 bg-green-100 border border-green-300 rounded-full mr-1"></div>
                                Verified: {verifiedCount}
                            </span>
                            <span className="flex items-center">
                                <div className="w-3 h-3 bg-purple-100 border border-purple-300 rounded-full mr-1"></div>
                                Premium: {premiumCount}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}