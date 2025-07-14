import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import moment from "moment";
import { toast } from "react-toastify";
import {
  useGetVendorOrderRequestByIdQuery,
  useVendorOrderRequestStatusMutation
} from "../../services/Api";
import { useSelector } from "react-redux";

const ViewVendorOrderRequest = () => {
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const reqDataId = location?.state?.data;
  const auth = useSelector((state) => state?.auth);

  // API hooks
  const [vendorOrderRequestStatus] = useVendorOrderRequestStatusMutation();
  const {
    data: getVendorOrderRequestById,
    refetch: getVendorOrderRequestByIdRefetch,
    isLoading,
    isFetching,
    error
  } = useGetVendorOrderRequestByIdQuery(
    { params: { id: reqDataId?.id } },
    { skip: !reqDataId?.id }
  );

  const orderData = getVendorOrderRequestById?.data || {};

  // Handle image modal
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage("");
  };

  // Handle status changes
  const handleStatusChange = async (status) => {
    if (status === "rejected") {
      setIsRejectionModalOpen(true);
      return;
    }

    try {
      const payload = {
        id: parseInt(orderData?.id, 10),
        status,
        rejection_reason: ""
      };

      const response = await vendorOrderRequestStatus(payload).unwrap();

      if (response?.status === true) {
        toast.success(`Order ${status} successfully!`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        await getVendorOrderRequestByIdRefetch();
      } else {
        toast.error(response?.message || "Failed to update status", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }
    } catch (error) {
      console.error("Status change error:", error);
      toast.error(error?.data?.message || "Failed to update status", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  };

  // Handle order rejection
  const handleConfirmRejection = async () => {
    if (!rejectionReason.trim()) {
      toast.error("Please provide a rejection reason", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
      return;
    }

    try {
      const payload = {
        id: parseInt(orderData?.id, 10),
        status: "rejected",
        rejection_reason: rejectionReason.trim()
      };

      const response = await vendorOrderRequestStatus(payload).unwrap();

      if (response?.status === true) {
        toast.success("Order rejected successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
        setIsRejectionModalOpen(false);
        setRejectionReason("");
        await getVendorOrderRequestByIdRefetch();
      } else {
        toast.error(response?.message || "Failed to reject order", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined
        });
      }
    } catch (error) {
      console.error("Rejection error:", error);
      toast.error(error?.data?.message || "Failed to reject order", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined
      });
    }
  };

  if (isLoading || isFetching) {
    return <div className="text-center py-5">Loading order details...</div>;
  }

  if (error) {
    return (
      <div className="text-center py-5 text-danger">
        Error loading order details. Please try again.
      </div>
    );
  }

  if (!orderData?.id) {
    return (
      <div className="text-center py-5 text-muted">
        No order data found. Returning to previous page...
      </div>
    );
  }

  return (
    <div className="container-fluid">
      <Row className="mb-4">
        <Col lg="12">
          <h4>Order Details</h4>
          <hr />
        </Col>
      </Row>

      <Row>
        {/* Status Change Dropdown */}
        {auth?.userDetail?.type !== 3 && auth?.userDetail?.type !== 5 && (
          <Col lg="4" className="mb-4">
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle w-100"
                type="button"
                id="statusDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Change Status
              </button>
              <ul className="dropdown-menu" aria-labelledby="statusDropdown">
                {orderData?.status === "pending" && (
                  <>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleStatusChange("approved")}
                      >
                        Approve
                      </button>
                    </li>
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => handleStatusChange("rejected")}
                      >
                        Reject
                      </button>
                    </li>
                  </>
                )}
                {orderData?.status === "rejected" && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleStatusChange("approved")}
                    >
                      Approve
                    </button>
                  </li>
                )}
                {orderData?.status === "approved" && (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => handleStatusChange("rejected")}
                    >
                      Reject
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </Col>
        )}

        {/* Order Information */}
        <Col lg="4">
          <FormGroup>
            <Label>Product Name</Label>
            <Input type="text" value={orderData?.item_name || "N/A"} readOnly />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label>Phone Number</Label>
            <Input
              type="text"
              value={orderData?.phone_number || "N/A"}
              readOnly
            />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label>Status</Label>
            <Input
              type="text"
              className="text-capitalize"
              value={orderData?.status || "N/A"}
              readOnly
            />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label>Order Price</Label>
            <Input
              type="text"
              value={orderData?.item_price || "N/A"}
              readOnly
            />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label>Order Date</Label>
            <Input
              type="text"
              value={
                orderData?.created_at
                  ? moment(orderData?.created_at).format(
                      "MMMM Do YYYY, h:mm:ss a"
                    )
                  : "N/A"
              }
              readOnly
            />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label>Address</Label>
            <Input
              type="text"
              value={orderData?.buyer_address || "N/A"}
              readOnly
            />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label>CNIC</Label>
            <Input
              type="text"
              value={orderData?.buyer_cnic_number || "N/A"}
              readOnly
            />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label>User Name</Label>
            <Input
              type="text"
              value={orderData?.buyer_user || "N/A"}
              readOnly
            />
          </FormGroup>
        </Col>

        {/* Product Description */}
        <Col lg="12">
          <FormGroup>
            <Label>Product Description</Label>
            <textarea
              className="form-control"
              rows="4"
              value={orderData?.description || "No description available"}
              readOnly
              style={{ resize: "none" }}
            />
          </FormGroup>
        </Col>

        {/* Product Image */}
        <Col lg="12">
          <FormGroup>
            <Label>Product Image</Label>
            <div
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "200px",
                border: "1px solid #ddd",
                borderRadius: "5px",
                overflow: "hidden",
                cursor: orderData?.item_image ? "pointer" : "default"
              }}
              onClick={() =>
                orderData?.item_image && handleImageClick(orderData?.item_image)
              }
            >
              {orderData?.item_image ? (
                <img
                  src={orderData.item_image}
                  alt="Product"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover"
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
                    justifyContent: "center"
                  }}
                >
                  <span style={{ color: "#6c757d" }}>No Image Available</span>
                </div>
              )}
            </div>
            {orderData?.item_image && (
              <small className="text-muted">Click image to enlarge</small>
            )}
          </FormGroup>
        </Col>

        {/* Rejection Reason (if rejected) */}
        {orderData?.status === "rejected" && orderData?.rejection_reason && (
          <Col lg="12">
            <FormGroup>
              <Label>Rejection Reason</Label>
              <textarea
                className="form-control"
                rows="4"
                value={orderData.rejection_reason}
                readOnly
                style={{ resize: "none" }}
              />
            </FormGroup>
          </Col>
        )}
      </Row>

      {/* Rejection Modal */}
      {isRejectionModalOpen && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.5)", zIndex: 1050 }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Order</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsRejectionModalOpen(false)}
                />
              </div>
              <div className="modal-body">
                <FormGroup>
                  <Label>Reason for rejection</Label>
                  <textarea
                    className="form-control"
                    rows="4"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    placeholder="Enter reason for rejection"
                  />
                </FormGroup>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsRejectionModalOpen(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={handleConfirmRejection}
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {imageModalOpen && (
        <div
          className="modal fade show d-block"
          style={{ background: "rgba(0,0,0,0.8)", zIndex: 1050 }}
          tabIndex="-1"
          role="dialog"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Product Image</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeImageModal}
                />
              </div>
              <div className="modal-body text-center">
                <img
                  src={selectedImage}
                  alt="Product"
                  style={{
                    maxWidth: "100%",
                    maxHeight: "70vh",
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

export default ViewVendorOrderRequest;
