import { useEffect, useState, useRef } from "react";
import { useForm } from "@inertiajs/react";

import {
    XMarkIcon,
    TagIcon,
    DocumentTextIcon,
    UserIcon,
    PhotoIcon,
    ClockIcon,
    RectangleGroupIcon,
    ExclamationCircleIcon
} from "@heroicons/react/24/outline";

export default function CreateNewsArticleModal({ open, onClose, article }) {
    const isEdit = !!article;
    const modalRef = useRef(null);
    const [preview, setPreview] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        title: "",
        summary: "",
        content: "",
        category: "",
        author: "",
        read_time: "",
        image: null,
        remove_image: false,
    });


    useEffect(() => {
        const handleClick = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) {
                onClose();
            }
        };

        if (open) document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [open]);


    useEffect(() => {
        if (!open) {
            reset();
            setPreview(null);
        }
    }, [open]);


    useEffect(() => {
        if (!open || !article) return;

        setData({
            title: article.title,
            summary: article.summary,
            content: article.content,
            category: article.category,
            author: article.author,
            read_time: article.read_time,
            image: null,
            remove_image: false,
        });

        setPreview(article.image);
    }, [open, article]);

    const handleImage = (e) => {
        const file = e.target.files[0];
        setData("image", file);

        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setPreview(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const removeImage = () => {
        setPreview(null);
        setData("image", null);
        setData("remove_image", true);
    };



    const submit = (e) => {
        e.preventDefault();

        const form = new FormData();

        form.append("title", data.title);
        form.append("summary", data.summary);
        form.append("content", data.content);
        form.append("category", data.category);
        form.append("author", data.author);
        form.append("read_time", data.read_time);

        if (data.remove_image === true) {
            form.append("remove_image", true);
        }

        if (data.image instanceof File) {
            form.append("image", data.image);
        }

        if (isEdit) {
            form.append("_method", "PUT");
        }

        post(
            isEdit ? route("news.update", article.id) : route("news.store"),
            {
                data: form,
                forceFormData: true,
                onSuccess: () => {
                    reset();
                    onClose();
                },
            }
        );
    };



    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center backdrop-blur-sm z-50 p-4">
            <div
                ref={modalRef}
                className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto"
            >
                <div className="p-8">

                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-2xl font-bold">
                                {isEdit ? "Edit Article" : "Create New Article"}
                            </h2>
                            <p className="text-gray-600">
                                {isEdit
                                    ? "Update the article details below"
                                    : "Fill in details to publish a news article"}
                            </p>
                        </div>

                        <button onClick={onClose} className="hover:bg-gray-100 p-2 rounded-xl">
                            <XMarkIcon className="w-6 h-6 text-gray-500" />
                        </button>
                    </div>

                    {/* FORM */}
                    <form onSubmit={submit} className="space-y-8" encType="multipart/form-data">

                        {/* Title */}
                        <Field
                            label="Article Title *"
                            icon={TagIcon}
                            value={data.title}
                            placeholder="Enter title..."
                            error={errors.title}
                            onChange={(e) => setData("title", e.target.value)}
                        />

                        {/* Summary */}
                        <Field
                            label="Summary *"
                            icon={DocumentTextIcon}
                            type="textarea"
                            rows="3"
                            value={data.summary}
                            error={errors.summary}
                            placeholder="Short summary..."
                            onChange={(e) => setData("summary", e.target.value)}
                        />

                        {/* Content */}
                        <Field
                            label="Content *"
                            icon={RectangleGroupIcon}
                            type="textarea"
                            rows="6"
                            value={data.content}
                            error={errors.content}
                            placeholder="Full article content..."
                            onChange={(e) => setData("content", e.target.value)}
                        />

                        {/* Category */}
                        <Field
                            label="Category"
                            icon={TagIcon}
                            value={data.category}
                            placeholder="News category..."
                            error={errors.category}
                            onChange={(e) => setData("category", e.target.value)}
                        />

                        {/* Author */}
                        <Field
                            label="Author"
                            icon={UserIcon}
                            value={data.author}
                            placeholder="Article author..."
                            error={errors.author}
                            onChange={(e) => setData("author", e.target.value)}
                        />

                        {/* Read time */}
                        <Field
                            label="Read Time (minutes)"
                            icon={ClockIcon}
                            type="number"
                            value={data.read_time}
                            placeholder="E.g. 5"
                            error={errors.read_time}
                            onChange={(e) => setData("read_time", e.target.value)}
                        />

                        {/* IMAGE UPLOAD */}
                        <div className="space-y-2">
                            <label className="font-semibold text-gray-900 flex items-center gap-2">
                                <PhotoIcon className="w-4 h-4" /> Cover Image
                            </label>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                                {/* Upload */}
                                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50">
                                    <PhotoIcon className="w-8 h-8 text-gray-400" />
                                    <p className="text-gray-500 text-sm">Upload Image</p>
                                    <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
                                </label>

                                {/* Preview */}
                                <div className="relative h-32 rounded-xl border bg-gray-50 flex items-center justify-center">
                                    {preview ? (
                                        <>
                                            <img src={preview} className="w-full h-full object-cover rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full"
                                            >
                                                <XMarkIcon className="w-4 h-4" />
                                            </button>
                                        </>
                                    ) : (
                                        <p className="text-gray-500">No image selected</p>
                                    )}
                                </div>
                            </div>

                            {errors.image && <ErrorMessage message={errors.image} />}
                        </div>

                        {/* Buttons */}
                        <div className="flex justify-end gap-4 pt-6 border-t">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50"
                            >
                                Cancel
                            </button>

                            <button
                                disabled={processing}
                                type="submit"
                                className="px-8 py-3 bg-blue-700 text-white rounded-xl hover:bg-blue-800"
                            >
                                {processing ? "Saving..." : isEdit ? "Update Article" : "Create Article"}
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}


function Field({ label, icon: Icon, type = "text", error, ...props }) {
    return (
        <div className="space-y-1">
            <label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                <Icon className="w-4 h-4" /> {label}
            </label>

            {type === "textarea" ? (
                <textarea
                    {...props}
                    className={`w-full px-4 py-3 rounded-xl border ${error ? "border-red-400" : "border-gray-300"
                        }`}
                />
            ) : (
                <input
                    type={type}
                    {...props}
                    className={`w-full px-4 py-3 rounded-xl border ${error ? "border-red-400" : "border-gray-300"
                        }`}
                />
            )}

            {error && <ErrorMessage message={error} />}
        </div>
    );
}


function ErrorMessage({ message }) {
    return (
        <p className="text-red-600 text-sm flex items-center gap-1">
            <ExclamationCircleIcon className="w-4 h-4" />
            {message}
        </p>
    );
}
