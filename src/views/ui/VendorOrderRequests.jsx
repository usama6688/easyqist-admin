import React, { useState, useEffect } from "react";
import { Button, Col, Input, Row, Table } from "reactstrap";
import delIcon from "../../assets/images/delIcon.svg";
import {
  useDeleteVendorOrderRequestMutation,
  useGetVendorOrderRequestsQuery,
  useVendorOrderRequestStatusMutation
} from "../../services/Api";
import { useNavigate } from "react-router-dom";
import PATHS from "../../routes/Paths";
import DeleteModal from "../../components/DeleteModal";
import { useSelector } from "react-redux";
import moment from "moment/moment";
import PaginationComponent from "../../components/pagination/Pagination";
import { DateRangePicker } from "react-dates";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const VendorOrderRequests = () => {
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");

  // Search states
  const [searchName, setSearchName] = useState("");
  const [searchPhone, setSearchPhone] = useState("");
  const [cnic, setCnic] = useState("");
  const [area, setArea] = useState("");

  // Status and date states
  const [status, setStatus] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [focusedInput, setFocusedInput] = useState(null);

  // Modal states
  const [deleteModal, setDeleteModal] = useState(false);
  const [viewData, setViewData] = useState("");

  const navigator = useNavigate();
  const auth = useSelector((data) => data?.auth);

  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 50,
    status: "",
    name: "",
    phone: "",
    cnic: "",
    area: "",
    startDate: "",
    endDate: ""
  });

  // Load saved status from localStorage on mount
  useEffect(() => {
    const prevStatus = localStorage.getItem("status");
    if (prevStatus) {
      setStatus(prevStatus);
      setQueryParams((prev) => ({
        ...prev,
        status: prevStatus
      }));
    }
  }, []);

  // Debug effect to monitor queryParams changes
  useEffect(() => {
    console.log("Current queryParams:", queryParams);
  }, [queryParams]);

  const {
    data: getVendorOrderRequests,
    isLoading: getVendorOrderRequestsLoading,
    refetch: getVendorOrderRequestsRefetch
  } = useGetVendorOrderRequestsQuery(
    { params: queryParams },
    {
      refetchOnMountOrArgChange: true
    }
  );

  const totalRecords = getVendorOrderRequests?.pagination?.totalRecords || 0;
  const totalPages = Math.ceil(totalRecords / queryParams?.limit);

  const handleSearch = () => {
    const newParams = {
      ...queryParams,
      page: 1,
      name: searchName.trim(),
      cnic: cnic.trim(),
      phone: searchPhone.trim(),
      area: area.trim()
    };
    console.log("Search Parameters:", newParams);
    setQueryParams(newParams);
  };

  const handleReset = () => {
    const resetParams = {
      ...queryParams,
      page: 1,
      name: "",
      phone: "",
      cnic: "",
      area: ""
    };
    console.log("Reset Parameters:", resetParams);
    setQueryParams(resetParams);
    setSearchName("");
    setSearchPhone("");
    setCnic("");
    setArea("");
  };

  const handleResetDate = () => {
    const resetDateParams = {
      ...queryParams,
      page: 1,
      startDate: "",
      endDate: ""
    };
    console.log("Reset Date Parameters:", resetDateParams);
    setQueryParams(resetDateParams);
    setStartDate(null);
    setEndDate(null);
  };

  const handleDatesChange = ({ startDate, endDate }) => {
    setStartDate(startDate);
    setEndDate(endDate);

    const newParams = {
      ...queryParams,
      page: 1,
      startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
      endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : ""
    };
    console.log("Date Filter Parameters:", newParams);
    setQueryParams(newParams);
  };

  const handlePageChange = (page) => {
    setQueryParams((prev) => ({ ...prev, page: page }));
  };

  const falseFunc = () => false;

  const deleteModalHandler = (data) => {
    setDeleteModal((prev) => !prev);
    setViewData(data);
  };

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage("");
  };

  const [vendorOrderRequestStatus] = useVendorOrderRequestStatusMutation();
  const [deleteVendorOrderRequest] = useDeleteVendorOrderRequestMutation();

  const handleStatusChange = async (status, item) => {
    if (status === "rejected") {
      setSelectedOrderItem(item);
      setIsRejectionModalOpen(true);
      return;
    }

    const payload = {
      id: parseInt(item?.id, 10),
      status: "approved"
    };

    try {
      const response = await vendorOrderRequestStatus(payload).unwrap();
      if (response?.status === true) {
        toast.success(`Order approved successfully!`);
        await getVendorOrderRequestsRefetch();
      } else {
        toast.error(
          `Status update failed: ${
            response?.message || "Invalid response from server."
          }`
        );
      }
    } catch (error) {
      toast.error(
        `Failed to update status: ${error?.data?.message || error.message}`
      );
    }
  };

  const handleConfirmRejection = async () => {
    if (!rejectionReason || !rejectionReason.trim()) {
      toast.error("Please provide a valid rejection reason.");
      return;
    }

    if (!selectedOrderItem?.id) {
      toast.error("Invalid order selection. Please try again.");
      return;
    }

    const payload = {
      id: parseInt(selectedOrderItem.id, 10),
      status: "rejected",
      rejection_reason: rejectionReason.trim()
    };

    try {
      const response = await vendorOrderRequestStatus(payload).unwrap();

      if (response?.status === true) {
        toast.success("Order rejected successfully!");
        setIsRejectionModalOpen(false);
        setRejectionReason("");
        setSelectedOrderItem(null);
        await getVendorOrderRequestsRefetch();
      } else {
        console.error("Rejection failed - server response:", response);
        toast.error(
          `Rejection failed: ${
            response?.message || "No error message provided"
          }`
        );
      }
    } catch (error) {
      console.error("Rejection error details:", {
        error,
        response: error?.data,
        status: error?.status
      });

      toast.error(
        `Rejection failed: ${
          error?.data?.message ||
          error.message ||
          "Unknown error (check console for details)"
        }`
      );
    }
  };

  const deleteOrderHandler = async (id) => {
    try {
      const response = await deleteVendorOrderRequest({ data: id }).unwrap();
      if (response?.status === true) {
        toast.success("Order deleted successfully!");
        await getVendorOrderRequestsRefetch();
        setDeleteModal(false);
      } else {
        toast.error(
          `Delete failed: ${
            response?.message || "Invalid response from server."
          }`
        );
      }
    } catch (error) {
      toast.error(
        `Failed to delete order: ${error?.data?.message || error.message}`
      );
    }
  };

  const selectStatusHandler = (value) => {
    const statusMap = {
      1: "pending",
      2: "approved",
      "-1": "rejected",
      "": ""
    };
    const mappedStatus = statusMap[value] || "";
    setStatus(mappedStatus);
    localStorage.setItem("status", mappedStatus);

    const newParams = {
      ...queryParams,
      page: 1,
      status: mappedStatus
    };
    console.log("Status Filter Parameters:", newParams);
    setQueryParams(newParams);
  };

  // Helper function to get status badge color and style
  const getStatusBadge = (status) => {
    const statusLower = status?.toLowerCase();
    let badgeClass = "badge ";
    let badgeStyle = {
      fontSize: "12px",
      fontWeight: "bold",
      padding: "5px 10px",
      borderRadius: "15px",
      textTransform: "capitalize"
    };

    switch (statusLower) {
      case "pending":
        badgeClass += "bg-warning text-dark";
        badgeStyle.backgroundColor = "#ffc107";
        badgeStyle.color = "#000";
        break;
      case "approved":
        badgeClass += "bg-success text-white";
        badgeStyle.backgroundColor = "#28a745";
        badgeStyle.color = "#fff";
        break;
      case "rejected":
        badgeClass += "bg-danger text-white";
        badgeStyle.backgroundColor = "#dc3545";
        badgeStyle.color = "#fff";
        break;
      default:
        badgeClass += "bg-secondary text-white";
        badgeStyle.backgroundColor = "#6c757d";
        badgeStyle.color = "#fff";
    }

    return (
      <span className={badgeClass} style={badgeStyle}>
        {status}
      </span>
    );
  };

  // Get reverse status mapping for select dropdown
  const getSelectValue = (status) => {
    const reverseMap = {
      pending: "1",
      approved: "2",
      rejected: "-1",
      "": ""
    };
    return reverseMap[status] || "";
  };

  return (
    <div className="container-fluid">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Row>
        <Col lg="12">
          <div className="row">
            <div className="col-4 pe-0">
              <Input
                placeholder="Search by Name"
                className="h-100"
                type="search"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
              />
            </div>
            <div className="col-4 pe-0">
              <Input
                placeholder="Search by CNIC"
                className="h-100"
                type="text"
                value={cnic}
                onChange={(e) => setCnic(e.target.value)}
              />
            </div>
            <div className="col-4 d-flex gap-2 pe-0">
              <Button
                className="w-100 h-100 bg-danger border-0"
                onClick={handleReset}
              >
                Reset
              </Button>
              <Button
                className="w-100 h-100 bg-success border-0"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>

          <div className="row">
            <div className="col-3 pe-0 mt-4">
              <select
                className="form-select"
                aria-label="Default select example"
                onChange={(e) => selectStatusHandler(e.target.value)}
                value={getSelectValue(status)}
                style={{ height: "47px" }}
              >
                <option value="">Select status</option>
                <option value="1">Pending</option>
                <option value="2">Approved</option>
                <option value="-1">Rejected</option>
              </select>
            </div>
            <div className="col-4 mt-4 pe-0">
              <DateRangePicker
                isOutsideRange={falseFunc}
                startDate={startDate}
                startDateId="datepicker-start-date"
                endDate={endDate}
                endDateId="datepicker-end-date"
                onDatesChange={handleDatesChange}
                focusedInput={focusedInput}
                onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
              />
            </div>
            <div className="col-4 mt-4 ps-0">
              <Button
                className="w-50 h-100 bg-danger border-0"
                onClick={handleResetDate}
              >
                Reset Date
              </Button>
            </div>
          </div>

          <Table className="no-wrap mt-3 align-middle" responsive borderless>
            <thead>
              <tr>
                <th>Image</th>
                <th>Name</th>
                <th>Price</th>
                <th>Order Date</th>
                <th>Product Name</th>
                <th>CNIC</th>
                <th>Status</th>
                {auth?.userDetail?.type == 1 && <th>Action</th>}
              </tr>
            </thead>
            <tbody>
              {getVendorOrderRequests?.data?.length ? (
                getVendorOrderRequests?.data?.map((data) => (
                  <tr
                    className="border-top mainDiv"
                    style={{ cursor: "pointer" }}
                    key={data?.id}
                  >
                    <td>
                      <div style={{ width: "50px", height: "50px" }}>
                        {data?.item_image &&
                        !data?.item_image.includes("null") ? (
                          <img
                            src={data?.item_image}
                            alt="Product"
                            style={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                              borderRadius: "5px",
                              cursor: "pointer",
                              border: "1px solid #ddd"
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleImageClick(data?.item_image);
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: "#f8f9fa",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "5px",
                              border: "1px solid #ddd"
                            }}
                          >
                            <span
                              style={{ fontSize: "12px", color: "#6c757d" }}
                            >
                              No Image
                            </span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td
                      onClick={() => {
                        navigator(PATHS.viewVendorOrderRequests, {
                          state: { data: data }
                        });
                        window.location.reload();
                      }}
                    >
                      <h6 className="mb-0 text-capitalize">
                        {data?.buyer_user}
                      </h6>
                    </td>
                    <td
                      onClick={() => {
                        navigator(PATHS.viewVendorOrderRequests, {
                          state: { data: data }
                        });
                        window.location.reload();
                      }}
                    >
                      <h6 className="mb-0">{data?.item_price}</h6>
                    </td>
                    <td
                      onClick={() => {
                        navigator(PATHS.viewVendorOrderRequests, {
                          state: { data: data }
                        });
                        window.location.reload();
                      }}
                    >
                      <h6 className="mb-0">
                        {moment(data?.created_at).format("DD-MM-YYYY")}
                      </h6>
                    </td>
                    <td
                      onClick={() => {
                        navigator(PATHS.viewVendorOrderRequests, {
                          state: { data: data }
                        });
                        window.location.reload();
                      }}
                    >
                      <h6 className="mb-0">{data?.item_name}</h6>
                    </td>
                    <td
                      onClick={() => {
                        navigator(PATHS.viewVendorOrderRequests, {
                          state: { data: data }
                        });
                        window.location.reload();
                      }}
                    >
                      <h6 className="mb-0">{data?.buyer_cnic_number}</h6>
                    </td>
                    <td
                      onClick={() => {
                        navigator(PATHS.viewVendorOrderRequests, {
                          state: { data: data }
                        });
                        window.location.reload();
                      }}
                    >
                      {getStatusBadge(data?.status)}
                    </td>
                    {auth?.userDetail?.type == 1 && (
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <div className="dropdown">
                            <button
                              className="btn btn-secondary btn-sm"
                              type="button"
                              id={`admin-dropdown-${data?.id}`}
                              data-bs-toggle="dropdown"
                              aria-expanded="false"
                            >
                              Action
                            </button>
                            <ul
                              className="dropdown-menu"
                              aria-labelledby={`admin-dropdown-${data?.id}`}
                            >
                              {data?.status === "pending" ? (
                                <>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleStatusChange("approved", data);
                                      }}
                                    >
                                      Accept
                                    </a>
                                  </li>
                                  <li>
                                    <a
                                      className="dropdown-item"
                                      href="#"
                                      onClick={(e) => {
                                        e.preventDefault();
                                        handleStatusChange("rejected", data);
                                      }}
                                    >
                                      Reject
                                    </a>
                                  </li>
                                </>
                              ) : data?.status === "approved" ? (
                                <li>
                                  <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleStatusChange("rejected", data);
                                    }}
                                  >
                                    Reject
                                  </a>
                                </li>
                              ) : data?.status === "rejected" ? (
                                <li>
                                  <a
                                    className="dropdown-item"
                                    href="#"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      handleStatusChange("approved", data);
                                    }}
                                  >
                                    Accept
                                  </a>
                                </li>
                              ) : null}
                            </ul>
                          </div>
                          <img
                            src={delIcon}
                            alt="Delete"
                            style={{ cursor: "pointer" }}
                            onClick={() => deleteModalHandler(data)}
                          />
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  {getVendorOrderRequestsLoading ? (
                    <td colSpan={auth?.userDetail?.type == 1 ? 8 : 7}>
                      <h6 className="text-center">Loading...</h6>
                    </td>
                  ) : (
                    <td colSpan={auth?.userDetail?.type == 1 ? 8 : 7}>
                      <h6 className="text-center">No Record Found</h6>
                    </td>
                  )}
                </tr>
              )}
            </tbody>
          </Table>

          <div style={{ marginTop: "6.4rem" }}>
            <PaginationComponent
              currentPage={queryParams?.page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </Col>
      </Row>

      {deleteModal && (
        <DeleteModal
          handleCloseDeletModal={deleteModalHandler}
          confirmationMessage="Are you sure you want to delete this order?"
          id={viewData?.id}
          action={deleteOrderHandler}
        />
      )}

      {isRejectionModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Order</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setIsRejectionModalOpen(false);
                    setRejectionReason("");
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <label htmlFor="rejectionReason">Reason for rejection</label>
                <textarea
                  className="form-control"
                  id="rejectionReason"
                  rows="4"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Enter reason"
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsRejectionModalOpen(false);
                    setRejectionReason("");
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmRejection}
                >
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {imageModalOpen && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
        >
          <div
            className="modal-dialog modal-lg modal-dialog-centered"
            role="document"
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Product Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeImageModal}
                ></button>
              </div>
              <div className="modal-body text-center">
                <img
                  src={selectedImage}
                  alt="Product"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "500px",
                    objectFit: "contain"
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorOrderRequests;
