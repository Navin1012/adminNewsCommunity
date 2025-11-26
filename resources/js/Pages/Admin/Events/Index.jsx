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
                setEditingEvent(null);   // Create mode
                setShowModal(true);
              }}
               className="inline-flex items-center px-4 py-2.5 border border-transparent text-sm font-medium rounded-lg text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 transition-colors duration-200"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Create New Event
            </button>


          </div>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
          {events.data.map((event) => {
            const timeInfo = getTimeRemaining(event.start_at);

            return (
              <div
                key={event.id}
                className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200 overflow-hidden hover:shadow-[0_20px_50px_rgb(0,0,0,0.1)] transition-all duration-500 transform hover:-translate-y-2 group"
              >
                {/* Image Section */}
                <div className="relative overflow-hidden">
                  {event.image ? (
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <PhotoIcon className="w-12 h-12 mx-auto mb-2" />
                        <span className="text-sm font-medium">No Image</span>
                      </div>
                    </div>
                  )}

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Status and Time Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <span
                      className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${event.is_published
                        ? "bg-green-100/90 text-green-800 border-green-200"
                        : "bg-gray-100/90 text-gray-800 border-gray-200"
                        }`}
                    >
                      <span className={`w-2 h-2 rounded-full mr-2 ${event.is_published ? "bg-green-500" : "bg-gray-500"
                        }`}></span>
                      {event.is_published ? "Published" : "Draft"}
                    </span>

                    {timeInfo && (
                      <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${timeInfo.bg} ${timeInfo.color} border-current/20`}>
                        {timeInfo.text}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6">
                  {/* Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                    {event.title}
                  </h3>

                  {/* Date */}
                  <div className="flex items-center text-gray-600 mb-4 p-3 bg-gray-50 rounded-xl">
                    <CalendarDaysIcon className="w-5 h-5 mr-3 to-purple-600" />
                    <span className="text-sm font-medium">{formatDate(event.start_at)}</span>
                  </div>

                  {/* Participation Stats */}
                  <div className="flex items-center justify-between mb-6 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
                    <div className="flex items-center">
                      <UserGroupIcon className="w-5 h-5 mr-2 to-purple-600" />
                      <span className="text-sm font-semibold to-purple-600">Participants</span>
                    </div>
                    <span className="text-lg font-bold to-purple-600">{event.join_count || 0}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-between pt-5 border-t border-gray-200">

                    {/* Left Action Buttons */}
                    <div className="flex items-center gap-4">

                      {/* Edit Button */}
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          setShowModal(true);
                        }}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium 
                 to-purple-600 bg-indigo-50 hover:bg-indigo-100 
                 rounded-lg transition-all duration-300 hover:shadow-sm 
                 hover:scale-105"
                      >
                        <PencilIcon className="w-4 h-4 mr-1.5" />
                        Edit
                      </button>

                      {/* Manage Attendees Button */}
                      <a
                        href={route("admin.events.joins", event.id)}
                        className="inline-flex items-center px-3 py-1.5 text-sm font-medium
                 tto-purple-600 bg-blue-50 hover:bg-blue-100
                 rounded-lg transition-all duration-300 hover:shadow-sm
                 hover:scale-105"
                      >
                        <ChartBarIcon className="w-4 h-4 mr-1.5" />
                        Manage ({event.join_count || 0})
                      </a>
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-2">

                      {/* Publish Toggle */}
                      <button
                        onClick={() => toggle(event.id)}
                        className="p-2 rounded-lg text-gray-500 bg-gray-50 hover:bg-gray-100 
                 hover:text-gray-700 transition-all duration-300 hover:shadow-sm 
                 hover:scale-110"
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
                        className="p-2 rounded-lg text-red-500 bg-red-50 hover:bg-red-100 
                 hover:text-red-600 transition-all duration-300 hover:shadow-sm 
                 hover:scale-110"
                        title="Delete event"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {events.data.length === 0 && (
          <div className="text-center py-20 bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-200">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-gray-100 to-gray-200 rounded-3xl flex items-center justify-center shadow-inner">
              <CalendarDaysIcon className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-3">No events found</h3>
            <p className="text-gray-600 max-w-sm mx-auto mb-8 leading-relaxed">
              Get started by creating your first amazing event for your community.
            </p>
            <div className="flex justify-center gap-4">
              <a
                href={route("admin.events.create")}
                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-semibold shadow-lg shadow-indigo-500/25 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:shadow-xl hover:scale-105"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Create Your First Event
              </a>
            </div>
          </div>
        )}

        {/* Pagination */}
        {events.links && events.links.length > 3 && (
          <div className="mt-12 flex justify-center">
            <div className="flex gap-2 bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-gray-200 px-3 py-2">
              {events.links.map((link, idx) => (
                <button
                  key={idx}
                  onClick={() => link.url && Inertia.get(link.url)}
                  dangerouslySetInnerHTML={{ __html: link.label }}
                  className={`
                    min-w-[40px] h-10 px-4 
                    flex items-center justify-center 
                    rounded-xl text-sm font-medium transition-all 
                    ${link.active
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 scale-105"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    }
                    ${!link.url ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:shadow-sm"}
                  `}
                />
              ))}
            </div>
          </div>
        )}
      </div>
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
              event={editingEvent}          // <-- Edit mode
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