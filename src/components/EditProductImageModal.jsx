import React, { useState } from "react";
import ModalComponent from "./modalSetup/Modal";
import { Modal } from "react-bootstrap";
import { Button, FormGroup, Label } from "reactstrap";
import ImageViewer from "./ImageViewer";
import uploadIcon from "../assets/images/uploadImg.svg";
import { useAddProductImageMutation } from "../services/Api";

const EditProductImageModal = (props) => {

    const [showImage, setShowImage] = useState([]);
    const [addImageApi, setAddImageApi] = useState("");

    const [addProductImage, { isLoading: addProductImageLoading }] = useAddProductImageMutation();

    const addImageHandler = (data) => {

        let formData = new FormData();

        formData.append('product_image', data[0]);

        addProductImage({ data: formData })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    setAddImageApi(payload?.data);
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const handleImage = (e) => {
        const maxImages = 1;

        const imagesMap = Object.entries(e.target.files).map((images) => {
            return (images[1])
        });

        const previousImages = [...showImage];

        const combinedImages = [...previousImages, ...imagesMap];

        if (combinedImages.length > maxImages) {
            alert("Please select up to 1 images only.");
            return;
        }

        setShowImage(combinedImages);

        addImageHandler(combinedImages);
    };

    const removeImage = (image) => {
        let filteredData = [];
        if (image.id) {
            filteredData = showImage.filter((i) =>
                i.hasOwnProperty("id") ? i.id !== image.id : true
            );
        } else {
            filteredData = showImage.filter((i) => i.name !== image.name);
        }
        setShowImage([...filteredData]);
    };

    const onEditProductImage = () => {

        let formData = new URLSearchParams();

        formData.append('product_id', props?.data?.product_id);
        formData.append('id', props?.data?.id);
        formData.append('productimage', addImageApi);

        props?.action(formData);
    };

    return (
        <ModalComponent
            size="md"
            show={true}
            handleClose={props?.handleCloseEditProductImageModal}
        >
            <Modal.Body className="overflow p-4">
                <FormGroup>
                    <Label for="exampleFile">Image(s)</Label>

                    <div className='position-relative ms-5 mb-4'>
                        <div className="row">

                            {showImage?.length < 6 ?
                                <div className="col-md-3">
                                    <img src={uploadIcon} alt="" height={100} width={100} />
                                    <input type="file" className='hiddenInputFile' name="image"
                                        accept="image/png, image/jpg, image/jpeg" onChange={handleImage} style={{ top: "0", width: "100px" }} />
                                </div>
                                : ""}

                            {showImage?.length > 0 ?
                                showImage?.map((image) => (
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
                                            onClick={() => removeImage(image)}
                                        >X</div>
                                    </div>
                                ))
                                :
                                <div className="col-md-3 ms-5 position-relative">
                                    <ImageViewer
                                        src={props?.data?.image_name}
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
                        onClick={onEditProductImage}
                    >Update</Button>
                </div>
            </Modal.Body>
        </ModalComponent>
    );
};

export default EditProductImageModal;