import { useState } from "react";
import { ModalHeader } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const Signup = ({ userSignup, handleUserSignupClose }) => {
    const [signupData, setSignupData] = useState({
        signupUsername: "",
        signupPassword: "",
        signupRepeatPassword: "",
        signupCurrentUserLocation: "",        
    });

    const [signupErrors, setSignupErrors] = useState({});
    const [validated, setValidated] = useState(false);

    const handleSignupChange = (e) => {
        const { name, value } = e.target;
        setSignupData((prevData) => {
            return {
                ...prevData,
                [name]: value,
            };
        });
    };

    const handleSignupSubmit = (e) => {
        e.preventDefault();
    };

    const handleSignupSend = async () => {
        const response = await fetch(
            //! HIER WEITER MACHEN!!!
            process.env["REACT_APP_BACKEND_URL"] + "/box/signup",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8",
                },
                body: JSON.stringify(signupData),
            },
        );
        
        

        const data = await response.json();
        
        if (response.ok){
            if (data.success) {
                handleUserSignupClose();
                window.location.reload();
            }
        } else {
            if (data.name && data.name === "ValidationError"){
                const validationErrors = data.inner;
                
                setSignupErrors((prev) => {return {}});  //flush previous errors

                validationErrors.forEach((entry) => { 
                    const {path, message} = entry;
                    addSignupError(message,path);
                });

                setValidated(true);
            }
        }
    };

    const addSignupError = (errorMessage, inputField) => {
        setSignupErrors((prevErrors) => {
            prevErrors[inputField] ? prevErrors[inputField] += ", " + errorMessage  : prevErrors[inputField] = errorMessage;
            return prevErrors;
        });
    }

    return (
        <Modal
            show={userSignup}
            onHide={handleUserSignupClose}
            backdrop="true"
            fade="true"
            centered="true"
        >
            <ModalHeader closeButton>
                <Modal.Title>Sign up</Modal.Title>
            </ModalHeader>
            <Modal.Body>
                <Form noValidate onSubmit={handleSignupSubmit}>
                    <Form.Group className="mb-3" controlId="signup_username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter username"
                            name="signupUsername"
                            value={signupData.signupUsername}
                            onChange={handleSignupChange}
                            isInvalid={signupErrors.hasOwnProperty("signupUsername")}                            
                        />
                        <Form.Control.Feedback type="invalid">
                            {signupErrors.signupUsername}
                        </Form.Control.Feedback>                         
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="signup_password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter Password"
                            name="signupPassword"
                            value={signupData.signupPassword}
                            onChange={handleSignupChange}
                            isInvalid={signupErrors.hasOwnProperty("signupPassword")}                            
                        />
                        <Form.Control.Feedback type="invalid">
                            {signupErrors.signupPassword}
                        </Form.Control.Feedback>                         
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="signup_password_repeat"
                    >
                        <Form.Label>Repeat password</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Repeat password"
                            name="signupRepeatPassword"
                            value={signupData.signupRepeatPassword}
                            onChange={handleSignupChange}
                        />
                        <p>
                            {signupData.signupPassword ===
                            signupData.signupRepeatPassword
                                ? ""
                                : "Password do not match!"}
                        </p>
                    </Form.Group>
                    <Form.Group
                        className="mb-3"
                        controlId="signup_userlocation"
                    >
                        <Form.Label>Your current location</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter city"
                            name="signupCurrentUserLocation"
                            value={signupData.signupCurrentUserLocation}
                            onChange={handleSignupChange}
                            isInvalid={signupErrors.hasOwnProperty("signupCurrentUserLocation")}
                        />
                        <Form.Control.Feedback type="invalid">
                            {signupErrors.signupCurrentUserLocation}
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Button onClick={handleSignupSend} type="submit">
                        Send
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default Signup;
