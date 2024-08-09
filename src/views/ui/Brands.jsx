import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteBrandMutation, useGetBrandsQuery } from '../../services/Api';
import DeleteModal from '../../components/DeleteModal';
import PATHS from '../../routes/Paths';
import { useSelector } from 'react-redux';

const Brands = () => {

    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [itemId, setItemId] = useState("");
    const navigate = useNavigate();
    const auth = useSelector((data) => data?.auth);

    const {
        data: getBrands,
        refetch: getBrandtCatRefetch,
    } = useGetBrandsQuery({ params: { category_id: "" } });

    //DeletBrand
    const [deleteBrand, { isLoading }] = useDeleteBrandMutation();

    const onDeleteBrand = (id) => {
        deleteBrand({ data: id })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    getBrandtCatRefetch();
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
        getBrandtCatRefetch()
    }, []);

    return (
        <Row>
            <Col lg="12">
                <div className='text-end'>
                    <a href={PATHS.addBrands}>
                        <Button>Add Brand</Button>
                    </a>
                </div>

                {getBrands?.data?.map((item, index) => {
                    return (
                        <Table key={index} className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                                <tr>
                                    <th>Thumbnail</th>
                                    <th>Name</th>
                                    <th></th>
                                    {/* <th>Status</th> */}
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-top">
                                    <td>
                                        <div className="d-flex align-items-center p-2">
                                            <img
                                                src={item?.brand_image}
                                                className="rounded-circle"
                                                alt="avatar"
                                                width="45"
                                                height="45"
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <h6 className="mb-0">{item?.brand_name}</h6>
                                    </td>
                                    <td>
                                        <div className='text-end'>
                                            <Button style={{ marginRight: 5 }} onClick={() => { navigate(PATHS.editBrand, { state: { data: item } }); window.location.reload(); }}>Edit</Button>
                                            {auth?.userDetail?.type == 1 ?
                                                <Button onClick={
                                                    () => {
                                                        DeleteModalHandler(item)
                                                    }
                                                }>Delete</Button>
                                                : null}
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    )
                })}

                {deleteItemModal &&
                    <DeleteModal
                        handleCloseDeletModal={DeleteModalHandler}
                        action={onDeleteBrand}
                        id={itemId}
                        confirmationMessage="Are you sure you want to delete the item?"
                    />
                }

            </Col>

        </Row>
    )
}

export default Brands;