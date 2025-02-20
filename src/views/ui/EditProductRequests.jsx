import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table, FormGroup, Input } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteProductMutation, useGetBrandsQuery, useGetProductCatQuery, useGetEditProductRequestsQuery, useApproveProductRequestMutation } from '../../services/Api';
import PATHS from '../../routes/Paths';
import DeleteModal from '../../components/DeleteModal';
import { useSelector } from 'react-redux';

const EditProductRequests = () => {

    // const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    // const [itemId, setItemId] = useState("");
    // const navigator = useNavigate();
    const auth = useSelector((data) => data?.auth);

    const {
        data: getEditProductRequests,
        isLoading: getEditProductRequestsLoading,
        refetch: getEditProductRequestsRefetch,
    } = useGetEditProductRequestsQuery({ params: { start: 0, limit: 100000 } });

    const {
        data: getProductCat,
        refetch: getProductCatRefetch,
    } = useGetProductCatQuery();

    const {
        data: getBrands,
        refetch: getBrandRefetch,
    } = useGetBrandsQuery({ params: { category_id: selectedCategory } });

    const { data: categories } = getProductCat || {};
    const { data: brands } = getBrands || {};

    // const [deleteProduct] = useDeleteProductMutation();
    const [approveProductRequest] = useApproveProductRequestMutation();

    // const DeleteModalHandler = (data) => {
    //     setItemId(data);
    //     setDeleteItemModal((prev) => !prev);
    // };

    // const ondeleteProduct = (id) => {
    //     deleteProduct({ data: id })
    //         .unwrap()
    //         .then((payload) => {
    //             if (payload.status) {
    //                 DeleteModalHandler();
    //                 getEditProductRequestsRefetch();
    //             }
    //         })
    //         .catch((error) => {
    //             console.log("error", error);
    //         });
    // };

    const onApproveProduct = (id) => {

        const data = {
            status: "approved",
            id: id,
        };

        approveProductRequest({ data: data })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    getEditProductRequestsRefetch();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const filteredNullData = getEditProductRequests?.data?.filter(data => data !== null);

    const filteredDataInput = filteredNullData?.filter(item => {
        return (
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    const filteredData = filteredDataInput?.filter(item => {
        return (
            (selectedBrand ? item.brand_id == selectedBrand : true)
        );
    });

    useEffect(() => {
        getEditProductRequestsRefetch();
        getProductCatRefetch();
        getBrandRefetch();
    }, []);

    useEffect(() => {
        if (!selectedCategory) {
            setSelectedBrand("");
        }
    }, [selectedCategory]);

    return (
        <Row>
            <Col lg="12">
                <Row>
                    <Col lg="3">
                        <FormGroup>
                            <Input type="search" placeholder='Search product' value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                        </FormGroup>
                    </Col>
                    <Col lg="3">
                        <FormGroup>
                            <Input type="select" value={selectedCategory} onChange={(e) => { setSelectedCategory(e.target.value); setSearchQuery("") }}>
                                <option value="">Select Category</option>
                                {categories?.map(category => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col lg="3">
                        <FormGroup>
                            <Input type="select" value={selectedBrand} onChange={(e) => setSelectedBrand(e.target.value)} disabled={!selectedCategory}>
                                <option value="">Select Brand</option>
                                {brands?.map(brand => (
                                    <option key={brand.id} value={brand.id}>{brand.brand_name}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                        <tr>
                            <th>Thumbnail</th>
                            <th>Name</th>
                            {auth?.userDetail?.type == 3 ? null :
                                <th>Actions</th>
                            }
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData?.length ? filteredData?.map((item, index) => {
                            return (
                                <tr className="border-top mainDiv" key={index}>
                                    <td>
                                        <div className="d-flex align-items-center p-2">
                                            <img
                                                src={item.thumbnail}
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
                                    {auth?.userDetail?.type == 3 ? null :
                                        <td>
                                            <div className='d-flex align-items-center'>
                                                {/* <Button
                                                    onClick={() => { navigator(PATHS.viewProductRequest, { state: { id: item?.edit_id } }); window.location.reload(); }}
                                                >View</Button> */}
                                                {/* <Button
                                                    style={{ backgroundColor: "orange", marginLeft: 10 }}
                                                    onClick={() => { navigator(PATHS.editProduct, { state: { id: item?.id } }); window.location.reload(); }}
                                                >Edit</Button> */}
                                                {item?.edit_status == "approved" ?
                                                    <Button
                                                        style={{ backgroundColor: "green", marginLeft: 10, cursor: "unset" }}
                                                    >Approved</Button>
                                                    :
                                                    <Button
                                                        style={{ backgroundColor: "orange", marginLeft: 10 }}
                                                        onClick={() => {
                                                            onApproveProduct(item?.edit_id)
                                                        }}
                                                    >Approve</Button>
                                                }
                                            </div>
                                        </td>
                                    }
                                </tr>
                            )
                        }).reverse() : <> {getEditProductRequestsLoading ? <td colSpan={5}>
                            <h6 className='text-center'>Loading...</h6>
                        </td> : <td colSpan={5}><h6 className='text-center'>No Record Found</h6></td>
                        }</>}
                    </tbody>
                </Table>
            </Col >


            {/* {deleteItemModal &&
                <DeleteModal
                    handleCloseDeletModal={DeleteModalHandler}
                    action={ondeleteProduct}
                    id={itemId}
                    confirmationMessage="Are you sure you want to delete the item?"
                />
            } */}

        </Row >
    )
}

export default EditProductRequests;