import React, { useEffect, useState } from 'react';
import { Button, Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Row, Table } from 'reactstrap';
import delIcon from "../../assets/images/delIcon.svg";
import { useChangeOrderStatusMutation, useDeleteOrderMutation, useViewOrderRequestQuery } from '../../services/Api';
import { Link, useNavigate } from 'react-router-dom';
import PATHS from '../../routes/Paths';
import DeleteModal from "../../components/DeleteModal";
import { useSelector } from 'react-redux';
import moment from 'moment/moment';
import PaginationComponent from '../../components/pagination/Pagination';
import { DateRangePicker } from "react-dates";

const OrderRequests = () => {

    const prevStatus = localStorage.getItem("status");
    const [status, setStatus] = useState(prevStatus || "");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchName, setSearchName] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [area, setArea] = useState("");
    const [focusedInput, setFocusedInput] = useState(null);
    const [deleteModal, setDeleteModal] = useState(false);
    const [viewData, setViewData] = useState("");
    const navigator = useNavigate();
    const auth = useSelector((data) => data?.auth);

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 50,
        status: prevStatus || "",
        name: "",
        phone: "",
        startDate: "",
        endDate: "",
    });

    const {
        data: viewOrderRequest,
        isLoading: viewOrderRequestLoading,
        refetch: viewOrderRequestRefetch,
    } = useViewOrderRequestQuery({ params: queryParams });

    const totalRecords = viewOrderRequest?.pagination?.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / queryParams?.limit);

    const handleSearch = () => {
        setQueryParams((prev) => ({
            ...prev,
            page: 1,
            // status: status,
            name: searchName,
            phone: searchPhone,
            area: area,
        }));
    };

    const handleReset = () => {
        setQueryParams((prev) => ({
            ...prev,
            name: "",
            phone: "",
            status: ""
        }));
        setSearchName("");
        setSearchPhone("");
        // setStatus("");
    };

    const handleResetDate = () => {
        setQueryParams((prev) => ({
            ...prev,
            limit: 10,
            startDate: "",
            endDate: "",
        }));
        setStartDate(null);
        setEndDate(null);
    };

    const handleDatesChange = ({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
        setQueryParams((prev) => ({
            ...prev,
            page: 1,
            limit: 100,
            startDate: startDate ? moment(startDate).format("YYYY-MM-DD") : "",
            endDate: endDate ? moment(endDate).format("YYYY-MM-DD") : "",
        }));
    };

    const handlePageChange = (page) => {
        setQueryParams((prev) => ({ ...prev, page: page }));
    };

    const falseFunc = () => false;

    const deleteModalHandler = (data) => {
        setDeleteModal((prev) => !prev);
        setViewData(data);
    };

    const [changeOrderStatus] = useChangeOrderStatusMutation();
    const [deleteOrder] = useDeleteOrderMutation();

    const handleItemClick = (itemId, item) => {

        const data = {
            order_id: item?.id,
            order_status: itemId,
        };

        changeOrderStatus({ data: data })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    console.log("success");
                    viewOrderRequestRefetch();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const deleteOrderHandler = (id) => {
        deleteOrder({ data: id })
            .unwrap()
            .then(() => {
                viewOrderRequestRefetch();
                deleteModalHandler();
            })
            .catch((error) => { });
    };

    const selectStatusHandler = (value) => {
        setStatus(value);
        localStorage.setItem("status", value);
        setQueryParams((prev) => ({
            ...prev,
            page: 1,
            status: value,
        }));
    };

    return (
        <Row>
            <Col lg="12">
                <div className="row">
                    <div className="col-3 pe-0">
                        <Input
                            placeholder="Search by Name"
                            className='h-100'
                            type="search"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                    </div>
                    <div className="col-3 pe-0">
                        <Input
                            placeholder="Search by Phone"
                            className='h-100'
                            type="number"
                            value={searchPhone}
                            onChange={(e) => setSearchPhone(e.target.value)}
                        />
                    </div>
                    <div className="col-3 pe-0">
                        <Input
                            placeholder="Search by Area"
                            className='h-100'
                            type="number"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                        />
                    </div>
                    <div className="col-3 pe-0 d-flex gap-2">
                        <Button className="w-100 h-100 bg-danger border-0" onClick={handleReset}>Reset</Button>
                        <Button className="w-100 h-100 bg-success border-0" onClick={handleSearch}>Search</Button>
                    </div>

                    <div className="col-3 pe-0 mt-4">
                        <select class="form-select" aria-label="Default select example" onChange={(e) => selectStatusHandler(e.target.value)} value={status} style={{ height: "47px" }}>
                            <option value="">Select status</option>
                            <option value="1">Pending</option>
                            <option value="2">Accepted</option>
                            {/* <option value="3">Documentation</option>
                            <option value="4">Out for delivery</option> */}
                            <option value="5">Delivered</option>
                            <option value="6">Completed</option>
                            <option value="-1">Rejected</option>
                            <option value="-2">Canceled</option>
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
                            onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                        />
                    </div>
                    <div className="col-4 mt-4 ps-0">
                        <Button className="w-50 h-100 bg-danger border-0" onClick={handleResetDate}>Reset Date</Button>
                    </div>
                </div>

                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Price</th>
                            <th>Order Date</th>
                            <th>Product Name</th>
                            <th>CNIC</th>
                            <th>Session ID</th>
                            <th>Status</th>
                            {auth?.userDetail?.type == 1 ?
                                <th>Actions</th>
                                : null}
                        </tr>
                    </thead>
                    <tbody>
                        {viewOrderRequest?.data?.length ? viewOrderRequest?.data?.map((data) => {
                            return (
                                <tr className="border-top mainDiv" style={{ cursor: "pointer" }}
                                >
                                    <td onClick={() => { navigator(PATHS.viewOrderRequest, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0 text-capitalize">{data?.users?.name}</h6>
                                    </td>
                                    <td onClick={() => { navigator(PATHS.viewOrderRequest, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0">{data?.users?.phone_no}</h6>
                                    </td>
                                    <td onClick={() => { navigator(PATHS.viewOrderRequest, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0">{data?.order_price}</h6>
                                    </td>
                                    <td onClick={() => { navigator(PATHS.viewOrderRequest, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0">{moment(data?.order_date).format("DD-MM-YYYY")}</h6>
                                    </td>
                                    <td onClick={() => { navigator(PATHS.viewOrderRequest, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0">{data?.order_products?.[0]?.product?.name}</h6>
                                    </td>
                                    <td onClick={() => { navigator(PATHS.viewOrderRequest, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0">{data?.users?.cnic_number}</h6>
                                    </td>
                                    <td onClick={() => { navigator(PATHS.viewOrderRequest, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0">{data?.order_session_id}</h6>
                                    </td>
                                    <td onClick={() => { navigator(PATHS.viewOrderRequest, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0">{data?.order_status == 1 ? "Pending" : data?.order_status == 2 ? "Accepted" : data?.order_status == 3 ? "Documentation" : data?.order_status == 4 ? "Out for delivery" : data?.order_status == 5 ? "Delivered" : data?.order_status == 5 ? "Rejected" : ""}</h6>
                                    </td>
                                    {auth?.userDetail?.type == 1 ?
                                        <td>
                                            <div className='d-flex align-items-center gap-3'>
                                                <div class="dropdown">
                                                    <button class="btn btn-secondary dropdown-togglex" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                        ...
                                                    </button>
                                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                        <li>
                                                            <a class="dropdown-item" onClick={() => handleItemClick(1, data)}>Pending</a>
                                                        </li>
                                                        <li>
                                                            <a class="dropdown-item" onClick={() => handleItemClick(2, data)}>Accepted</a>
                                                        </li>
                                                        {/* <li>
                                                            <a class="dropdown-item" onClick={() => handleItemClick(3, data)}>Documentation</a>
                                                        </li>
                                                        <li>
                                                            <a class="dropdown-item" onClick={() => handleItemClick(4, data)}>Out for delivery</a>
                                                        </li> */}
                                                        <li>
                                                            <a class="dropdown-item" onClick={() => handleItemClick(5, data)}>Delivered</a>
                                                        </li>
                                                        <li>
                                                            <a class="dropdown-item" onClick={() => handleItemClick(6, data)}>Completed</a>
                                                        </li>
                                                        <li>
                                                            <a class="dropdown-item" onClick={() => handleItemClick(-1, data)}>Rejected</a>
                                                        </li>
                                                    </ul>
                                                </div>
                                                {auth?.userDetail?.type == 1 ?
                                                    <img
                                                        src={delIcon}
                                                        alt=""
                                                        onClick={() => deleteModalHandler(data)}
                                                    />
                                                    :
                                                    null
                                                }
                                            </div>
                                        </td>
                                        : null}
                                </tr>
                            )
                        }) : <>{viewOrderRequestLoading ? <td colSpan={9}>
                            <h6 className='text-center'>Loading...</h6>
                        </td> : <td colSpan={9}><h6 className='text-center'>No Record Found</h6></td>}</>
                        }
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

            {deleteModal &&
                <DeleteModal
                    handleCloseDeletModal={deleteModalHandler}
                    confirmationMessage="Are you sure you want to delete this order?"
                    id={viewData?.id}
                    action={deleteOrderHandler}
                />
            }
        </Row >
    )
}

export default OrderRequests;