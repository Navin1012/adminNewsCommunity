import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import CreateChapterModal from "@/Components/Chapters/CreateChapterModal";
import { MapPin, Users, PlusIcon, MoreVertical, Edit3, Trash2, Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react';

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
  const [openDropdownId, setOpenDropdownId] = useState(null);
  return (
    <AuthenticatedLayout
      admin={auth.admin}
      header={<h2 className="font-semibold text-xl text-gray-800">Chapters Management</h2>}
    >
      <Head title="Chapters" />

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

        {/* 🔍 Search + Add Button Bar */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">

          {/* Search Input */}
          <form onSubmit={doSearch} className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-80">

              {/* Search Icon */}
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                size={18}
              />

              {/* Input */}
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search chapters..."
                className="
      w-full rounded-xl border border-slate-200 bg-white 
      py-2.5 pl-10 pr-10 text-sm text-slate-800 
      placeholder-slate-400
      focus:border-blue-500 focus:ring-1 focus:ring-blue-500 
      transition-colors outline-none
      min-w-[260px]
    "
              />

              {/* Clear (X) Button — shows only when text entered */}
              {search !== "" && (
                <button
                  onClick={() => setSearch("")}
                  className="
        absolute right-3 top-1/2 -translate-y-1/2 
        bg-slate-100 hover:bg-slate-200 
        text-slate-500 hover:text-slate-700 
        w-6 h-6 rounded-full flex items-center justify-center 
        transition
      "
                >
                  ✕
                </button>
              )}
            </div>


            {/* Search Button */}
            <button
              type="submit"
              className="
        inline-flex items-center justify-center rounded-xl 
        font-medium transition-all duration-200 
        px-4 py-2 text-sm
        bg-white text-slate-700 border border-slate-200 
        hover:bg-slate-50 focus:ring-2 focus:ring-slate-300
      "
            >
              <Search size={16} className="mr-2" />
              Search
            </button>
          </form>

          {/* Add Button */}
          <button
            onClick={() => setOpen(true)}
            className="
      inline-flex items-center justify-center rounded-xl font-medium
      px-4 py-2 text-sm transition-all duration-200
      bg-blue-600 text-white hover:bg-blue-700 
      focus:outline-none focus:ring-2 focus:ring-blue-500 
      shadow-md shadow-blue-200
    "
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Chapter
          </button>
        </div>



        {/* ⭐ PREMIUM CARD GRID (Same as your mock UI) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">

          {chapters.data.map((chapter) => (
            <div
              key={chapter.id}
              className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6
            relative group hover:shadow-lg transition-all duration-200"
            >

              {/* 3-dot Actions Dropdown */}
              <td className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition">

                {/* 3-dot button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDropdownId(openDropdownId === chapter.id ? null : chapter.id);
                  }}
                  className={`p-1.5 rounded-lg transition-colors ${openDropdownId === chapter.id
                      ? "bg-blue-50 text-blue-600"
                      : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    }`}
                >
                  <MoreVertical size={20} />
                </button>

                {/* DROPDOWN MENU */}
                {openDropdownId === chapter.id && (
                  <>
                    {/* background overlay to close dropdown */}
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setOpenDropdownId(null)}
                    />

                    <div className="absolute right-10 top-8 z-50 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 animate-in fade-in zoom-in-95 duration-200">

                      {/* VIEW / EDIT BUTTON */}
                      <button
                        onClick={() => {
                          setSelectedChapter(chapter);
                          setOpen(true);
                        }}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-600 
                     hover:bg-slate-50 hover:text-blue-600 
                     flex items-center gap-2 transition font-medium"
                      >
                        <Edit3 size={16} /> Edit Chapter
                      </button>

                      {/* JOIN LIST BUTTON  (ADDED HERE) */}
                      <button
                        onClick={() => router.get(route("chapters.joins", chapter.id))}
                        className="w-full text-left px-4 py-2.5 text-sm text-slate-600 
                     hover:bg-blue-50 hover:text-blue-700
                     flex items-center gap-2 transition font-medium"
                      >
                        <Users size={16} className="text-blue-600" />
                        View Joins ({chapter.join_count || 0})
                      </button>

                      <div className="h-px bg-slate-100 my-1" />

                      {/* ACTIVATE / DEACTIVATE */}
                      <button
                        onClick={() => toggleStatus(chapter.id)}
                        className="w-full text-left px-4 py-2.5 text-sm 
                     flex items-center gap-2 font-medium
                     hover:bg-slate-50 transition
                     text-slate-600"
                      >
                        <Eye size={16} /> {chapter.status === "active" ? "Deactivate" : "Activate"}
                      </button>

                      {/* DELETE BUTTON */}
                      <button
                        onClick={() => destroyChapter(chapter.id)}
                        className="w-full text-left px-4 py-2.5 text-sm 
                     flex items-center gap-2 font-medium
                     text-red-600 hover:bg-red-50 hover:text-red-700 transition"
                      >
                        <Trash2 size={16} /> Delete Chapter
                      </button>

                    </div>
                  </>
                )}
              </td>


              {/* Card Top */}
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16  rounded-2xl flex items-center justify-center 
              text-3xl shadow-inner mb-4">
                  {chapter.icon ? (
                    <img src={chapter.icon} className="w-10 h-10 rounded-xl" />
                  ) : (
                    <Users className="w-7 h-7 text-blue-500" />
                  )}
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-1">{chapter.title}</h3>
                <div className="flex items-center text-sm text-slate-500">
                  <MapPin size={14} className="mr-1" />
                  {chapter.state || "N/A"}
                </div>
              </div>

              {/* Members + Joins */}
              <div className="flex justify-between items-center py-3 border-t border-b border-slate-100 mb-4">
                <div className="text-center w-1/2 border-r border-slate-100">
                  <div className="text-lg font-bold text-slate-800">{chapter.total_members}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">Members</div>
                </div>

                <div className="text-center w-1/2">
                  <div className="text-lg font-bold text-emerald-600">
                    +{chapter.join_count || 0}
                  </div>
                  <div className="text-xs text-slate-500 uppercase tracking-wide">New Today</div>
                </div>
              </div>

              {/* Footer - Status + Actions */}
              <div className="flex justify-between items-center">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold
                ${chapter.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                    }`}
                >
                  {chapter.status === "active" ? "Active" : "Inactive"}
                </span>

                <div className="flex gap-2">
                  {/* Edit */}
                  <button
                    onClick={() => {
                      setSelectedChapter(chapter);
                      setOpen(true);
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Edit3 size={16} />
                  </button>

                  {/* Active Toggle */}
                  <button
                    onClick={() => toggleStatus(chapter.id)}
                    className={`p-1.5 rounded-lg 
                  ${chapter.status === "active"
                        ? "text-gray-600 hover:bg-gray-100"
                        : "text-green-600 hover:bg-green-50"
                      }`}
                  >
                    <Eye size={16} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => destroyChapter(chapter.id)}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>


        {/* ⭐ Pagination */}
        {chapters.links.length > 3 && (
          <div className="mt-10 px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50 rounded-b-2xl">

            {/* Showing X to Y of Z */}
            <span className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-medium text-slate-900">{chapters.from}</span> to{" "}
              <span className="font-medium text-slate-900">{chapters.to}</span> of{" "}
              <span className="font-medium text-slate-900">{chapters.total}</span> results
            </span>

            {/* Pagination Buttons */}
            <div className="flex items-center gap-2">

              {/* Prev Button */}
              <button
                onClick={() => chapters.prev_page_url && router.visit(chapters.prev_page_url)}
                disabled={!chapters.prev_page_url}
                className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent 
        hover:border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed 
        transition-all text-slate-600"
              >
                <ChevronLeft size={16} />
              </button>

              {/* Page Numbers */}
              <div className="flex items-center gap-1">
                {chapters.links
                  .filter((l) => !isNaN(Number(l.label))) // numeric pagination only
                  .map((link, idx) => (
                    <button
                      key={idx}
                      disabled={!link.url}
                      onClick={() => link.url && router.visit(link.url)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${link.active
                        ? "bg-blue-600 text-white shadow-sm"
                        : "text-slate-600 hover:bg-white hover:shadow-sm"
                        } ${!link.url ? "opacity-40 cursor-not-allowed" : ""}`}
                    >
                      {link.label}
                    </button>
                  ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => chapters.next_page_url && router.visit(chapters.next_page_url)}
                disabled={!chapters.next_page_url}
                className="p-2 rounded-lg hover:bg-white hover:shadow-sm border border-transparent 
        hover:border-slate-200 disabled:opacity-50 disabled:cursor-not-allowed 
        transition-all text-slate-600"
              >
                <ChevronRight size={16} />
              </button>
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