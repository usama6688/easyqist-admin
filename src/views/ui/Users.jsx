import React, { useState } from 'react';
import { Col, Row, Table, Button, Input } from 'reactstrap';
import user1 from "../../assets/images/users/user1.jpg";
import { useDeleteUserMutation, useGetUserQuery, useIsRejectedOrApprovedMutation } from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import PATHS from '../../routes/Paths';
import DeleteModal from '../../components/DeleteModal';
import { useSelector } from 'react-redux';

const Users = () => {

    const navigate = useNavigate();
    const [itemId, setItemId] = useState("");
    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const auth = useSelector((data) => data?.auth);

    const {
        data: getUser,
        refetch: getUserRefetch,
    } = useGetUserQuery({ params: { start: 0, limit: 100000 } });

    const DeleteModalHandler = (data) => {
        setItemId(data?.id);
        setDeleteItemModal((prev) => !prev);
    };

    const [deleteUser] = useDeleteUserMutation();

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

    const [isRejectedOrApproved] = useIsRejectedOrApprovedMutation();

    const onIsRejectedOrApproved = (id) => {

        isRejectedOrApproved({ data: id })
            .unwrap()
            .then((payload) => {
                console.log("Payload-->", payload);
                if (payload.status) {
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
    }

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
                </div>
                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
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
                                    <td>{data?.email}</td>
                                    <td>{data?.address}</td>
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

        </Row >
    )
}

export default Users;