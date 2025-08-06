import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Container,
  Card,
  CardBody,
  Nav,
  NavItem,
  NavLink,
  Table,
  Progress,
  Badge,
  FormGroup,
  Label,
  Input
} from "reactstrap";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import SalesChart from "../components/dashboard/SalesChart";
import ProjectTables from "../components/dashboard/ProjectTable";
import {
  useViewDashboardCountsQuery,
  useGetAreaWiseOrdersQuery
} from "../services/Api";

// RealtimeStatus Component (Unchanged)
const RealtimeStatus = ({ isConnected, lastUpdate, onRefresh }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await onRefresh();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <div
      onClick={handleRefresh}
      style={{
        position: "fixed",
        bottom: "32px",
        right: "32px",
        zIndex: 1050,
        background: isConnected
          ? "linear-gradient(135deg, #00b894, #00cec9)"
          : "linear-gradient(135deg, #e17055, #d63031)",
        color: "white",
        padding: "16px 24px",
        borderRadius: "30px",
        fontSize: "14px",
        fontWeight: "700",
        boxShadow: "0 12px 35px rgba(0,0,0,0.15)",
        border: "2px solid rgba(255,255,255,0.2)",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "12px",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        backdropFilter: "blur(15px)",
        minWidth: "160px",
        justifyContent: "center"
      }}
      onMouseEnter={(e) => {
        e.target.style.transform = "translateY(-4px) scale(1.05)";
        e.target.style.boxShadow = "0 20px 50px rgba(0,0,0,0.25)";
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = "translateY(0px) scale(1)";
        e.target.style.boxShadow = "0 12px 35px rgba(0,0,0,0.15)";
      }}
      title="Click to refresh data"
    >
      <i
        className={`bi ${isConnected ? "bi-wifi" : "bi-wifi-off"}`}
        style={{
          fontSize: "16px",
          animation: isRefreshing ? "spin 0.5s linear" : "none"
        }}
      ></i>
      <span>{isConnected ? "Live Data" : "Offline"}</span>
      <div
        style={{
          width: "2px",
          height: "18px",
          background: "rgba(255,255,255,0.4)",
          borderRadius: "1px"
        }}
      ></div>
      <span style={{ opacity: 0.95, fontSize: "13px", fontWeight: "600" }}>
        {lastUpdate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit"
        })}
      </span>
    </div>
  );
};

// ToastNotification Component (Unchanged)
const ToastNotification = ({ show, message, type, onClose }) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(onClose, 5000);
      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  const isSuccess = type === "success";

  return (
    <div
      style={{
        position: "fixed",
        top: "32px",
        right: "32px",
        zIndex: 1060,
        background: isSuccess
          ? "linear-gradient(135deg, #00b894, #00cec9)"
          : "linear-gradient(135deg, #e17055, #d63031)",
        color: "white",
        padding: "20px 28px",
        borderRadius: "16px",
        fontSize: "15px",
        fontWeight: "600",
        boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
        maxWidth: "400px",
        minWidth: "300px",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        animation:
          "slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1), fadeOut 0.4s ease-in 4.6s forwards",
        backdropFilter: "blur(15px)",
        border: "1px solid rgba(255,255,255,0.2)"
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.2)",
          borderRadius: "50%",
          padding: "8px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <i
          className={`bi ${
            isSuccess ? "bi-check-circle-fill" : "bi-exclamation-triangle-fill"
          }`}
          style={{ fontSize: "18px" }}
        ></i>
      </div>
      <span style={{ flex: 1, lineHeight: "1.4" }}>{message}</span>
      <button
        onClick={onClose}
        style={{
          background: "rgba(255,255,255,0.2)",
          border: "none",
          color: "white",
          cursor: "pointer",
          fontSize: "16px",
          padding: "8px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.target.style.background = "rgba(255,255,255,0.3)";
        }}
        onMouseLeave={(e) => {
          e.target.style.background = "rgba(255,255,255,0.2)";
        }}
      >
        <i className="bi bi-x"></i>
      </button>
    </div>
  );
};

// TopCard Component (Unchanged)
const TopCard = ({
  title,
  subtitle,
  earning,
  icon,
  trendDirection,
  bgColor = "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
}) => (
  <Card
    className="h-100"
    style={{
      background: bgColor,
      color: "white",
      border: "none",
      borderRadius: "20px",
      boxShadow: "0 8px 25px rgba(0,0,0,0.15)",
      transition: "all 0.3s ease"
    }}
  >
    <CardBody className="p-4">
      <div className="d-flex justify-content-between align-items-start">
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: "0.85rem",
              fontWeight: "600",
              marginBottom: "8px",
              opacity: 0.9
            }}
          >
            {title}
          </div>
          <div
            style={{
              fontSize: "1.8rem",
              fontWeight: "800",
              marginBottom: "4px",
              lineHeight: "1"
            }}
          >
            {earning || "0"}
          </div>
          <div
            style={{
              fontSize: "0.75rem",
              opacity: 0.8,
              fontWeight: "500"
            }}
          >
            {subtitle}
          </div>
        </div>
        <div
          style={{
            background: "rgba(255,255,255,0.2)",
            borderRadius: "12px",
            padding: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <i className={icon} style={{ fontSize: "1.5rem" }}></i>
        </div>
      </div>
    </CardBody>
  </Card>
);

// AreaAnalyticsCard Component
const AreaAnalyticsCard = ({ areaData, timeFilter, setTimeFilter }) => {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"];

  if (!areaData || !Array.isArray(areaData) || areaData.length === 0) {
    return (
      <Card
        style={{
          borderRadius: "20px",
          border: "none",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
        }}
      >
        <CardBody className="p-4">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
            <h4
              style={{
                fontSize: "1.3rem",
                fontWeight: "700",
                color: "#333",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                margin: 0,
                marginBottom: "1rem"
              }}
            >
              <i className="bi bi-geo-alt-fill" style={{ color: "#667eea" }}></i>
              Area Performance Analytics
            </h4>
            <FormGroup style={{ minWidth: "150px", maxWidth: "200px" }}>
              <Label for="timeFilter" style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>
                Time Period
              </Label>
              <Input
                type="select"
                id="timeFilter"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                style={{
                  borderRadius: "25px",
                  padding: "8px 30px 8px 16px", 
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  border: "2px solid #667eea",
                  appearance: "none",
                  background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%23667eea' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'/></svg>") no-repeat right 10px center`, // Custom arrow
                  backgroundSize: "10px"
                }}
              >
                {["Daily", "Weekly", "Monthly", "Yearly"].map((filter) => (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </div>

          <div className="text-center py-5">
            <i
              className="bi bi-bar-chart-line"
              style={{ fontSize: "3rem", color: "#ccc" }}
            ></i>
            <h5 style={{ color: "#666", marginTop: "1rem" }}>
              No area data available
            </h5>
            <p style={{ color: "#999" }}>
              Data will appear here once orders are placed in different areas.
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Create a shallow copy to avoid mutating the original array
  const topAreas = [...areaData]
    .filter((area) => area.total_orders > 0)
    .sort((a, b) => b.total_orders - a.total_orders)
    .slice(0, 10);

  const chartData = topAreas.map((area) => ({
    name:
      area.area && area.area.length > 15
        ? area.area.substring(0, 15) + "..."
        : area.area || "Unknown",
    fullName: area.area || "Unknown Area",
    total: parseInt(area.total_orders) || 0,
    pending: parseInt(area.pending_orders) || 0,
    accepted: parseInt(area.accepted_orders) || 0
  }));

  const pieData = topAreas.slice(0, 5).map((area, index) => ({
    name:
      area.area && area.area.length > 20
        ? area.area.substring(0, 20) + "..."
        : area.area || "Unknown",
    value: parseInt(area.total_orders) || 0,
    color: colors[index]
  }));

  return (
    <Card
      style={{
        borderRadius: "20px",
        border: "none",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
      }}
    >
      <CardBody className="p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h4
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              color: "#333",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: 0,
              marginBottom: "1rem"
            }}
          >
            <i className="bi bi-geo-alt-fill" style={{ color: "#667eea" }}></i>
            Area Performance Analytics
          </h4>
          <FormGroup style={{ minWidth: "150px", maxWidth: "200px" }}>
            <Label for="timeFilter" style={{ fontSize: "0.9rem", color: "#666", marginBottom: "0.5rem" }}>
              Time Period
            </Label>
            <Input
              type="select"
              id="timeFilter"
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              style={{
                borderRadius: "25px",
                padding: "8px 30px 8px 16px", // Increased right padding to avoid arrow overlap
                fontSize: "0.85rem",
                fontWeight: "600",
                border: "2px solid #667eea",
                appearance: "none", // Remove default browser arrow
                background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%23667eea' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'/></svg>") no-repeat right 10px center`, // Custom arrow
                backgroundSize: "10px"
              }}
            >
              {["Daily", "Weekly", "Monthly", "Yearly"].map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </Input>
          </FormGroup>
        </div>

        <Row className="g-4">
          <Col lg="8">
            <div style={{ marginBottom: "30px" }}>
              <h6
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#555",
                  marginBottom: "20px"
                }}
              >
                Top Areas - Order Distribution ({timeFilter})
              </h6>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={chartData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12 }}
                      angle={-45}
                      textAnchor="end"
                      height={80}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      contentStyle={{
                        background: "white",
                        border: "none",
                        borderRadius: "10px",
                        boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                      }}
                      formatter={(value, name) => [
                        value,
                        name.charAt(0).toUpperCase() + name.slice(1)
                      ]}
                      labelFormatter={(label) =>
                        chartData.find((d) => d.name === label)?.fullName || label
                      }
                    />
                    <Legend />
                    <Bar
                      dataKey="pending"
                      stackId="a"
                      fill="#ffc658"
                      name="Pending"
                      radius={[0, 0, 0, 0]}
                    />
                    <Bar
                      dataKey="accepted"
                      stackId="a"
                      fill="#82ca9d"
                      name="Accepted"
                      radius={[0, 0, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-4">
                  <p style={{ color: "#999" }}>
                    No chart data available for the selected time period.
                  </p>
                </div>
              )}
            </div>
          </Col>

          <Col lg="4">
            <div>
              <h6
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#555",
                  marginBottom: "20px"
                }}
              >
                Market Share by Area
              </h6>
              {pieData.length > 0 && pieData.some((d) => d.value > 0) ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) =>
                        `${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="text-center py-4">
                  <i
                    className="bi bi-pie-chart"
                    style={{ fontSize: "2rem", color: "#ccc" }}
                  ></i>
                  <p style={{ color: "#999", marginTop: "1rem" }}>
                    No pie chart data available.
                  </p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

// AreaManagementTable Component (Enhanced with Category Filter)
// AreaManagementTable Component
const AreaManagementTable = ({ selectedCategory }) => {
  const [sortConfig, setSortConfig] = useState({
    key: "total_orders",
    direction: "desc"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [timeFilter, setTimeFilter] = useState("Daily");

  const dateRange = getDateRange(timeFilter);
  const { data: areaWiseOrdersData, isFetching, isLoading, error } = useGetAreaWiseOrdersQuery({
    params: {
      start: dateRange.start,
      end: dateRange.end
    }
  });
  const areaData = areaWiseOrdersData?.data?.areaWiseOrders || [];

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const filteredData = Array.isArray(areaData) ? areaData.filter((area) =>
    area.area.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortConfig.key === "area") {
      return sortConfig.direction === "asc"
        ? a.area.localeCompare(b.area)
        : b.area.localeCompare(a.area);
    }

    const aValue =
      sortConfig.key === "total_orders"
        ? a.total_orders
        : parseInt(a[sortConfig.key]);
    const bValue =
      sortConfig.key === "total_orders"
        ? b.total_orders
        : parseInt(b[sortConfig.key]);

    return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
  });

  const getPerformanceLevel = (accepted, total) => {
    const ratio = accepted / total;
    if (ratio > 0.6) return { text: "Excellent", color: "#00b894" };
    if (ratio > 0.4) return { text: "Good", color: "#fdcb6e" };
    if (ratio > 0.2) return { text: "Average", color: "#fd79a8" };
    return { text: "Needs Attention", color: "#e17055" };
  };

  return (
    <Card
      style={{
        borderRadius: "20px",
        border: "none",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
      }}
    >
      <CardBody className="p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h4
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              color: "#333",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: 0,
              marginBottom: "1rem"
            }}
          >
            <i className="bi bi-table" style={{ color: "#667eea" }}></i>
            Area Management Dashboard - {timeFilter} View
            {selectedCategory !== "all" && (
              <span style={{ fontSize: "0.9rem", color: "#666" }}>
                (Filtered: {selectedCategory})
              </span>
            )}
          </h4>
          <div className="d-flex gap-3">
            <FormGroup style={{ minWidth: "150px", maxWidth: "200px" }}>
          
              <Input
                type="select"
                id="timeFilter"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                style={{
                  borderRadius: "25px",
                  padding: "8px 30px 8px 16px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  border: "2px solid #667eea",
                  appearance: "none",
                  background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%23667eea' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'/></svg>") no-repeat right 10px center`,
                  backgroundSize: "10px"
                }}
              >
                {["Daily", "Weekly", "Monthly", "Yearly"].map((filter) => (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <div style={{ position: "relative", maxWidth: "300px" }}>
              <input
                type="text"
                placeholder="Search areas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  padding: "10px 40px 10px 16px",
                  borderRadius: "25px",
                  border: "2px solid #e0e0e0",
                  fontSize: "14px",
                  width: "100%",
                  outline: "none",
                  transition: "all 0.3s ease"
                }}
                onFocus={(e) => (e.target.style.borderColor = "#667eea")}
                onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
              />
              <i
                className="bi bi-search"
                style={{
                  position: "absolute",
                  right: "16px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#999"
                }}
              ></i>
            </div>
          </div>
        </div>

        {isLoading || error || !sortedData.length ? (
          <div className="text-center py-5">
            <i
              className="bi bi-table"
              style={{ fontSize: "3rem", color: "#ccc" }}
            ></i>
            <h5 style={{ color: "#666", marginTop: "1rem" }}>
              {isLoading ? "Loading..." : error ? "Error loading data" : "No area data available"}
            </h5>
            <p style={{ color: "#999" }}>
              {error ? "Please try again later." : "Data will appear here once orders are placed in different areas."}
            </p>
          </div>
        ) : (
          <>
            <div
              style={{
                background: "#f8f9ff",
                borderRadius: "15px",
                padding: "20px",
                marginBottom: "20px"
              }}
            >
              <Row className="g-3">
                <Col md="12">
                  <div className="text-center">
                    <div
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: "800",
                        color: "#667eea"
                      }}
                    >
                      {filteredData.length}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        fontWeight: "600"
                      }}
                    >
                      Total Areas
                    </div>
                  </div>
                </Col>
                {/* <Col md="6">
                  <div className="text-center">
                    <div
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: "800",
                        color: "#00b894"
                      }}
                    >
                      {
                        filteredData.filter(
                          (a) =>
                            parseInt(a.accepted_orders) > parseInt(a.pending_orders)
                        ).length
                      }
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        fontWeight: "600"
                      }}
                    >
                      High Performing
                    </div>
                  </div>
                </Col> */}
                {/* <Col md="3">
                  <div className="text-center">
                    <div
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: "800",
                        color: "#fdcb6e"
                      }}
                    >
                      {
                        filteredData.filter(
                          (a) =>
                            parseInt(a.pending_orders) > parseInt(a.accepted_orders)
                        ).length
                      }
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        fontWeight: "600"
                      }}
                    >
                      Needs Attention
                    </div>
                  </div>
                </Col>
                <Col md="3">
                  <div className="text-center">
                    <div
                      style={{
                        fontSize: "1.8rem",
                        fontWeight: "800",
                        color: "#e17055"
                      }}
                    >
                      {filteredData.filter((a) => a.total_orders < 5).length}
                    </div>
                    <div
                      style={{
                        fontSize: "0.9rem",
                        color: "#666",
                        fontWeight: "600"
                      }}
                    >
                      Low Activity
                    </div>
                  </div>
                </Col> */}
              </Row>
            </div>

            <div
              style={{
                background: "white",
                borderRadius: "15px",
                overflow: "hidden",
                border: "1px solid #e9ecef"
              }}
            >
              <Table hover responsive className="mb-0">
                <thead style={{ background: "#f8f9fa" }}>
                  <tr>
                    <th
                      style={{
                        cursor: "pointer",
                        padding: "16px",
                        fontWeight: "700",
                        borderBottom: "2px solid #e9ecef",
                        color: "#333"
                      }}
                      onClick={() => handleSort("area")}
                    >
                      <div className="d-flex align-items-center gap-2">
                        Area Name
                        <i
                          className={`bi bi-arrow-${
                            sortConfig.key === "area" &&
                            sortConfig.direction === "asc"
                              ? "up"
                              : "down"
                          }`}
                        ></i>
                      </div>
                    </th>
                    <th
                      style={{
                        cursor: "pointer",
                        padding: "16px",
                        fontWeight: "700",
                        borderBottom: "2px solid #e9ecef",
                        color: "#333"
                      }}
                      onClick={() => handleSort("total_orders")}
                    >
                      <div className="d-flex align-items-center gap-2">
                        Total Orders
                        <i
                          className={`bi bi-arrow-${
                            sortConfig.key === "total_orders" &&
                            sortConfig.direction === "asc"
                              ? "up"
                              : "down"
                          }`}
                        ></i>
                      </div>
                    </th>
                    <th
                      style={{
                        padding: "16px",
                        fontWeight: "700",
                        borderBottom: "2px solid #e9ecef",
                        color: "#333"
                      }}
                    >
                      Status Distribution
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedData.map((area, index) => {
                    const total = area.total_orders;
                    const pending = parseInt(area.pending_orders);
                    const accepted = parseInt(area.accepted_orders);
                    const performance = getPerformanceLevel(accepted, total);

                    return (
                      <tr key={index} style={{ transition: "all 0.2s ease" }}>
                        <td style={{ padding: "16px", verticalAlign: "middle" }}>
                          <div>
                            <div
                              style={{
                                fontWeight: "600",
                                color: "#333",
                                marginBottom: "4px"
                              }}
                            >
                              {area.area}
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "16px", verticalAlign: "middle" }}>
                          <div
                            style={{
                              fontSize: "1.1rem",
                              fontWeight: "700",
                              color: "#667eea"
                            }}
                          >
                            {total}
                          </div>
                        </td>
                        <td style={{ padding: "16px", verticalAlign: "middle" }}>
                          <div style={{ marginBottom: "8px" }}>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small style={{ fontSize: "0.75rem", color: "#666" }}>
                                Pending: {pending}
                              </small>
                              <small style={{ fontSize: "0.75rem", color: "#666" }}>
                                {Math.round((pending / total) * 100)}%
                              </small>
                            </div>
                            <Progress
                              value={(pending / total) * 100}
                              color="warning"
                              style={{ height: "6px" }}
                            />
                          </div>
                          <div style={{ marginBottom: "8px" }}>
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small style={{ fontSize: "0.75rem", color: "#666" }}>
                                Accepted: {accepted}
                              </small>
                              <small style={{ fontSize: "0.75rem", color: "#666" }}>
                                {Math.round((accepted / total) * 100)}%
                              </small>
                            </div>
                            <Progress
                              value={(accepted / total) * 100}
                              color="success"
                              style={{ height: "6px" }}
                            />
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          </>
        )}
      </CardBody>
    </Card>
  );
};

const TopCategoriesCard = ({ selectedCategory, setSelectedCategory }) => {
  const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#8dd1e1"];
  const [timeFilter, setTimeFilter] = useState("Daily");

  const dateRange = getDateRange(timeFilter);
  const {
    data: areaWiseOrdersData,
    isFetching,
    isLoading,
    error
  } = useGetAreaWiseOrdersQuery({
    params: {
      start: dateRange.start,
      end: dateRange.end
    }
  });
  const categoryData = areaWiseOrdersData?.data?.topCategories || [];

  if (
    isLoading ||
    error ||
    !categoryData ||
    !Array.isArray(categoryData) ||
    categoryData.length === 0
  ) {
    return (
      <Card
        style={{
          borderRadius: "20px",
          border: "none",
          boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
        }}
      >
        <CardBody className="p-4">
          <div className="text-center py-5">
            <i
              className="bi bi-bar-chart-line"
              style={{ fontSize: "3rem", color: "#ccc" }}
            ></i>
            <h5 style={{ color: "#666", marginTop: "1rem" }}>
              {isLoading
                ? "Loading..."
                : error
                ? "Error loading data"
                : "No category data available"}
            </h5>
            <p style={{ color: "#999" }}>
              {error
                ? "Please try again later."
                : "Data will appear here once orders are placed in different categories."}
            </p>
          </div>
        </CardBody>
      </Card>
    );
  }

  // Filter categories based on selectedCategory
  const filteredCategories =
    selectedCategory === "all"
      ? [...categoryData]
          .sort((a, b) => b.total_orders - a.total_orders)
          .slice(0, 5)
      : [...categoryData]
          .filter((category) => category.category_name === selectedCategory)
          .sort((a, b) => b.total_orders - a.total_orders);

  // Prepare chart data
  const chartData = filteredCategories.map((category, index) => ({
    name:
      category.category_name.length > 15
        ? category.category_name.substring(0, 15) + "..."
        : category.category_name,
    fullName: category.category_name,
    total: parseInt(category.total_orders) || 0,
    color: colors[index % colors.length]
  }));

  return (
    <Card
      style={{
        borderRadius: "20px",
        border: "none",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)"
      }}
    >
      <CardBody className="p-4">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
          <h4
            style={{
              fontSize: "1.3rem",
              fontWeight: "700",
              color: "#333",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              margin: 0,
              marginBottom: "1rem"
            }}
          >
            <i
              className="bi bi-bar-chart-fill"
              style={{ color: "#667eea" }}
            ></i>
            Top Categories Performance
          </h4>
          <div className="d-flex flex-column flex-sm-row gap-3">
            <FormGroup style={{ minWidth: "150px", maxWidth: "200px" }}>
              <Label
                for="timeFilter"
                style={{
                  fontSize: "0.9rem",
                  color: "#666",
                  marginBottom: "0.5rem"
                }}
              >
                Time Period
              </Label>
              <Input
                type="select"
                id="timeFilter"
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                style={{
                  borderRadius: "25px",
                  padding: "8px 30px 8px 16px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  border: "2px solid #667eea",
                  appearance: "none",
                  background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%23667eea' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'/></svg>") no-repeat right 10px center`,
                  backgroundSize: "10px"
                }}
              >
                {["Daily", "Weekly", "Monthly", "Yearly"].map((filter) => (
                  <option key={filter} value={filter}>
                    {filter}
                  </option>
                ))}
              </Input>
            </FormGroup>
            <FormGroup
              style={{ minWidth: "120px", maxWidth: "180px", width: "100%" }}
            >
              <Label
                for="categoryFilter"
                style={{
                  fontSize: "0.9rem",
                  color: "#666",
                  marginBottom: "0.5rem"
                }}
              >
                Filter by Category
              </Label>
              <Input
                type="select"
                id="categoryFilter"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  borderRadius: "25px",
                  padding: "8px 30px 8px 16px",
                  fontSize: "0.85rem",
                  fontWeight: "600",
                  border: "2px solid #667eea",
                  appearance: "none",
                  background: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10' fill='%23667eea' viewBox='0 0 24 24'><path d='M7 10l5 5 5-5z'/></svg>") no-repeat right 10px center`,
                  backgroundSize: "10px",
                  width: "100%",
                  boxSizing: "border-box"
                }}
              >
                <option value="all">All Categories</option>
                {categoryData.map((category) => (
                  <option
                    key={category.category_id}
                    value={category.category_name}
                  >
                    {category.category_name}
                  </option>
                ))}
              </Input>
            </FormGroup>
          </div>
        </div>

        <Row className="g-4">
          <Col lg="8">
            <h6
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#555",
                marginBottom: "20px"
              }}
            >
              Category Order Distribution ({timeFilter})
            </h6>
            {chartData.length > 0 && !isFetching ? (
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={chartData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={80}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      background: "white",
                      border: "none",
                      borderRadius: "10px",
                      boxShadow: "0 8px 25px rgba(0,0,0,0.15)"
                    }}
                    formatter={(value, name) => [
                      value,
                      name.charAt(0).toUpperCase() + name.slice(1)
                    ]}
                    labelFormatter={(label) =>
                      chartData.find((d) => d.name === label)?.fullName || label
                    }
                  />
                  <Legend />
                  <Bar
                    dataKey="total"
                    name="Total Orders"
                    radius={[4, 4, 0, 0]}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center py-4">
                <p style={{ color: "#999" }}>
                  {isFetching
                    ? "Loading chart data..."
                    : "No data available for the selected category."}
                </p>
              </div>
            )}
          </Col>
          <Col lg="4">
            <h6
              style={{
                fontSize: "1rem",
                fontWeight: "600",
                color: "#555",
                marginBottom: "20px"
              }}
            >
              Category Details
            </h6>
            {filteredCategories.length > 0 && !isFetching ? (
              <Table hover responsive className="mb-0">
                <thead style={{ background: "#f8f9fa" }}>
                  <tr>
                    <th
                      style={{
                        padding: "12px",
                        fontWeight: "700",
                        color: "#333",
                        fontSize: "0.9rem",
                        minWidth: "100px"
                      }}
                    >
                      Category
                    </th>
                    <th
                      style={{
                        padding: "12px",
                        fontWeight: "700",
                        color: "#333",
                        fontSize: "0.9rem",
                        minWidth: "80px",
                        textAlign: "right"
                      }}
                    >
                      Total Orders
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCategories.map((category, index) => (
                    <tr key={index}>
                      <td
                        style={{
                          padding: "12px",
                          fontSize: "0.85rem",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          maxWidth: "150px"
                        }}
                      >
                        {category.category_name}
                      </td>
                      <td
                        style={{
                          padding: "12px",
                          fontWeight: "700",
                          color: "#667eea",
                          fontSize: "0.85rem",
                          textAlign: "right"
                        }}
                      >
                        {category.total_orders}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-4">
                <p style={{ color: "#999" }}>
                  {isFetching
                    ? "Loading table data..."
                    : "No categories match the selected filter."}
                </p>
              </div>
            )}
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};
// CardSkeleton Component (Unchanged)
const CardSkeleton = () => (
  <div
    style={{
      background:
        "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
      backgroundSize: "200% 100%",
      animation: "loading 1.5s infinite",
      borderRadius: "20px",
      height: "160px",
      marginBottom: "1rem"
    }}
  />
);

// Helper function to get date ranges based on filter (Unchanged)
const getDateRange = (filter) => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  switch (filter.toLowerCase()) {
    case "daily":
      return {
        start: today.toISOString().split("T")[0],
        end: today.toISOString().split("T")[0]
      };
    case "weekly":
      const weekStart = new Date(today);
      weekStart.setDate(today.getDate() - today.getDay());
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      return {
        start: weekStart.toISOString().split("T")[0],
        end: weekEnd.toISOString().split("T")[0]
      };
    case "monthly":
      const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      return {
        start: monthStart.toISOString().split("T")[0],
        end: monthEnd.toISOString().split("T")[0]
      };
    case "yearly":
      const yearStart = new Date(today.getFullYear(), 0, 1);
      const yearEnd = new Date(today.getFullYear(), 11, 31);
      return {
        start: yearStart.toISOString().split("T")[0],
        end: yearEnd.toISOString().split("T")[0]
      };
    default:
      return {
        start: today.toISOString().split("T")[0],
        end: today.toISOString().split("T")[0]
      };
  }
};

// Main Starter Component (Updated)
const Starter = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState("success");
  const [refreshCount, setRefreshCount] = useState(0);
  const [timeFilter, setTimeFilter] = useState("Daily");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  // Backend API Integration
  const {
    data: viewDashboardCounts,
    refetch: viewDashboardCountsRefetch,
    isFetching: isDashboardFetching,
    error: dashboardError,
    isLoading: isDashboardLoading
  } = useViewDashboardCountsQuery();

  const dateRange = getDateRange(timeFilter);

  const {
    data: areaWiseOrdersData,
    refetch: areaWiseOrdersRefetch,
    isFetching: isAreaFetching,
    error: areaError,
    isLoading: isAreaLoading
  } = useGetAreaWiseOrdersQuery({
    params: {
      start: dateRange.start,
      end: dateRange.end
    }
  });

  // Extract data correctly
  const areaData = areaWiseOrdersData?.data?.areaWiseOrders || [];
  const categoryData = areaWiseOrdersData?.data?.topCategories || [];
  const dashboardData = viewDashboardCounts?.data || {};

  const isFetching = isDashboardFetching || isAreaFetching;

  const showNotification = (message, type = "success") => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  const handleManualRefresh = async () => {
    try {
      setIsLoading(true);
      await Promise.all([
        viewDashboardCountsRefetch(),
        areaWiseOrdersRefetch()
      ]);
      setIsConnected(true);
      setLastUpdate(new Date());
      setRefreshCount((prev) => prev + 1);
      const messages = [
        "Dashboard updated successfully! 🎉",
        "Fresh data loaded! ✨",
        "All metrics refreshed! 📊",
        "Data sync complete! 🔄"
      ];
      showNotification(messages[refreshCount % messages.length]);
    } catch (error) {
      setIsConnected(false);
      showNotification(
        "Failed to refresh dashboard data. Please try again.",
        "error"
      );
      console.error("Refresh error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const autoRefresh = async () => {
      try {
        await Promise.all([
          viewDashboardCountsRefetch(),
          areaWiseOrdersRefetch()
        ]);
        setIsConnected(true);
        setLastUpdate(new Date());
        if (Math.random() < 0.15) {
          showNotification("Data updated automatically ✨");
        }
      } catch (error) {
        setIsConnected(false);
        console.error("Auto-refresh failed:", error);
        if (Math.random() < 0.3) {
          showNotification(
            "Auto-refresh failed. Click the status button to manually refresh.",
            "error"
          );
        }
      }
    };

    const interval = setInterval(autoRefresh, 45000);
    return () => clearInterval(interval);
  }, [viewDashboardCountsRefetch, areaWiseOrdersRefetch]);

  useEffect(() => {
    if (dashboardError || areaError) {
      setIsConnected(false);
    } else if (viewDashboardCounts || areaWiseOrdersData) {
      setIsConnected(true);
    }
  }, [dashboardError, areaError, viewDashboardCounts, areaWiseOrdersData]);

  useEffect(() => {
    if (timeFilter) {
      areaWiseOrdersRefetch();
    }
  }, [timeFilter, areaWiseOrdersRefetch]);

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundAttachment: "fixed",
        // padding: "32px 0"
      }}
    >
      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
          
          @keyframes fadeOut {
            from {
              opacity: 1;
              transform: translateX(0);
            }
            to {
              opacity: 0;
              transform: translateX(100%);
            }
          }
          
          @keyframes loading {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
          
          @keyframes spin {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          
          .loading-pulse {
            animation: pulse 2s infinite;
          }
          
          @keyframes pulse {
            0%, 100% {
              opacity: 1;
            }
            50% {
              opacity: 0.8;
            }
          }

          .nav-pills-custom .nav-link:hover {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            transform: translateY(-2px);
          }

          .table tbody tr:hover {
            background-color: #f8f9ff !important;
            transform: translateY(-2px);
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          }

          .dashboard-header {
            padding: 0 0 16px 0;
            margin-bottom: 16px;
            border-bottom: 1px solid #eee;
          }
        `}
      </style>

      <Container fluid>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h1
              style={{
                fontSize: "1.2rem",
                fontWeight: "800",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                letterSpacing: "-0.5px",
                marginBottom: "8px"
              }}
            >
              EasyQist Dashboard
            </h1>
          </div>
        </div>

        {/* Main Metrics Cards */}
        <Row className="gx-4 gy-0">
          <Col sm="6" lg="3">
            {isLoading ? (
              <CardSkeleton />
            ) : (
              <div className={isFetching ? "loading-pulse" : ""}>
                <TopCard
                  title="Daily Performance"
                  subtitle="Today's Orders"
                  earning={dashboardData?.today || 0}
                  icon="bi bi-bag"
                  trendDirection="up"
                  bgColor="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                />
              </div>
            )}
          </Col>
          <Col sm="6" lg="3">
            {isLoading ? (
              <CardSkeleton />
            ) : (
              <div className={isFetching ? "loading-pulse" : ""}>
                <TopCard
                  title="Order Management"
                  subtitle="Pending Orders"
                  earning={dashboardData?.pending || 0}
                  icon="bi bi-clock"
                  trendDirection="down"
                  bgColor="linear-gradient(135deg, #ffc658 0%, #ff8a00 100%)"
                />
              </div>
            )}
          </Col>
          <Col sm="6" lg="3">
            {isLoading ? (
              <CardSkeleton />
            ) : (
              <div className={isFetching ? "loading-pulse" : ""}>
                <TopCard
                  title="Acceptance Rate"
                  subtitle="Today's Accepted"
                  earning={dashboardData?.todayAccepted || 0}
                  icon="bi bi-check-circle"
                  trendDirection="up"
                  bgColor="linear-gradient(135deg, #00b894 0%, #00cec9 100%)"
                />
              </div>
            )}
          </Col>
          <Col sm="6" lg="3">
            {isLoading ? (
              <CardSkeleton />
            ) : (
              <div className={isFetching ? "loading-pulse" : ""}>
                <TopCard
                  title="Total Performance"
                  subtitle="Total Accepted"
                  earning={dashboardData?.totalAccepted || 0}
                  icon="bi bi-target"
                  trendDirection="up"
                  bgColor="linear-gradient(135deg, #e17055 0%, #d63031 100%)"
                />
              </div>
            )}
          </Col>
        </Row>

        {/* Secondary Metrics Cards */}
        <Row className="gx-4 mb-3">
          <Col sm="6" lg="3">
            {isLoading ? (
              <CardSkeleton />
            ) : (
              <div className={isFetching ? "loading-pulse" : ""}>
                <TopCard
                  title="Daily Delivery"
                  subtitle="Today Delivered"
                  earning={dashboardData?.todayDelivered || 0}
                  icon="bi bi-truck"
                  trendDirection="up"
                  bgColor="linear-gradient(135deg, #fd79a8 0%, #e84393 100%)"
                />
              </div>
            )}
          </Col>
          <Col sm="6" lg="3">
            {isLoading ? (
              <CardSkeleton />
            ) : (
              <div className={isFetching ? "loading-pulse" : ""}>
                <TopCard
                  title="Total Delivery"
                  subtitle="Total Delivered"
                  earning={dashboardData?.totalDelivered || 0}
                  icon="bi bi-box-seam"
                  trendDirection="up"
                  bgColor="linear-gradient(135deg, #8884d8 0%, #82ca9d 100%)"
                />
              </div>
            )}
          </Col>
          <Col sm="6" lg="3">
            {isLoading ? (
              <CardSkeleton />
            ) : (
              <div className={isFetching ? "loading-pulse" : ""}>
                <TopCard
                  title="User Activity"
                  subtitle="Today Users"
                  earning={dashboardData?.todayUsers || 0}
                  icon="bi bi-person-plus"
                  trendDirection="up"
                  bgColor="linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)"
                />
              </div>
            )}
          </Col>
          <Col sm="6" lg="3">
            {isLoading ? (
              <CardSkeleton />
            ) : (
              <div className={isFetching ? "loading-pulse" : ""}>
                <TopCard
                  title="User Base"
                  subtitle="Total Users"
                  earning={dashboardData?.totalUsers || 0}
                  icon="bi bi-people"
                  trendDirection="up"
                  bgColor="linear-gradient(135deg, #fdcb6e 0%, #e17055 100%)"
                />
              </div>
            )}
          </Col>
        </Row>
        <Row className="g-4 mb-3">
          <Col sm="12">
            <AreaAnalyticsCard
              areaData={areaData}
              timeFilter={timeFilter}
              setTimeFilter={setTimeFilter}
            />
          </Col>
        </Row>
        {/* Top Categories Section */}
        <Row className="g-4 mb-3">
          <Col sm="12">
            <TopCategoriesCard
              categoryData={categoryData}
              timeFilter={timeFilter}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
            />
          </Col>
        </Row>

        {/* Sales Analytics Section */}
        <Row className="g-4 mb-3">
          <Col sm="12">
            <div className="section-container">
              <SalesChart />
            </div>
          </Col>
        </Row>

        {/* Area Management Table */}
        <Row className="g-4 mb-3">
          <Col lg="12">
            <AreaManagementTable
              areaData={areaData}
              timeFilter={timeFilter}
              selectedCategory={selectedCategory}
            />
          </Col>
        </Row>

        {/* Project Tables Section */}
        <Row className="g-4">
          <Col lg="12">
            <div className="section-container">
              <ProjectTables />
            </div>
          </Col>
        </Row>
      </Container>

      {/* Real-time Status Indicator */}
      <RealtimeStatus
        isConnected={isConnected}
        lastUpdate={lastUpdate}
        onRefresh={handleManualRefresh}
      />

      <ToastNotification
        show={showToast}
        message={toastMessage}
        type={toastType}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
};

export default Starter;