import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { useAddProductImageMutation, useAddProductImagesMutation, useAddProductInstallmentMutation, useAddProductTypeMutation, useDeletePlanMutation, useDeleteProductImageMutation, useDeleteTypeMutation, useEditProductImagesMutation, useEditProductInstallmentMutation, useEditProductMutation, useEditProductTypeMutation, useViewProductDetailQuery } from "../../services/Api";
import ImageViewer from "../../components/ImageViewer";
import { useLocation, useNavigate } from "react-router-dom";
import EditProductModal from "../../components/EditProductModal";
import PATHS from "../../routes/Paths";
import uploadIcon from "../../assets/images/uploadImg.svg";
import EditProductImageModal from "../../components/EditProductImageModal";
import AddProductTypeModal from "../../components/AddProductTypeModal";
import EditProductTypeModal from "../../components/EditProductTypeModal";
import EditProductInstalmentModal from "../../components/EditProductInstalmentModal";
import AddProductInstalmentModal from "../../components/AddProductInstalmentModal";
import DeleteModal from "../../components/DeleteModal";

const EditProduct = () => {

  const [showShopImages, setShowShopImages] = useState([]);
  const [editProductModal, setEditProductModal] = useState(false);
  const [editProductImageModal, setEditProductImageModal] = useState(false);
  const [editProductImageData, setEditProductImageData] = useState("");
  const [addType, setAddType] = useState(false);
  const [editType, setEditType] = useState(false);
  const [editTypeData, setEditTypeData] = useState("");
  const [editInstallment, setEditInstallment] = useState(false);
  const [addInstallment, setAddInstallment] = useState(false);
  const [installmentData, setInstallmentData] = useState("");
  const [deleteItemModal, setDeleteItemModal] = useState(false);
  const [deleteTypeModal, setDeleteTypeModal] = useState(false);
  const [deletePlanModal, setDeletePlanModal] = useState(false);
  const [itemId, setItemId] = useState("");
  const location = useLocation();
  const navigator = useNavigate();

  const [deleteProductImage] = useDeleteProductImageMutation();

  const DeleteModalHandler = (data) => {
    setItemId(data);
    setDeleteItemModal((prev) => !prev);
  };

  const DeleteTypeModalHandler = (data) => {
    setItemId(data);
    setDeleteTypeModal((prev) => !prev);
  };

  const DeletePlanModalHandler = (data) => {
    setItemId(data);
    setDeletePlanModal((prev) => !prev);
  };

  const editProductModalHandler = () => {
    setEditProductModal((prev) => !prev);
  };

  const editProductImageModalHandler = (data) => {
    setEditProductImageData(data);
    setEditProductImageModal((prev) => !prev);
  };

  const addTypeModalHandler = () => {
    setAddType((prev) => !prev);
  };

  const editTypeModalHandler = (data) => {
    setEditType((prev) => !prev);
    setEditTypeData(data);
  };

  const editInstallmentModalHandler = (data) => {
    setEditInstallment((prev) => !prev);
    setInstallmentData(data);
  };

  const addInstallmentModalHandler = (data) => {
    setAddInstallment((prev) => !prev);
    setInstallmentData(data);
  };

  const [editProduct, { isLoading }] = useEditProductMutation();
  const [addProductImage, { isLoading: addProductImageLoading }] = useAddProductImageMutation();
  const [editProductImages, { isLoading: editProductImagesLoading }] = useEditProductImagesMutation();
  const [addProductImages, { isLoading: addProductImagesLoading }] = useAddProductImagesMutation();


  const [addProductType, { isLoading: addProductTypeLoading }] = useAddProductTypeMutation();
  const [editProductType, { isLoading: editProductTypeLoading }] = useEditProductTypeMutation();
  const [addProductInstallment, { isLoading: addProductInstallmentLoading }] = useAddProductInstallmentMutation();
  const [editProductInstallment, { isLoading: editProductInstallmentLoading }] = useEditProductInstallmentMutation();
  const [deleteType, { isLoading: deleteTypeLoading }] = useDeleteTypeMutation();
  const [deletePlan, { isLoading: deletePlanLoading }] = useDeletePlanMutation();


  const {
    data: viewProductDetail,
    refetch: viewProductDetailRefetch,
  } = useViewProductDetailQuery({ params: { product_id: location?.state?.id } });

  const onDeletePlan = (id) => {
    deletePlan({ data: id })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          DeletePlanModalHandler();
          viewProductDetailRefetch();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const onDeleteType = (id) => {
    deleteType({ data: id })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          DeleteTypeModalHandler();
          viewProductDetailRefetch();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const onDeleteImage = (id) => {
    deleteProductImage({ data: id })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          DeleteModalHandler();
          viewProductDetailRefetch();
          // navigator(PATHS.products);
          // window.location.reload();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const editProductApiHandler = (data) => {
    editProduct({ data: data })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          console.log("success");
          editProductModalHandler();
          viewProductDetailRefetch();
          // navigator(PATHS.editProduct);
          // window.location.reload();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const editProductImageApiHandler = (data) => {
    editProductImages({ data: data })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          console.log("success");
          viewProductDetailRefetch();
          editProductImageModalHandler();
          // navigator(PATHS.products);
          // window.location.reload();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const addProductImageHandler = (data) => {

    let formData = new URLSearchParams();

    formData.append('productimage', data);
    formData.append('product_id', location?.state?.id);

    addProductImages({ data: formData })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          viewProductDetailRefetch();
          // navigator(PATHS.products);
          // window.location.reload();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const addImageHandler = (data) => {

    let formData = new FormData();

    formData.append('product_image', data);

    addProductImage({ data: formData })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          addProductImageHandler(payload?.data);
          viewProductDetailRefetch();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const handleFileChange = (e) => {

    const newImages = [...showShopImages];

    for (let i = 0; i < e.target.files.length; i++) {
      newImages.push((e.target.files[i]));
    }

    setShowShopImages(newImages);
    addImageHandler(e.target.files[0]);
  };

  const removeShopImages = (image) => {
    let filteredData = [];
    if (image.id) {
      filteredData = showShopImages.filter((i) =>
        i.hasOwnProperty("id") ? i.id !== image.id : true
      );
    } else {
      filteredData = showShopImages.filter((i) => i.name !== image.name);
    }
    setShowShopImages([...filteredData]);
  };

  const addProductTypeHandler = (data) => {
    addProductType({ data: data })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          viewProductDetailRefetch();
          addTypeModalHandler();
          // navigator(PATHS.products);
          // window.location.reload();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const editProductTypeHandler = (data) => {
    editProductType({ data: data })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          viewProductDetailRefetch();
          editTypeModalHandler();
          // navigator(PATHS.products);
          // window.location.reload();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const editProductInstallmentHandler = (data) => {
    editProductInstallment({ data: data })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          viewProductDetailRefetch();
          editInstallmentModalHandler();
          // navigator(PATHS.products);
          // window.location.reload();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const addProductInstallmentHandler = (data) => {
    addProductInstallment({ data: data })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          viewProductDetailRefetch();
          addInstallmentModalHandler();
          // navigator(PATHS.products);
          // window.location.reload();
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  useEffect(() => {
    viewProductDetailRefetch();
  }, []);

  return (
    <div>
      <Form>
        <FormGroup>
          <Label for="exampleEmail">Product Name</Label>
          <Input type="text" value={viewProductDetail?.data?.name} readOnly />
        </FormGroup>

        <FormGroup>
          <Label for="exampleEmail">Price</Label>
          <Input placeholder="Price" type="number" value={viewProductDetail?.data?.price} readOnly />
        </FormGroup>

        <FormGroup>
          <Label for="exampleEmail">Advance</Label>
          <Input placeholder="Advance" type="number" value={viewProductDetail?.data?.advance} readOnly />
        </FormGroup>

        <FormGroup>
          <Label for="exampleText">Description</Label>
          <Input id="exampleText" name="description" rows="8" type="textarea" value={viewProductDetail?.data?.description} readOnly />
        </FormGroup>

        <FormGroup>
          <Label for="exampleText">Detail Description</Label>
          <Input id="exampleText" type="textarea" rows="8" value={viewProductDetail?.data?.detail_description} readOnly />
        </FormGroup>

        <FormGroup>
          <Label for="exampleText">Special</Label>
          <Input
            id="exampleText"
            name="description"
            type="number"
            value={viewProductDetail?.data?.special}
            pattern="[01]"
            readOnly
          />
        </FormGroup>

        <FormGroup>
          <Label for="exampleText">Trending</Label>
          <Input
            id="exampleText"
            name="description"
            type="number"
            value={viewProductDetail?.data?.trending}
            pattern="[01]"
            readOnly
          />
        </FormGroup>

        <FormGroup>
          <Label for="exampleSelect">Select Category</Label>
          <Input id="exampleSelect" name="select" type="select" disabled>
            <option>{viewProductDetail?.data?.category_name}</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="exampleSelect">Select Brand</Label>
          <Input id="exampleSelect" name="select" type="select" disabled>
            <option>{viewProductDetail?.data?.brand_name}</option>
          </Input>
        </FormGroup>

        <FormGroup>
          <Label for="exampleEmail">Discount</Label>
          <Input value={viewProductDetail?.data?.discount} readOnly />
        </FormGroup>

        <FormGroup>
          <Label for="exampleFile">Thumbnail</Label>

          <div className='position-relative ms-5 mb-4'>
            <div className="row">
              <div className="col-md-3 mt-3 position-relative">
                <ImageViewer
                  src={viewProductDetail?.data?.thumbnail}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = '';
                  }}
                  width="100px"
                  height="100px"
                />
              </div>
            </div>
          </div>
        </FormGroup>

        <div className="text-center">
          <Button
            className='mt-4 w-25'
            onClick={editProductModalHandler}
          >Edit Product</Button>
        </div>

        <FormGroup>
          <Label for="exampleFile">Image(s)</Label>

          <div className='position-relative ms-5 mb-4'>
            <div className="row">

              {showShopImages?.length < 6 ?
                <div className="col-md-3">
                  <img src={uploadIcon} alt="" height={100} width={100} />
                  <input type="file" className='hiddenInputFile' name="image"
                    accept="image/png, image/jpg, image/jpeg" onChange={handleFileChange} />
                </div>
                : ""}

              {showShopImages?.length > 0 &&
                showShopImages?.map((image) => (
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
                      onClick={() => removeShopImages(image)}
                    >X</div>
                  </div>
                ))}
            </div>
          </div>
        </FormGroup>

        {viewProductDetail?.data?.product_image?.length ?
          <FormGroup>
            {/* <Label for="exampleFile">Image(s)</Label> */}

            <div className='position-relative ms-5 mb-4'>
              <div className="row">
                {viewProductDetail?.data?.product_image?.map((image) => (
                  <div className="col-md-3 mt-3 position-relative">
                    <div className="d-flex justify-content-end gap-3">
                      <span className="cursor" style={{ fontSize: "25px" }} onClick={() => editProductImageModalHandler(image)}>✎</span>

                      <span className="cursor" style={{ fontSize: "25px" }} onClick={() => DeleteModalHandler(image?.id)}>X</span>
                    </div>

                    <ImageViewer
                      src={image?.image_name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '';
                      }}
                      width="100px"
                      height="100px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </FormGroup>
          : null}

        <FormGroup>
          <div className="d-flex justify-content-between align-items-center">
            <Label for="exampleEmail">Product Types</Label>
            <Button
              className='mt-4'
              onClick={addTypeModalHandler}
            >Add Type</Button>
          </div>

          {viewProductDetail?.data?.product_type?.map((data, index) => {
            return (
              <>
                <div className="d-flex justify-content-between align-items-center">
                  <Label className="mb-0"><b>Type {index + 1}</b></Label>
                  <div className="d-flex align-items-center gap-3">
                    <Button
                      className='mt-4 mb-3 btn-danger'
                      onClick={() => DeleteTypeModalHandler(data?.id)}
                    >Delete Type</Button>

                    <Button
                      className='mt-4 mb-3'
                      onClick={() => editTypeModalHandler(data)}
                    >Edit Type</Button>

                    <Button
                      className='mt-4 mb-3'
                      onClick={() => addInstallmentModalHandler(data)}
                    >Add Plan</Button>
                  </div>
                </div>

                <Input className="mb-3" value={`Type Name: ${data?.title}`} readOnly />

                {data?.product_installment?.map((item, ind) => {
                  return (
                    <>
                      <div className="d-flex justify-content-between align-items-center">
                        <Label className="mb-0"><b>Plan {ind + 1}</b></Label>
                        <div className="d-flex align-items-center">
                          <Button
                            className='mt-4 mb-3 me-3 btn-danger'
                            onClick={() => DeletePlanModalHandler(item?.id)}
                          >Delete Plan</Button>

                          <Button
                            className='mt-4 mb-3'
                            onClick={() => editInstallmentModalHandler(item)}
                          >Edit Plan</Button>
                        </div>
                      </div>
                      <Input className="mb-3" value={`Title: ${item?.installment_title}`} readOnly />
                      <Input className="mb-3" value={`Advance: ${item?.advance}`} readOnly />
                      <Input className="mb-3" value={`Amount: ${item?.amount}`} readOnly />
                      <Input className="mb-3" value={`Month(s): ${item?.duration}`} readOnly />
                      <Input className="mb-3" value={`Total Amount: ${item?.total_amount}`} readOnly />
                    </>
                  )
                })}
              </>
            )
          })}
        </FormGroup>

        {deleteItemModal &&
          <DeleteModal
            handleCloseDeletModal={DeleteModalHandler}
            action={onDeleteImage}
            id={itemId}
            confirmationMessage="Are you sure you want to delete the item?"
          />
        }

        {deleteTypeModal &&
          <DeleteModal
            handleCloseDeletModal={DeleteTypeModalHandler}
            action={onDeleteType}
            id={itemId}
            confirmationMessage="Are you sure you want to delete the type?"
          />
        }

        {deletePlanModal &&
          <DeleteModal
            handleCloseDeletModal={DeletePlanModalHandler}
            action={onDeletePlan}
            id={itemId}
            confirmationMessage="Are you sure you want to delete the plan?"
          />
        }

        {editProductModal &&
          <EditProductModal
            handleCloseEditProductModal={editProductModalHandler}
            data={viewProductDetail?.data}
            action={editProductApiHandler}
          />
        }

        {addType &&
          <AddProductTypeModal
            handleCloseAddProductTypeModal={addTypeModalHandler}
            data={location?.state?.id}
            action={addProductTypeHandler}
          />
        }

        {editType &&
          <EditProductTypeModal
            handleCloseEditProductTypeModal={editTypeModalHandler}
            data={editTypeData}
            action={editProductTypeHandler}
          />
        }

        {editInstallment &&
          <EditProductInstalmentModal
            handleCloseEditInstallmentModal={editInstallmentModalHandler}
            data={installmentData}
            action={editProductInstallmentHandler}
          />
        }

        {addInstallment &&
          <AddProductInstalmentModal
            handleCloseAddInstalmentModal={addInstallmentModalHandler}
            data={installmentData}
            action={addProductInstallmentHandler}
          />
        }

        {editProductImageModal &&
          <EditProductImageModal
            handleCloseEditProductImageModal={editProductImageModalHandler}
            data={editProductImageData}
            action={editProductImageApiHandler}
          />
        }

      </Form>
    </div>
  );
};

export default EditProduct;