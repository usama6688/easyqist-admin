import React, { useState } from 'react';
import { Col, Row, Table, Button, Input } from 'reactstrap';
import { useChangeUserStatusMutation, useDeleteUserMutation, useGetUserQuery } from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import PATHS from '../../routes/Paths';
import DeleteModal from '../../components/DeleteModal';
import { useSelector } from 'react-redux';
import moment from 'moment/moment';
import { DateRangePicker } from "react-dates";

const Users = () => {

    const navigate = useNavigate();
    const [itemId, setItemId] = useState("");
    const [status, setStatus] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [banUserModal, setBanUserModal] = useState(false);
    const auth = useSelector((data) => data?.auth);

    const {
        data: getUser,
        refetch: getUserRefetch,
    } = useGetUserQuery({ params: { start: 0, limit: 100000 } });

    const DeleteModalHandler = (data) => {
        setItemId(data?.id);
        setDeleteItemModal((prev) => !prev);
    };

    const banUserHandler = (data,status) => {
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

        // console.log("data", data);
        // return;

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

    const localSearchTableFunction = (value) => {
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
    };

    const handleDatesChange = ({ startDate, endDate }) => {
        setStartDate(startDate);
        setEndDate(endDate);
    };

    const falseFunc = () => false;

    const filterDataByDate = (data, startDate, endDate) => {
        if (!startDate || !endDate) return data;
        return data?.filter(item => {
            const createdAt = moment(item?.created_at);
            return createdAt.isSameOrAfter(startDate) && createdAt.isSameOrBefore(endDate);
        });
    };

    const filteredUserData = filterDataByDate(getUser?.data || [], startDate, endDate);

    return (
        <Row>
            <Col lg="12">
                <div>
                    <Input
                        id='localSearchInput'
                        placeholder="Search user"
                        type="search"
                        onChange={(e) => localSearchTableFunction(e.target.value)}
                    />

                    <div className="mt-4 d-flex justify-content-between">
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
                            <th>Email</th>
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
                        {filteredUserData?.map((data) => {
                            return (
                                <tr className="border-top mainDiv">
                                    <td>{data?.name}</td>
                                    <td>{data?.phone_no}</td>
                                    <td>{data?.email}</td>
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

                                                {auth?.userDetail?.type == 1 ?
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