import axios from "axios";

import React from "react";
import { Nav, Navbar } from "react-bootstrap";
import { Container } from "react-bootstrap/";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Utils/AuthProvider";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const DEFAULT_PROFILE_IMAGE = "https://via.placeholder.com/40x40?text=User";

function UserProfile({ user, onClick }) {
  return (
    <button
      type="button"
      className="navbar-user-profile"
      onClick={onClick}
      style={{
        background: "none",
        border: "none",
        padding: 0,
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        gap: "8px",
      }}
      aria-label="Go to My Account"
    >
      <img
        src={user.fileUrl || DEFAULT_PROFILE_IMAGE}
        alt={user.username ? `${user.username} profile` : "Profile"}
        width={40}
        height={40}
        className="navbar-user-avatar"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = DEFAULT_PROFILE_IMAGE;
        }}
      />
      <span className="navbar-user-name">{user.username}</span>
    </button>
  );
}

function Navigation() {
  let navigate = useNavigate();
  const { user, setUser, loading } = useAuth();
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`${API_BASE_URL}/logout`, {
        withCredentials: true,
      });
      setUser(null);
      navigate("/login");
    } catch (e) {}
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
    navigate("/allprograms/tags");
  };
  const handleAllRecipes = (e) => {
    e.preventDefault();
    navigate("/allrecipes/tags");
  };
  const handleMyJourney = (e) => {
    e.preventDefault();
    navigate("/myjourney");
  };

  const handleMyAccount = (e) => {
    e.preventDefault();
    navigate("/myjourney", { state: { activeTab: "myAccount" } });
  };

  const handleAllVideos = (e) => {
    e.preventDefault();
    navigate("/workoutvideos/tags");
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      data-bs-theme="light"
      style={{ backgroundColor: "#ffffff", position: "relative", zIndex: 2000 }}
    >
      <Container>
        <Navbar.Brand style={{ color: "rgb(209, 48, 75)" }} href="/">
          Fitness Social
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
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
          </Nav>
          <Nav className="ms-auto align-items-lg-center navbar-auth-nav">
            {loading ? null : !user ? (
              <>
                <Nav.Link className="main-nav-1" onClick={handleLogin}>
                  Login
                </Nav.Link>
                <Nav.Link className="main-nav-1" onClick={handleSignUp}>
                  Signup
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link className="main-nav-1" onClick={handleLogout}>
                  Logout
                </Nav.Link>
                <div className="navbar-user-profile-wrap">
                  <UserProfile user={user} onClick={handleMyAccount} />
                </div>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;
