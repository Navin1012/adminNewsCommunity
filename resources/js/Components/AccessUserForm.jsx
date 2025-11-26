import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import {
    ExclamationCircleIcon,
    UserIcon,
    EnvelopeIcon,
    PhoneIcon,
    CalendarIcon,
    BriefcaseIcon,
    KeyIcon,
    CheckBadgeIcon,
    XMarkIcon
} from "@heroicons/react/24/outline";

export default function AccessUserForm({ user = null, onSubmit, submitText = "Create User", onCancel }) {
    const { data, setData, post, put, errors, processing } = useForm({
        employee_code: user?.employee_code || "",
        name: user?.name || "",
        phone_number: user?.phone_number || "",
        email: user?.email || "",
        birthdate: user?.birthdate || "",
        designation: user?.designation || "",
        role: user?.role || "employee",
        active: user?.active ?? true,
        password: "",
        password_confirmation: "",
    });

    // If editing, load existing data
    useEffect(() => {
        if (user) {
            setData({
                employee_code: user.employee_code || "",
                name: user.name || "",
                phone_number: user.phone_number || "",
                email: user.email || "",
                birthdate: user.birthdate || "",
                designation: user.designation || "",
                role: user.role || "employee",
                active: user.active ?? true,
                password: "",
                password_confirmation: "",
            });
        }
    }, [user]);

  const submit = (e) => {
    e.preventDefault();

    if (user) {
        put(route("admin.access.update", user.id), {
            preserveScroll: true,
            onSuccess: () => onCancel(),
        });
    } else {
        post(route("admin.access.store"), {
            preserveScroll: true,
            onSuccess: () => onCancel(),
        });
    }
};



    return (
        <div className="space-y-6">
            {/* Header with Close Button */}
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {user ? "Edit User" : "Create New User"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {user ? "Update user information" : "Add a new user to the system"}
                    </p>
                </div>
                <button
                    onClick={onCancel}
                    className="p-2 hover:bg-gray-100 rounded-xl transition-colors duration-200"
                >
                    <XMarkIcon className="w-6 h-6 text-gray-500" />
                </button>
            </div>

            <form onSubmit={submit} className="space-y-6">
                {/* Employee Code - Only for editing */}
                {user && (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <BriefcaseIcon className="w-4 h-4" />
                            Employee Code
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${
                                    errors.employee_code 
                                        ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10" 
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                                value={data.employee_code}
                                onChange={(e) => setData("employee_code", e.target.value)}
                                placeholder="Enter employee code"
                            />
                            {errors.employee_code && (
                                <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                            )}
                        </div>
                        {errors.employee_code && (
                            <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                <ExclamationCircleIcon className="w-4 h-4" />
                                {errors.employee_code}
                            </p>
                        )}
                    </div>
                )}

                {/* Name - Required */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        Full Name *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${
                                errors.name 
                                    ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10" 
                                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            placeholder="Enter full name"
                        />
                        {errors.name && (
                            <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                        )}
                    </div>
                    {errors.name && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                            <ExclamationCircleIcon className="w-4 h-4" />
                            {errors.name}
                        </p>
                    )}
                </div>

                {/* Email - Required */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <EnvelopeIcon className="w-4 h-4" />
                        Email Address *
                    </label>
                    <div className="relative">
                        <input
                            type="email"
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${
                                errors.email 
                                    ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10" 
                                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            placeholder="Enter email address"
                        />
                        {errors.email && (
                            <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                        )}
                    </div>
                    {errors.email && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                            <ExclamationCircleIcon className="w-4 h-4" />
                            {errors.email}
                        </p>
                    )}
                </div>

                {/* Phone Number */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <PhoneIcon className="w-4 h-4" />
                        Phone Number
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${
                                errors.phone_number 
                                    ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10" 
                                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            value={data.phone_number}
                            onChange={(e) => setData("phone_number", e.target.value)}
                            placeholder="Enter phone number"
                        />
                        {errors.phone_number && (
                            <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                        )}
                    </div>
                    {errors.phone_number && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                            <ExclamationCircleIcon className="w-4 h-4" />
                            {errors.phone_number}
                        </p>
                    )}
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Birthdate */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" />
                            Birthdate
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${
                                    errors.birthdate 
                                        ? "border-red-400 focus:ring-red-500 focus:border-red-500" 
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                                value={data.birthdate}
                                onChange={(e) => setData("birthdate", e.target.value)}
                            />
                        </div>
                        {errors.birthdate && (
                            <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                <ExclamationCircleIcon className="w-4 h-4" />
                                {errors.birthdate}
                            </p>
                        )}
                    </div>

                    {/* Designation */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <BriefcaseIcon className="w-4 h-4" />
                            Designation
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${
                                    errors.designation 
                                        ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10" 
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                                value={data.designation}
                                onChange={(e) => setData("designation", e.target.value)}
                                placeholder="Enter designation"
                            />
                            {errors.designation && (
                                <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                            )}
                        </div>
                        {errors.designation && (
                            <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                <ExclamationCircleIcon className="w-4 h-4" />
                                {errors.designation}
                            </p>
                        )}
                    </div>
                </div>

                {/* Two Column Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Role */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <CheckBadgeIcon className="w-4 h-4" />
                            Role
                        </label>
                        <select
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${
                                errors.role 
                                    ? "border-red-400 focus:ring-red-500 focus:border-red-500" 
                                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            value={data.role}
                            onChange={(e) => setData("role", e.target.value)}
                        >
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                        </select>
                        {errors.role && (
                            <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                <ExclamationCircleIcon className="w-4 h-4" />
                                {errors.role}
                            </p>
                        )}
                    </div>

                    {/* Active Toggle */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900 block mb-3">
                            Account Status
                        </label>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                checked={data.active}
                                onChange={(e) => setData("active", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-gray-300 peer-checked:bg-green-600 rounded-full after:absolute after:content-[''] after:w-5 after:h-5 after:bg-white after:top-[2px] after:left-[2px] after:rounded-full after:transition-all peer-checked:after:translate-x-full"></div>
                            <span className="ml-3 text-sm font-medium text-gray-900">
                                {data.active ? "Active" : "Inactive"}
                            </span>
                        </label>
                    </div>
                </div>

                {/* Password */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <KeyIcon className="w-4 h-4" />
                        {user ? "New Password (optional)" : "Password *"}
                    </label>
                    <div className="relative">
                        <input
                            type="password"
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${
                                errors.password 
                                    ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10" 
                                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                            }`}
                            value={data.password}
                            onChange={(e) => setData("password", e.target.value)}
                            placeholder={user ? "Leave empty to keep old password" : "Enter password"}
                        />
                        {errors.password && (
                            <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                        )}
                    </div>
                    {errors.password && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                            <ExclamationCircleIcon className="w-4 h-4" />
                            {errors.password}
                        </p>
                    )}
                </div>

                {/* Confirm Password - Only for new users */}
                {!user && (
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <KeyIcon className="w-4 h-4" />
                            Confirm Password *
                        </label>
                        <div className="relative">
                            <input
                                type="password"
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${
                                    errors.password_confirmation 
                                        ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10" 
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                                value={data.password_confirmation}
                                onChange={(e) => setData("password_confirmation", e.target.value)}
                                placeholder="Confirm your password"
                            />
                            {errors.password_confirmation && (
                                <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                            )}
                        </div>
                        {errors.password_confirmation && (
                            <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                <ExclamationCircleIcon className="w-4 h-4" />
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>
                )}

                {/* Global Form Errors */}
                {Object.keys(errors).length > 0 && (
                    <div className="p-4 border border-red-200 bg-red-50 rounded-xl">
                        <p className="text-red-800 font-medium flex items-center gap-2">
                            <ExclamationCircleIcon className="w-5 h-5" />
                            Please fix the errors below to continue
                        </p>
                    </div>
                )}

                {/* Submit Button */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={processing}
                               className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200"
            > 
                        {processing ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Please wait...
                            </>
                        ) : (
                            submitText
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
}