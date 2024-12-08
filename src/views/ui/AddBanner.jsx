import React, { useState } from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import ImageViewer from '../../components/ImageViewer';
import uploadIcon from "../../assets/images/uploadImg.svg";
import Select from "react-select";
import { useAddBannerMutation, useGetAllProductsQuery } from '../../services/Api';
import { useNavigate } from 'react-router-dom';
import PATHS from '../../routes/Paths';

const AddBanner = () => {

    const [showThumbnail, setShowThumbnail] = useState([]);
    const [showMobThumbnail, setShowMobThumbnail] = useState([]);
    const [selectedOptions, setSelectedOptions] = useState();
    const navigate = useNavigate();

    const {
        data: getAllProducts,
    } = useGetAllProductsQuery({ params: { start: 0, limit: 100000 } });

    const [addBanner, { isLoading }] = useAddBannerMutation();

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
    };

    const handleMobThumbnail = (e) => {
        const maxImages = 1;

        const imagesMap = Object.entries(e.target.files).map((images) => {
            return (images[1])
        });

        const previousImages = [...showMobThumbnail];

        const combinedImages = [...previousImages, ...imagesMap];

        if (combinedImages.length > maxImages) {
            alert("Please select up to 1 images only.");
            return;
        }

        setShowMobThumbnail(combinedImages);
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

    const removeMobThumbnail = (image) => {
        let filteredData = [];
        if (image.id) {
            filteredData = showMobThumbnail.filter((i) =>
                i.hasOwnProperty("id") ? i.id !== image.id : true
            );
        } else {
            filteredData = showMobThumbnail.filter((i) => i.name !== image.name);
        }
        setShowMobThumbnail([...filteredData]);
    };

    const modifiedProducts = getAllProducts?.data.map(product => ({
        label: product?.name,
        value: product?.id
    }));

    const handleSelect = (data) => {
        setSelectedOptions(data);
    };

    const productIds = selectedOptions?.map(item => item?.value);
    const productIdsString = productIds?.join(',');

    const addBannerHandler = () => {

        let formData = new FormData();

        formData.append('banner_image', showThumbnail[0]);
        formData.append('mobile_banner', showMobThumbnail[0]);
        formData.append('banner_link', "#");
        formData.append('productids', productIdsString);

        addBanner({ data: formData })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    navigate(PATHS.banners);
                    window.location.reload();
                    console.log("success");
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    return (
        <div>
            <FormGroup>
                <Label for="exampleFile">Thumbnail</Label>

                <div className='position-relative ms-5 mb-4'>
                    <div className="row">
                        {showThumbnail?.length < 6 ?
                            <div className="col-md-3">
                                <img src={uploadIcon} alt="" height={100} width={100} />
                                <input type="file" className='hiddenInputFile' name="image"
                                    accept="image/png, image/jpg, image/jpeg" onChange={handleThumbnail} />
                            </div>
                            : ""}

                        {showThumbnail?.length > 0 &&
                            showThumbnail?.map((image) => (
                                <div className="col-md-3 mt-3 position-relative">
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
                            ))}
                    </div>
                </div>

                <Label for="exampleFile">Mobile Thumbnail</Label>

                <div className='position-relative ms-5 mb-4'>
                    <div className="row">
                        {showMobThumbnail?.length < 6 ?
                            <div className="col-md-3">
                                <img src={uploadIcon} alt="" height={100} width={100} />
                                <input type="file" className='hiddenInputFile' name="image"
                                    accept="image/png, image/jpg, image/jpeg" onChange={handleMobThumbnail} />
                            </div>
                            : ""}

                        {showMobThumbnail?.length > 0 &&
                            showMobThumbnail?.map((image) => (
                                <div className="col-md-3 mt-3 position-relative">
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
                                        onClick={() => removeMobThumbnail(image)}
                                    >X</div>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="row">
                    <div className="col-6">
                        <FormGroup>
                            <Label for="exampleEmail">Product Name</Label>
                            <Select
                                options={modifiedProducts}
                                placeholder="Select product"
                                value={selectedOptions}
                                onChange={handleSelect}
                                isSearchable={true}
                                isMulti
                            />
                        </FormGroup>
                    </div>

                    <div className="col-12">
                        <Button className="mt-4 bg-primary" onClick={addBannerHandler}>Add Banner</Button>
                    </div>
                </div>
            </FormGroup>
        </div>
    )
}

export default AddBanner;