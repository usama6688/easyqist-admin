import React, { useEffect, useState } from 'react';
import { Button, Col, Input, Row, Table } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { useDeleteRequestedProductMutation, useRequestedProductsQuery } from '../../services/Api';
import DeleteModal from '../../components/DeleteModal';
import PATHS from '../../routes/Paths';
import { useSelector } from 'react-redux';
import moment from 'moment/moment';

const RequestedProducts = () => {

    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [itemId, setItemId] = useState("");
    const navigate = useNavigate();
    const auth = useSelector((data) => data?.auth);

    const {
        data: requestedProducts,
        refetch: requestedProductsRefetch,
    } = useRequestedProductsQuery();

    const [deleteRequestedProduct, { isLoading }] = useDeleteRequestedProductMutation();

    const onDeleteProduct = (id) => {
        deleteRequestedProduct({ data: id })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    requestedProductsRefetch();
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
        requestedProductsRefetch();
    }, []);

    const localSearchTableFunction = (value) => {
        const input = document.getElementById("localSearchInput");
        const filter = input.value.toUpperCase();
        var length = document.getElementsByClassName("mainDiv").length;

        for (var i = 0; i < length; i++) {
            if (
                document
                    .getElementsByClassName("mainDiv")
                [i].innerHTML.toUpperCase()
                    .indexOf(filter) > -1
            ) {
                document.getElementsByClassName("mainDiv")[i].style.display = "table-row";
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
                        placeholder="Search.."
                        type="search"
                        onChange={(e) => localSearchTableFunction(e.target.value)}
                    />
                </div>

                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Address</th>
                            <th>Created At</th>
                            {auth?.userDetail?.type == 3 ? null :
                                <th>Actions</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {requestedProducts?.data?.map((data, index) => {
                            return (
                                <tr className="border-top mainDiv" key={index}>
                                    <td>
                                        <h6 className="mb-0">{data?.description}</h6>
                                    </td>
                                    <td>
                                        <h6 className="mb-0">{data?.address}</h6>
                                    </td>
                                    <td>
                                        <h6 className="mb-0">{moment(data?.created_at).format("DD-MM-YYYY")}</h6>
                                    </td>
                                    {auth?.userDetail?.type == 3 ? null :
                                        <td>
                                            <div className='d-flex align-items-center'>
                                                <Button
                                                    className='me-3'
                                                    onClick={() => { navigate(PATHS.viewRequestedProduct, { state: { data: data } }); window.location.reload(); }}
                                                >View</Button>

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
                        }).reverse()}
                    </tbody>
                </Table>
                {/* )
                })} */}
            </Col>

            {deleteItemModal &&
                <DeleteModal
                    handleCloseDeletModal={DeleteModalHandler}
                    action={onDeleteProduct}
                    id={itemId}
                    loading={isLoading}
                    confirmationMessage="Are you sure you want to delete the product?"
                />
            }

        </Row>
    )
}

export default RequestedProducts;