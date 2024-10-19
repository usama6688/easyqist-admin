import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useDeleteEmployeeMutation, useGetEmployeesQuery } from '../../services/Api';
import DeleteModal from '../../components/DeleteModal';
import PATHS from '../../routes/Paths';
import { useSelector } from 'react-redux';

const Employees = () => {

    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [itemId, setItemId] = useState("");
    const navigate = useNavigate();
    const auth = useSelector((data) => data?.auth);

    const {
        data: getEmployees,
        refetch: getEmployeesRefetch,
    } = useGetEmployeesQuery();

    const [deleteEmployee, { isLoading }] = useDeleteEmployeeMutation();

    const onDeletecategory = (id) => {
        deleteEmployee({ data: id })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    getEmployeesRefetch();
                    DeleteModalHandler();
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

    useEffect(() => {
        getEmployeesRefetch();
    }, []);

    return (
        <Row>
            <Col lg="12">
                {auth?.userDetail?.type == 3 ? null :
                    <div className='text-end'>
                        <a href={PATHS.addEmployee}>
                            <Button>Add Employee</Button>
                        </a>
                    </div>
                }

                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Reference Number</th>
                            {auth?.userDetail?.type == 3 ? null :
                                <th>Actions</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {getEmployees?.data?.map((data, index) => {
                            return (
                                <tr className="border-top" key={index}>
                                    <td>
                                        <h6 className="mb-0">{index + 1}</h6>
                                    </td>
                                    <td>
                                        <h6 className="mb-0">{data?.name}</h6>
                                    </td>
                                    <td>
                                        <h6 className="mb-0">{data?.email}</h6>
                                    </td>
                                    <td>
                                        <h6 className="mb-0">{data?.phone}</h6>
                                    </td>
                                    <td>
                                        <h6 className="mb-0">{data?.refno}</h6>
                                    </td>
                                    {auth?.userDetail?.type == 3 ? null :
                                        <td>
                                            <div>
                                                <Button style={{ marginRight: 5 }}
                                                    onClick={() => { navigate(PATHS.editEmployee, { state: { data: data } }); window.location.reload(); }}
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
                        })}
                    </tbody>
                </Table>
                {/* )
                })} */}
            </Col>

            {deleteItemModal &&
                <DeleteModal
                    handleCloseDeletModal={DeleteModalHandler}
                    action={onDeletecategory}
                    id={itemId}
                    loading={isLoading}
                    confirmationMessage="Are you sure you want to delete the employee?"
                />
            }

        </Row>
    )
}

export default Employees;