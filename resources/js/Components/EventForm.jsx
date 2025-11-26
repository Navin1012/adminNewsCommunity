import { useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
    XMarkIcon,
    PhotoIcon,
    CalendarIcon,
    MapPinIcon,
    DocumentTextIcon,
    TagIcon,
    GlobeAltIcon,
    ClockIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function EventForm({ event = null, onCancel, onSuccess }) {
    const [imagePreview, setImagePreview] = useState(null);

    const { data, setData, post, processing, errors } = useForm({
        title: event?.title || "",
        excerpt: event?.excerpt || "",
        content: event?.content || "",
        start_at: event?.start_at ? event.start_at.slice(0, 16) : "",
        end_at: event?.end_at ? event.end_at.slice(0, 16) : "",
        location: event?.location || "",
        image: null,
        is_published: event?.is_published || true,
    });

    // Load old image when editing
    useEffect(() => {
        if (event) {
            setData({
                title: event.title || "",
                excerpt: event.excerpt || "",
                content: event.content || "",
                start_at: event.start_at ? event.start_at.slice(0, 16) : "",
                end_at: event.end_at ? event.end_at.slice(0, 16) : "",
                location: event.location || "",
                image: null,
                is_published: event.is_published || "",
            });

            if (event.image) {
                setImagePreview(event.image);
            }
        }
    }, [event]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("image", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setImagePreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setData("image", null);     // no new image
        setData("remove_image", true);  // tell backend to delete old image
        setImagePreview(null);      // remove preview
    };


    const submit = (e) => {
        e.preventDefault();

        const routeName = event
            ? route("admin.events.update", event.id)
            : route("admin.events.store");

        post(routeName, {
            onSuccess: () => onSuccess && onSuccess(),
        });
    };

    return (
        <>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                        {event ? "Edit Event" : "Create New Event"}
                    </h2>
                    <p className="text-gray-600 mt-1">
                        {event
                            ? "Update event details"
                            : "Fill in the details to create a new event"}
                    </p>
                </div>

                <button
                    onClick={onCancel}
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
                        <TagIcon className="w-4 h-4" /> Event Title *
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
                            placeholder="Enter event title..."

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

                {/* Excerpt */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <DocumentTextIcon className="w-4 h-4" /> Short Description
                    </label>
                    <div className="relative">
                        <textarea
                            rows="3"
                            value={data.excerpt}
                            onChange={(e) => setData("excerpt", e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${errors.excerpt
                                    ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10"
                                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                            placeholder="Brief description..."
                        />
                        {errors.excerpt && (
                            <ExclamationCircleIcon className="absolute right-3 top-4 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                        )}
                    </div>
                    {errors.excerpt && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                            <ExclamationCircleIcon className="w-4 h-4" />
                            {errors.excerpt}
                        </p>
                    )}
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <GlobeAltIcon className="w-4 h-4" /> Full Content
                    </label>
                    <div className="relative">
                        <textarea
                            rows="6"
                            value={data.content}
                            onChange={(e) => setData("content", e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${errors.content
                                    ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10"
                                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                            placeholder="Full description..."
                        />
                        {errors.content && (
                            <ExclamationCircleIcon className="absolute right-3 top-4 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                        )}
                    </div>
                    {errors.content && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                            <ExclamationCircleIcon className="w-4 h-4" />
                            {errors.content}
                        </p>
                    )}
                </div>

                {/* Dates */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Start Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <CalendarIcon className="w-4 h-4" /> Start Date *
                        </label>
                        <div className="relative">
                            <input
                                type="datetime-local"
                                value={data.start_at}
                                onChange={(e) => setData("start_at", e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${errors.start_at
                                        ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10"
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    }`}

                            />
                            {errors.start_at && (
                                <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                            )}
                        </div>
                        {errors.start_at && (
                            <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                <ExclamationCircleIcon className="w-4 h-4" />
                                {errors.start_at}
                            </p>
                        )}
                    </div>

                    {/* End Date */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                            <ClockIcon className="w-4 h-4" /> End Date *
                        </label>
                        <div className="relative">
                            <input
                                type="datetime-local"
                                value={data.end_at}
                                onChange={(e) => setData("end_at", e.target.value)}
                                className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${errors.end_at
                                        ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10"
                                        : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                    }`}

                            />
                            {errors.end_at && (
                                <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                            )}
                        </div>
                        {errors.end_at && (
                            <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                                <ExclamationCircleIcon className="w-4 h-4" />
                                {errors.end_at}
                            </p>
                        )}
                    </div>
                </div>

                {/* Location */}
                <div className="space-y-2">
                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" /> Location *
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            value={data.location}
                            onChange={(e) => setData("location", e.target.value)}
                            className={`w-full px-4 py-3 rounded-xl border bg-white focus:ring-2 transition-all duration-200 ${errors.location
                                    ? "border-red-400 focus:ring-red-500 focus:border-red-500 pr-10"
                                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                                }`}
                            placeholder="Venue or online..."

                        />
                        {errors.location && (
                            <ExclamationCircleIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500" />
                        )}
                    </div>
                    {errors.location && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                            <ExclamationCircleIcon className="w-4 h-4" />
                            {errors.location}
                        </p>
                    )}
                </div>

                {/* Image Upload */}
                <div className="space-y-4">
                    <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                        <PhotoIcon className="w-4 h-4" /> Event Image
                    </label>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Upload Box */}
                        <div className="relative">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                                errors.image ? 'border-red-400 bg-red-50' : 'border-gray-300 hover:bg-gray-50'
                            }">
                                <div className="text-center">
                                    <PhotoIcon className={`w-8 h-8 mx-auto ${errors.image ? 'text-red-400' : 'text-gray-400'
                                        }`} />
                                    <p className={`text-sm mt-1 ${errors.image ? 'text-red-600' : 'text-gray-500'
                                        }`}>
                                        Upload Image
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />
                            </label>
                            {errors.image && (
                                <ExclamationCircleIcon className="absolute right-3 top-3 w-5 h-5 text-red-500" />
                            )}
                        </div>

                        {/* Preview */}
                        <div className={`relative h-32 rounded-xl border overflow-hidden flex items-center justify-center transition-all duration-200 ${errors.image ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-gray-50'
                            }`}>
                            {imagePreview ? (
                                <>
                                    <img
                                        src={imagePreview}
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
                                    {data.remove_image && (
                                        <input type="hidden" name="remove_image" value="1" />
                                    )}

                                </>
                            ) : (
                                <p className={`${errors.image ? 'text-red-600' : 'text-gray-500'}`}>
                                    No image selected
                                </p>
                            )}
                        </div>
                    </div>
                    {errors.image && (
                        <p className="text-red-600 text-sm font-medium flex items-center gap-1">
                            <ExclamationCircleIcon className="w-4 h-4" />
                            {errors.image}
                        </p>
                    )}
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center justify-between p-4 border rounded-xl bg-gray-50">
                    <div>
                        <h4 className="font-semibold">Publish Event</h4>
                        <p className="text-gray-600 text-sm">
                            {data.is_published ? "Visible to users" : "Hidden from users"}
                        </p>
                    </div>

                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={data.is_published}
                            onChange={(e) => setData("is_published", e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-300 peer-checked:bg-blue-600 rounded-full after:absolute after:content-[''] after:w-5 after:h-5 after:bg-white after:top-[2px] after:left-[2px] after:rounded-full after:transition-all peer-checked:after:translate-x-full" />
                    </label>
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
                        onClick={onCancel}
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
                                {event ? "Updating..." : "Creating..."}
                            </>
                        ) : (
                            event ? "Update Event" : "Create Event"
                        )}
                    </button>
                </div>
            </form>
        </>
    );
}