import { useEffect, useState, useRef } from "react";
import { useForm } from "@inertiajs/react";
import {
    XMarkIcon,
    PhotoIcon,
    MapPinIcon,
    UsersIcon,
    DocumentTextIcon,
    TagIcon,
    ChartBarIcon,
    ExclamationCircleIcon,
    CheckCircleIcon,
    NoSymbolIcon
} from "@heroicons/react/24/outline";

export default function CreateChapterModal({ open, onClose, chapter }) {
    const isEdit = !!chapter;
    const [preview, setPreview] = useState(null);
    const modalRef = useRef(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: chapter?.title ?? "",
        state: chapter?.state ?? "",
        total_members: chapter?.total_members ?? "",
        description: chapter?.description ?? "",
        icon: null,
        status: chapter?.status ?? "active",
        remove_icon: false,
    });

    // Handle outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        if (open) {
            document.addEventListener("mousedown", handleClickOutside);
            // Hide scrollbar
            document.body.style.overflow = "hidden";
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            // Restore scrollbar
            document.body.style.overflow = "unset";
        };
    }, [open, onClose]);

    // Load edit data
    useEffect(() => {
        if (!open || !chapter) return;

        setData({
            title: chapter.title,
            state: chapter.state,
            total_members: chapter.total_members,
            description: chapter.description,
            icon: null,
            status: chapter.status,
            remove_icon: false,
        });

        setPreview(chapter.icon);
    }, [open, chapter]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("icon", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreview(null);
        setData("icon", null);
        setData("remove_icon", true);
    };

    const submit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        Object.keys(data).forEach((key) => {
            if (key !== "icon") formData.append(key, data[key]);
        });

        if (data.icon) {
            formData.append("icon", data.icon);
        }

        const routeName = isEdit
            ? route("chapters.update", { id: chapter.id })
            : route("chapters.store");

        post(routeName, {
            data: formData,
            method: isEdit ? "post" : "post",
            forceFormData: true,
            onSuccess: () => {
                reset();
                onClose();
            }
        });
    };

    useEffect(() => {
        if (!open) {
            reset();
            setPreview(null);
        }
    }, [open]);

    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-50 p-4">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" // Changed max-w-2xl to max-w-4xl
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                <style jsx>{`
                .bg-white::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
                <div className="p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                {isEdit ? "Edit Chapter" : "Create New Chapter"}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                {isEdit
                                    ? "Update chapter details and information"
                                    : "Fill in the details to create a new chapter"}
                            </p>
                        </div>

                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-xl transition"
                        >
                            <XMarkIcon className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    {/* FORM */}
                    <form onSubmit={submit} className="space-y-8" encType="multipart/form-data">

                        {/* Title - Required Field */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <TagIcon className="w-4 h-4" /> Chapter Title *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={data.title}
                                    onChange={(e) => setData("title", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${errors.title
                                            ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10"
                                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        }`}
                                    placeholder="Enter chapter title..."
                                />
                                {errors.title && (
                                    <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                                )}
                            </div>
                            {errors.title && (
                                <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                    <ExclamationCircleIcon className="w-4 h-4" />
                                    {errors.title}
                                </p>
                            )}
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <MapPinIcon className="w-4 h-4" /> State/Location *
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={data.state}
                                    onChange={(e) => setData("state", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${errors.state
                                            ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10"
                                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        }`}
                                    placeholder="Enter state or location..."
                                />
                                {errors.state && (
                                    <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                                )}
                            </div>
                            {errors.state && (
                                <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                    <ExclamationCircleIcon className="w-4 h-4" />
                                    {errors.state}
                                </p>
                            )}
                        </div>

                        {/* Total Members */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <UsersIcon className="w-4 h-4" /> Total Members
                            </label>
                            <div className="relative">
                                <input
                                    type="number"
                                    value={data.total_members}
                                    onChange={(e) => setData("total_members", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${errors.total_members
                                            ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10"
                                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        }`}
                                    placeholder="Enter total number of members..."
                                />
                                {errors.total_members && (
                                    <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                                )}
                            </div>
                            {errors.total_members && (
                                <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                    <ExclamationCircleIcon className="w-4 h-4" />
                                    {errors.total_members}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <DocumentTextIcon className="w-4 h-4" /> Description
                            </label>
                            <div className="relative">
                                <textarea
                                    rows="4"
                                    value={data.description}
                                    onChange={(e) => setData("description", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${errors.description
                                            ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10"
                                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        }`}
                                    placeholder="Enter chapter description..."
                                />
                                {errors.description && (
                                    <ExclamationCircleIcon className="absolute right-3 top-4 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                                )}
                            </div>
                            {errors.description && (
                                <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                    <ExclamationCircleIcon className="w-4 h-4" />
                                    {errors.description}
                                </p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <PhotoIcon className="w-4 h-4" /> Chapter Icon
                            </label>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Upload Box */}
                                <div className="relative">
                                    <label className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${errors.icon ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:bg-gray-50'
                                        }`}>
                                        <div className="text-center">
                                            <PhotoIcon className={`w-8 h-8 mx-auto ${errors.icon ? 'text-red-400' : 'text-gray-400'
                                                }`} />
                                            <p className={`text-sm mt-1 ${errors.icon ? 'text-red-600' : 'text-gray-500'
                                                }`}>
                                                Upload Icon
                                            </p>
                                        </div>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    </label>
                                    {errors.icon && (
                                        <ExclamationCircleIcon className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                                    )}
                                </div>

                                {/* Preview */}
                                <div className={`relative h-32 rounded-xl border overflow-hidden flex items-center justify-center transition-all duration-200 ${errors.icon ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'
                                    }`}>
                                    {preview ? (
                                        <>
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="object-cover w-full h-full"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <p className={`${errors.icon ? 'text-red-600' : 'text-gray-500'}`}>
                                            No icon selected
                                        </p>
                                    )}
                                </div>
                            </div>
                            {errors.icon && (
                                <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                    <ExclamationCircleIcon className="w-4 h-4" />
                                    {errors.icon}
                                </p>
                            )}
                        </div>

                        {/* Status */}
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                                <ChartBarIcon className="w-4 h-4" /> Status
                            </label>
                            <div className="relative">
                                <select
                                    value={data.status}
                                    onChange={(e) => setData("status", e.target.value)}
                                    className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${errors.status
                                            ? "border-red-400 focus:ring-red-500 focus:border-red-500"
                                            : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                        }`}
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                                {errors.status && (
                                    <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                                )}
                            </div>
                            {errors.status && (
                                <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                    <ExclamationCircleIcon className="w-4 h-4" />
                                    {errors.status}
                                </p>
                            )}
                        </div>

                        {/* Global Form Errors */}
                        {Object.keys(errors).length > 0 && (
                            <div className="p-4 border border-red-200 bg-red-50 rounded-xl">
                                <p className="text-red-800 font-medium flex items-center gap-2">
                                    <ExclamationCircleIcon className="w-5 h-5" />
                                    Please fix the errors below to continue
                                </p>
                            </div>
                        )}

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-200"
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={processing}
                                  className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200"
            > 
                                {processing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        {isEdit ? "Updating..." : "Creating..."}
                                    </>
                                ) : (
                                    isEdit ? "Update Chapter" : "Create Chapter"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}