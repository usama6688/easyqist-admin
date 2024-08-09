import React, { useState } from 'react';
import { Button, FormGroup, Input, Label } from 'reactstrap';
import ImageViewer from '../../components/ImageViewer';
import uploadIcon from "../../assets/images/uploadImg.svg";
import Select from "react-select";
import { useEditBannerMutation, useGetAllProductsQuery } from '../../services/Api';
import { useLocation, useNavigate } from 'react-router-dom';
import PATHS from '../../routes/Paths';

const EditBanner = () => {

    const [showThumbnail, setShowThumbnail] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();

    const {
        data: getAllProducts,
    } = useGetAllProductsQuery({ params: { start: 0, limit: 100000 } });

    const [editBanner] = useEditBannerMutation();

    const modifyProducts = getAllProducts?.data?.map(data => ({
        label: data?.name,
        value: data?.id
    }));

    const brandIdsArray = location?.state?.data?.productids?.split(',').map(Number);

    const selectedProducts = modifyProducts?.filter(data => brandIdsArray?.includes(data?.value));

    const [selectedOptions, setSelectedOptions] = useState(selectedProducts);

    // console.log("getAllProducts", getAllProducts);

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

    const modifiedProducts = getAllProducts?.data.map(product => ({
        label: product?.name,
        value: product?.id
    }));

    const handleSelect = (data) => {
        setSelectedOptions(data);
    };

    const productIds = selectedOptions?.map(item => item?.value);
    const productIdsString = productIds?.join(',');

    const editBannerHandler = () => {

        let formData = new FormData();

        formData.append('banner_image', showThumbnail[0]);
        formData.append('banner_link', "#");
        formData.append('productids', productIdsString);
        formData.append('id', location?.state?.data?.id);

        editBanner({ data: formData })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    navigate(PATHS.banners);
                    window.location.reload();
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

                        {showThumbnail?.length > 0 ?
                            showThumbnail?.map((image) => (
                                <div className="col-md-3 position-relative">
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
                            <div className="col-md-3 position-relative">
                                <ImageViewer
                                    src={location?.state?.data?.banner_image}
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
                        <Button className="mt-4 bg-primary" onClick={editBannerHandler}>Edit Banner</Button>
                    </div>
                </div>
            </FormGroup>
        </div>
    )
}

export default EditBanner;