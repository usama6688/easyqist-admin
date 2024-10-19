import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Row, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteCustomerMutation, useGetCustomersQuery, useSendMessageMutation } from '../../services/Api';
import DeleteModal from '../../components/DeleteModal';
import PATHS from '../../routes/Paths';
import SendMessageModal from '../../components/SendMessageModal';
import { DateRangePicker } from "react-dates";
import moment from "moment/moment";
import { useSelector } from 'react-redux';

const Customers = () => {

    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [sendMessageModal, setSendMessageModal] = useState(false);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [itemId, setItemId] = useState("");
    const navigate = useNavigate();
    const auth = useSelector((data) => data?.auth);

    const SendMessageModalHandler = () => {
        setSendMessageModal((prev) => !prev);
    };

    const {
        data: getCustomers,
        refetch: getCustomersRefetch,
    } = useGetCustomersQuery();

    const [deleteCustomer, { isLoading }] = useDeleteCustomerMutation();
    const [sendMessage] = useSendMessageMutation();

    const onDeletecategory = (id) => {
        deleteCustomer({ data: id })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    getCustomersRefetch();
                    DeleteModalHandler();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const onSendMessage = (data) => {
        sendMessage({ data: data })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    getCustomersRefetch();
                    SendMessageModalHandler();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const DeleteModalHandler = (data) => {
        setItemId(data?.id);
        setDeleteItemModal((prev) => !prev);
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
        getCustomersRefetch();
    }, []);

    const handleDatesChange = ({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    const falseFunc = () => false;

    const filterDataByDate = (data, startDate, endDate) => {
        if (!startDate || !endDate) return data;
        return data.filter(item => {
            const createdAt = moment(item.created_at);
            return createdAt.isSameOrAfter(startDate) && createdAt.isSameOrBefore(endDate);
        });
    };

    const filteredCustomerData = filterDataByDate(getCustomers?.data || [], startDate, endDate);

    return (
        <Row>
            <Col lg="12">
                <div className='d-flex justify-content-between'>
                    <Input
                        id='localSearchInput'
                        placeholder="Search customer"
                        type="search"
                        className='w-50'
                        onChange={(e) => localSearchTableFunction(e.target.value)}
                    />

                    <div>
                        <span>Select Date Range: </span>
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
                </div>

                {auth?.userDetail?.type == 3 ? null :
                    <div className='mt-3 text-end'>
                        <a href={PATHS.addCustomers}>
                            <Button>Add Customer</Button>
                        </a>

                        <Button className='ms-3' onClick={SendMessageModalHandler}>Send Message</Button>
                    </div>
                }


                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Address</th>
                            {auth?.userDetail?.type == 3 ? null :
                                <th>Actions</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomerData?.length ? filteredCustomerData?.map((data, index) => {
                            return (
                                <tr className="border-top mainDiv" key={index}>
                                    <td>
                                        <h6 className="mb-0">{index + 1}</h6>
                                    </td>
                                    <td>
                                        <h6 className="mb-0">{data?.custname}</h6>
                                    </td>
                                    <td>
                                        <h6 className="mb-0">{data?.phone}</h6>
                                    </td>
                                    <td>
                                        <h6 className="mb-0">{data?.address}</h6>
                                    </td>
                                    {auth?.userDetail?.type == 3 ? null :
                                        <td>
                                            <div className='d-flex align-items-center gap-2'>
                                                <Button style={{ marginRight: 5 }}
                                                    onClick={() => { navigate(PATHS.editCustomers, { state: { data: data } }); window.location.reload(); }}
                                                >Edit</Button>
                                                <Button
                                                    onClick={
                                                        () => {
                                                            DeleteModalHandler(data)
                                                        }}
                                                >Delete</Button>
                                            </div>
                                        </td>
                                    }
                                </tr>
                            )
                        }) : <tr><td colSpan={5}><p className='text-center'>No record found</p></td></tr>}
                    </tbody>
                </Table>
            </Col>

            {deleteItemModal &&
                <DeleteModal
                    handleCloseDeletModal={DeleteModalHandler}
                    action={onDeletecategory}
                    id={itemId}
                    loading={isLoading}
                    confirmationMessage="Are you sure you want to delete the customer?"
                />
            }

            {sendMessageModal &&
                <SendMessageModal
                    handleCloseSendMessageModal={SendMessageModalHandler}
                    action={onSendMessage}
                />
            }

        </Row>
    )
}

export default Customers;