import axios from "axios";

import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap/";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function Navigation() {
  let navigate = useNavigate();
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      let res = await axios.get(`${API_BASE_URL}/logout`, {
        withCredentials: true,
      });

      navigate("/login");
    } catch (e) {
      console.log(e, "Nahi ho payega");
    }
  };
  const handleadd = (e) => {
    e.preventDefault();
    navigate("/new");
  };
  const handleSignUp = (e) => {
    e.preventDefault();
    navigate("/signup");
  };
  const handleLogin = (e) => {
    e.preventDefault();
    navigate("/login");
  };
  const handleAllPrograms = (e) => {
    e.preventDefault();
    navigate("/allprograms");
  };
  const handleAllRecipes = (e) => {
    e.preventDefault();
    navigate("/allrecipes");
  };
  const handleMyJourney = (e) => {
    e.preventDefault();
    navigate("/myjourney");
  };

  const handleAllVideos = (e) => {
    e.preventDefault();
    navigate("/workoutvideos/tags");
  };
  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      data-bs-theme="dark"
      className="bg-body-tertiary"
    >
      <Container>
        <Navbar.Brand style={{ color: "rgb(209, 48, 75)" }} href="#home">
          Fitness Social
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          {/* <Nav className="me-auto"> */}
          <Nav>
            <Nav.Link className="main-nav-1" onClick={handleMyJourney}>
              My Fitness Journey
            </Nav.Link>
            <Nav.Link className="main-nav-1" onClick={handleAllPrograms}>
              Workout Programs
            </Nav.Link>
            <Nav.Link className="main-nav-1" onClick={handleAllVideos}>
              Workout Videos
            </Nav.Link>
            <Nav.Link className="main-nav-1" onClick={handleAllRecipes}>
              Recipes
            </Nav.Link>
            <Nav.Link className="main-nav-1" href="#contact">
              Say Hello👋
            </Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {/* <Nav.Link href="#deets">More deets</Nav.Link>
            <Nav.Link eventKey={2} href="#memes">
              Dank memes
            </Nav.Link> */}
            <Nav.Link className="main-nav-1" onClick={handleLogin}>
              Login
            </Nav.Link>
            <Nav.Link className="main-nav-1" onClick={handleSignUp}>
              Signup
            </Nav.Link>
            <Nav.Link className="main-nav-1" onClick={handleLogout}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
