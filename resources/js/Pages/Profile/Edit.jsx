import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Head } from '@inertiajs/react';

export default function Edit({ auth, mustVerifyEmail, status }) {
    return (
        <AuthenticatedLayout 
            admin={auth.admin}  // ✔ Admin injected
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Admin Profile</h2>}
        >
            <Head title="Admin Profile" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                            isAdmin={true} // ✔ So inside form we know it's admin
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <UpdatePasswordForm 
                            className="max-w-xl"
                            isAdmin={true}  // ✔ For admin password update route
                        />
                    </div>

                    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
                        <DeleteUserForm 
                            className="max-w-xl"
                            isAdmin={true}  // ✔ For admin deletion
                        />
                    </div>

                </div>
            </div>
        </AuthenticatedLayout>
    );
}
