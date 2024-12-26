import React, { useState } from "react";
import {
    Button,
    Form,
    FormGroup,
    Label,
    Input,
} from "reactstrap";
import { toast } from "react-toastify";
import { useSendNotificationsMutation } from "../../services/Api";

const Notifications = () => {

    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const [sendNotifications] = useSendNotificationsMutation();

    const onSubmit = () => {

        const data = {
            messageTitle: title,
            messageBody: body
        };

        sendNotifications({ data: data })
            .unwrap()
            .then((payload) => {
                if (payload.status) {
                    toast.success("Notification sent successfully");
                    setTitle("");
                    setBody("");
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
                    <Label for="exampleEmail">Message Title</Label>
                    <Input
                        name="title"
                        placeholder="Message Title..."
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </FormGroup>

                <FormGroup>
                    <Label for="exampleEmail">Message Body</Label>
                    <textarea
                        name="body"
                        className="form-control"
                        rows={5}
                        placeholder="Message Body..."
                        type="body"
                        value={body}
                        onChange={(e) => setBody(e.target.value)}
                    />
                </FormGroup>

                <Button onClick={onSubmit} className="mt-2">Submit</Button>
            </Form>
        </div>
    )
}

export default Notifications;