// import React from 'react';
import React, { useEffect, useState } from "react";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { useEditCategoryMutation, useGetBrandsQuery } from '../../services/Api';
import { useLocation, useNavigate } from "react-router-dom";
import Select from "react-select";
import ImageViewer from "../../components/ImageViewer";
import uploadIcon from "../../assets/images/uploadImg.svg";
import PATHS from "../../routes/Paths";

const EditCategories = () => {
    const [name, setName] = useState("");
    const [showThumbnail, setShowThumbnail] = useState([]);

    const navigate = useNavigate();
    const location = useLocation();
    const [editCategory, { isLoading }] = useEditCategoryMutation();

    const catData = location?.state?.data;

    const {
        data: getBrands,
    } = useGetBrandsQuery({ params: {} });

    const modifiedBrands = getBrands?.data?.map(product => ({
        label: product?.brand_name,
        value: product?.id
    }));

    const brandIdsArray = catData?.brand_ids?.split(',').map(Number);

    const selectedBrands = modifiedBrands?.filter(brand => brandIdsArray?.includes(brand?.value));

    const [selectedOptions, setSelectedOptions] = useState(selectedBrands);

    const handleSelect = (data) => {
        setSelectedOptions(data);
    };

    const productIds = selectedOptions?.map(item => item?.value);
    const productIdsString = productIds?.join(',');

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

    const onEditCategory = () => {

        let formData = new FormData();

        formData.append('name', name);
        formData.append('id', catData?.id);
        formData.append('brand_ids', productIdsString);
        if (showThumbnail[0]) {
            formData.append('category_image', showThumbnail[0]);
        }

        editCategory({ data: formData })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    navigate(PATHS.categories);
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    useEffect(() => {
        setName(catData?.name);
    }, []);

    return (
        <div>
            <Form>
                <FormGroup>
                    <Label for="exampleEmail">Category Name</Label>
                    <Input
                        name="name"
                        placeholder="Name"
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleSelect">Select Brands</Label>
                    <Select
                        options={modifiedBrands}
                        placeholder="Select brands"
                        value={selectedOptions}
                        onChange={handleSelect}
                        isSearchable={true}
                        isMulti
                    />
                </FormGroup>

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
                                    src={catData?.category_image}
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

                <Button onClick={onEditCategory} className="mt-2">Update</Button>
            </Form>
        </div>
    )
}

export default EditCategories;