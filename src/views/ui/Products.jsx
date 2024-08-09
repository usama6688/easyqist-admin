import React, { useEffect, useState } from 'react';
import { Button, Col, Row, Table, FormGroup, Input } from 'reactstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useDeleteProductMutation, useGetBrandsQuery, useGetProductCatQuery, useGetProductsQuery } from '../../services/Api';
import PATHS from '../../routes/Paths';
import DeleteModal from '../../components/DeleteModal';
import { useSelector } from 'react-redux';

const Products = () => {

    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedBrand, setSelectedBrand] = useState('');
    const [itemId, setItemId] = useState("");
    const navigator = useNavigate();
    const auth = useSelector((data) => data?.auth);

    const {
        data: getProducts,
        isLoading: getProductsLoading,
        refetch: getProductsRefetch,
    } = useGetProductsQuery({ params: { start: 0, limit: 100000 } });

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

    const [deleteProduct] = useDeleteProductMutation();

    const DeleteModalHandler = (data) => {
        setItemId(data);
        setDeleteItemModal((prev) => !prev);
    };

    const ondeleteProduct = (id) => {
        deleteProduct({ data: id })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    DeleteModalHandler();
                    getProductsRefetch();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const filteredDataInput = getProducts?.data?.filter(item => {
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
        getProductsRefetch();
        getProductCatRefetch();
        getBrandRefetch();
    }, []);

    useEffect(() => {
        if(!selectedCategory){
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
                    <Col lg="3">
                        <div className='text-end'>
                            <a href={PATHS.addProduct}>
                                <Button>Add Product</Button>
                            </a>
                        </div>
                    </Col>
                </Row>

                {filteredData?.length ? filteredData?.map((item) => {
                    return (
                        <Table className="no-wrap mt-3 align-middle" responsive borderless>
                            <thead>
                                <tr>
                                    <th>Thumbnail</th>
                                    <th>Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-top mainDiv">
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
                                    <td>
                                        <Button
                                            onClick={() => { navigator(PATHS.viewProduct, { state: { id: item?.id } }); window.location.reload(); }}
                                        >View</Button>
                                        <Button
                                            style={{ backgroundColor: "orange", marginLeft: 10 }}
                                            onClick={() => { navigator(PATHS.editProduct, { state: { id: item?.id } }); window.location.reload(); }}
                                        >Edit</Button>
                                        {auth?.userDetail?.type == 1 ?
                                            <Button
                                                style={{ backgroundColor: "red", marginLeft: 10 }}
                                                onClick={() => {
                                                    DeleteModalHandler(item?.id)
                                                }}
                                            >Delete</Button>
                                            : null}
                                        {item?.status == 0 ?
                                            <Button
                                                style={{ backgroundColor: "green", marginLeft: 10 }}
                                                onClick={() => {
                                                    // onDeleteBrand(item?.id)
                                                }}
                                            >Deactivate</Button>
                                            :
                                            <Button
                                                style={{ backgroundColor: "green", marginLeft: 10 }}
                                                onClick={() => {
                                                    // onDeleteBrand(item?.id)
                                                }}
                                            >Activate</Button>}
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    )
                }).reverse() : <> {getProductsLoading ? <td colSpan={5}>
                    <h6 className='text-center'>Loading...</h6>
                </td> : <td colSpan={5}><h6 className='text-center'>No Record Found</h6></td>
                }</>}
            </Col >


            {deleteItemModal &&
                <DeleteModal
                    handleCloseDeletModal={DeleteModalHandler}
                    action={ondeleteProduct}
                    id={itemId}
                    confirmationMessage="Are you sure you want to delete the item?"
                />
            }

        </Row >
    )
}

export default Products;