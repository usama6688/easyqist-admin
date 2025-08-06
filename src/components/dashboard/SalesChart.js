import React, { useEffect, useState, useCallback } from "react";
import { Card, CardBody, CardSubtitle, CardTitle } from "reactstrap";
import Chart from "react-apexcharts";
import { useChartDataQuery } from "../../services/Api";

const SalesChart = () => {
  // Add polling to the query for real-time updates
  const {
    data: chartData,
    refetch: chartDataRefetch,
    isFetching,
    isLoading
  } = useChartDataQuery(undefined, {
    // Poll every 30 seconds for real-time updates
    pollingInterval: 30000,
    // Refetch on window focus
    refetchOnFocus: true,
    // Refetch on reconnect
    refetchOnReconnect: true,
    // Keep previous data while fetching new data
    keepPreviousData: true
  });

  const [chartHeight, setChartHeight] = useState(390);
  const [lastUpdateTime, setLastUpdateTime] = useState(Date.now());

  const totalOrders = chartData?.data?.map((item) => item.totalOrder) || [];
  const dates = chartData?.data?.map((item) => item.date) || [];

  // Force refresh function for manual updates
  const forceRefresh = useCallback(async () => {
    try {
      await chartDataRefetch();
      setLastUpdateTime(Date.now());
    } catch (error) {
      console.error("Error refreshing chart data:", error);
    }
  }, [chartDataRefetch]);

  // Auto-refresh every 5 minutes as backup
  useEffect(() => {
    const interval = setInterval(() => {
      forceRefresh();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [forceRefresh]);

  // Responsive chart height based on screen size
  useEffect(() => {
    const updateChartHeight = () => {
      const width = window.innerWidth;
      if (width < 576) {
        setChartHeight(280); // Mobile
      } else if (width < 768) {
        setChartHeight(320); // Tablet
      } else if (width < 992) {
        setChartHeight(360); // Small laptop
      } else {
        setChartHeight(390); // Desktop
      }
    };

    updateChartHeight();
    window.addEventListener("resize", updateChartHeight);
    return () => window.removeEventListener("resize", updateChartHeight);
  }, []);

  // Update last update time when data changes
  useEffect(() => {
    if (chartData) {
      setLastUpdateTime(Date.now());
    }
  }, [chartData]);

  const chartoptions = {
    series: [
      {
        name: "Total Orders",
        data: totalOrders
      }
    ],
    options: {
      chart: {
        type: "area",
        toolbar: {
          show: true,
          tools: {
            download: true,
            selection: false,
            zoom: false,
            zoomin: false,
            zoomout: false,
            pan: false,
            reset: false
          },
          export: {
            csv: {
              filename: "sales-data"
            },
            svg: {
              filename: "sales-chart"
            },
            png: {
              filename: "sales-chart"
            }
          }
        },
        background: "transparent",
        fontFamily: "inherit",
        foreColor: "#64748b",
        animations: {
          enabled: true,
          easing: "easeinout",
          speed: 800,
          animateGradually: {
            enabled: true,
            delay: 150
          },
          dynamicAnimation: {
            enabled: true,
            speed: 350
          }
        }
      },
      colors: ["#667eea"],
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#667eea"]
      },
      fill: {
        type: "gradient",
        gradient: {
          shade: "light",
          type: "vertical",
          shadeIntensity: 0.4,
          gradientToColors: ["#764ba2"],
          inverseColors: false,
          opacityFrom: 0.8,
          opacityTo: 0.1,
          stops: [0, 100]
        }
      },
      grid: {
        show: true,
        strokeDashArray: 3,
        borderColor: "#e2e8f0",
        row: {
          colors: ["transparent", "transparent"],
          opacity: 0.5
        },
        column: {
          colors: ["transparent", "transparent"],
          opacity: 0.5
        },
        xaxis: {
          lines: {
            show: false
          }
        },
        yaxis: {
          lines: {
            show: true
          }
        },
        padding: {
          top: 0,
          right: 20,
          bottom: 0,
          left: 20
        }
      },
      xaxis: {
        categories: dates,
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px",
            fontWeight: 500
          },
          rotate: -45,
          rotateAlways: false,
          hideOverlappingLabels: true,
          showDuplicates: false,
          trim: true,
          maxHeight: 120
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          show: true,
          width: 1,
          position: "back",
          opacity: 0.9,
          stroke: {
            color: "#667eea",
            width: 1,
            dashArray: 3
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: "#64748b",
            fontSize: "12px",
            fontWeight: 500
          },
          formatter: function (val) {
            return Math.floor(val);
          }
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        }
      },
      tooltip: {
        enabled: true,
        theme: "light",
        style: {
          fontSize: "12px",
          fontFamily: "inherit"
        },
        x: {
          show: true,
          format: "dd MMM yyyy"
        },
        y: {
          formatter: function (val) {
            return val + " orders";
          }
        },
        marker: {
          show: true,
          fillColors: ["#667eea"]
        },
        custom: function ({ series, seriesIndex, dataPointIndex, w }) {
          const value = series[seriesIndex][dataPointIndex];
          const date = w.globals.categoryLabels[dataPointIndex];

          return `
            <div style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              padding: 12px 16px;
              border-radius: 12px;
              box-shadow: 0 8px 25px rgba(0,0,0,0.15);
              border: none;
              font-weight: 600;
            ">
              <div style="font-size: 11px; opacity: 0.9; margin-bottom: 4px;">
                ${date}
              </div>
              <div style="font-size: 14px; font-weight: 700;">
                ${value} Orders
              </div>
            </div>
          `;
        }
      },
      legend: {
        show: false
      },
      responsive: [
        {
          breakpoint: 576,
          options: {
            chart: {
              height: 280
            },
            xaxis: {
              labels: {
                rotate: -45,
                style: {
                  fontSize: "10px"
                }
              }
            },
            yaxis: {
              labels: {
                style: {
                  fontSize: "10px"
                }
              }
            }
          }
        },
        {
          breakpoint: 768,
          options: {
            chart: {
              height: 320
            },
            xaxis: {
              labels: {
                style: {
                  fontSize: "11px"
                }
              }
            }
          }
        }
      ]
    }
  };

  // Format last update time
  const formatLastUpdate = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);

    if (minutes < 1) return "Just now";
    if (minutes === 1) return "1 minute ago";
    if (minutes < 60) return `${minutes} minutes ago`;

    const hours = Math.floor(minutes / 60);
    if (hours === 1) return "1 hour ago";
    return `${hours} hours ago`;
  };

  return (
    <Card
      style={{
        border: "none",
        borderRadius: "20px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.08)",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(20px)",
        overflow: "hidden"
      }}
    >
      <CardBody className="p-4">
        {/* Enhanced Header Section */}
        <div className="d-flex justify-content-between align-items-start mb-4">
          <div>
            <CardTitle
              tag="h5"
              style={{
                fontSize: "1.3rem",
                fontWeight: "700",
                color: "#334155",
                marginBottom: "8px",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <i
                className="bi bi-graph-up"
                style={{ color: "#667eea", fontSize: "1.1rem" }}
              ></i>
              Sales Summary
            </CardTitle>
            <CardSubtitle
              className="text-muted mb-0"
              tag="h6"
              style={{
                fontSize: "0.9rem",
                fontWeight: "500",
                color: "#64748b"
              }}
            >
              Last 7 Days Report
            </CardSubtitle>
          </div>

          {/* Enhanced Status Indicator */}
          <div className="d-flex align-items-center gap-3">
            {/* Real-time Status */}
            <div className="d-flex align-items-center gap-2">
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: isFetching
                    ? "linear-gradient(135deg, #f59e0b, #f97316)"
                    : "linear-gradient(135deg, #10b981, #059669)",
                  animation: isFetching ? "pulse 2s infinite" : "none"
                }}
              ></div>
              <span
                style={{
                  fontSize: "0.7rem",
                  color: "#64748b",
                  fontWeight: "500"
                }}
              >
                {isFetching ? "Updating..." : "Live"}
              </span>
            </div>

            {/* Manual Refresh Button */}
            <button
              onClick={forceRefresh}
              disabled={isFetching}
              style={{
                background: "transparent",
                border: "1px solid #e2e8f0",
                borderRadius: "8px",
                padding: "6px 8px",
                cursor: isFetching ? "not-allowed" : "pointer",
                color: "#64748b",
                fontSize: "0.8rem",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                transition: "all 0.2s ease"
              }}
              onMouseEnter={(e) => {
                if (!isFetching) {
                  e.target.style.background = "#f8fafc";
                  e.target.style.borderColor = "#cbd5e1";
                }
              }}
              onMouseLeave={(e) => {
                e.target.style.background = "transparent";
                e.target.style.borderColor = "#e2e8f0";
              }}
            >
              <i
                className="bi bi-arrow-clockwise"
                style={{
                  fontSize: "0.8rem",
                  animation: isFetching ? "spin 1s linear infinite" : "none"
                }}
              ></i>
              Refresh
            </button>

            {/* Data Points Count */}
            {/* <span
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                fontWeight: "500",
                background: "#f1f5f9",
                padding: "4px 8px",
                borderRadius: "8px"
              }}
            >
              {totalOrders.length} days
            </span> */}
          </div>
        </div>

        {/* Last Update Time */}
        <div
          style={{
            fontSize: "0.7rem",
            color: "#94a3b8",
            marginBottom: "16px",
            textAlign: "right"
          }}
        >
          Last updated: {formatLastUpdate(lastUpdateTime)}
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div
            style={{
              height: `${chartHeight}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background:
                "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
              backgroundSize: "200% 100%",
              animation: "loading 1.5s infinite",
              borderRadius: "12px"
            }}
          >
            <div style={{ textAlign: "center", color: "#64748b" }}>
              <i
                className="bi bi-graph-up"
                style={{ fontSize: "2rem", opacity: 0.5 }}
              ></i>
              <p
                style={{
                  marginTop: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "500"
                }}
              >
                Loading chart data...
              </p>
            </div>
          </div>
        ) : totalOrders.length === 0 ? (
          // Empty State
          <div
            style={{
              height: `${chartHeight}px`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f8fafc",
              borderRadius: "12px",
              border: "2px dashed #cbd5e1"
            }}
          >
            <div style={{ textAlign: "center", color: "#64748b" }}>
              <i
                className="bi bi-graph-up"
                style={{ fontSize: "2rem", opacity: 0.5 }}
              ></i>
              <p
                style={{
                  marginTop: "8px",
                  fontSize: "0.9rem",
                  fontWeight: "500"
                }}
              >
                No sales data available
              </p>
              <button
                onClick={forceRefresh}
                style={{
                  marginTop: "12px",
                  background: "#667eea",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "0.8rem",
                  cursor: "pointer"
                }}
              >
                Retry Loading
              </button>
            </div>
          </div>
        ) : (
          // Chart with responsive wrapper
          <div
            className={isFetching ? "loading-pulse" : ""}
            style={{
              borderRadius: "12px",
              overflow: "hidden",
              transition: "opacity 0.3s ease"
            }}
          >
            <Chart
              type="area"
              width="100%"
              height={chartHeight}
              options={chartoptions.options}
              series={chartoptions.series}
            />
          </div>
        )}

        {/* Enhanced Bottom Stats */}
        {!isLoading && totalOrders.length > 0 && (
          <div
            style={{
              marginTop: "20px",
              padding: "16px",
              background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
              borderRadius: "12px",
              border: "1px solid #e2e8f0"
            }}
          >
            <div className="row g-3">
              <div className="col-6 col-md-3">
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#334155"
                    }}
                  >
                    {Math.max(...totalOrders)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: "500"
                    }}
                  >
                    Peak Orders
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#334155"
                    }}
                  >
                    {Math.round(
                      totalOrders.reduce((a, b) => a + b, 0) /
                        totalOrders.length
                    )}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: "500"
                    }}
                  >
                    Daily Average
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#334155"
                    }}
                  >
                    {totalOrders.reduce((a, b) => a + b, 0)}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: "500"
                    }}
                  >
                    Total Orders
                  </div>
                </div>
              </div>
              <div className="col-6 col-md-3">
                <div style={{ textAlign: "center" }}>
                  <div
                    style={{
                      fontSize: "1.1rem",
                      fontWeight: "700",
                      color: "#334155"
                    }}
                  >
                    {dates.length}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: "500"
                    }}
                  >
                    Days Tracked
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardBody>

      <style jsx>{`
        @keyframes loading {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
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
      `}</style>
    </Card>
  );
};

export default SalesChart;
