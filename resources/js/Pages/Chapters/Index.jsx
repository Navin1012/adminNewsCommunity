import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import CreateChapterModal from "@/Components/Chapters/CreateChapterModal";
import {
  MagnifyingGlassIcon,
  PlusIcon,
  PencilIcon,
  PowerIcon,
  TrashIcon,
  EyeIcon,
  MapPinIcon,
  UsersIcon,
  UserPlusIcon,
  ChartBarIcon,
  CheckCircleIcon,
  NoSymbolIcon,
  ExclamationTriangleIcon
} from "@heroicons/react/24/outline";

export default function Index({ auth, chapters, filters }) {
  const { flash } = usePage().props;
  const [open, setOpen] = useState(false);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [search, setSearch] = useState(filters.q || "");

  const closeModal = () => {
    setOpen(false);
    setTimeout(() => setSelectedChapter(null), 200);
  };

  const toggleStatus = (id) => {
    router.post(route("chapters.toggle", id), {
      preserveScroll: true,
      onSuccess: () => router.reload({ only: ["chapters"] }),
    });
  };

  const destroyChapter = (id) => {
    if (confirm("Are you sure you want to delete this chapter? This action cannot be undone.")) {
      router.delete(route("chapters.destroy", id), {
        preserveScroll: true,
        onSuccess: () => router.reload({ only: ["chapters"] }),
      });
    }
  };

  const doSearch = (e) => {
    e.preventDefault();
    router.get(route("chapters.index"), { q: search }, { preserveState: true });
  };

  const activeChapters = chapters.data.filter(ch => ch.status === 'active').length;
  const totalMembers = chapters.data.reduce((sum, ch) => sum + (ch.total_members || 0), 0);
  const totalJoins = chapters.data.reduce((sum, ch) => sum + (ch.join_count || 0), 0);

  return (
    <AuthenticatedLayout
      admin={auth.admin}
      header={<h2 className="font-semibold text-xl text-gray-800">Chapters Management</h2>}
    >
      <Head title="Chapters" />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="md:flex md:items-center md:justify-between mb-8">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-gray-900">Chapters</h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage your organization's chapters and their members
            </p>
          </div>
          <div className="mt-4 flex md:mt-0 md:ml-4">
            <button
              onClick={() => setOpen(true)}
             className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Create Chapter
            </button>
          </div>
        </div>

        {/* Flash Message */}
        {flash.message && (
          <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200 flex items-center">
            <CheckCircleIcon className="h-5 w-5 text-green-500 mr-2" />
            <p className="text-green-800 text-sm font-medium">{flash.message}</p>
          </div>
        )}

      

        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={doSearch} className="flex gap-3">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="search"
                placeholder="Search chapters by title, location..."
                className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200"
            >
              <MagnifyingGlassIcon className="h-4 w-4 mr-2" />
              Search
            </button>
          </form>
        </div>

        {/* Chapters Table */}
        <div className="bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Chapter
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Members
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joins
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {chapters.data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <ExclamationTriangleIcon className="w-16 h-16 text-gray-400 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No chapters found</h3>
                        <p className="text-gray-500 mb-4">Get started by creating your first chapter.</p>
                        <button
                          onClick={() => setOpen(true)}
                        className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200"
            > 
                          <PlusIcon className="h-4 w-4 mr-2" />
                          Create Chapter
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  chapters.data.map((chapter) => (
                    <tr key={chapter.id} className="hover:bg-gray-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            {chapter.icon ? (
                              <img
                                className="h-10 w-10 rounded-lg object-cover border border-gray-200"
                                src={chapter.icon}
                                alt={chapter.title}
                              />
                            ) : (
                              <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 border border-blue-200 flex items-center justify-center">
                                <UsersIcon className="w-5 h-5 text-blue-400" />
                              </div>
                            )}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{chapter.title}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPinIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {chapter.state || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm font-medium text-gray-900">
                          <UsersIcon className="h-4 w-4 text-gray-400 mr-1" />
                          {chapter.total_members || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${chapter.status === "active"
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                            }`}
                        >
                          {chapter.status === "active" ? (
                            <>
                              <CheckCircleIcon className="w-3 h-3 mr-1" />
                              Active
                            </>
                          ) : (
                            <>
                              <NoSymbolIcon className="w-3 h-3 mr-1" />
                              Inactive
                            </>
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button
                          onClick={() => router.get(route("chapters.joins", chapter.id))}
                          className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 transition-colors duration-200"
                        >
                          <UserPlusIcon className="w-3 h-3 mr-1" />
                          {chapter.join_count || 0}
                        </button>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => {
                              setSelectedChapter(chapter);
                              setOpen(true);
                            }}
                            className="inline-flex items-center p-2 border border-gray-300 rounded-md text-gray-600 bg-white hover:bg-gray-50 transition-colors duration-200"
                            title="Edit Chapter"
                          >
                            <PencilIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => toggleStatus(chapter.id)}
                            className={`inline-flex items-center p-2 border rounded-md transition-colors duration-200 ${chapter.status === "active"
                                ? "border-gray-300 text-gray-600 bg-white hover:bg-gray-50"
                                : "border-green-300 text-green-600 bg-green-50 hover:bg-green-100"
                              }`}
                            title={chapter.status === "active" ? "Deactivate" : "Activate"}
                          >
                            <PowerIcon className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => destroyChapter(chapter.id)}
                            className="inline-flex items-center p-2 border border-red-300 rounded-md text-red-600 bg-white hover:bg-red-50 transition-colors duration-200"
                            title="Delete Chapter"
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {chapters.links && chapters.links.length > 4 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(chapters.current_page - 1) * chapters.per_page + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min(chapters.current_page * chapters.per_page, chapters.total)}
              </span>{" "}
              of <span className="font-medium">{chapters.total}</span> results
            </div>
            <div className="flex space-x-1">
              {chapters.links.map((link, index) => (
                <button
                  key={index}
                  disabled={!link.url}
                  onClick={() => link.url && router.visit(link.url)}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md ${link.active
                      ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                      : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                    } ${!link.url ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Modal */}
        <CreateChapterModal
          open={open}
          onClose={closeModal}
          chapter={selectedChapter}
        />
      </div>
    </AuthenticatedLayout>
  );
}