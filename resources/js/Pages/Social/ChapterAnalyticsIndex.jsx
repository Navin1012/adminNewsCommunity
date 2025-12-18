import { Head, Link } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
  CheckCircle,
  ArrowRight,
} from "lucide-react";

export default function ChapterAnalyticsIndex({ auth, chapters }) {
  return (
    <AuthenticatedLayout admin={auth.admin} header="Chapter Analytics">
      <Head title="Chapter Analytics" />

      <div className="space-y-6">

        <div>
          <h1 className="text-3xl font-extrabold text-slate-900">
            Chapter Analytics
          </h1>
          <p className="text-slate-500 mt-1">
            Analytics overview of all chapters
          </p>
        </div>

        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="px-6 py-4 text-left font-semibold text-slate-600">
                  Chapter
                </th>
                <th className="px-6 py-4 text-left font-semibold text-slate-600">
                  State
                </th>
                <th className="px-6 py-4 text-left font-semibold text-slate-600">
                  Analytics
                </th>
                <th className="px-6 py-4 text-left font-semibold text-slate-600">
                  Last Calculated
                </th>
                <th className="px-6 py-4 text-right font-semibold text-slate-600">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {chapters.data.map((chapter) => (
                <tr
                  key={chapter.id}
                  className="hover:bg-slate-50 transition"
                >
                  <td className="px-6 py-4 font-semibold text-slate-800">
                    {chapter.title}
                  </td>

                  <td className="px-6 py-4 text-slate-600">
                    {chapter.state ?? "-"}
                  </td>

                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 px-3 py-1
                      text-xs font-semibold rounded-full
                      bg-emerald-50 text-emerald-600">
                      <CheckCircle size={14} />
                      Available
                    </span>
                  </td>

                  <td className="px-6 py-4 text-slate-500">
                    {chapter.calculated_at
                      ? new Date(chapter.calculated_at).toLocaleString()
                      : "-"}
                  </td>

                  <td className="px-6 py-4 text-right">
                    <Link
                      href={route("chapters.analytics.show", {
                        chapter: chapter.id,
                      })}
                      className="inline-flex items-center gap-2 px-4 py-2
                        rounded-xl text-sm font-medium
                        bg-blue-600 text-white
                        hover:bg-blue-700 transition"
                    >
                      View
                      <ArrowRight size={16} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {chapters.data.length === 0 && (
            <div className="p-10 text-center text-slate-400">
              No chapters with analytics found
            </div>
          )}

          {/* PAGINATION */}
          {chapters.links && (
            <div className="flex justify-center gap-2 p-4 border-t">
              {chapters.links.map((link, index) => (
                <Link
                  key={index}
                  href={link.url ?? "#"}
                  className={`px-3 py-1 rounded-lg text-sm
                    ${link.active
                      ? "bg-blue-600 text-white"
                      : "bg-white border text-slate-600 hover:bg-slate-50"}
                    ${!link.url && "opacity-50 cursor-not-allowed"}
                  `}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
