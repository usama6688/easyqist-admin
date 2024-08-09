import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'reactstrap';
import { Link, useLocation } from 'react-router-dom';
import { useAddPaymentMutation, useViewPaymentHistoryQuery } from '../../services/Api';
import AddPaymentModal from '../../components/AddPaymentModal';
import moment from 'moment';

const ViewOrderHistory = (props) => {

    const [addPaymentModal, setAddPaymentModal] = useState(false);
    const location = useLocation();
    const reqData = location?.state?.data;

    const [addPayment, { isSuccess, isLoading }] = useAddPaymentMutation();

    const addPaymentModalHandler = () => {
        setAddPaymentModal((prev) => !prev);
    };

    const {
        data: viewPaymentHistory,
        refetch: viewPaymentHistoryRefetch,
        isLoading: viewPaymentHistoryLoading,
    } = useViewPaymentHistoryQuery({ params: { user_id: reqData?.user_id, order_id: reqData?.order_id, order_product_id: reqData?.product_id } });

    const paymentData = viewPaymentHistory?.data?.payment;

    useEffect(() => {
        viewPaymentHistoryRefetch();
    }, []);

    useEffect(() => {
        viewPaymentHistoryRefetch();
    }, [isSuccess]);

    const onAddPayment = (data) => {

        addPayment({ data: data })
            .unwrap()
            .then((payload) => {
                addPaymentModalHandler();
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    return (
        <Row>
            <Col lg="12">
                <div className='text-end'>
                    <Button onClick={addPaymentModalHandler}>Add Payment</Button>
                </div>

                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Amount</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paymentData?.length ? paymentData?.map((data) => {
                            return (
                                <tr className="border-top">
                                    <td>{data?.id}</td>
                                    <td>{data?.amount}</td>
                                    <td>{moment(data?.payment_date).format('MMMM Do, YYYY')}</td>
                                </tr>
                            )
                        })
                            : <>{viewPaymentHistoryLoading ? <td colSpan={5}>
                                <h6 className='text-center'>Loading...</h6>
                            </td> : <td colSpan={3}><h6 className='text-center'>No Record Found</h6></td>}</>}
                    </tbody>
                </Table>

                {addPaymentModal &&
                    <AddPaymentModal
                        handleCloseAddPaymentModal={addPaymentModalHandler}
                        action={onAddPayment}
                        data={reqData}
                        loading={isLoading}
                    />
                }

            </Col>

        </Row>
    )
}

export default ViewOrderHistory;