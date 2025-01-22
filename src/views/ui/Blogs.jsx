import React, { useState } from 'react';
import { Col, Row, Table, Button, Input } from 'reactstrap';
import { useDeleteAdminMutation, useDeleteBlogMutation, useGetAllBlogsQuery } from '../../services/Api';
import PATHS from '../../routes/Paths';
import { useNavigate } from 'react-router-dom';
import DeleteModal from '../../components/DeleteModal';

const Blogs = () => {

    const [deleteItemModal, setDeleteItemModal] = useState(false);
    const [itemId, setItemId] = useState("");
    const navigate = useNavigate();

    const {
        data: getAllBlogs,
        refetch: getAllBlogsRefetch,
    } = useGetAllBlogsQuery({ params: { start: 0, limit: 100000 } });

    const DeleteModalHandler = (data) => {
        setItemId(data?.id);
        setDeleteItemModal((prev) => !prev);
    };

    const [deleteBlog] = useDeleteBlogMutation();

    const onDeleteBlog = (id) => {
        deleteBlog(id)
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    getAllBlogsRefetch();
                    window.location.reload();
                }
            })
            .catch((error) => {
                console.log("error", error);
            });
    };

    const localSearchTableFunction = (value) => {
        const input = document.getElementById("localSearchInput");
        const filter = input.value.toUpperCase();
        var length = document.getElementsByClassName("mainDiv").length;
        let recordsFound = false;

        for (var i = 0; i < length; i++) {
            if (
                document
                    .getElementsByClassName("mainDiv")
                [i].innerHTML.toUpperCase()
                    .indexOf(filter) > -1
            ) {
                document.getElementsByClassName("mainDiv")[i].style.display = "table-row";
                recordsFound = true;
            } else {
                document.getElementsByClassName("mainDiv")[i].style.display = "none";
            }
        }
    }

    return (
        <Row>
            <Col lg="12">
                <div className='d-flex align-items-center justify-content-between'>
                    <Input
                        id='localSearchInput'
                        placeholder="Search"
                        type="search"
                        className='w-50'
                        onChange={(e) => localSearchTableFunction(e.target.value)}
                    />
                    <a href={PATHS.addBlog}>
                        <Button>Add Blog</Button>
                    </a>
                </div>
                <Table className="no-wrap mt-3 align-middle" responsive borderless>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {getAllBlogs?.data?.map((data) => {
                            return (
                                <tr className="border-top mainDiv">
                                    <td>{data?.name}</td>
                                    <td>{data?.email}</td>
                                    <td>
                                        <div style={{ alignItems: "center" }}>
                                            <Button style={{ backgroundColor: "green" }} onClick={() => { navigate(PATHS.editBlog, { state: { data: data } }); window.location.reload(); }}>Edit</Button>

                                            <Button
                                                style={{ backgroundColor: "red", marginLeft: 10 }}
                                                onClick={
                                                    () => {
                                                        DeleteModalHandler(data)
                                                    }}
                                            >Delete</Button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Col>

            {deleteItemModal &&
                <DeleteModal
                    handleCloseDeletModal={DeleteModalHandler}
                    action={onDeleteBlog}
                    id={itemId}
                    confirmationMessage="Are you sure you want to delete the blog?"
                />
            }
        </Row >
    )
}

export default Blogs;