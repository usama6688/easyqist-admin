import React, { useEffect, useState } from "react";
import { Form, FormGroup, Label, Input } from "reactstrap";
import { useChangeProductStatusMutation, useViewProductDetailQuery } from "../../services/Api";
import ImageViewer from "../../components/ImageViewer";
import { useLocation } from "react-router-dom";
import PATHS from "../../routes/Paths";
import { useSelector } from "react-redux";

const ViewProductRequest = () => {

  const location = useLocation();
  const auth = useSelector((data) => data?.auth);

  const [changeProductStatus] = useChangeProductStatusMutation();

  const {
    data: viewProductDetail,
    refetch: viewProductDetailRefetch,
  } = useViewProductDetailQuery({ params: { product_id: location?.state?.id } });

  const onChangeStatus = (value) => {

    const data = {
      status: value,
      product_id: viewProductDetail?.data?.id,
    };

    changeProductStatus({ data: data })
      .unwrap()
      .then((payload) => {
        if (payload.status) {
          navigator(PATHS.products);
          window.location.reload();
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

      {auth?.userDetail?.type == 6 ? null :
        <select className="form-select w-50 mb-5" onChange={(e) => onChangeStatus(e.target.value)}>
          <option value="">Change Status</option>
          <option value="1">Active</option>
          <option value="0">Not Active</option>
        </select>
      }

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

        {viewProductDetail?.data?.product_image?.length ?
          <FormGroup>
            <Label for="exampleFile">Image(s)</Label>

            <div className='position-relative ms-5 mb-4'>
              <div className="row">
                {viewProductDetail?.data?.product_image?.map((image) => (
                  <div className="col-md-3 mt-3 position-relative">
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
          <Label for="exampleEmail">Discount</Label>
          <Input value={viewProductDetail?.data?.discount} readOnly />
        </FormGroup>

        <FormGroup>
          <Label for="exampleEmail">Product Types</Label><br />
          {viewProductDetail?.data?.product_type?.map((data, index) => {
            return (
              <>
                <Label for="exampleEmail"><b>Type {index + 1}</b></Label>
                <Input className="mb-3" value={`Type Name: ${data?.title}`} readOnly />

                {data?.product_installment?.map((item, ind) => {
                  return (
                    <>
                      <Label for="exampleEmail"><b>Plan {ind + 1}</b></Label>
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



      </Form>
    </div>
  );
};

export default ViewProductRequest;