import axios from 'axios';
 
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../Utils/AuthProvider';
import { Container, Form, Button } from 'react-bootstrap';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function Login() {
  var navigate = useNavigate();
  var nameRef = useRef();
  var passwordRef = useRef();
  const { setUser } = useAuth();
  let handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let username = nameRef.current.value;
      let password = passwordRef.current.value;
      let data = {};
      data.username = username;
      data.password = password;

      let res = await axios.post(
        `${API_BASE_URL}/login`,
        { data },
        { withCredentials: true }
      );
      const me = await axios.get(`${API_BASE_URL}/me`, { withCredentials: true });
      setUser(me.data.user);
      navigate("/");
    } catch (e) {
      console.log(e, "Nahi ho payega");
    }
  };

  return (
    <div className='mx-auto'> 
      <Container className="p-4 border rounded">
      <Form onSubmit={handleSubmit}>
        <div className="text-center mb-4">
          <h2>Login here!</h2>
        </div>
        <Form.Group className="mb-3" controlId="formGridUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" name="username" ref={nameRef} />
        </Form.Group>
        {/* <label htmlFor="username">Username:</label>
        <input ref={nameRef} type="text" name="username" /> */}
        <Form.Group  controlId="formGridPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type='password'  placeholder="Enter Password" name="password" ref={passwordRef} />
        </Form.Group>
        <br />
        {/* <label htmlFor="password">Password</label>
        <input ref={passwordRef} type="password" name="password" id="" /> */}
        <Button variant="primary" type="submit" className='w-100'>
        Login
        </Button>
      </Form>
      </Container>
    </div>
  );
}

export default Login