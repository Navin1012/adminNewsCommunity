import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function FacebookUsersList({ auth, users = [] }) {
    return (
        <AuthenticatedLayout admin={auth?.admin}>
            <Head title="Facebook Users" />

            <div className="max-w-7xl mx-auto px-4 py-6">

                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">
                        Facebook Connected Users
                    </h1>
                    <p className="text-sm text-gray-500">
                        List of users who connected Facebook pages
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left">Name</th>
                                <th className="px-4 py-3 text-left">Email</th>
                                <th className="px-4 py-3 text-left">Facebook ID</th>
                                <th className="px-4 py-3 text-center">Pages</th>
                                <th className="px-4 py-3 text-center">Action</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {users.length === 0 && (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        No Facebook users found
                                    </td>
                                </tr>
                            )}

                            {users.map((u) => (
                                <tr key={u.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3 font-medium">
                                        {u.name}
                                    </td>
                                    <td className="px-4 py-3">
                                        {u.email}
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {u.facebook_id}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        {u.pages_count}
                                    </td>
                                    <td className="px-4 py-3 text-center">
                                        <button
                                            onClick={() =>
                                                router.get(
                                                    route("social.analysis"),
                                                    {
                                                        user_id: u.user_id,   
                                                        days: 7               
                                                    },
                                                    {
                                                        preserveState: false,
                                                        replace: true
                                                    }
                                                )
                                            }
                                            className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-xs hover:bg-indigo-700"
                                        >
                                            View Analytics
                                        </button>

                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
