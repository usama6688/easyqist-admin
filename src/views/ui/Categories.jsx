import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteCategoryMutation, useGetProductCatQuery } from '../../services/Api';
import DeleteModal from '../../components/DeleteModal';
import PATHS from '../../routes/Paths';
import { useSelector } from 'react-redux';

const Categories = () => {

    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [itemId, setItemId] = useState("");
    const navigate = useNavigate();
    const auth = useSelector((data) => data?.auth);

    const {
        data: getProductCat,
        refetch: getProductCatRefetch,
    } = useGetProductCatQuery();

    const [deleteCategory, { isLoading }] = useDeleteCategoryMutation();

    const onDeletecategory = (id) => {
        deleteCategory({ data: id })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    getProductCatRefetch();
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
        getProductCatRefetch();
    }, []);

    return (
        <Row>
            <Col lg="12">
                {auth?.userDetail?.type == 3 ? null :
                    <div className='text-end'>
                        <a href={PATHS.addCategory}>
                            <Button>Add Category</Button>
                        </a>
                    </div>
                }

                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                        <tr>
                            <th>Thumbnail</th>
                            <th>Name</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {getProductCat?.data?.map((item, index) => {
                            return (
                                <tr className="border-top" key={index}>
                                    <td>
                                        <div className="d-flex align-items-center p-2">
                                            <img
                                                src={item.category_image}
                                                className="rounded-circle"
                                                alt="avatar"
                                                width="45"
                                                height="45"
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <h6 className="mb-0">{item.name}</h6>
                                    </td>
                                    <td>
                                        {auth?.userDetail?.type == 3 ? null :
                                            <div className='text-end'>
                                                <Button style={{ marginRight: 5 }} onClick={() => { navigate(PATHS.editCategory, { state: { data: item } }); window.location.reload(); }}>Edit</Button>
                                                {auth?.userDetail?.type == 1 ?
                                                    <Button onClick={
                                                        () => {
                                                            DeleteModalHandler(item)
                                                        }
                                                    }>Delete</Button>
                                                    : null}
                                            </div>
                                        }
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
                    action={onDeletecategory}
                    id={itemId}
                    confirmationMessage="Are you sure you want to delete the item?"
                />
            }

        </Row>
    )
}

export default Categories;