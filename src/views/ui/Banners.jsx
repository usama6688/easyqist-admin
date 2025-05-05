import React, { useEffect, useState } from 'react';
import sort from '../../assets/images/sort.png';
import { useNavigate } from 'react-router-dom';
import { Button } from 'reactstrap';
import { useBannerSortingMutation, useDeleteBannerMutation, useGetBannersQuery } from '../../services/Api';
import DeleteModal from '../../components/DeleteModal';
import PATHS from '../../routes/Paths';
import { useSelector } from 'react-redux';
import SortBannerModal from '../../components/SortBannerModal';

const Banners = () => {

    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [sortBannerModal, setSortBannerModal] = useState(false);
    const [itemId, setItemId] = useState("");
    const navigator = useNavigate();
    const auth = useSelector((data) => data?.auth);

    const [deleteBanner, { isSuccess }] = useDeleteBannerMutation();
    const [bannerSorting] = useBannerSortingMutation();

    const DeleteModalHandler = (data) => {
        setItemId(data);
        setDeleteItemModal((prev) => !prev);
    };

    const sortBannerHandler = (data) => {
        setItemId(data);
        setSortBannerModal((prev) => !prev);
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

    const onSortBanner = (data) => {
        bannerSorting({ data: data })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    sortBannerHandler();
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

                                <img src={sort} alt="" className='mt-1' title='Sort' style={{ height: "25px", width: "25px" }} onClick={() => sortBannerHandler(data)} />
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

            {sortBannerModal &&
                <SortBannerModal
                    handleCloseSortBannerModal={sortBannerHandler}
                    action={onSortBanner}
                    data={itemId}
                />
            }
        </div>
    )
}

export default Banners;