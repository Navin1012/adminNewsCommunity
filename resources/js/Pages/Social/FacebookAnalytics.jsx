import { Head, router } from "@inertiajs/react";
import { useEffect, useRef } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Chart from "chart.js/auto";

import {
  Facebook, Eye, TrendingUp, Users, Heart, MessageCircle, Share2, MoreHorizontal,
  ArrowUpRight, ArrowDownRight
} from "lucide-react";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  BarChart, Bar
} from "recharts";

export default function FacebookAnalytics({
  auth = {},

  pages = [],
  activePage = null,
  days = 7,

  totalReach = 0,
  engagement = 0,
  followers = 0,

  chartLabels = [],
  reachSeries = [],

  engagementSplit = { reactions: 0, comments: 0, shares: 0 },

  avgEngagement = 0,
  highestEngagement = 0,

  engagementTrend = [],
  selectedUserId = null,
}) {

  const reachChartRef = useRef(null);

  useEffect(() => {
    if (!reachChartRef.current || reachSeries.length === 0) return;

    const chart = new Chart(reachChartRef.current, {
      type: "line",
      data: {
        labels: chartLabels,
        datasets: [{
          data: reachSeries,
          borderColor: "#3b82f6",
          backgroundColor: "rgba(59, 130, 246, 0.15)",
          tension: 0.4,
          fill: true,
          borderWidth: 3,
          pointRadius: 4,
          pointBackgroundColor: "#3b82f6",
          pointBorderColor: "#ffffff",
          pointBorderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'white',
            titleColor: '#1e293b',
            bodyColor: '#64748b',
            borderColor: '#e2e8f0',
            borderWidth: 1,
            cornerRadius: 12,
            padding: 12,
            boxPadding: 6,
            displayColors: false,
          }
        },
        scales: {
          x: {
            grid: {
              display: false,
            },
            ticks: {
              color: '#94a3b8',
              font: {
                size: 12
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#f1f5f9',
            },
            ticks: {
              color: '#94a3b8',
              font: {
                size: 12
              }
            }
          }
        },
      },
    });

    return () => chart.destroy();
  }, [chartLabels, reachSeries]);

  const PIE_DATA = [
    { name: "Reactions", value: engagementSplit.reactions },
    { name: "Comments", value: engagementSplit.comments },
    { name: "Shares", value: engagementSplit.shares },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  const stats = [
    {
      title: "Page Views",
      value: totalReach.toLocaleString(),
      icon: Eye,
      color: "blue",
      trend: "+12.5%"
    },
    {
      title: "Engagement",
      value: engagement.toLocaleString(),
      icon: TrendingUp,
      color: "emerald",
      trend: "+8.2%"
    },
    {
      title: "Followers",
      value: followers.toLocaleString(),
      icon: Users,
      color: "violet",
      trend: "+5.7%"
    }
  ];

  const getTrendIcon = (trend) => {
    if (trend.includes("+")) return <ArrowUpRight size={14} className="ml-1" />;
    return <ArrowDownRight size={14} className="ml-1" />;
  };

  return (
    <AuthenticatedLayout admin={auth.admin} header="Facebook Analytics">
      <Head title="Facebook Analytics" />

      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 flex items-center gap-2 tracking-tight">
              Facebook Analytics <Facebook className="text-blue-600" size={28} />
            </h1>
            <p className="text-slate-500 mt-2 text-base">
              Track your page performance and engagement metrics
            </p>
          </div>
          <div className="flex gap-3">
            {/* Page Selector */}
            <select
              value={activePage?.page_id ?? ""}
              onChange={(e) =>
                router.get(
                  route("social.analysis"),
                  {
                    user_id: selectedUserId,
                    page_id: e.target.value,
                    days,
                  },
                  { preserveState: true }
                )
              }
              className="px-4 py-2 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-medium hover:bg-slate-50 shadow-sm transition-all"
            >
              <option value="">Select Page</option>
              {pages.map((p) => (
                <option key={p.page_id} value={p.page_id}>
                  {p.name}
                </option>
              ))}
            </select>

            {/* Days Filter */}
            <div className="flex gap-2">
              {[7, 30, 90].map((d) => (
                <button
                  key={d}
                  onClick={() =>
                    router.get(
                      route("social.analysis"),
                      {
                        user_id: selectedUserId,
                        page_id: activePage?.page_id,
                        days: d,
                      },
                      { preserveState: true }
                    )
                  }
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${days === d
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200 hover:bg-blue-700"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm"
                    }`}
                >
                  {d} Days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border border-slate-100 shadow-[0_2px_10px_-4px_rgba(6,81,237,0.1)] hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group"
              >
                <div className="flex justify-between items-start mb-6">
                  <div
                    className={`p-3 rounded-2xl transition-colors ${stat.color === 'blue'
                      ? 'bg-blue-50 text-blue-600 group-hover:bg-blue-100'
                      : stat.color === 'emerald'
                        ? 'bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100'
                        : 'bg-violet-50 text-violet-600 group-hover:bg-violet-100'
                      }`}
                  >
                    <Icon size={24} />
                  </div>

                  <span
                    className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center ${stat.trend.includes("+")
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
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Page Views Trend */}
          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-slate-800">
                Page Views Trend
              </h2>
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="h-80 w-full mt-4">
              {Array.isArray(reachSeries) && reachSeries.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartLabels.map((label, index) => ({
                      name: label,
                      value: reachSeries[index] ?? 0,
                    }))}
                  >
                    <defs>
                      <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.15} />
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

                    <Area
                      type="monotone"
                      dataKey="value"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      fill="url(#colorViews)"
                      fillOpacity={1}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-slate-400 mb-2">📊</div>
                    <p className="text-slate-500">No data available</p>
                    <p className="text-sm text-slate-400">
                      Select a page to view analytics
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Engagement Breakdown (Right – 1 Column) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg text-slate-800">
                Engagement Breakdown
              </h2>
              <button className="p-2 hover:bg-slate-50 rounded-lg text-slate-400">
                <MoreHorizontal size={20} />
              </button>
            </div>

            <div className="h-64 w-full mt-4">
              {PIE_DATA.every(d => d.value === 0) ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="text-slate-400 mb-2">💬</div>
                    <p className="text-slate-500">No engagement data</p>
                    <p className="text-sm text-slate-400">
                      Engagement metrics will appear here
                    </p>
                  </div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={PIE_DATA}
                      dataKey="value"
                      nameKey="name"
                      innerRadius={80}
                      outerRadius={100}
                      paddingAngle={5}
                      cornerRadius={6}
                      strokeWidth={0}
                    >
                      {PIE_DATA.map((entry, index) => (
                        <Cell
                          key={index}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>

                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        padding: "12px 16px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Legend */}
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-4">
              {PIE_DATA.map((entry, index) => (
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


        {/* Engagement Trend */}
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h2 className="font-bold text-lg text-slate-800">
            Engagement Trend
          </h2>

          <div className="h-80 w-full mt-4">
            {engagementTrend?.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={engagementTrend}
                  barSize={36}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e5e7eb"
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
                    radius={[10, 10, 10, 10]}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <div className="text-slate-400 mb-2">📊</div>
                  <p className="text-slate-500">No trend data available</p>
                  <p className="text-sm text-slate-400">
                    Engagement trend will appear here
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>




        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                <Heart size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Average Engagement Rate</h3>
                <p className="text-2xl font-bold text-slate-800 mt-1">{avgEngagement}%</p>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              Average engagement rate across all posts
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Highest Engagement</h3>
                <p className="text-2xl font-bold text-slate-800 mt-1">{highestEngagement.toLocaleString()}</p>
              </div>
            </div>
            <div className="text-sm text-slate-500">
              Highest engagement on a single post
            </div>
          </div>
        </div>
      </div>
    </AuthenticatedLayout>
  );
}