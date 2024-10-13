import React, { useState } from "react";
import {
    useProceedMutation,
} from "../services/Api";
import ModalComponent from "../components/modalSetup/Modal";
import { Modal } from "react-bootstrap";
import PATHS from "../routes/Paths";
import { toast } from "react-toastify";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

const PlaceOrderModal = (props) => {
    const [address, setAddress] = useState("");
    const [refCode, setRefCode] = useState("");
    const handleInputChange = (event) => {
        const value = event.target.value;
        const trimmedValue = value.trimStart();
        setAddress(trimmedValue);
    };
    //proceed
    const [proceed] = useProceedMutation();
    const [cnic, setCnic] = useState("");
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const onProceed = () => {
        const data = props?.data?.order_products;
        const productIDS = data?.map((product) => product?.id);

        let cartData = {
            order_status: 1,
            user_id: props?.userId,
            address,
            refercode: refCode,
            product_id: productIDS,
            order_id: parseInt(data[0]?.order_id),
            cnic_number: cnic,
        };

        if (address) {
            proceed({ data: cartData })
                .unwrap()
                .then((payload) => {
                    if (payload.status) {
                        navigate(PATHS.users);
                        window.location.reload();
                    }
                })
                .catch((error) => { });
        } else {
            toast.error("Please add your address");
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;

        if (!/^\d*$/.test(value)) {
            setError('Please enter only numbers.');
            return;
        }

        setCnic(value);

        if (value.length < 13) {
            setError('Number must be exactly 13 digits.');
        } else if (value.length > 13) {
            setError('Number must be exactly 13 digits.');
        } else {
            setError('');
        }
    };

    return (
        <ModalComponent
            size="md"
            show={true}
            handleClose={props?.handlePlaceOrderModal}
        >
            <Modal.Body className="overflow m-2 lgModals customScroll pt-0 mt-0">
                <>
                    <h1 className="mainHeading mb-4 text-center">Proceed</h1>

                    <div className="row">
                        <div className="col-md-6"></div>

                        <div className="col-md-12">
                            <label className="formLabel">Address</label>
                            <input
                                type="text"
                                placeholder="Address.."
                                className="inputField"
                                value={address}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="col-md-12 mt-2">
                            <label className="formLabel">CNIC</label>
                            <input
                                type="text"
                                placeholder="Type.."
                                className="inputField"
                                value={cnic}
                                onChange={handleChange}
                                maxLength={13}
                            />
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                        </div>

                        <div className="col-md-12 mt-2">
                            <label className="formLabel">Referral Code (Optional)</label>
                            <input
                                type="text"
                                placeholder="Referral Code.."
                                className="inputField"
                                value={refCode}
                                onChange={(e) => setRefCode(e.target.value)}
                            />
                        </div>

                        {/* <h4 className="mt-4 text-muted text-end">نوٹ: فی الحال یہ سروس صرف لاہور میں دستیاب ہے۔</h4>

                        <div className="col-md-12 mt-4">
                            <h4 className="text-end" style={{ lineHeight: "2" }}>اب آپ ایزی قسط کے ذریعے گھر بیٹھے الیکٹرانکس اور دیگر گھریلو سامان باآسانی آسان اقساط پر حاصل کر سکتے ہیں۔</h4>

                            <h4 className="text-end" style={{ lineHeight: "2.5rem" }}>
                                آپ کا آرڈر موصول ہونے کے بعد ہمارا نمائندہ 24 گھنٹے کے اندر آپ سے رابطہ کرے گا اور تصدیقی عمل مکمل کرنے کے لیے درکار دستاویزات سے آگاہ کرے گا۔ تصدیقی عمل مکمل کرنے کے لیے درخواست گزار کے علاوہ دو ضامن اور ان کے شناختی کارڈ کی کاپیاں اور ایک عدد چیک درکار ہوگا۔ ضامن کوئی بھی ہو سکتا ہے جیسے آپ کا پڑوسی، دوست، یا رشتہ دار جس کا اپنا گھر ہو یا کاروبار ہو۔ یہ عمل مکمل ہوتے ہی 24 گھنٹے کے اندر آپ کا آرڈر کیا ہوا پروڈکٹ ڈیلیور کر دیا جائے گا۔
                            </h4>
                        </div> */}

                        <div className="col-12 mt-4 text-center">
                            <Button
                                onClick={() => { onProceed(); }}
                            >Proceed</Button>
                        </div>
                    </div>
                </>
            </Modal.Body>
        </ModalComponent>
    );
};

export default PlaceOrderModal;