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
} from "recharts";

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // ❌ Supplier should not load dashboard
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

  // Supplier view
  if (user?.role === "supplier") {
    return (
      <div className="alert alert-info">
        Dashboard is not available for suppliers.
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  if (!stats) return <p>Loading dashboard...</p>;

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  const pieData = [
    { name: "RFQs", value: stats.totalRFQs || 0 },
    { name: "Quotes", value: stats.totalQuotes || 0 },
  ];

  return (
    <div>
      <h3>Dashboard Overview</h3>

      {/* KPI CARDS */}
      <div className="row mt-4">
        {[
          { label: "RFQs", value: stats.totalRFQs },
          { label: "Quotes", value: stats.totalQuotes },
          { label: "POs", value: stats.totalPOs },
          { label: "Suppliers", value: stats.totalSuppliers },
        ].map((kpi, idx) => (
          <div className="col-md-3" key={idx}>
            <div className="card p-3 bg-light shadow-sm">
              <h6>{kpi.label}</h6>
              <h3>{kpi.value ?? 0}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="row mt-4">
        {/* BAR CHART */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h5>Monthly PO Spend</h5>

            {stats.last6Months?.length ? (
              <BarChart width={450} height={250} data={stats.last6Months}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="totalAmount" fill="#0088FE" />
              </BarChart>
            ) : (
              <p className="text-muted">No PO data available</p>
            )}
          </div>
        </div>

        {/* PIE CHART */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h5>RFQ → Quote Ratio</h5>

            <PieChart width={400} height={250}>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
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
            </PieChart>
          </div>
        </div>
      </div>
    </div>
  );
}
