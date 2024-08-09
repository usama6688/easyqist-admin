import React from 'react';
import { Col, Row, Table, Button, Input } from 'reactstrap';
import user1 from "../../assets/images/users/user1.jpg";
import { useLocation, useNavigate } from 'react-router-dom';
import { useViewOrderHistoryQuery } from '../../services/Api';
import moment from 'moment';
import PATHS from '../../routes/Paths';

const ViewUserData = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const userData = location?.state?.data;

    const {
        data: viewOrderHistory,
        refetch: viewOrderHistoryRefetch,
    } = useViewOrderHistoryQuery({ params: { user_id: userData } });

    console.log("viewOrderHistory", viewOrderHistory);

    return (
        <Row>
            <Col lg="12">
                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Advance</th>
                            <th>Price</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viewOrderHistory?.data?.length ? viewOrderHistory?.data?.map((data) => {
                            return (
                                <tr className="border-top mainDiv">
                                    <td>{moment(data?.order_date).format('MMMM Do YYYY, h:mm:ss a')}</td>
                                    <td>{data?.order_advance_amount}</td>
                                    <td>{data?.order_price}</td>
                                    <td>
                                        <div style={{ alignItems: "center" }} >
                                            <Button
                                                style={{ marginLeft: 10 }}
                                                onClick={() => { navigate(PATHS.viewOrderRequest, { state: { data: data } }); window.location.reload(); }}
                                            >View</Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        }) : <td colSpan={4} className='text-center'>No Record Found</td>}
                    </tbody>
                </Table >
            </Col >

        </Row >
    )
}

export default ViewUserData;