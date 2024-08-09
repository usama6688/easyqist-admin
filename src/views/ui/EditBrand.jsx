import React, { useEffect, useState } from 'react';
import {
    Button,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import ImageViewer from '../../components/ImageViewer';
import uploadIcon from "../../assets/images/uploadImg.svg";
import { useEditBrandMutation } from '../../services/Api';
import PATHS from '../../routes/Paths';

const EditBrand = () => {

    const [name, setName] = useState("");
    const [showThumbnail, setShowThumbnail] = useState([]);
    const navigate = useNavigate();
    const location = useLocation();
    const [editBrand, { isLoading }] = useEditBrandMutation();

    const brandData = location?.state?.data;

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

    const onEditBrand = () => {

        let formData = new FormData();

        formData.append('name', name);
        formData.append('id', brandData?.id);

        if (showThumbnail[0]) {
            formData.append('brand_image', showThumbnail[0]);
        }

        editBrand({ data: formData })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    navigate(PATHS.brands);
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    useEffect(() => {
        setName(brandData?.brand_name);
    }, []);

    return (
        <div>
            <FormGroup>
                <Label for="exampleEmail">Brand Name</Label>
                <Input
                    name="name"
                    placeholder="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                        ))
                        :
                        <div className="col-md-3 mt-3 position-relative">
                            <ImageViewer
                                src={brandData?.brand_image}
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

            <Button className="mt-2" onClick={onEditBrand}>Update</Button>
        </div>
    )
}

export default EditBrand;