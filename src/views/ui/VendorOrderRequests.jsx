import React, { useState } from 'react';
import { Button, Col, Input, Row, Table } from 'reactstrap';
import delIcon from "../../assets/images/delIcon.svg";
import { useChangeOrderStatusMutation, useDeleteOrderMutation, useDeleteVendorOrderRequestMutation, useGetVendorOrderRequestsQuery, useVendorOrderRequestStatusMutation } from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import PATHS from '../../routes/Paths';
import DeleteModal from "../../components/DeleteModal";
import { useSelector } from 'react-redux';
import moment from 'moment/moment';
import PaginationComponent from '../../components/pagination/Pagination';
import { DateRangePicker } from "react-dates";
import * as XLSX from "xlsx";

const VendorOrderRequests = () => {

    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedOrderItem, setSelectedOrderItem] = useState(null);
    const prevStatus = localStorage.getItem("status");
    const [status, setStatus] = useState(prevStatus || "");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchName, setSearchName] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [cnic, setCnic] = useState("");
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
        cnic: "",
        startDate: "",
        endDate: "",
    });

    const {
        data: getVendorOrderRequests,
        isLoading: getVendorOrderRequestsLoading,
        refetch: getVendorOrderRequestsRefetch,
    } = useGetVendorOrderRequestsQuery({ params: queryParams });

    const totalRecords = getVendorOrderRequests?.pagination?.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / queryParams?.limit);

    const handleSearch = () => {
        setQueryParams((prev) => ({
            ...prev,
            page: 1,
            cnic: cnic,
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
            status: "",
            cnic: ""
        }));
        setSearchName("");
        setSearchPhone("");
        setCnic("");
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

    const [vendorOrderRequestStatus] = useVendorOrderRequestStatusMutation();
    const [deleteVendorOrderRequest] = useDeleteVendorOrderRequestMutation();

    const handleStatusChange = (status, item) => {
        if (status == "rejected") {
            setSelectedOrderItem(item);
            setIsRejectionModalOpen(true);
            return;
        }

        const data = {
            id: item?.id,
            status: status,
            rejection_reason: "",
        };

        vendorOrderRequestStatus({ data })
            .unwrap()
            .then(() => {
                getVendorOrderRequestsRefetch();
            })
            .catch((error) => console.log("error", error));
    };

    const handleConfirmRejection = () => {
        const data = {
            id: selectedOrderItem?.id,
            status: "rejected",
            rejection_reason: rejectionReason,
        };

        vendorOrderRequestStatus({ data })
            .unwrap()
            .then(() => {
                setIsRejectionModalOpen(false);
                setRejectionReason('');
                getVendorOrderRequestsRefetch();
            })
            .catch((error) => console.log("error", error));
    };

    const deleteOrderHandler = (id) => {
        deleteVendorOrderRequest({ data: id })
            .unwrap()
            .then(() => {
                getVendorOrderRequestsRefetch();
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

    // const handleExport = () => {
    //     if (!getVendorOrderRequests?.data?.length) {
    //         alert("No data available to export.");
    //         return;
    //     }

    //     const tableData = getVendorOrderRequests.data.map((data) => ({
    //         "User Name": data?.users?.name,
    //         "Phone No": data?.users?.phone_no,
    //         "Order Price": data?.order_price,
    //         "Order Date": data?.order_date ? new Date(data?.order_date).toLocaleDateString() : "",
    //         "Product Name": data?.order_products?.[0]?.product?.name,
    //         "CNIC": data?.users?.cnic_number,
    //         "Session ID": data?.order_session_id,
    //         "Order Status":
    //             data?.order_status == 1
    //                 ? "Pending"
    //                 : data?.order_status == 2
    //                     ? "Accepted"
    //                     : data?.order_status == 3
    //                         ? "Documentation"
    //                         : data?.order_status == 4
    //                             ? "Out for delivery"
    //                             : data?.order_status == 5
    //                                 ? "Delivered"
    //                                 : data?.order_status == -1
    //                                     ? "Rejected"
    //                                     : "Unknown",
    //     }));

    //     const worksheet = XLSX.utils.json_to_sheet(tableData);
    //     const workbook = XLSX.utils.book_new();
    //     XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

    //     XLSX.writeFile(workbook, "Order_Requests.xlsx");
    // };

    return (
        <Row>
            <Col lg="12">
                <div className="row">
                    <div className="col-4 pe-0">
                        <Input
                            placeholder="Search by Name"
                            className='h-100'
                            type="search"
                            value={searchName}
                            onChange={(e) => setSearchName(e.target.value)}
                        />
                    </div>
                    <div className="col-4 pe-0 mt-3">
                        <Input
                            placeholder="Search by CNIC"
                            className='h-100'
                            type="text"
                            value={cnic}
                            onChange={(e) => setCnic(e.target.value)}
                        />
                    </div>
                    <div className="col-4 d-flex gap-2 pe-0 mt-3">
                        <Button className="w-100 h-100 bg-danger border-0" onClick={handleReset}>Reset</Button>
                        <Button className="w-100 h-100 bg-success border-0" onClick={handleSearch}>Search</Button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-3 pe-0 mt-4">
                        <select class="form-select" aria-label="Default select example" onChange={(e) => selectStatusHandler(e.target.value)} value={status} style={{ height: "47px" }}>
                            <option value="">Select status</option>
                            <option value="1">Pending</option>
                            <option value="2">Accepted</option>
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
                            onFocusChange={focusedInput => setFocusedInput(focusedInput)}
                        />
                    </div>
                    <div className="col-4 mt-4 ps-0">
                        <Button className="w-50 h-100 bg-danger border-0" onClick={handleResetDate}>Reset Date</Button>
                    </div>
                </div>

                {/* <div className='text-end mt-5'>
                    <Button className="bg-success border-0" onClick={handleExport}>Download Excel</Button>
                </div> */}

                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                        <tr>
                            <th>Name</th>
                            {/* <th>Phone</th> */}
                            <th>Price</th>
                            <th>Order Date</th>
                            <th>Product Name</th>
                            <th>CNIC</th>
                            {/* <th>Session ID</th> */}
                            <th>Status</th>
                            {auth?.userDetail?.type == 1 ?
                                <th>Actions</th>
                                : null}
                        </tr>
                    </thead>
                    <tbody>
                        {getVendorOrderRequests?.data?.length ? getVendorOrderRequests?.data?.map((data) => {
                            return (
                                <tr className="border-top mainDiv" style={{ cursor: "pointer" }}
                                >
                                    <td onClick={() => { navigator(PATHS.viewVendorOrderRequests, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0 text-capitalize">{data?.buyer_user}</h6>
                                    </td>
                                    {/* <td onClick={() => { navigator(PATHS.viewVendorOrderRequests, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0">{data?.users?.phone_no}</h6>
                                    </td> */}
                                    <td onClick={() => { navigator(PATHS.viewVendorOrderRequests, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0">{data?.item_price}</h6>
                                    </td>
                                    <td onClick={() => { navigator(PATHS.viewVendorOrderRequests, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0">{moment(data?.order_date).format("DD-MM-YYYY")}</h6>
                                    </td>
                                    <td onClick={() => { navigator(PATHS.viewVendorOrderRequests, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0">{data?.item_name}</h6>
                                    </td>
                                    <td onClick={() => { navigator(PATHS.viewVendorOrderRequests, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0">{data?.buyer_cnic_number}</h6>
                                    </td>
                                    {/* <td onClick={() => { navigator(PATHS.viewVendorOrderRequests, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0">{data?.order_session_id}</h6>
                                    </td> */}
                                    <td onClick={() => { navigator(PATHS.viewVendorOrderRequests, { state: { data: data } }); window.location.reload(); }}>
                                        <h6 className="mb-0 text-capitalize">{data?.status}</h6>
                                    </td>
                                    {auth?.userDetail?.type == 1 ?
                                        <td>
                                            <div className='d-flex align-items-center gap-3'>
                                                <div class="dropdown">
                                                    <button class="btn btn-secondary dropdown-togglex" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                                        ...
                                                    </button>
                                                    <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                                        {data?.status == "pending" ?
                                                            <>
                                                                <li>
                                                                    <a class="dropdown-item" onClick={() => handleStatusChange("approved", data)}>Approve</a>
                                                                </li>
                                                                <li>
                                                                    <a class="dropdown-item" onClick={() => handleStatusChange("rejected", data)}>Reject</a>
                                                                </li>
                                                            </>
                                                            : data?.status == "rejected" ?
                                                                <li>
                                                                    <a class="dropdown-item" onClick={() => handleStatusChange("approved", data)}>Approve</a>
                                                                </li>
                                                                : data?.status == "approved" ?
                                                                    <li>
                                                                        <a class="dropdown-item" onClick={() => handleStatusChange("rejected", data)}>Reject</a>
                                                                    </li>
                                                                    : null
                                                        }
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
                        }) : <>{getVendorOrderRequestsLoading ? <td colSpan={9}>
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

            {isRejectionModalOpen && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Reject Order</h5>
                                <button type="button" className="btn-close" onClick={() => setIsRejectionModalOpen(false)}></button>
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
                                <button type="button" className="btn btn-secondary" onClick={() => setIsRejectionModalOpen(false)}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={handleConfirmRejection}>Reject</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Row >
    )
}

export default VendorOrderRequests;