import React, { useEffect, useState } from 'react';
import bg1 from '../../assets/images/bg/bg1.jpg';
import bg2 from '../../assets/images/bg/bg2.jpg';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { useDeleteBannerMutation, useGetBannersQuery } from '../../services/Api';
import DeleteModal from '../../components/DeleteModal';
import PATHS from '../../routes/Paths';
import { useSelector } from 'react-redux';

const Banners = () => {

    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [itemId, setItemId] = useState("");
    const navigator = useNavigate();
    const auth = useSelector((data) => data?.auth);

    const [deleteBanner, { isSuccess }] = useDeleteBannerMutation();

    const DeleteModalHandler = (data) => {
        setItemId(data);
        setDeleteItemModal((prev) => !prev);
    };

    const {
        data: getBanners,
        refetch: getBannersRefetch,
    } = useGetBannersQuery();

    const onDeleteBanner = (id) => {
        deleteBanner({ data: id })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    DeleteModalHandler();
                    navigator(PATHS.banners);
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    useEffect(() => {
        getBannersRefetch();
    }, []);

    useEffect(() => {
        getBannersRefetch();
    }, [isSuccess]);

    return (
        <div className='row'>

            {auth?.userDetail?.type == 3 ? null :
                <div className="col-12 mb-4">
                    <div className='text-end'>
                        <a href={PATHS.addBanner}>
                            <Button>Add Banner</Button>
                        </a>
                    </div>
                </div>
            }

            {getBanners?.data?.map((data) => {
                return (
                    <div className="col-6 mb-4">
                        {auth?.userDetail?.type == 3 ? null :
                            <div className="d-flex justify-content-end gap-3">
                                <span className="cursor" style={{ fontSize: "25px" }} onClick={() => { navigator(PATHS.editBanner, { state: { data: data } }); window.location.reload(); }}>✎</span>

                                <span className="cursor" style={{ fontSize: "25px" }} onClick={() => DeleteModalHandler(data?.id)}>X</span>
                            </div>
                        }
                        <img src={data?.banner_image} height={300} style={{ width: "100%" }} />
                    </div>
                )
            })}

            {deleteItemModal &&
                <DeleteModal
                    handleCloseDeletModal={DeleteModalHandler}
                    action={onDeleteBanner}
                    id={itemId}
                    confirmationMessage="Are you sure you want to delete the item?"
                />
            }
        </div>
    )
}

export default Banners;