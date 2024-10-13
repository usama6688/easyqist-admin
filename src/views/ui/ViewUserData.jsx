import React, { useEffect, useState } from 'react';
import { Col, Row, Table, Button } from 'reactstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGetAllProductsQuery, useViewOrderHistoryQuery } from '../../services/Api';
import moment from 'moment';
import PATHS from '../../routes/Paths';
import Select from "react-select";

const ViewUserData = () => {

    const [selectedOptions, setSelectedOptions] = useState();
    const navigate = useNavigate();
    const location = useLocation();
    const userData = location?.state?.data;

    const {
        data: viewOrderHistory,
        refetch: viewOrderHistoryRefetch,
    } = useViewOrderHistoryQuery({ params: { user_id: userData } });

    const {
        data: getAllProducts,
        refetch: getAllProductsRefetch,
    } = useGetAllProductsQuery({ params: { start: 0, limit: 100000 } });

    const modifiedProducts = getAllProducts?.data.map(product => ({
        label: product?.name,
        value: product?.id
    }));

    const handleSelect = (data) => {
        setSelectedOptions(data);
        navigate(PATHS.productDetail, { state: { id: data?.value, userId: userData } });
        window.location.reload();
    };

    useEffect(() => {
        viewOrderHistoryRefetch();
        getAllProductsRefetch();
    }, []);

    return (
        <Row>

            <Col lg="6">
                <Select
                    options={modifiedProducts}
                    placeholder="Select product"
                    value={selectedOptions}
                    onChange={handleSelect}
                    isSearchable={true}
                />
            </Col>

            <Col lg="12 mt-3">
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
            </Col>

        </Row >
    )
}

export default ViewUserData;