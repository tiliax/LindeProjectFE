import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import React, { useEffect, useState } from "react";

import Signup from "./navbar-components/Signup";
import AddNewBox from "./navbar-components/AddNewBox";
import Login from "./navbar-components/Login";
import Logout from "./navbar-components/Logout";
import UserSettings from "./navbar-components/UserSettings";
import MobileView from "./navbar-components/MobileView";
import MyBoxes from "./navbar-components/MyBoxes";

const CustomNavbar = ({ setCurrentUserBoxes }) => {
    // add a new box
    const [addNewBox, setAddNewBox] = useState(false);
    const handleAddNewBoxClose = () => setAddNewBox(false);
    const handleAddNewBoxOpen = () => setAddNewBox(true);
    // User settings
    const [userSettings, setUserSettings] = useState(false);
    const handleUserSettingsClose = () => setUserSettings(false);
    const handleUserSettingsShow = () => setUserSettings(true);
    // Sign up
    const [userSignup, setUserSignup] = useState(false);
    const handleUserSignupClose = () => setUserSignup(false);
    const handleUserSignupOpen = () => setUserSignup(true);
    // log in
    const [userLogin, setUserLogin] = useState(false);
    const handleUserLoginClose = () => setUserLogin(false);
    const handleUserLoginOpen = () => setUserLogin(true);
    // log out
    const [showUserLogout, setShowUserLogout] = useState(false);
    const handleUserLogoutClose = () => setShowUserLogout(false);
    const handleUserLogout = () => setShowUserLogout(true);
    // Current User Data
    const [currentUser, setCurrentUser] = useState({});
    // My Boxes
    const [myBoxes, setMyBoxes] = useState(false);
    const handleMyBoxesClose = () => setMyBoxes(false);
    const handleMyBoxes = () => setMyBoxes(true);

    console.log(currentUser);

    // const memoizedSetCurrentUserBoxes = useCallback((boxes) => { //!chatGPT Vorschlag
    //     setCurrentUserBoxes(boxes);
    // }, []);
    
    // useEffect(() => {
    //     memoizedSetCurrentUserBoxes(currentUser.userBoxes);
    // }, [currentUser, memoizedSetCurrentUserBoxes]);

    
    // useEffect(() => { //! original
    //     setCurrentUserBoxes(currentUser.userBoxes);
    // }, [currentUser]); //TODO function runs with the first rendern and allways when a certain value (here currentUser) changes

    useEffect(() => {
        setCurrentUserBoxes(currentUser.userBoxes);
    }, [currentUser, setCurrentUserBoxes]); //! setCurrenUserBoxes evt nicht richtig da. hat jedoch Fehelermeldung behoben


    useEffect(() => {
        fetch(process.env["REACT_APP_BACKEND_URL"] + "/user/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json; charset=utf-8",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        })
            .then((res) => res.json())
            .then((data) => {
                setCurrentUser(data.user);
            });
    }, []);  //TODO empty array: runs function only with the first render 

    return (
        <header>
            <Navbar
                bg="dark"
                variant="dark"
                expand=""
                fixed="top"
                className="bootstrap_navbar"
            >
                <Container fluid>
                    <Navbar.Brand className="nav-logo" href="#">
                        {/*  BOX <i className="bx bx-package" /> */}
                        <img
                            className="box-image-nav"
                            src="logo-image/Freebox__9_-removebg-preview_1.png"
                            alt=""
                        />
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            {Object.hasOwn(currentUser, "_id") ? null : (   //TODO hasOwn() checks, of object has certain property (here id) or not. if yes: null, nichts passiert. if no, sign up kommt
                                <Nav.Link
                                    href="#"
                                    onClick={handleUserSignupOpen}
                                >
                                    Sign up
                                </Nav.Link>
                            )}

                            
                            {/* <Nav.Link> */} {/* //! Nav.Link auskommentiert um Zehler zu beheben. evt coursing others */}
                                {Object.hasOwn(currentUser, "_id") ? ( //TODO hat existiert currentUser mit id, dann wird logout angeboten, sind daten nicht vorhanden, login
                                    <Nav.Link
                                        href="#"
                                        onClick={handleUserLogout}
                                    >
                                        Log Out
                                    </Nav.Link>
                                ) : (
                                    <Nav.Link
                                        href="#"
                                        onClick={handleUserLoginOpen}
                                    >
                                        Log In
                                    </Nav.Link>
                                )}
                            {/* </Nav.Link> */}



                            {Object.hasOwn(currentUser, "_id") && (  //TODO sind daten da, dann optionen für neue box, settings, und myboxes. (git nur den true fall)
                                <>
                                    <Nav.Link
                                        href="#"
                                        onClick={handleAddNewBoxOpen}
                                    >
                                        Add a new box
                                    </Nav.Link>

                                    <Nav.Link
                                        href="#"
                                        onClick={handleUserSettingsShow}
                                    >
                                        User Settings
                                    </Nav.Link>
                                    <Nav.Link href="#" onClick={handleMyBoxes}>
                                        My Boxes
                                    </Nav.Link>
                                </>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            <Signup
                userSignup={userSignup}
                handleUserSignupClose={handleUserSignupClose}
            />

            <Login
                userLogin={userLogin}
                handleUserLoginClose={handleUserLoginClose}
                setCurrentUser={setCurrentUser}
            />

            <Logout
                showUserLogout={showUserLogout}
                handleUserLogoutClose={handleUserLogoutClose}
                setCurrentUser={setCurrentUser}
            />

            <AddNewBox
                addNewBox={addNewBox}
                handleAddNewBoxClose={handleAddNewBoxClose}
                currentUser={currentUser}
            />

            <UserSettings
                userSettings={userSettings}
                handleUserSettingsClose={handleUserSettingsClose}
                currentUser={currentUser}
            />

            <MyBoxes
                myBoxes={myBoxes}
                handleMyBoxesClose={handleMyBoxesClose}
                currentUser={currentUser}
            />

            <MobileView
                handleUserSettingsShow={handleUserSettingsShow}
                handleAddNewBoxOpen={handleAddNewBoxOpen}
            />
        </header>
    );
};
export default CustomNavbar;
