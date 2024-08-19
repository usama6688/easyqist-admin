import React, { useEffect, useState } from 'react';
import { Col, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Input, Row, Table } from 'reactstrap';
import delIcon from "../../assets/images/delIcon.svg";
import { useChangeOrderStatusMutation, useDeleteOrderMutation, useViewOrderRequestQuery } from '../../services/Api';
import { Link, useNavigate } from 'react-router-dom';
import PATHS from '../../routes/Paths';
import DeleteModal from "../../components/DeleteModal";
import { useSelector } from 'react-redux';
import moment from 'moment/moment';

const OrderRequests = () => {

    const [status, setStatus] = useState("");
    const [deleteModal, setDeleteModal] = useState(false);
    const [viewData, setViewData] = useState("");
    const navigator = useNavigate();
    const auth = useSelector((data) => data?.auth);

    const {
        data: viewOrderRequest,
        isLoading: viewOrderRequestLoading,
        refetch: viewOrderRequestRefetch,
    } = useViewOrderRequestQuery({ params: { status: status } });

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
    };

    const localSearchTableFunction = () => {
        const input = document.getElementById("localSearchInput");
        const filter = input.value.toUpperCase();
        var length = document.getElementsByClassName("mainDiv").length;
        let recordsFound = false;

        for (var i = 0; i < length; i++) {
            if (
                document
                    .getElementsByClassName("mainDiv")
                [i].innerHTML.toUpperCase()
                    .indexOf(filter) > -1
            ) {
                document.getElementsByClassName("mainDiv")[i].style.display = "table-row";
                recordsFound = true;
            } else {
                document.getElementsByClassName("mainDiv")[i].style.display = "none";
            }
        }
    }

    useEffect(() => {
        viewOrderRequestRefetch();
    }, [status]);

    return (
        <Row>
            <Col lg="12">
                <div className="row">
                    <div className="col-4">
                        <Input
                            id='localSearchInput'
                            placeholder="Search order"
                            type="search"
                            onChange={(e) => localSearchTableFunction(e.target.value)}
                        />
                    </div>
                    <div className="col-4"></div>
                    <div className="col-4">
                        <select class="form-select" aria-label="Default select example" onChange={(e) => selectStatusHandler(e.target.value)}>
                            <option value="">Select status</option>
                            <option value="1">Pending</option>
                            <option value="2">Accepted</option>
                            {/* <option value="3">Documentation</option>
                            <option value="4">Out for delivery</option> */}
                            <option value="5">Delivered</option>
                            <option value="6">Completed</option>
                            <option value="-1">Rejected</option>
                            <option value="o">Canceled</option>
                        </select>
                    </div>
                </div>

                <Table className="no-wrap mt-3 align-middle" borderless>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Price</th>
                            <th>Order Date</th>
                            <th>Product Name</th>
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

                                                {/* <>
                                                {auth?.userDetail?.type == 2 && data?.order_status != 4 && data?.order_status != 5 && data?.order_status != 6 ?
                                                    <img
                                                        src={delIcon}
                                                        alt=""
                                                        onClick={() => deleteModalHandler(data)}
                                                    />
                                                    : null}
                                            </> */}
                                            </div>
                                        </td>
                                        : null}
                                </tr>
                            )
                        }) : <>{viewOrderRequestLoading ? <td colSpan={7}>
                            <h6 className='text-center'>Loading...</h6>
                        </td> : <td colSpan={7}><h6 className='text-center'>No Record Found</h6></td>}</>
                        }
                    </tbody>
                </Table>
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