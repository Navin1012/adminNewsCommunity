import { Link, useForm, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useState } from "react";
import CreateNewsArticleModal from "@/Components/CreateNewsArticleModal";

export default function Index({ auth, articles, filters }) {
    const { delete: destroy } = useForm();
    const [modalOpen, setModalOpen] = useState(false);
    const [editArticle, setEditArticle] = useState(null);

    const handleDelete = (id) => {
        if (confirm("Delete this article?")) {
            destroy(route("news.destroy", id));
        }
    };

    const handleSearch = (e) => {
        router.get(route("news.index"), { q: e.target.value }, { preserveState: true });
    };

    const openCreateModal = () => {
        setEditArticle(null);
        setModalOpen(true);
    };

    const openEditModal = (article) => {
        setEditArticle(article);
        setModalOpen(true);
    };

    return (
        <AuthenticatedLayout admin={auth.admin}
         header={<h2 className="text-2xl font-bold text-gray-900">Articles Management</h2>}
        >

            
            <div className="p-6">

                {/* Modal */}
                <CreateNewsArticleModal
                    open={modalOpen}
                    onClose={() => setModalOpen(false)}
                    article={editArticle}
                />

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                      <input
                        type="text"
                        placeholder="Search..."
                        defaultValue={filters?.q || ""}
                        onChange={handleSearch}
                        className="border px-3 py-2 rounded-lg w-64 shadow-sm"
                    />

                    <button
                        onClick={openCreateModal}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + Create Article
                    </button>
                </div>

             

                {/* Table */}
                <div className="overflow-x-auto rounded-xl shadow-sm border">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-100 text-left border-b">
                                <th className="p-3 font-semibold">Title</th>
                                <th className="p-3 font-semibold">Author</th>
                                <th className="p-3 font-semibold">Category</th>
                                <th className="p-3 font-semibold text-center">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {articles.data.map((a) => (
                                <tr key={a.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{a.title}</td>
                                    <td className="p-3">{a.author}</td>
                                    <td className="p-3">{a.category}</td>

                                    <td className="p-3 text-center space-x-2">

                                        {/* Edit opens modal */}
                                        <button
                                            onClick={() => openEditModal(a)}
                                            className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>

                                        {/* Delete */}
                                        <button
                                            onClick={() => handleDelete(a.id)}
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>

                                    </td>
                                </tr>
                            ))}

                            {articles.data.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-6 text-center text-gray-500">
                                        No articles found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-center">
                    <Pagination links={articles.links} />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

/* PAGINATION COMPONENT */
function Pagination({ links }) {
    return (
        <div className="flex items-center space-x-1">
            {links.map((link, i) => (
                <Link
                    key={i}
                    href={link.url ?? ""}
                    className={`px-3 py-1 rounded border text-sm ${
                        link.active
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-gray-100"
                    }`}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                />
            ))}
        </div>
    );
}
