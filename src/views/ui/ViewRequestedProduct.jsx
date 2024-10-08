import React, { useEffect } from 'react';
import {
    Button,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { useLocation } from 'react-router-dom';
import { useRequestedProductDetailQuery } from '../../services/Api';
import { BASE_URL_IMAGES } from '../../services/ApiEndpoints';

const ViewRequestedProduct = () => {

    const location = useLocation();

    const {
        data: requestedProductDetail,
        refetch: requestedProductDetailRefetch,
    } = useRequestedProductDetailQuery({ params: { id: location?.state?.data?.id } });

    const detail = requestedProductDetail?.data;

    useEffect(() => {
        requestedProductDetailRefetch();
    }, []);

    return (
        <div>
            {detail?.image_name ?
                <FormGroup>
                    <Label for="exampleEmail">Product Image</Label>
                    <div>
                        <img src={detail?.image_name} alt="" className='w-50 rounded' style={{ height: "10rem", objectFit: "contain" }} />
                    </div>
                </FormGroup>
                : null
            }

            <FormGroup>
                <Label for="exampleEmail">Description</Label>
                <Input
                    placeholder="Name"
                    type="text"
                    value={detail?.description}
                    readOnly
                />
            </FormGroup>

            <FormGroup>
                <Label for="exampleEmail">Customer Name</Label>
                <Input
                    placeholder="Name"
                    type="text"
                    value={detail?.user?.name}
                    readOnly
                />
            </FormGroup>

            <FormGroup>
                <Label for="exampleEmail">Customer CNIC</Label>
                <Input
                    placeholder="Name"
                    type="text"
                    value={detail?.user?.cnic_number}
                    readOnly
                />
            </FormGroup>

            <FormGroup>
                <Label for="exampleEmail">Customer Email</Label>
                <Input
                    placeholder="Name"
                    type="text"
                    value={detail?.user?.email}
                    readOnly
                />
            </FormGroup>

            <FormGroup>
                <Label for="exampleEmail">Customer Phone</Label>
                <Input
                    placeholder="Name"
                    type="text"
                    value={detail?.user?.phone_no}
                    readOnly
                />
            </FormGroup>

            <FormGroup>
                <Label for="exampleEmail">Address</Label>
                <Input
                    placeholder="Name"
                    type="text"
                    value={detail?.address}
                    readOnly
                />
            </FormGroup>
        </div>
    )
}

export default ViewRequestedProduct;