import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import moment from 'moment';
import Select from "react-select";
import PATHS from '../../routes/Paths';
import { useAddCommentMutation, useChangeOrderStatusMutation, useEmploymentAssignMutation, useGetCommentsQuery, useGetEmployeesQuery, useViewOrderDetailQuery } from '../../services/Api';
import AssignEmployeeModal from '../../components/AssignEmployeeModal';
import { useSelector } from 'react-redux';

const ViewOrderRequests = () => {

    const [assignEmployeeModal, setAssignEmployeeModal] = useState(false);
    const [selectedOptions, setSelectedOptions] = useState();
    const [comment, setComment] = useState('');
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

    const {
        data: getEmployees,
        refetch: getEmployeesRefetch,
    } = useGetEmployeesQuery();

    const {
        data: getComments,
        refetch: getCommentsRefetch,
    } = useGetCommentsQuery({ params: { orderId: reqDataId?.id } });

    console.log("getComments", getComments);

    const {
        data: viewOrderDetail,
        refetch: viewOrderDetailRefetch,
    } = useViewOrderDetailQuery({ params: { order_id: reqDataId?.id } });

    const reqData = viewOrderDetail?.data[0];

    const modifiedBrands = getEmployees?.data?.map(data => ({
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
            user_id: reqDataId?.users?.id,
            order_id: reqDataId?.id,
        }

        addComment({ data: data })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    getCommentsRefetch();
                    // navigate(PATHS.orderRequests);
                    // window.location.reload();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const handleItemClick = (itemId, item) => {

        const data = {
            order_id: item?.id,
            order_status: itemId,
        }

        changeOrderStatus({ data: data })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    navigate(PATHS.orderRequests);
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const AssignEmployeeApiHandler = (id) => {

        const data = {
            empid: selectedOptions?.value,
            orderid: id,
        };

        employmentAssign({ data: data })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    AssignEmployeeModalHandler();
                    navigate(PATHS.orderRequests);
                    // window.location.reload();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    useEffect(() => {
        getEmployeesRefetch();
        viewOrderDetailRefetch();
        getCommentsRefetch();
    }, []);

    return (
        <div>
            <Row>

                {(auth?.userDetail?.type == 3 || auth?.userDetail?.type == 5) ? null :
                    <>
                        <Col lg="4"></Col>
                        {auth?.userDetail?.type == 4 ? <Col lg="4"></Col> :
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
                        }
                        <Col lg="4" className='mb-4'>
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-togglex w-100" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    Change Status
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    <li>
                                        <a class="dropdown-item" onClick={() => handleItemClick(1, reqData)}>Pending</a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" onClick={() => handleItemClick(2, reqData)}>Accepted</a>
                                    </li>
                                    {/* <li>
                                <a class="dropdown-item" onClick={() => handleItemClick(3, reqData)}>Documentation</a>
                            </li>
                            <li>
                                <a class="dropdown-item" onClick={() => handleItemClick(4, reqData)}>Out for delivery</a>
                            </li> */}
                                    <li>
                                        <a class="dropdown-item" onClick={() => handleItemClick(5, reqData)}>Delivered</a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" onClick={() => handleItemClick(6, reqData)}>Completed</a>
                                    </li>
                                    <li>
                                        <a class="dropdown-item" onClick={() => handleItemClick(-1, reqData)}>Rejected</a>
                                    </li>
                                </ul>
                            </div>
                        </Col>
                    </>
                }

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
                        <Input type="text" value={moment(reqData?.order_date).format('MMMM Do YYYY, h:mm:ss a')} readOnly />
                    </FormGroup>
                </Col>

                <Col lg="4">
                    <FormGroup>
                        <Label for="exampleEmail">Address</Label>
                        <Input type="text" value={reqData?.address?.address || reqData?.user?.address} readOnly />
                    </FormGroup>
                </Col>

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

                <Col lg="4">
                    <FormGroup>
                        <Label for="exampleEmail">Referee Code</Label>
                        <Input type="text" value={reqData?.refercode} readOnly />
                    </FormGroup>
                </Col>

                <Col lg="4">
                    <FormGroup>
                        <Label for="exampleEmail">Referee Name</Label>
                        <Input type="text" value={reqData?.refername} readOnly />
                    </FormGroup>
                </Col>

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
                <Label for="exampleEmail" className='mt-4'>Ordered Products</Label>
                {reqData?.order_products?.map((data) => {
                    return (
                        <Col lg="4">
                            <div class="card">
                                <img src={data?.product?.thumbnail} class="card-img-top" />
                                <div class="card-body">
                                    <h5 class="card-title">{data?.product?.name}</h5>
                                    <h6 class="card-title">Amount: {data?.order_product_amount}</h6>
                                    <h6 class="card-title">Advance: {data?.order_product_advance_amount}</h6>
                                    <h6 class="card-title">Plan: {data?.orderinstallment?.amount * data?.qty} x {data?.orderinstallment?.duration} months</h6>

                                    {reqData?.order_status != 5 && (auth?.userDetail?.type != 3 && auth?.userDetail?.type != 4 && auth?.userDetail?.type != 5) ?
                                        <a class="btn btn-primary" onClick={() => { navigate(PATHS.viewOrderPayment, { state: { data: data } }); window.location.reload(); }}
                                        >View Order Payment</a>
                                        : null}
                                </div>
                            </div>
                        </Col>
                    )
                })}
            </Row>

            <FormGroup>
                <Label for="exampleEmail">Add Comment</Label>
                <textarea value={comment} className='form-control' rows={6} onChange={(e) => setComment(e.target.value)} placeholder='Add Comment...' />

                <div className='text-end mt-3'>
                    <button class="btn btn-success" onClick={handleAddComment} disabled={!comment}>
                        Add Comment
                    </button>
                </div>
            </FormGroup>

            {getComments?.data?.orderComment?.length ?
                <Label for="exampleEmail">Comments</Label>
                : null}
            {getComments?.data?.orderComment?.map((data) => {
                return (
                    <Input type="text" className='mb-3' value={data?.comment} readOnly />
                )
            })}

            {assignEmployeeModal &&
                <AssignEmployeeModal
                    handleCloseAssignEmployeeModal={AssignEmployeeModalHandler}
                    action={AssignEmployeeApiHandler}
                    id={reqData?.id}
                    loading={isLoading}
                    confirmationMessage="Are you sure you want to assign the employee?"
                />
            }
        </div>
    )
}

export default ViewOrderRequests;