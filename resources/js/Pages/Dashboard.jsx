import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from "@inertiajs/react";

import { 
  Users, MapPin, Calendar, DollarSign, ArrowUpRight, ArrowDownRight,
  MoreHorizontal, Mail, Phone 
} from "lucide-react";

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, AreaChart, Area
} from "recharts";

import { DASHBOARD_STATS, GROWTH_DATA, CHAPTER_DATA, LEAD_DATA, MOCK_USERS ,MOCK_INQUIRIES } 
from "@/Constants/dashboard";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

export default function Dashboard({ auth }) {
  const getIcon = (iconName) => {
    switch (iconName) {
      case "users":
        return <Users size={24} />;
      case "map-pin":
        return <MapPin size={24} />;
      case "calendar":
        return <Calendar size={24} />;
      case "dollar-sign":
        return <DollarSign size={24} />;
      default:
        return <Users size={24} />;
    }
  };

  const getTrendIcon = (trend) => {
    if (trend.includes("+")) return <ArrowUpRight size={14} className="ml-1" />;
    if (trend.includes("Next")) return null;
    return <ArrowDownRight size={14} className="ml-1" />;
  };

  return (
    <AuthenticatedLayout admin={auth.admin} header="Dashboard">
      <Head title="Dashboard" />

      <div className="space-y-8">

        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
              Good Morning, {auth.admin.name} 👋
            </h1>
            <p className="text-slate-500 mt-2 text-base">
              Here's what's happening in your community today.
            </p>
          </div>
          <div className="flex gap-3">
            <button className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 shadow-sm transition-all">
              Last 7 Days
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center">
              <span className="mr-2">+</span> Create Report
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {DASHBOARD_STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                <div
                  className={`p-3 rounded-2xl transition-colors bg-${stat.color}-50 text-${stat.color}-600 group-hover:bg-${stat.color}-100`}
                >
                  {getIcon(stat.icon)}
                </div>

                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center ${
                    stat.trend.includes("+")
                      ? "bg-emerald-50 text-emerald-600"
                      : "bg-slate-50 text-slate-600"
                  }`}
                >
                  {stat.trend} {getTrendIcon(stat.trend)}
                </span>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-slate-800 mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm font-medium text-slate-400 uppercase tracking-wide">
                  {stat.title}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Growth */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-slate-800">
                User Growth Overview
              </h2>
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="h-80 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={GROWTH_DATA}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "16px",
                      border: "none",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      padding: "12px 16px",
                    }}
                  />

                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorValue)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="font-bold text-lg text-slate-800">Lead Source</h2>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={LEAD_DATA}
                    innerRadius={80}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={6}
                  >
                    {LEAD_DATA.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index % COLORS.length]}
                        strokeWidth={0}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-4">
              {LEAD_DATA.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center text-xs font-medium text-slate-500"
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full mr-2"
                    style={{
                      backgroundColor: COLORS[index % COLORS.length],
                    }}
                  ></span>
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Inquiries */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-slate-800">
                Recent Inquiries
              </h2>
              <button className="text-sm text-slate-500 hover:text-blue-600">
                View All
              </button>
            </div>

            <div className="space-y-4 mt-4">
              {MOCK_INQUIRIES.slice(0, 3).map((inq) => (
                <div
                  key={inq.id}
                  className="flex items-start gap-4 p-3 hover:bg-slate-50 rounded-xl transition-colors group cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                    {inq.name.charAt(0)}
                  </div>

                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h4 className="text-sm font-semibold text-slate-800 truncate">
                        {inq.name}
                      </h4>
                      <span className="text-xs text-slate-400">{inq.date}</span>
                    </div>

                    <p className="text-xs text-slate-500 mt-1 truncate">
                      {inq.message}
                    </p>

                    <div className="flex items-center gap-3 mt-2">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                          inq.priority === "High"
                            ? "bg-red-100 text-red-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {inq.priority}
                      </span>

                      <span className="flex items-center text-xs text-slate-400 gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Mail size={12} /> Reply
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chapter Performance */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <h2 className="font-bold text-lg text-slate-800">
              Chapter Performance
            </h2>

            <div className="h-64 w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CHAPTER_DATA} barSize={32}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#94a3b8", fontSize: 12 }}
                  />
                  <Tooltip
                    cursor={{ fill: "#f8fafc", radius: 8 }}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="value"
                    fill="#8b5cf6"
                    radius={[6, 6, 6, 6]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
