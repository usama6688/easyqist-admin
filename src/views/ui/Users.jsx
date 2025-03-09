import React, { useState } from 'react';
import { Col, Row, Table, Button, Input } from 'reactstrap';
import { useChangeUserStatusMutation, useDeleteUserMutation, useGetUserQuery } from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import PATHS from '../../routes/Paths';
import DeleteModal from '../../components/DeleteModal';
import { useSelector } from 'react-redux';
import moment from 'moment/moment';
import { DateRangePicker } from "react-dates";
import PaginationComponent from '../../components/pagination/Pagination';

const Users = () => {

    const navigate = useNavigate();
    const [itemId, setItemId] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [searchName, setSearchName] = useState("");
    const [searchPhone, setSearchPhone] = useState("");
    const [searchCnic, setSearchCnic] = useState("");
    const [focusedInput, setFocusedInput] = useState(null);
    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [banUserModal, setBanUserModal] = useState(false);
    const auth = useSelector((data) => data?.auth);

    const [queryParams, setQueryParams] = useState({
        page: 1,
        limit: 50,
        name: "",
        phone: "",
        cnic: "",
        startDate: "",
        endDate: "",
    });

    const {
        data: getUser,
        refetch: getUserRefetch,
    } = useGetUserQuery({ params: queryParams });

    const totalRecords = getUser?.pagination?.totalRecords || 0;
    const totalPages = Math.ceil(totalRecords / queryParams?.limit);

    const handleSearch = () => {
        setQueryParams((prev) => ({
            ...prev,
            page: 1,
            name: searchName,
            phone: searchPhone,
            cnic: searchCnic,
        }));
    };

    const handleReset = () => {
        setQueryParams((prev) => ({
            ...prev,
            name: "",
            phone: "",
            cnic: "",
        }));
        setSearchName("");
        setSearchPhone("");
        setSearchCnic("");
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

    const falseFunc = () => false;

    const handlePageChange = (page) => {
        setQueryParams((prev) => ({ ...prev, page: page }));
    };

    const DeleteModalHandler = (data) => {
        setItemId(data?.id);
        setDeleteItemModal((prev) => !prev);
    };

    const banUserHandler = (data, status) => {
        setItemId(data?.id);
        setStatus(status);
        setBanUserModal((prev) => !prev);
    };

    const [deleteUser] = useDeleteUserMutation();
    const [changeUserStatus] = useChangeUserStatusMutation();

    const onDeleteUser = (id) => {

        deleteUser({ data: id })
            .unwrap()
            .then((payload) => {
                console.log("Payload-->", payload);
                if (payload.status) {
                    window.location.reload();
                    getUserRefetch();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const onChangeUserStatus = (id) => {

        const data = {
            user_id: id,
            status: status,
        };

        changeUserStatus({ data: data })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    window.location.reload();
                    getUserRefetch();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    return (
        <Row>
            <Col lg="12">
                <div>
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
                                placeholder="Search by CNIC"
                                className='h-100'
                                type="number"
                                value={searchCnic}
                                onChange={(e) => setSearchCnic(e.target.value)}
                            />
                        </div>
                        <div className="col-3 d-flex gap-2">
                            <Button className="w-100 h-100 bg-danger border-0" onClick={handleReset}>Reset</Button>
                            <Button className="w-100 h-100 bg-success border-0" onClick={handleSearch}>Search</Button>
                        </div>
                        <div className="col-4 mt-4">
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

                    <div className="mt-4 d-flex justify-content-between">
                        <div>
                        </div>

                        {auth?.userDetail?.type == 3 ? null :
                            <a href={PATHS.addUser}>
                                <Button>Add User</Button>
                            </a>
                        }
                    </div>
                </div>

                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            {/* <th>Email</th> */}
                            <th>Address</th>
                            <th>CNIC</th>
                            <th>Status</th>
                            <th>Created At</th>
                            {auth?.userDetail?.type == 3 ? null :
                                <th>Actions</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {getUser?.data?.map((data) => {
                            return (
                                <tr className="border-top mainDiv">
                                    <td>{data?.name}</td>
                                    <td>{data?.phone_no}</td>
                                    {/* <td>{data?.email}</td> */}
                                    <td>{data?.address}</td>
                                    <td>{data?.cnic_number}</td>
                                    <td>
                                        {(data?.status == 0 || data?.status == 1 || data?.status == 2) ? <p className="text-success mb-0" style={{ width: "max-content" }}>Not Banned</p> : data?.status == 3 ? <p className="text-danger mb-0" style={{ width: "max-content" }}>Banned</p> : ""}
                                    </td>
                                    {/* <td>
                                        {(data?.status == 0 || data?.status == 1 || data?.status == 2) ? <p className="text-white bg-success p-2 rounded mb-0" style={{ width: "max-content" }}>Not Banned</p> : data?.status == 3 ? <p className="text-white bg-danger p-2 rounded mb-0" style={{ width: "max-content" }}>Banned</p> : ""}
                                    </td> */}
                                    <td>{moment(data?.created_at).format("DD-MM-YYYY")}</td>
                                    {auth?.userDetail?.type == 3 ? null :
                                        <td>
                                            <div className='d-flex' style={{ alignItems: "center" }} >
                                                {auth?.userDetail?.type == 1 ?
                                                    <Button
                                                        style={{ backgroundColor: "red" }}
                                                        onClick={
                                                            () => {
                                                                DeleteModalHandler(data)
                                                            }}
                                                    >Delete</Button>
                                                    : null}

                                                {(auth?.userDetail?.type == 1 || auth?.userDetail?.type == 2) ?
                                                    <>
                                                        {(data?.status == 0 || data?.status == 1 || data?.status == 2) ?
                                                            <Button
                                                                style={{ marginLeft: 10, width: "max-content" }}
                                                                className='bg-danger'
                                                                onClick={
                                                                    () => {
                                                                        banUserHandler(data, 3)
                                                                    }}
                                                            >Ban User</Button>
                                                            :
                                                            <Button
                                                                style={{ backgroundColor: "green", marginLeft: 10, width: "max-content" }}
                                                                onClick={
                                                                    () => {
                                                                        banUserHandler(data, 2)
                                                                    }}
                                                            >UnBan User</Button>}
                                                    </>
                                                    : null}

                                                <Button
                                                    style={{ marginLeft: 10 }}
                                                    onClick={() => { navigate(PATHS.viewUserData, { state: { data: data?.id } }); window.location.reload(); }}
                                                >View</Button>
                                            </div>
                                        </td>
                                    }
                                </tr>
                            )
                        })}
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

            {deleteItemModal &&
                <DeleteModal
                    handleCloseDeletModal={DeleteModalHandler}
                    action={onDeleteUser}
                    id={itemId}
                    confirmationMessage="Are you sure you want to delete the user?"
                />
            }

            {banUserModal &&
                <DeleteModal
                    handleCloseDeletModal={banUserHandler}
                    action={onChangeUserStatus}
                    id={itemId}
                    confirmationMessage="Are you sure you want to change status of this user?"
                />
            }

        </Row>
    )
}

export default Users;