import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { getDashboardStats } from "../../services/adminService";

const COLORS = {
  emerald: "#059669",
  emeraldLight: "#6ee7b7",
  amber: "#f59e0b",
  red: "#ef4444",
  blue: "#3b82f6",
  slate: "#94a3b8",
};

const Dashboard = () => {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await getDashboardStats();
        if (response.success) {
          setDashboard(response.data);
        } else {
          setError("Unable to load dashboard");
        }
      } catch (err) {
        console.error("Dashboard Error:", err);
        setError(err.response?.data?.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-slate-500">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 rounded-2xl p-5">
        {error}
      </div>
    );
  }

  if (!dashboard) {
    return null;
  }

  // Platform overview — counts as bars
  const overviewData = [
    { name: "Users", value: dashboard.counts.users },
    { name: "Instructors", value: dashboard.counts.instructors },
    { name: "Classes", value: dashboard.counts.classes },
    { name: "Sessions", value: dashboard.counts.session },
    { name: "Bookings", value: dashboard.counts.bookings },
    { name: "Blogs", value: dashboard.counts.blogs },
  ];

  // Payment summary — pie
  const paymentData = [
    { name: "Paid", value: dashboard.payments.paid, color: COLORS.emerald },
    { name: "Pending", value: dashboard.payments.pending, color: COLORS.amber },
    { name: "Failed", value: dashboard.payments.failed, color: COLORS.red },
    { name: "Refunded", value: dashboard.payments.refunded, color: COLORS.blue },
  ].filter((d) => d.value > 0);

  // Recent booking status — computed from the recentBookings list only
  const bookingStatusCounts = { Booked: 0, Cancelled: 0, Completed: 0 };
  (dashboard.recentBookings || []).forEach((b) => {
    if (bookingStatusCounts[b.bookingStatus] !== undefined) {
      bookingStatusCounts[b.bookingStatus] += 1;
    }
  });
  const bookingStatusData = Object.entries(bookingStatusCounts)
    .map(([name, value]) => ({ name, value }))
    .filter((d) => d.value > 0);

  // Recent blog categories — computed from the recentBlogs list only
  const blogCategoryCounts = {};
  (dashboard.recentBlogs || []).forEach((b) => {
    blogCategoryCounts[b.category] = (blogCategoryCounts[b.category] || 0) + 1;
  });
  const blogCategoryData = Object.entries(blogCategoryCounts).map(
    ([name, value]) => ({ name, value })
  );

  const pieColors = [COLORS.emerald, COLORS.emeraldLight, COLORS.amber, COLORS.blue, COLORS.slate];

  return (
    <div className="space-y-7">
      {/* Header */}
      <div>
        <p className="text-sm font-medium text-emerald-600">Overview</p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1">Dashboard</h1>
        <p className="text-slate-500 mt-1">
          Here's what's happening with YogaConnect today.
        </p>
      </div>

      {/* Platform Overview + Payment Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Platform Overview
          </h3>
          <p className="text-sm text-slate-500 mb-6">Current totals across the platform</p>

          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={overviewData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }}
              />
              <Bar dataKey="value" fill={COLORS.emerald} radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">Payment Summary</h3>
          <p className="text-sm text-slate-500 mb-6">Current payment status</p>

          {paymentData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">
              No payment data yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={paymentData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {paymentData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12 }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Recent Booking Status + Recent Blog Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Recent Bookings by Status
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Based on the {dashboard.recentBookings?.length || 0} most recent bookings
          </p>

          {bookingStatusData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">
              No recent bookings yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={bookingStatusData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 12, fill: "#64748b" }} axisLine={false} tickLine={false} width={90} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                <Bar dataKey="value" fill={COLORS.emerald} radius={[0, 6, 6, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-1">
            Recent Blogs by Category
          </h3>
          <p className="text-sm text-slate-500 mb-6">
            Based on the {dashboard.recentBlogs?.length || 0} most recent blog posts
          </p>

          {blogCategoryData.length === 0 ? (
            <div className="h-64 flex items-center justify-center text-sm text-slate-400">
              No recent blog posts yet.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={blogCategoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={85}
                  paddingAngle={2}
                >
                  {blogCategoryData.map((entry, index) => (
                    <Cell key={entry.name} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #e2e8f0", fontSize: 13 }} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;