import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Col, FormGroup, Input, Label, Row } from "reactstrap";
import moment from "moment";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";
import PATHS from "../../routes/Paths";
import {
  useAddCommentMutation,
  useChangeOrderStatusMutation,
  useEmploymentAssignMutation,
  useGetCommentsQuery,
  useGetEmployeesQuery,
  useViewOrderDetailQuery
} from "../../services/Api";
import AssignEmployeeModal from "../../components/AssignEmployeeModal";
import { useSelector } from "react-redux";

const ViewOrderRequests = () => {
  const [assignEmployeeModal, setAssignEmployeeModal] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState();
  const [comment, setComment] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const reqDataId = location?.state?.data;
  const auth = useSelector((data) => data?.auth);

  const [employmentAssign, { isLoading }] = useEmploymentAssignMutation();
  const [changeOrderStatus] = useChangeOrderStatusMutation();
  const [addComment] = useAddCommentMutation();

  const AssignEmployeeModalHandler = () => {
    setAssignEmployeeModal((prev) => !prev);
  };

  const { data: getEmployees, refetch: getEmployeesRefetch } =
    useGetEmployeesQuery();

  const { data: getComments, refetch: getCommentsRefetch } =
    useGetCommentsQuery({ params: { orderId: reqDataId?.id } });

  const { data: viewOrderDetail, refetch: viewOrderDetailRefetch } =
    useViewOrderDetailQuery({ params: { order_id: reqDataId?.id } });

  const reqData = viewOrderDetail?.data[0];

  const modifiedBrands = getEmployees?.data?.map((data) => ({
    label: data?.name,
    value: data?.id
  }));

  const handleSelect = (data) => {
    setSelectedOptions(data);
    AssignEmployeeModalHandler();
  };

  const handleAddComment = () => {
    const data = {
      comment: comment,
      user_id: reqDataId?.users?.id || reqDataId?.user_id,
      order_id: reqDataId?.id
    };

    addComment({ data: data })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          toast.success("Comment added successfully!");
          getCommentsRefetch();
          setComment("");
        }
      })
      .catch((error) => {
        toast.error(
          "Error adding comment: " +
            (error?.data?.message || error?.message || "Unknown error")
        );
        console.log("error", error);
      });
  };

  const handleItemClick = (itemId, item) => {
    const statusNames = {
      1: "Pending",
      2: "Accepted",
      3: "Documentation",
      4: "Out for delivery",
      5: "Delivered",
      6: "Completed",
      "-1": "Rejected",
      "-2": "Canceled"
    };

    const data = {
      order_id: item?.id,
      order_status: itemId
    };

    changeOrderStatus({ data: data })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          toast.success(
            `Order status changed to ${statusNames[itemId]} successfully!`
          );
          viewOrderDetailRefetch();
        } else {
          toast.error("Failed to change order status");
        }
      })
      .catch((error) => {
        toast.error(
          "Error changing order status: " +
            (error?.data?.message || error?.message || "Unknown error")
        );
        console.log("error", error);
      });
  };

  const AssignEmployeeApiHandler = (id) => {
    const data = {
      empid: selectedOptions?.value,
      orderid: id
    };

    employmentAssign({ data: data })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          toast.success("Employee assigned successfully!");
          AssignEmployeeModalHandler();
          navigate(PATHS.orderRequests);
        } else {
          toast.error("Failed to assign employee");
        }
      })
      .catch((error) => {
        toast.error(
          "Error assigning employee: " +
            (error?.data?.message || error?.message || "Unknown error")
        );
        console.log("error", error);
      });
  };

  // Helper function to get installment plan details
  const getInstallmentPlanDetails = (orderProduct) => {
    const installment = orderProduct?.orderinstallment;
    if (!installment) return null;

    return {
      planTitle: installment?.installment_title || "N/A",
      downPaymentPercentage: installment?.downpayment_percentage || "N/A",
      advanceAmount:
        installment?.advance || orderProduct?.order_product_advance_amount || 0,
      monthlyAmount: installment?.amount || 0,
      duration: installment?.duration || orderProduct?.qty || 0,
      totalAmount:
        installment?.total_amount || orderProduct?.order_product_amount || 0,
      installmentId: installment?.id || "N/A"
    };
  };

  useEffect(() => {
    getEmployeesRefetch();
    viewOrderDetailRefetch();
    getCommentsRefetch();
  }, []);

  return (
    <div>
      <Row>
        {auth?.userDetail?.type == 3 || auth?.userDetail?.type == 5 ? null : (
          <>
            <Col lg="4"></Col>
            {auth?.userDetail?.type == 4 ? (
              <Col lg="4"></Col>
            ) : (
              <Col lg="4">
                <FormGroup>
                  <Select
                    options={modifiedBrands}
                    placeholder="Assign to Employee"
                    value={selectedOptions}
                    onChange={handleSelect}
                    isSearchable={true}
                  />
                </FormGroup>
              </Col>
            )}
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
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => handleItemClick(1, reqData)}
                    >
                      Pending
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => handleItemClick(2, reqData)}
                    >
                      Accepted
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => handleItemClick(5, reqData)}
                    >
                      Delivered
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => handleItemClick(6, reqData)}
                    >
                      Completed
                    </a>
                  </li>
                  <li>
                    <a
                      class="dropdown-item"
                      onClick={() => handleItemClick(-1, reqData)}
                    >
                      Rejected
                    </a>
                  </li>
                </ul>
              </div>
            </Col>
          </>
        )}

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Advance Amount</Label>
            <Input type="text" value={reqData?.order_advance_amount} readOnly />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Order Price</Label>
            <Input type="text" value={reqData?.order_price} readOnly />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Order Date</Label>
            <Input
              type="text"
              value={moment(reqData?.order_date).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}
              readOnly
            />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Address</Label>
            <Input
              type="text"
              value={reqData?.address?.address || reqData?.user?.address}
              readOnly
            />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Area</Label>
            <Input type="text" value={reqData?.address?.area} readOnly />
          </FormGroup>
        </Col>

        {/* <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">UC</Label>
            <Input type="text" value={reqData?.address?.uc} readOnly />
          </FormGroup>
        </Col> */}

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">CNIC</Label>
            <Input type="text" value={reqData?.user?.cnic_number} readOnly />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Session ID</Label>
            <Input type="text" value={reqData?.order_session_id} readOnly />
          </FormGroup>
        </Col>

        {/* <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Referee Code</Label>
            <Input type="text" value={reqData?.refercode} readOnly />
          </FormGroup>
        </Col> */}

        {/* <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Referee Name</Label>
            <Input type="text" value={reqData?.refername} readOnly />
          </FormGroup>
        </Col> */}

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Assigned Employee</Label>
            <Input type="text" value={reqData?.empname} readOnly />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Phone</Label>
            <Input type="text" value={reqData?.user?.phone_no} readOnly />
          </FormGroup>
        </Col>

        <Col lg="4">
          <FormGroup>
            <Label for="exampleEmail">Name</Label>
            <Input type="text" value={reqData?.user?.name} readOnly />
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Label for="exampleEmail" className="mt-4">
          Ordered Products
        </Label>
        {reqData?.order_products?.map((data, index) => {
          const planDetails = getInstallmentPlanDetails(data);

          return (
            <Col lg="6" key={index} className="mb-4">
              <div class="card">
                <img
                  src={data?.product?.thumbnail}
                  alt="Product"
                  style={{
                    width: "50%", // half the width of the card
                    height: "auto", // keep full image visible
                    display: "block",
                    margin: "0 auto" // center the image
                  }}
                />
                <div class="card-body">
                  <h5 class="card-title">{data?.product?.name}</h5>

                  {/* Product Basic Info */}
                  <div className="mb-3">
                    <h6 class="text-primary mb-2">Order Details:</h6>
                    <p class="mb-1">
                      <strong>Quantity:</strong> {data?.qty}
                    </p>
                    <p class="mb-1">
                      <strong>Order Amount:</strong> Rs{" "}
                      {data?.order_product_amount}
                    </p>
                    <p class="mb-1">
                      <strong>Order Advance:</strong> Rs{" "}
                      {data?.order_product_advance_amount}
                    </p>
                  </div>

                  {/* Installment Plan Details */}
                  {planDetails && (
                    <div
                      className="mb-3 p-3"
                      style={{
                        backgroundColor: "#f8f9fa",
                        borderRadius: "5px"
                      }}
                    >
                      <h6 class="text-success mb-2">
                        Installment Plan Details:
                      </h6>
                      <p class="mb-1">
                        <strong>Plan Title:</strong> {planDetails.planTitle}
                      </p>
                      {planDetails.downPaymentPercentage !== "N/A" && (
                        <p class="mb-1">
                          <strong>Down Payment %:</strong>{" "}
                          {planDetails.downPaymentPercentage}%
                        </p>
                      )}
                      <p class="mb-1">
                        <strong>Advance Amount:</strong> Rs{" "}
                        {planDetails.advanceAmount}
                      </p>
                      <p class="mb-1">
                        <strong>Monthly Payment:</strong> Rs{" "}
                        {planDetails.monthlyAmount}
                      </p>
                      <p class="mb-1">
                        <strong>Duration:</strong> {planDetails.duration} months
                      </p>
                      <p class="mb-1">
                        <strong>Total Amount:</strong> Rs{" "}
                        {planDetails.totalAmount}
                      </p>
                      {/* <p class="mb-1">
                        <strong>Installment ID:</strong>{" "}
                        {planDetails.installmentId}
                      </p> */}
                    </div>
                  )}

                  {/* Traditional Plan Display (keeping original) */}
                  <div className="mb-3">
                    <h6 class="text-info mb-2">Plan Summary:</h6>
                    <p class="mb-1">
                      <strong>Plan:</strong> Rs{" "}
                      {data?.orderinstallment?.amount * data?.qty} x{" "}
                      {data?.orderinstallment?.duration} months
                    </p>
                  </div>

                  {reqData?.order_status != 5 &&
                  auth?.userDetail?.type != 3 &&
                  auth?.userDetail?.type != 4 &&
                  auth?.userDetail?.type != 5 ? (
                    <a
                      class="btn btn-primary"
                      onClick={() => {
                        navigate(PATHS.viewOrderPayment, {
                          state: { data: data }
                        });
                        window.location.reload();
                      }}
                    >
                      View Order Payment
                    </a>
                  ) : null}
                </div>
              </div>
            </Col>
          );
        })}
      </Row>

      <FormGroup>
        <Label for="exampleEmail">Add Comment</Label>
        <textarea
          value={comment}
          className="form-control"
          rows={6}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Add Comment..."
        />

        <div className="text-end mt-3">
          <button
            class="btn btn-success"
            onClick={handleAddComment}
            disabled={!comment}
          >
            Add Comment
          </button>
        </div>
      </FormGroup>

      {getComments?.data?.orderComment?.length ? (
        <Label for="exampleEmail">Comments</Label>
      ) : null}
      {getComments?.data?.orderComment?.map((data) => {
        return (
          <Input type="text" className="mb-3" value={data?.comment} readOnly />
        );
      })}

      {assignEmployeeModal && (
        <AssignEmployeeModal
          handleCloseAssignEmployeeModal={AssignEmployeeModalHandler}
          action={AssignEmployeeApiHandler}
          id={reqData?.id}
          loading={isLoading}
          confirmationMessage="Are you sure you want to assign the employee?"
        />
      )}

      {/* Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default ViewOrderRequests;
