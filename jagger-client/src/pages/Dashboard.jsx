import React, { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "supplier") return;

    const loadStats = async () => {
      try {
        const res = await api.get("/dashboard");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error:", err);
        setError("You are not authorized to view dashboard data.");
      }
    };

    loadStats();
  }, [user]);

  if (user?.role === "supplier") {
    return (
      <div className="alert alert-info">
        Dashboard is not available for suppliers.
      </div>
    );
  }

  if (error) return <div className="alert alert-danger">{error}</div>;
  if (!stats) return <p>Loading dashboard...</p>;

  const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#dc2626"];

  const pieData = [
    { name: "RFQs", value: stats.totalRFQs || 0 },
    { name: "Quotes", value: stats.totalQuotes || 0 },
  ];

  return (
    <div>
      <h3 className="fw-bold mb-4">Dashboard Overview</h3>

      {/* ===== KPI CARDS ===== */}
      <div className="row g-4 mb-4">
        <KpiCard
          title="Total RFQs"
          value={stats.totalRFQs}
          icon="bi-file-earmark-text"
          color="primary"
        />
        <KpiCard
          title="Total Quotes"
          value={stats.totalQuotes}
          icon="bi-chat-dots"
          color="success"
        />
        <KpiCard
          title="Purchase Orders"
          value={stats.totalPOs}
          icon="bi-receipt"
          color="warning"
        />
        <KpiCard
          title="Suppliers"
          value={stats.totalSuppliers}
          icon="bi-truck"
          color="danger"
        />
      </div>

      {/* ===== CHARTS ===== */}
      <div className="row g-4">
        {/* BAR CHART */}
        <div className="col-md-6">
          <div className="card dashboard-card">
            <h5 className="mb-3 fw-semibold">
              <i className="bi bi-bar-chart me-2"></i>
              Monthly PO Spend
            </h5>

            {stats.last6Months?.length ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.last6Months}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="totalAmount" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted">No PO data available</p>
            )}
          </div>
        </div>

        {/* PIE CHART */}
        <div className="col-md-6">
          <div className="card dashboard-card">
            <h5 className="mb-3 fw-semibold">
              <i className="bi bi-pie-chart me-2"></i>
              RFQ → Quote Ratio
            </h5>

            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                  label
                >
                  {pieData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== KPI CARD COMPONENT ===== */
function KpiCard({ title, value, icon, color }) {
  return (
    <div className="col-md-3 col-sm-6">
      <div className="card kpi-card">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-muted mb-1">{title}</h6>
            <h3 className="fw-bold mb-0">{value ?? 0}</h3>
          </div>
          <div className={`kpi-icon bg-${color}`}>
            <i className={`bi ${icon}`}></i>
          </div>
        </div>
      </div>
    </div>
  );
}
