import axios from 'axios';
 
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useAuth } from '../Utils/AuthProvider';
import { Container, Form, Button } from 'react-bootstrap';
import AuthToast from '../Utils/AuthToast';
import {
  useLoginPrompt,
  UNAUTHORIZED_CREDENTIALS_MSG,
} from '../Utils/useLoginPrompt';
import { LOGIN_REQUIRED_MSG } from '../Utils/routeToastMessages';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const nameRef = useRef();
  const passwordRef = useRef();
  const { setUser } = useAuth();
  const { redirectToLogin } = useLoginPrompt();
  const [toastMessage, setToastMessage] = useState("");
  const [toastTitle, setToastTitle] = useState("Login");
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (location.state?.authError) {
      setToastMessage(location.state.authError);
      setToastTitle(
        location.state.authError === LOGIN_REQUIRED_MSG ? "Login required" : "Login"
      );
      setShowToast(true);
    }
  }, [location.state?.authError]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const username = nameRef.current.value;
      const password = passwordRef.current.value;

      await axios.post(
        `${API_BASE_URL}/login`,
        { data: { username, password } },
        { withCredentials: true }
      );
      const me = await axios.get(`${API_BASE_URL}/me`, { withCredentials: true });
      setUser(me.data.user);
      navigate("/");
    } catch (err) {
      const message =
        err.response?.status === 401
          ? err.response?.data?.msg || UNAUTHORIZED_CREDENTIALS_MSG
          : "Something went wrong. Please try again.";
      redirectToLogin(message);
    }
  };

  return (
    <div className='mx-auto'> 
      <AuthToast
        show={showToast}
        message={toastMessage}
        title={toastTitle}
        onClose={() => setShowToast(false)}
      />
      <Container className="p-4 border rounded">
      <Form onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          <h2>Login here!</h2>
        </div>
        <Form.Group className="mb-3" controlId="formGridUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" name="username" ref={nameRef} />
        </Form.Group>
        <Form.Group  controlId="formGridPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type='password'  placeholder="Enter Password" name="password" ref={passwordRef} />
        </Form.Group>
        <br />
        <Button variant="primary" type="submit" className='w-100'>
        Login
        </Button>
      </Form>
      <p className="mt-3" style={{ textAlign: "center" }}>
        Don&apos;t have an account?{" "}
        <Link to="/signup">Sign up</Link>
      </p>
      </Container>
    </div>
  );
}

export default Login
