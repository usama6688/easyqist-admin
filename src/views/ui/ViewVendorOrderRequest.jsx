import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import moment from "moment";
import {
  useGetVendorOrderRequestByIdQuery,
  useVendorOrderRequestStatusMutation
} from "../../services/Api";
import { useSelector } from "react-redux";

const ViewVendorOrderRequest = () => {
  const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [selectedOrderItem, setSelectedOrderItem] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const reqDataId = location?.state?.data;
  const auth = useSelector((data) => data?.auth);

  const [vendorOrderRequestStatus] = useVendorOrderRequestStatusMutation();

  const {
    data: getVendorOrderRequestById,
    refetch: getVendorOrderRequestByIdRefetch
  } = useGetVendorOrderRequestByIdQuery({ params: { id: reqDataId?.id } });

  const orderData = getVendorOrderRequestById?.data || [];

  // Image modal handlers
  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setImageModalOpen(true);
  };

  const closeImageModal = () => {
    setImageModalOpen(false);
    setSelectedImage("");
  };

  const handleStatusChange = (status, item) => {
    if (status == "rejected") {
      setSelectedOrderItem(item);
      setIsRejectionModalOpen(true);
      return;
    }

    const data = {
      id: item?.id,
      status: status,
      rejection_reason: ""
    };

    vendorOrderRequestStatus({ data })
      .unwrap()
      .then(() => {
        getVendorOrderRequestByIdRefetch();
      })
      .catch((error) => console.log("error", error));
  };

  const handleConfirmRejection = () => {
    const data = {
      id: selectedOrderItem?.id,
      status: "rejected",
      rejection_reason: rejectionReason
    };

    vendorOrderRequestStatus({ data })
      .unwrap()
      .then(() => {
        setIsRejectionModalOpen(false);
        setRejectionReason("");
        getVendorOrderRequestByIdRefetch();
      })
      .catch((error) => console.log("error", error));
  };

  useEffect(() => {
    getVendorOrderRequestByIdRefetch();
  }, []);

  return (
    <div>
      <Row>
        {auth?.userDetail?.type == 3 || auth?.userDetail?.type == 5 ? null : (
          <>
            <Col lg="4"></Col>
            <Col lg="4"></Col>
            <Col lg="4" className="mb-4">
              <div class="dropdown">
                <button
                  class="btn btn-secondary dropdown-togglex w-100"
                  type="button"
                  id="dropdownMenuButton1"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Change Status
                </button>
                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                  {orderData?.status == "pending" ? (
                    <>
                      <li>
                        <a
                          class="dropdown-item"
                          onClick={() =>
                            handleStatusChange("approved", orderData)
                          }
                        >
                          Approve
                        </a>
                      </li>
                      <li>
                        <a
                          class="dropdown-item"
                          onClick={() =>
                            handleStatusChange("rejected", orderData)
                          }
                        >
                          Reject
                        </a>
                      </li>
                    </>
                  ) : orderData?.status == "rejected" ? (
                    <li>
                      <a
                        class="dropdown-item"
                        onClick={() =>
                          handleStatusChange("approved", orderData)
                        }
                      >
                        Approve
                      </a>
                    </li>
                  ) : orderData?.status == "approved" ? (
                    <li>
                      <a
                        class="dropdown-item"
                        onClick={() =>
                          handleStatusChange("rejected", orderData)
                        }
                      >
                        Reject
                      </a>
                    </li>
                  ) : null}
                </ul>
              </div>
            </Col>
          </>
        )}

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Product Name</Label>
            <Input type="text" value={orderData?.item_name} readOnly />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Phone No.</Label>
            <Input type="text" value={orderData?.phone_number} readOnly />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Status</Label>
            <Input
              type="text"
              className="text-capitalize"
              value={orderData?.status}
              readOnly
            />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Order Price</Label>
            <Input type="text" value={orderData?.item_price} readOnly />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Order Date</Label>
            <Input
              type="text"
              value={moment(orderData?.order_date).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
              readOnly
            />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Address</Label>
            <Input type="text" value={orderData?.buyer_address} readOnly />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">CNIC</Label>
            <Input type="text" value={orderData?.buyer_cnic_number} readOnly />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">User Name</Label>
            <Input type="text" value={orderData?.buyer_user} readOnly />
          </FormGroup>
        </Col>

        {/* Product Description Section */}
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

        {/* Product Image Section */}
        <Col lg="12">
          <FormGroup>
            <Label>Product Image</Label>
            <div
              style={{
                width: "100%",
                maxWidth: "300px",
                height: "200px",
                border: "1px solid #ddd",
                borderRadius: "5px"
              }}
            >
              {orderData?.item_image &&
              !orderData?.item_image.includes("null") ? (
                <img
                  src={orderData?.item_image}
                  alt="Product"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    borderRadius: "5px",
                    cursor: "pointer"
                  }}
                  onClick={() => handleImageClick(orderData?.item_image)}
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
                    borderRadius: "5px"
                  }}
                >
                  <span style={{ fontSize: "14px", color: "#6c757d" }}>
                    No Image Available
                  </span>
                </div>
              )}
            </div>
            {orderData?.item_image &&
              !orderData?.item_image.includes("null") && (
                <small className="text-muted">
                  Click image to view in full size
                </small>
              )}
          </FormGroup>
        </Col>
      </Row>

      {isRejectionModalOpen && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reject Order</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setIsRejectionModalOpen(false)}
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
                ></textarea>
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

export default ViewVendorOrderRequest;
