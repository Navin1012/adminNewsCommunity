import { Head, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
  Facebook, Eye, TrendingUp, Users, Heart,
  MoreHorizontal, ArrowUpRight
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
  BarChart,
  Bar,
} from "recharts";

export default function UsersAnalytics({
  auth,
  analytics,
  days = 7,
}) {
  const periodKey = `${days}d`;
  const data = analytics?.period_analytics?.[periodKey] ?? {};

  const {
    total_followers = 0,
    total_reach = 0,
    engagement = 0,
    avg_engagement = 0,
    highest_engagement = 0,
    engagement_split = { reactions: 0, comments: 0, shares: 0 },
    engagement_trend = [],
    chart_labels = [],
    reach_series = [],
  } = data;

  const reachChartData = chart_labels.map((label, i) => ({
    name: label,
    value: Number(reach_series[i] ?? 0),
  }));

  const trendChartData = engagement_trend.map(item => ({
    name: item.name,
    value: Number(item.value),
  }));

  const PIE_DATA = [
    { name: "Reactions", value: engagement_split.reactions },
    { name: "Comments", value: engagement_split.comments },
    { name: "Shares", value: engagement_split.shares },
  ];

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  const stats = [
    {
      title: "Page Views",
      value: total_reach,
      icon: Eye,
      color: "blue",
    },
    {
      title: "Engagement",
      value: engagement,
      icon: TrendingUp,
      color: "emerald",
    },
    {
      title: "Followers",
      value: total_followers,
      icon: Users,
      color: "violet",
    },
  ];

  return (
    <AuthenticatedLayout admin={auth.admin} header="Facebook Analytics">
      <Head title="Facebook Analytics" />

      <div className="space-y-8">

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold flex items-center gap-2">
              Facebook Analytics <Facebook className="text-blue-600" />
            </h1>
            <p className="text-slate-500 mt-2">
              Combined analytics of all connected Facebook pages
            </p>
          </div>

          <div className="flex gap-2">
            {[7, 30, 90].map(d => (
              <button
                key={d}
                onClick={() =>
                  router.get(route("all.users.analytics"), { days: d })
                }
                className={`px-4 py-2 rounded-xl text-sm font-medium
                  ${days === d
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                    : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
              >
                {d} Days
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-lg transition"
              >
                <div className="flex justify-between mb-4">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
                    <Icon size={24} />
                  </div>
                  <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-1 rounded-full flex items-center">
                    + <ArrowUpRight size={12} />
                  </span>
                </div>
                <div className="text-3xl font-bold">
                  {Number(stat.value).toLocaleString()}
                </div>
                <div className="text-sm text-slate-500">{stat.title}</div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 bg-white p-6 rounded-2xl border shadow-sm">
            <div className="flex justify-between mb-4">
              <h2 className="font-bold">Page Views Trend</h2>
              <MoreHorizontal className="text-slate-400" />
            </div>

            {reachChartData.length ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={reachChartData}>
                  <defs>
                    <linearGradient id="reach" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Area dataKey="value" stroke="#3b82f6" fill="url(#reach)" />
                </AreaChart>
              </ResponsiveContainer>
            ) : <Empty />}
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow-sm">
            <h2 className="font-bold mb-4">Engagement Breakdown</h2>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={PIE_DATA}
                  dataKey="value"
                  innerRadius={80}
                  outerRadius={100}
                >
                  {PIE_DATA.map((_, i) => (
                    <Cell key={i} fill={COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h2 className="font-bold mb-4">Engagement Trend</h2>

          {trendChartData.length ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trendChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <Empty />}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Metric title="Average Engagement" value={`${avg_engagement}%`} icon={Heart} />
          <Metric title="Highest Engagement" value={highest_engagement} icon={TrendingUp} />
        </div>

      </div>
    </AuthenticatedLayout>
  );
}


const Metric = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-6 rounded-2xl border shadow-sm flex gap-4">
    <div className="p-3 bg-slate-100 rounded-xl">
      <Icon />
    </div>
    <div>
      <div className="text-sm text-slate-500">{title}</div>
      <div className="text-2xl font-bold">{value}</div>
    </div>
  </div>
);

const Empty = () => (
  <div className="h-64 flex items-center justify-center text-slate-400">
    No data available
  </div>
);
