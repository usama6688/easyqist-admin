import React, { useState } from "react";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { toast } from "react-toastify";
import { useAddBlogMutation } from "../../services/Api";
import { useNavigate } from "react-router-dom";
import PATHS from "../../routes/Paths";

const AddBlog = () => {

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const navigate = useNavigate();

    const [addBlog] = useAddBlogMutation();

    const onSubmit = () => {

        const data = {
            title: title,
            content: content
        };

        addBlog({ data: data })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    toast.success("Blog added successfully");
                    navigate(PATHS.allBlogs);
                } else {
                    toast.error(payload.message);
                }
            })
            .catch((error) => {
                console.log("error", error);
                toast.error(error.message);
            });
    };

    return (
        <div>
            <Form>
                <FormGroup>
                    <Label for="exampleEmail">Title</Label>
                    <Input
                        name="title"
                        placeholder="Title..."
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleEmail">Content</Label>
                    <textarea
                        name="body"
                        className="form-control"
                        rows={5}
                        placeholder="Content..."
                        type="body"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                    />
                </FormGroup>

                <Button onClick={onSubmit} className="mt-2">Submit</Button>
            </Form>
        </div>
    )
}

export default AddBlog;