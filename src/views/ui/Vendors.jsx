import React, { useState } from 'react';
import { Col, Row, Table, Button, Input } from 'reactstrap';
import { useDeleteAdminMutation, useGetAllVendorsQuery } from '../../services/Api';
import PATHS from '../../routes/Paths';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../../components/DeleteModal';

const Vendors = () => {

    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [itemId, setItemId] = useState("");
    const navigate = useNavigate();

    const {
        data: getAllVendors,
        refetch: getAllVendorsRefetch,
    } = useGetAllVendorsQuery({ params: { start: 0, limit: 100000 } });

    const DeleteModalHandler = (data) => {
        setItemId(data?.id);
        setDeleteItemModal((prev) => !prev);
    };

    const [deleteAdmin] = useDeleteAdminMutation();

    const ondeleteAdmin = (id) => {
        deleteAdmin({ data: id })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    getAllVendorsRefetch();
                    window.location.reload();
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
                <div className='d-flex align-items-center justify-content-between'>
                    <Input
                        id='localSearchInput'
                        placeholder="Search"
                        type="search"
                        className='w-50'
                        onChange={(e) => localSearchTableFunction(e.target.value)}
                    />
                    <a href={PATHS.addVendors}>
                        <Button>Add Vendor</Button>
                    </a>
                </div>
                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Address 2</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getAllVendors?.data?.map((data) => {
                            return (
                                <tr className="border-top mainDiv">
                                    <td>{data?.name}</td>
                                    <td>{data?.phone_no}</td>
                                    <td>{data?.address}</td>
                                    <td>{data?.address2}</td>
                                    <td>
                                        {/* <div style={{ alignItems: "center" }}>
                                            <Button style={{ backgroundColor: "green" }} onClick={() => { navigate(PATHS.editAdmin, { state: { data: data } }); window.location.reload(); }}>Edit</Button>

                                            <Button
                                                style={{ backgroundColor: "red", marginLeft: 10 }}
                                                onClick={
                                                    () => {
                                                        DeleteModalHandler(data)
                                                    }}
                                            >Delete</Button>
                                        </div> */}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Col>

            {deleteItemModal &&
                <DeleteModal
                    handleCloseDeletModal={DeleteModalHandler}
                    action={ondeleteAdmin}
                    id={itemId}
                    confirmationMessage="Are you sure you want to delete the admin?"
                />
            }
        </Row >
    )
}

export default Vendors;