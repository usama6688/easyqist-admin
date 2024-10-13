import React, { useEffect, useState } from "react";
import "../../Shop.css";
import {
    useAddToCartMutation,
    useGetProductDetailsQuery,
    useViewCartOrdersQuery,
} from "../../services/Api";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
// import { productDetails } from "../../redux/ProductSlice";
import PATHS from "../../routes/Paths";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import PlaceOrderModal from "../../components/PlaceOrderModal";

const ProductDetails = () => {
    const [productData, setProductData] = useState([]);
    const [selectedTitle, setSelectedTitle] = useState("");
    const [selectedProdDetail, setSelectedProdDetail] = useState("");
    const [radioIndex, setRadioIndex] = useState("");
    const [discountedPrice, setDiscountedPrice] = useState("");
    const [selectedImage, setSelectedImage] = useState("");
    const [isZoomed, setIsZoomed] = useState(false);
    const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
    const location = useLocation();
    const navigate = useNavigate();
    const ID = location?.state?.userId;
    const [placeOrderModal, setPlaceOrderModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState("");

    const placeOrderHandler = (data) => {
        setPlaceOrderModal((prev) => !prev);
        setSelectedProduct(data);
    };

    const {
        data: getProductDetails
    } = useGetProductDetailsQuery({ params: { product_id: location?.state?.id } });

    const [addToCart] = useAddToCartMutation();

    const {
        data: viewCartOrders,
        refetch: viewCartOrdersRefetch,
    } = useViewCartOrdersQuery({
        params: { user_id: ID, order_status: 0 },
    });

    const AddToCartHandlerFirsTime = () => {
        let previousOrders = viewCartOrders?.data?.order_products;

        let isOrderAlreadyExit = previousOrders?.find(
            (product) => product.product_id == selectedProdDetail.product_id
        );

        let isDifferentOrder = previousOrders?.find((product) => { return product?.order_id });

        let isDifferentOrderInst = previousOrders?.find((product) => { return product });

        let cartData = null;

        if (isDifferentOrder) {
            if (
                isDifferentOrderInst?.order_product_type_id ==
                selectedProdDetail?.product_type_id &&
                isDifferentOrderInst?.order_product_installment_id ==
                selectedProdDetail?.id
            ) {
                //if product exist with same installment id
                cartData = {
                    order_session_id: "anson5555",
                    order_product_duration: Number(selectedProdDetail?.duration),
                    order_status: 0,
                    user_id: ID,
                    product_id: selectedProdDetail?.product_id,
                    order_product_amount: getProductDetails?.data?.discount > 0 ? discountedPrice : selectedProdDetail?.total_amount,
                    order_product_advance_amount: selectedProdDetail?.advance,
                    qty: isOrderAlreadyExit?.qty + 1,
                    order_product_status: 0,
                    order_product_installment_id: selectedProdDetail?.id,
                    order_product_type_id: selectedProdDetail?.product_type_id,
                    category_id: getProductDetails?.data?.category_id,
                    brand_id: getProductDetails?.data?.brand_id,
                    order_id: Number(isDifferentOrder?.order_id),
                    order_product_id: isOrderAlreadyExit.id,
                };
            } else {
                cartData = {
                    order_session_id: "anson5555",
                    order_product_duration: Number(selectedProdDetail?.duration),
                    order_status: 0,
                    user_id: ID,
                    product_id: selectedProdDetail?.product_id,
                    order_product_amount: getProductDetails?.data?.discount > 0 ? discountedPrice : selectedProdDetail?.total_amount,
                    order_product_advance_amount: selectedProdDetail?.advance,
                    qty: 1,
                    order_product_status: 0,
                    order_product_installment_id: selectedProdDetail?.id,
                    order_product_type_id: selectedProdDetail?.product_type_id,
                    category_id: getProductDetails?.data?.category_id,
                    brand_id: getProductDetails?.data?.brand_id,
                    order_id: Number(isDifferentOrder?.order_id),
                };
            }
        } else {
            //if added new product
            cartData = {
                order_session_id: "anson5555",
                order_product_duration: Number(selectedProdDetail?.duration),
                order_status: 0,
                user_id: ID,
                product_id: selectedProdDetail?.product_id,
                order_product_amount: getProductDetails?.data?.discount > 0 ? discountedPrice : selectedProdDetail?.total_amount,
                order_product_advance_amount: selectedProdDetail?.advance,
                qty: 1,
                order_product_status: 0,
                order_product_installment_id: selectedProdDetail?.id,
                order_product_type_id: selectedProdDetail?.product_type_id,
                category_id: getProductDetails?.data?.category_id,
                brand_id: getProductDetails?.data?.brand_id,
            };
        }

        addToCart({ data: cartData })
            .unwrap()
            .then((payload) => {
                console.log("payload", payload);
                if (payload.status) {
                    placeOrderHandler(payload?.data);
                }
            })
            .catch((error) => { });
    };

    const handleImageClick = (imageSrc) => {
        setSelectedImage(imageSrc);
    };

    const handleClick = (title) => {
        const filteredInstallments = getProductDetails?.data?.product_type.find(
            (product) => product?.title === title
        );
        setProductData(filteredInstallments);
        setSelectedProdDetail("");
    };

    const prodPlan = (data, index, discountPrice) => {
        const detail = {
            product_image: getProductDetails?.data?.product_image[0]?.image_name,
            name: getProductDetails?.data?.name,
            price: getProductDetails?.data?.price,
        };
        const mergedDetail = { ...detail, ...data };
        setRadioIndex(index);
        setSelectedProdDetail(mergedDetail);
        setDiscountedPrice(discountPrice);
    };

    useEffect(() => {
        if (
            productData?.length === 0 &&
            getProductDetails?.data?.product_type?.length > 0
        ) {
            const defaultTitle = getProductDetails?.data?.product_type[0]?.title;
            setSelectedTitle(defaultTitle);
            const defaultInstallment = getProductDetails?.data?.product_type[0];
            setProductData(defaultInstallment);
        }
    }, [productData, getProductDetails?.data]);

    const handleMouseEnter = () => {
        setIsZoomed(true);
    };

    const handleMouseMove = (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = ((e.pageX - left) / width) * 100;
        const y = ((e.pageY - top) / height) * 100;
        setZoomPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setIsZoomed(false);
    };

    return (
        <div className="marginContainer mt-5 mb-5">
            <div className="row">
                <div className="col-md-7">
                    <div className="row">
                        <div className="col-md-3">
                            {getProductDetails?.data?.product_image?.map((data, index) => {
                                return (
                                    <div
                                        className={`${selectedImage == data?.image_name ? "selectedImg" : ""
                                            } productSlides mb-4`}
                                        key={index}
                                    >
                                        <img
                                            src={data?.image_name}
                                            className="img-fluid h-100"
                                            onClick={() => handleImageClick(data?.image_name)}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                        <div className="col-md-9">
                            <div className="productSlideMain zoomed-image-container">
                                <div
                                    className="product-image w-100"
                                    onMouseEnter={handleMouseEnter}
                                    onMouseMove={handleMouseMove}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <img
                                        src={selectedImage || getProductDetails?.data?.thumbnail}
                                        alt="Product"
                                        className={`product-img w-100 ${isZoomed ? 'zoomed' : ''}`}
                                        style={isZoomed ? { transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%` } : {}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="col-md-5">

                    <h3>{getProductDetails?.data?.name}</h3>

                    {getProductDetails?.data?.description ? (
                        <ul className="productDesc mt-3">
                            <li>{getProductDetails?.data?.description}</li>
                        </ul>
                    ) : null}

                    <div className="row mt-4">
                        {getProductDetails?.data?.product_type?.length
                            ? getProductDetails?.data?.product_type?.map((data, index) => {
                                return (
                                    <div className="col-md-4 mb-4">
                                        <input
                                            type="radio"
                                            className="hideRadioBtn"
                                            id={`one${index + 1}`}
                                            name="one"
                                            defaultChecked={index === 0}
                                            onChange={() => handleClick(data?.title, index)}
                                        />
                                        <label
                                            className="customRadio mr-2"
                                            htmlFor={`one${index + 1}`}
                                        >
                                            {data?.title}
                                        </label>
                                    </div>
                                );
                            })
                            : null}
                    </div>

                    {getProductDetails?.data?.product_installment?.length ? (
                        <div className="row mt-4">
                            <h3>SELECT YOUR PLAN</h3>
                            {productData?.product_installment?.map((data, index) => {
                                const decimalDiscount = getProductDetails?.data?.discount / 100;
                                const discountAmount = data?.total_amount * decimalDiscount;
                                const finalPrice = data?.total_amount - discountAmount;
                                return (
                                    <div className="col-10 mb-4 mt-4">
                                        <div className="planDiv">
                                            <label class="radioContainer">
                                                <div>
                                                    <h2 className="planName">
                                                        {data?.installment_title}
                                                    </h2>

                                                    {data?.duration > 1 ?
                                                        <>
                                                            <h3 className="priceText">
                                                                Rs: {data?.amount}{" "}
                                                                <span className="months">
                                                                    x {data?.duration} Months
                                                                </span>
                                                            </h3>
                                                            <h3 className="priceText">
                                                                Rs: {data?.advance}{" "}
                                                                <span className="advanceTxt">Advance</span>
                                                            </h3>
                                                        </>
                                                        :
                                                        <h3 className="priceText">
                                                            {getProductDetails?.data?.discount > 0 ?
                                                                <>Total Rs:<del> {Math.round(data?.total_amount)}</del> {finalPrice}</>
                                                                :
                                                                <>Total Rs: {data?.total_amount}</>
                                                            }
                                                        </h3>
                                                    }
                                                </div>

                                                <div>
                                                    <input
                                                        type="radio"
                                                        name="radio"
                                                        onChange={() => prodPlan(data, index, finalPrice)}
                                                        checked={(selectedProdDetail && radioIndex == index) ? true : false}
                                                    />
                                                    <span class="checkmark"></span>
                                                </div>
                                            </label>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : null}

                    {selectedProdDetail && (
                        <Button
                            onClick={() => { AddToCartHandlerFirsTime(); }}
                        >Add to cart</Button>
                    )}
                </div>

                <div className="row mt-5">
                    <h3>Detail Description</h3>
                    <h5 className="mt-3">{getProductDetails?.data?.detail_description ?? "-"}</h5>
                </div>

                {placeOrderModal &&
                    <PlaceOrderModal
                        handlePlaceOrderModal={placeOrderHandler}
                        data={selectedProduct}
                        userId={ID}
                    />
                }

            </div>
        </div>
    );
};

export default ProductDetails;