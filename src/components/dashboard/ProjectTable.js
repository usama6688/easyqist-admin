import React, { useEffect, useState } from "react";
import { Button, Card, CardBody, CardTitle, Table } from "reactstrap";
import { useGetUserQuery, useViewOrderRequestQuery } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import PATHS from "../../routes/Paths";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import PaginationComponent from "../pagination/Pagination";

const ProjectTables = () => {
  const navigator = useNavigate();
  const auth = useSelector((data) => data?.auth);
  const [isMobile, setIsMobile] = useState(false);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    status: 0,
    sort: "desc"
  });

  const {
    data: viewOrderRequest,
    isLoading: viewOrderRequestLoading,
    refetch: viewOrderRequestRefetch
  } = useViewOrderRequestQuery({ params: queryParams });

  const totalRecords = viewOrderRequest?.pagination?.totalRecords || 0;
  const totalPages = Math.ceil(totalRecords / queryParams?.limit);

  const handlePageChange = (page) => {
    setQueryParams((prev) => ({ ...prev, page: page }));
  };

  // Check for mobile screen
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    viewOrderRequestRefetch();
  }, [viewOrderRequestRefetch]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const getStatusConfig = (status) => {
      // Convert to number to handle both string and number inputs
      const statusNum = parseInt(status);

      switch (statusNum) {
        case 0:
          return {
            text: "Pending",
            color: "#ff6b35",
            bg: "rgba(255, 107, 53, 0.1)"
          };
        case 2:
          return {
            text: "Accepted",
            color: "#00c851",
            bg: "rgba(0, 200, 81, 0.1)"
          };
        case 3:
          return {
            text: "Documentation",
            color: "#00bcd4",
            bg: "rgba(0, 188, 212, 0.1)"
          };
        case 4:
          return {
            text: "Out for delivery",
            color: "#7b1fa2",
            bg: "rgba(123, 31, 162, 0.1)"
          };
        case 5:
          return {
            text: "Delivered",
            color: "#2e7d32",
            bg: "rgba(46, 125, 50, 0.1)"
          };
        case 6:
          return {
            text: "Rejected",
            color: "#d32f2f",
            bg: "rgba(211, 47, 47, 0.1)"
          };
        default:
          return {
            text: "Pending",
            color: "#ff6b35",
            bg: "rgba(255, 107, 53, 0.1)"
          };
      }
    };

    const config = getStatusConfig(status);

    return (
      <span
        style={{
          background: config.bg,
          color: config.color,
          padding: "4px 12px",
          borderRadius: "20px",
          fontSize: "0.75rem",
          fontWeight: "600",
          border: `1px solid ${config.color}20`,
          display: "inline-block",
          minWidth: "80px",
          textAlign: "center"
        }}
      >
        {config.text}
      </span>
    );
  };

  // Mobile card component
  const MobileOrderCard = ({ data }) => (
    <div
      onClick={() => {
        if (auth?.userDetail?.type != 3) {
          navigator(PATHS.viewOrderRequest, { state: { data: data } });
          window.location.reload();
        }
      }}
      style={{
        background: "rgba(255,255,255,0.95)",
        border: "1px solid #e2e8f0",
        borderRadius: "16px",
        padding: "20px",
        marginBottom: "16px",
        cursor: "pointer",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0,0,0,0.1)";
        e.currentTarget.style.borderColor = "#667eea";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
        e.currentTarget.style.borderColor = "#e2e8f0";
      }}
    >
      {/* Header with name and status */}
      <div className="d-flex justify-content-between align-items-start mb-3">
        <div>
          <h6
            style={{
              fontSize: "1.1rem",
              fontWeight: "700",
              color: "#334155",
              marginBottom: "4px",
              textTransform: "capitalize"
            }}
          >
            {data?.users?.name}
          </h6>
          <p
            style={{
              fontSize: "0.85rem",
              color: "#64748b",
              marginBottom: "0",
              fontWeight: "500"
            }}
          >
            {data?.users?.phone_no}
          </p>
        </div>
        <StatusBadge status={data?.order_status} />
      </div>

      {/* Details grid */}
      <div className="row g-3">
        <div className="col-6">
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              Price
            </span>
            <div
              style={{
                fontSize: "1.1rem",
                fontWeight: "700",
                color: "#334155",
                marginTop: "2px"
              }}
            >
              ₨{data?.order_price}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              Time
            </span>
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#334155",
                marginTop: "2px"
              }}
            >
              {moment(data?.order_date).format("hh:mm A")}
            </div>
          </div>
        </div>
        <div className="col-6">
          <div>
            <span
              style={{
                fontSize: "0.75rem",
                color: "#64748b",
                fontWeight: "600",
                textTransform: "uppercase",
                letterSpacing: "0.5px"
              }}
            >
              Date
            </span>
            <div
              style={{
                fontSize: "0.9rem",
                fontWeight: "600",
                color: "#334155",
                marginTop: "2px"
              }}
            >
              {moment(data?.order_date).format("DD MMM YYYY")}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "3px",
          background: "linear-gradient(90deg, #667eea, #764ba2)",
          borderBottomLeftRadius: "16px",
          borderBottomRightRadius: "16px"
        }}
      />
    </div>
  );

  // Loading skeleton for mobile
  const MobileLoadingSkeleton = () => (
    <div style={{ marginBottom: "16px" }}>
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          style={{
            background:
              "linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)",
            backgroundSize: "200% 100%",
            animation: "loading 1.5s infinite",
            borderRadius: "16px",
            height: "120px",
            marginBottom: "16px"
          }}
        />
      ))}
    </div>
  );

  return (
    <div>
      <style>
        {`
          @keyframes loading {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
          
          /* Enhanced table responsiveness */
          @media (max-width: 991.98px) {
            .table-responsive {
              font-size: 0.85rem;
            }
          }
          
          @media (max-width: 767.98px) {
            .table-responsive {
              font-size: 0.8rem;
            }
            
            .table th,
            .table td {
              padding: 0.5rem 0.25rem;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              max-width: 120px;
            }
          }
          
          @media (max-width: 575.98px) {
            .table th:nth-child(2),
            .table td:nth-child(2) {
              display: none;
            }
          }
        `}
      </style>

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
          {/* Enhanced Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
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
                  className="bi bi-clock-history"
                  style={{ color: "#667eea", fontSize: "1.1rem" }}
                ></i>
                Pending Orders
              </CardTitle>
            </div>

            {/* Order count badge */}
            <div
              style={{
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "white",
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "0.8rem",
                fontWeight: "600"
              }}
            >
              {viewOrderRequest?.data?.length || 0} orders
            </div>
          </div>

          {/* Mobile View */}
          {isMobile ? (
            <div>
              {viewOrderRequestLoading ? (
                <MobileLoadingSkeleton />
              ) : viewOrderRequest?.data?.length ? (
                <div>
                  {viewOrderRequest.data
                    .map((data, index) => (
                      <MobileOrderCard key={index} data={data} />
                    ))
                    .reverse()}
                </div>
              ) : (
                <div
                  style={{
                    textAlign: "center",
                    padding: "40px 20px",
                    color: "#64748b"
                  }}
                >
                  <i
                    className="bi bi-inbox"
                    style={{ fontSize: "3rem", opacity: 0.5 }}
                  ></i>
                  <p
                    style={{
                      marginTop: "16px",
                      fontSize: "1rem",
                      fontWeight: "500"
                    }}
                  >
                    No pending orders found
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Desktop/Tablet Table View */
            <div className="table-responsive">
              <Table
                className="no-wrap mt-3 align-middle"
                borderless
                style={{
                  background: "transparent"
                }}
              >
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                    <th
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        padding: "16px 12px",
                        border: "none"
                      }}
                    >
                      Customer
                    </th>
                    <th
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        padding: "16px 12px",
                        border: "none"
                      }}
                    >
                      Phone
                    </th>
                    <th
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        padding: "16px 12px",
                        border: "none"
                      }}
                    >
                      Price
                    </th>
                    <th
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        padding: "16px 12px",
                        border: "none"
                      }}
                    >
                      Date
                    </th>
                    <th
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        padding: "16px 12px",
                        border: "none"
                      }}
                    >
                      Time
                    </th>
                    <th
                      style={{
                        fontSize: "0.85rem",
                        fontWeight: "700",
                        color: "#64748b",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                        padding: "16px 12px",
                        border: "none"
                      }}
                    >
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {viewOrderRequestLoading ? (
                    <tr>
                      <td
                        colSpan={6}
                        style={{ textAlign: "center", padding: "40px" }}
                      >
                        <div style={{ color: "#64748b" }}>
                          <i
                            className="bi bi-arrow-clockwise"
                            style={{
                              fontSize: "2rem",
                              animation: "spin 1s linear infinite"
                            }}
                          ></i>
                          <p
                            style={{
                              marginTop: "12px",
                              fontSize: "0.9rem",
                              fontWeight: "500"
                            }}
                          >
                            Loading orders...
                          </p>
                        </div>
                      </td>
                    </tr>
                  ) : viewOrderRequest?.data?.length ? (
                    viewOrderRequest.data
                      .map((data, index) => (
                        <tr
                          key={index}
                          className="border-top"
                          style={{
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                            borderTop: "1px solid #f1f5f9 !important"
                          }}
                          onClick={() => {
                            if (auth?.userDetail?.type != 3) {
                              navigator(PATHS.viewOrderRequest, {
                                state: { data: data }
                              });
                              window.location.reload();
                            }
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = "#f8fafc";
                            e.currentTarget.style.transform = "translateX(4px)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor =
                              "transparent";
                            e.currentTarget.style.transform = "translateX(0)";
                          }}
                        >
                          <td style={{ padding: "16px 12px", border: "none" }}>
                            <h6
                              className="mb-0 text-capitalize"
                              style={{
                                fontSize: "0.95rem",
                                fontWeight: "600",
                                color: "#334155"
                              }}
                            >
                              {data?.users?.name}
                            </h6>
                          </td>
                          <td style={{ padding: "16px 12px", border: "none" }}>
                            <h6
                              className="mb-0"
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: "500",
                                color: "#64748b"
                              }}
                            >
                              {data?.users?.phone_no}
                            </h6>
                          </td>
                          <td style={{ padding: "16px 12px", border: "none" }}>
                            <h6
                              className="mb-0"
                              style={{
                                fontSize: "0.95rem",
                                fontWeight: "700",
                                color: "#334155"
                              }}
                            >
                              ₨{data?.order_price}
                            </h6>
                          </td>
                          <td style={{ padding: "16px 12px", border: "none" }}>
                            <h6
                              className="mb-0"
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: "500",
                                color: "#64748b"
                              }}
                            >
                              {moment(data?.order_date).format("DD MMM YYYY")}
                            </h6>
                          </td>
                          <td style={{ padding: "16px 12px", border: "none" }}>
                            <h6
                              className="mb-0"
                              style={{
                                fontSize: "0.9rem",
                                fontWeight: "500",
                                color: "#64748b"
                              }}
                            >
                              {moment(data?.order_date).format("hh:mm A")}
                            </h6>
                          </td>
                          <td style={{ padding: "16px 12px", border: "none" }}>
                            <StatusBadge status={data?.order_status} />
                          </td>
                        </tr>
                      ))
                      .reverse()
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        style={{ textAlign: "center", padding: "40px" }}
                      >
                        <div style={{ color: "#64748b" }}>
                          <i
                            className="bi bi-inbox"
                            style={{ fontSize: "3rem", opacity: 0.5 }}
                          ></i>
                          <p
                            style={{
                              marginTop: "16px",
                              fontSize: "1rem",
                              fontWeight: "500"
                            }}
                          >
                            No pending orders found
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </div>
          )}

          {/* Pagination */}
          {!viewOrderRequestLoading && viewOrderRequest?.data?.length > 0 && (
            <div style={{ marginTop: "2rem" }}>
              <PaginationComponent
                currentPage={queryParams?.page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default ProjectTables;
