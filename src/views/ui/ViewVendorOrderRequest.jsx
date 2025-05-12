import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Col, FormGroup, Input, Label, Row } from 'reactstrap';
import moment from 'moment';
import { useGetVendorOrderRequestByIdQuery, useVendorOrderRequestStatusMutation } from '../../services/Api';
import { useSelector } from 'react-redux';

const ViewVendorOrderRequest = () => {

    const [isRejectionModalOpen, setIsRejectionModalOpen] = useState(false);
    const [rejectionReason, setRejectionReason] = useState('');
    const [selectedOrderItem, setSelectedOrderItem] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const reqDataId = location?.state?.data;
    const auth = useSelector((data) => data?.auth);

    const [vendorOrderRequestStatus] = useVendorOrderRequestStatusMutation();

    const {
        data: getVendorOrderRequestById,
        refetch: getVendorOrderRequestByIdRefetch,
    } = useGetVendorOrderRequestByIdQuery({ params: { id: reqDataId?.id } });

    const orderData = getVendorOrderRequestById?.data || [];

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
                getVendorOrderRequestByIdRefetch();
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

                {(auth?.userDetail?.type == 3 || auth?.userDetail?.type == 5) ? null :
                    <>
                        <Col lg="4"></Col>
                        <Col lg="4"></Col>
                        <Col lg="4" className='mb-4'>
                            <div class="dropdown">
                                <button class="btn btn-secondary dropdown-togglex w-100" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    Change Status
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
                                    {orderData?.status == "pending" ?
                                        <>
                                            <li>
                                                <a class="dropdown-item" onClick={() => handleStatusChange("approved", orderData)}>Approve</a>
                                            </li>
                                            <li>
                                                <a class="dropdown-item" onClick={() => handleStatusChange("rejected", orderData)}>Reject</a>
                                            </li>
                                        </>
                                        : orderData?.status == "rejected" ?
                                            <li>
                                                <a class="dropdown-item" onClick={() => handleStatusChange("approved", orderData)}>Approve</a>
                                            </li>
                                            : orderData?.status == "approved" ?
                                                <li>
                                                    <a class="dropdown-item" onClick={() => handleStatusChange("rejected", orderData)}>Reject</a>
                                                </li>
                                                : null
                                    }
                                </ul>
                            </div>
                        </Col>
                    </>
                }

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
                        <Input type="text" className='text-capitalize' value={orderData?.status} readOnly />
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
                        <Input type="text" value={moment(orderData?.order_date).format('MMMM Do YYYY, h:mm:ss a')} readOnly />
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
            </Row>

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
        </div>
    )
}

export default ViewVendorOrderRequest;