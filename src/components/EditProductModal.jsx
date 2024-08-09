import React, { useEffect, useState } from "react";
import ModalComponent from "./modalSetup/Modal";
import { Modal } from "react-bootstrap";
import { Button, FormGroup, Input, Label } from "reactstrap";
import ImageViewer from "./ImageViewer";
import uploadIcon from "../assets/images/uploadImg.svg";
import { useAddThumbnailMutation, useGetBrandsQuery, useGetProductCatQuery } from "../services/Api";

const EditProductModal = (props) => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [advance, setAdvance] = useState("");
    const [description, setDescription] = useState("");
    const [detailDescription, setDetailDescription] = useState("");
    const [special, setSpecial] = useState(0);
    const [trending, setTrending] = useState(0);
    const [discount, setDiscount] = useState("");
    const [selectedCategoryId, setSelectedCategoryId] = useState(null);
    const [selectedBrandId, setSelectedBrandId] = useState(null);
    const [showThumbnail, setShowThumbnail] = useState([]);
    const [addThumbnailApi, setAddThumbnailApi] = useState("");

    const {
        data: getProductCat,
        isLoading: getProductCatLoading,
        refetch: getProductCatRefetch,
    } = useGetProductCatQuery();

    const {
        data: getBrands,
        isLoading: getBrandLoading,
        refetch: getBrandRefetch,
    } = useGetBrandsQuery({ params: { category_id: "" } });

    const [addThumbnail, { isLoading: addThumbnailLoading }] = useAddThumbnailMutation();

    const { data: categories } = getProductCat || {};
    const { data: brands } = getBrands || {};

    const handleSpecial = (e) => {
        const value = e.target.value;

        if (/^[01]?$/.test(value)) {
            setSpecial(value);
        }
    };

    const handleTrending = (e) => {
        const value = e.target.value;

        if (/^[01]?$/.test(value)) {
            setTrending(value);
        }
    };

    const handleCatChange = (e) => {
        const selectedId = e.target.value;
        setSelectedCategoryId(selectedId);
    };

    const handleBrandChange = (e) => {
        const selectedId = e.target.value;
        setSelectedBrandId(selectedId);
    };

    const addThumbnailHandler = (data) => {

        let formData = new FormData();

        formData.append('thumbnail', data[0]);

        addThumbnail({ data: formData })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    setAddThumbnailApi(payload?.data);
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const handleThumbnail = (e) => {
        const maxImages = 1;

        const imagesMap = Object.entries(e.target.files).map((images) => {
            return (images[1])
        });

        const previousImages = [...showThumbnail];

        const combinedImages = [...previousImages, ...imagesMap];

        if (combinedImages.length > maxImages) {
            alert("Please select up to 1 images only.");
            return;
        }

        setShowThumbnail(combinedImages);

        addThumbnailHandler(combinedImages);
    };

    const removeThumbnail = (image) => {
        let filteredData = [];
        if (image.id) {
            filteredData = showThumbnail.filter((i) =>
                i.hasOwnProperty("id") ? i.id !== image.id : true
            );
        } else {
            filteredData = showThumbnail.filter((i) => i.name !== image.name);
        }
        setShowThumbnail([...filteredData]);
    };

    const onEditProduct = () => {

        let formData = new URLSearchParams();

        formData.append('name', name);
        formData.append('description', description);
        formData.append('detail_description', detailDescription);
        formData.append('special', special);
        formData.append('trending', trending);
        formData.append('category_id', Number(props?.data?.category_id || selectedCategoryId));
        formData.append('brand_id', Number(props?.data?.brand_id || selectedBrandId));
        formData.append('discount', Number(discount));
        formData.append('price', price);
        formData.append('advance', advance);
        formData.append('discount_type', '%');
        formData.append('status', 1);
        formData.append('installment', 1);
        formData.append('thumbnailimage', addThumbnailApi);
        formData.append('id', props?.data?.id);

        props?.action(formData);
    };

    useEffect(() => {
        if (props?.data) {
            setName(props?.data?.name);
            setPrice(props?.data?.price);
            setAdvance(props?.data?.advance);
            setDescription(props?.data?.description);
            setDetailDescription(props?.data?.detail_description);
            setSpecial(props?.data?.special);
            setTrending(props?.data?.trending);
            setDiscount(props?.data?.discount);
        }
    }, [props?.data]);

    return (
        <ModalComponent
            size="md"
            show={true}
            handleClose={props?.handleCloseEditProductModal}
        >
            <Modal.Body className="overflow p-4">
                <FormGroup>
                    <Label for="exampleEmail">Product Name</Label>
                    <Input name="name" placeholder="Name" type="text" onChange={(e) => setName(e.target.value)} value={name} />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleEmail">Price</Label>
                    <Input placeholder="Price" type="number" onChange={(e) => setPrice(e.target.value)} value={price} />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleEmail">Advance</Label>
                    <Input placeholder="Advance" type="number" onChange={(e) => setAdvance(e.target.value)} value={advance} />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleText">Description</Label>
                    <Input id="exampleText" name="description" type="textarea" placeholder="Type..." onChange={(e) => setDescription(e.target.value)} value={description} />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleText">Detail Description</Label>
                    <Input id="exampleText" type="textarea" placeholder="Type..." onChange={(e) => setDetailDescription(e.target.value)} value={detailDescription} />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleText">Special</Label>
                    <Input
                        id="exampleText"
                        name="description"
                        type="number"
                        value={special}
                        onChange={handleSpecial}
                        pattern="[01]"
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleText">Trending</Label>
                    <Input
                        id="exampleText"
                        name="description"
                        type="number"
                        value={trending}
                        onChange={handleTrending}
                        pattern="[01]"
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleEmail">Discount</Label>
                    <Input name="name" placeholder="Type.." type="number" onChange={(e) => setDiscount(e.target.value)} value={discount} />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleSelect">Select Category</Label>
                    <Input id="exampleSelect" name="select" type="select" onChange={handleCatChange} value={selectedCategoryId}>
                        <option>{props?.data?.category_name}</option>
                        {categories?.map((item, index) => {
                            return <option key={index} value={item?.id}>{item?.name}</option>;
                        })}
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="exampleSelect">Select Brand</Label>
                    <Input id="exampleSelect" name="select" type="select" onChange={handleBrandChange} value={selectedBrandId}>
                        <option>{props?.data?.brand_name}</option>
                        {brands?.map((item, index) => {
                            return <option key={index} value={item?.id}>{item?.brand_name}</option>;
                        })}
                    </Input>
                </FormGroup>

                <FormGroup>
                    <Label for="exampleFile">Thumbnail</Label>

                    <div className='position-relative ms-5 mb-4'>
                        <div className="row">

                            {showThumbnail?.length < 6 ?
                                <div className="col-md-3">
                                    <img src={uploadIcon} alt="" height={100} width={100} />
                                    <input type="file" className='hiddenInputFile' name="image"
                                        accept="image/png, image/jpg, image/jpeg" onChange={handleThumbnail} style={{ top: "0", width: "100px" }} />
                                </div>
                                : ""}

                            {showThumbnail?.length > 0 ?
                                showThumbnail?.map((image) => (
                                    <div className="col-md-3 ms-5 position-relative">
                                        <ImageViewer
                                            src={image}
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = '';
                                            }}
                                            width="100px"
                                            height="100px"
                                        />

                                        <div
                                            className='removeImageIcon text-dark'
                                            onClick={() => removeThumbnail(image)}
                                        >X</div>
                                    </div>
                                ))
                                :
                                <div className="col-md-3 ms-5 position-relative">
                                    <ImageViewer
                                        src={props?.data?.thumbnail}
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = '';
                                        }}
                                        width="100px"
                                        height="100px"
                                    />
                                </div>
                            }
                        </div>
                    </div>
                </FormGroup>

                <div className="text-center">
                    <Button
                        className='mt-4 w-25'
                        onClick={onEditProduct}
                    >Update</Button>
                </div>
            </Modal.Body>
        </ModalComponent>
    );
};

export default EditProductModal;