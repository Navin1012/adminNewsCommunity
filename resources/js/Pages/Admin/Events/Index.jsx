import { Inertia } from '@inertiajs/inertia';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, usePage } from '@inertiajs/react';
import EventForm from "@/Components/EventForm";
import { useState } from "react";

import {
  PlusIcon,
  CalendarDaysIcon,
  PencilIcon,
  UserGroupIcon,
  ArrowPathIcon,
  TrashIcon,
  PhotoIcon,
  EyeIcon,
  EyeSlashIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

export default function Index({ events, filters }) {
  const admin = usePage().props.auth.admin;

  const toggle = (id) => {
    if (!confirm('Toggle publish status?')) return;
    Inertia.post(route('admin.events.togglePublish', id));
  };

  const remove = (id) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    Inertia.post(route('admin.events.destroy', id));
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No date scheduled";
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTimeRemaining = (dateString) => {
    if (!dateString) return null;
    const now = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { text: 'Past Event', color: 'text-red-600', bg: 'bg-red-100' };
    if (diffDays === 0) return { text: 'Today', color: 'text-green-600', bg: 'bg-green-100' };
    if (diffDays === 1) return { text: 'Tomorrow', color: 'to-purple-600', bg: 'bg-blue-100' };
    if (diffDays <= 7) return { text: `${diffDays} days`, color: 'text-purple-600', bg: 'bg-purple-100' };
    return { text: `${Math.ceil(diffDays / 7)} weeks`, color: 'text-gray-600', bg: 'bg-gray-100' };
  };

  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

 return (
    <AuthenticatedLayout
      admin={admin}
      header={<h2 className="text-2xl font-bold text-gray-900">Events Management</h2>}
    >
      <Head title="Events" />

      <div className="py-6 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          {/* Create Button */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={() => {
                setEditingEvent(null);
                setShowModal(true);
              }}
              className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create New Event
            </button>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Event</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Participants</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {events.data.map((event) => {
                const timeInfo = getTimeRemaining(event.start_at);

                return (
                  <tr key={event.id} className="hover:bg-gray-50 transition-colors duration-200">
                    {/* Event Info */}
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        {event.image ? (
                          <img 
                            src={event.image} 
                            alt={event.title}
                            className="w-12 h-12 rounded-lg object-cover shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center shadow-sm">
                            <PhotoIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">{event.title}</h3>
                          {timeInfo && (
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${timeInfo.bg} ${timeInfo.color}`}>
                              {timeInfo.text}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Date & Time */}
                    <td className="px-6 py-4">
                      <div className="flex items-center text-gray-600">
                        <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="text-sm font-medium">{formatDate(event.start_at)}</span>
                      </div>
                    </td>

                    {/* Participants */}
                    <td className="px-6 py-4 text-center">
                      <a
                        href={route("admin.events.joins", event.id)}
                        className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-gray-900 transition-colors duration-200 shadow-sm"
                      >
                        <UserGroupIcon className="w-4 h-4" />
                        <span className="font-semibold">{event.join_count || 0}</span>
                        <span className="text-xs text-gray-500">View</span>
                      </a>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold ${
                        event.is_published 
                          ? "bg-green-100 text-green-800 border border-green-200" 
                          : "bg-gray-100 text-gray-800 border border-gray-200"
                      }`}>
                        <span className={`w-2 h-2 rounded-full mr-2 ${
                          event.is_published ? "bg-green-500" : "bg-gray-500"
                        }`}></span>
                        {event.is_published ? "Published" : "Draft"}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        {/* Edit Button */}
                        <button
                          onClick={() => {
                            setEditingEvent(event);
                            setShowModal(true);
                          }}
                          className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800 transition-colors duration-200 shadow-sm"
                        >
                          <PencilIcon className="w-4 h-4 mr-1" />
                          Edit
                        </button>

                        {/* Publish Toggle */}
                        <button
                          onClick={() => toggle(event.id)}
                          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-700 transition-colors duration-200 shadow-sm"
                          title={event.is_published ? "Unpublish event" : "Publish event"}
                        >
                          {event.is_published ? (
                            <EyeSlashIcon className="w-4 h-4" />
                          ) : (
                            <EyeIcon className="w-4 h-4" />
                          )}
                        </button>

                        {/* Delete Button */}
                        <button
                          onClick={() => remove(event.id)}
                          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors duration-200 shadow-sm"
                          title="Delete event"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {events.data.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-2xl flex items-center justify-center">
              <CalendarDaysIcon className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-600 max-w-sm mx-auto mb-6">
              Get started by creating your first amazing event for your community.
            </p>
            <button
              onClick={() => {
                setEditingEvent(null);
                setShowModal(true);
              }}
              className="inline-flex items-center px-6 py-3 bg-gray-800 text-white rounded-lg font-medium shadow-sm hover:bg-gray-900 transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create Your First Event
            </button>
          </div>
        )}

        {/* Pagination */}
        {events.links && events.links.length > 3 && (
          <div className="mt-8 flex justify-center">
            <div className="flex gap-1 bg-gray-50 rounded-lg p-1 shadow-sm border border-gray-200">
              {events.links.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => link.url && Inertia.get(link.url)}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`
                    min-w-[40px] h-9 px-3 
                    flex items-center justify-center 
                    rounded-md text-sm font-medium transition-all 
                    ${link.active
                      ? "bg-gray-800 text-white shadow-sm"
                      : "text-gray-700 hover:bg-gray-200 hover:text-gray-900"
                    }
                    ${!link.url ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}
                  `}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto hide-scrollbar animate-popup"
            onClick={(e) => e.stopPropagation()}
          >
            <EventForm
              event={editingEvent}
              onCancel={() => setShowModal(false)}
              onSuccess={() => {
                setShowModal(false);
                setEditingEvent(null);
              }}
            />
          </div>

          <style>{`
            .hide-scrollbar::-webkit-scrollbar { width: 0; }
            .hide-scrollbar { scrollbar-width: none; }
            @keyframes popup {
              from { opacity: 0; transform: translateY(20px) scale(0.96); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .animate-popup {
              animation: popup .25s ease-out;
            }
          `}</style>
        </div>
      )}
    </AuthenticatedLayout>
  );
}