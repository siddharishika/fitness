import axios from 'axios';
 
import React, { useRef, useState } from "react";
import { Col, Container, Form, Row, Button } from 'react-bootstrap';
import {  Link, useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim());
}

function SignUp() {
  const navigate = useNavigate();
  let nameRef = useRef("");
  let emailRef = useRef("");
  let emailConfirmRef = useRef("");
  const [gender, setGender] = useState("");
  // let roleRef1=useRef("");
  // let roleRef2=useRef("");
  let passwordRef = useRef("");
  let passwordcRef = useRef("");
  let [role, setRole] = useState("");
  let profilePictureRef = useRef("");
  var [profilePicture, setProfilePicture] = useState();
  const [passwordError, setPasswordError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [emailFormatError, setEmailFormatError] = useState("");
  const onOptionChange = (e) => {
    setRole(e.target.value);
  };
  const onGenderChange = (e) => {
    setGender(e.target.value);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = emailRef.current?.value?.trim() ?? "";
    const emailConfirm = emailConfirmRef.current?.value?.trim() ?? "";
    const password = passwordRef.current?.value ?? "";
    const passwordConfirm = passwordcRef.current?.value ?? "";

    if (!isValidEmail(email)) {
      setEmailFormatError("Please enter a valid email address.");
      return;
    }

    if (email !== emailConfirm) {
      setEmailError("Emails do not match. Please re-enter your confirm email.");
      return;
    }

    if (password !== passwordConfirm) {
      setPasswordError("Passwords do not match. Please re-enter your confirm password.");
      return;
    }

    if (!gender) {
      return;
    }

    if (!role) {
      return;
    }

    setEmailFormatError("");
    setEmailError("");
    setPasswordError("");
    const formData = new FormData();
    formData.append("username", nameRef.current?.value?.trim() ?? "");
    formData.append("email", email);
    formData.append("password", password);
    formData.append("passwordc", passwordConfirm);
    formData.append("gender", gender);
    formData.append("role", role);
    if (profilePictureRef.current?.files?.[0]) {
      formData.append("profilePicture", profilePictureRef.current.files[0]);
    }
    try {
      await axios.post(`${API_BASE_URL}/signup`, formData, {
        withCredentials: true,
      });
      navigate("/login");
    } catch (e) {
      console.log(e, "Nahi ho payega");
    }
  };
  const handleEmailChange = () => {
    const email = emailRef.current?.value?.trim() ?? "";
    const emailConfirm = emailConfirmRef.current?.value?.trim() ?? "";

    if (email && !isValidEmail(email)) {
      setEmailFormatError("Please enter a valid email address.");
    } else {
      setEmailFormatError("");
    }

    if (emailConfirm && email !== emailConfirm) {
      setEmailError("Emails do not match.");
    } else {
      setEmailError("");
    }
  };
  const handlePasswordChange = () => {
    const password = passwordRef.current?.value ?? "";
    const passwordConfirm = passwordcRef.current?.value ?? "";
    if (passwordConfirm && password !== passwordConfirm) {
      setPasswordError("Passwords do not match.");
    } else {
      setPasswordError("");
    }
  };
  const handleFileChange = (e) => {
    e.preventDefault();
    let files = e.target.files;
    setProfilePicture(files.item(0));
  };

  return (
    <div className='mx-auto'> 
      <Container className="p-4 border rounded">
      
      <Form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        method="POST"
      >
        <div className="text-center mb-4">
          <h2>Sign Up</h2>
          <p>Create your account to get started!</p>
        </div>
        {/* <label htmlFor="name">Name:</label>
        <input type="text" name="name" ref={nameRef} required /> */}
        <Form.Group className="mb-3" controlId="formGridUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter username"
            name="username"
            ref={nameRef}
            required
          />
        </Form.Group>
        {/* <label htmlFor="username">Username:</label>
        <input type="text" name="username" ref={nameRef} required /> */}
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formGridEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              name="email"
              ref={emailRef}
              onChange={handleEmailChange}
              isInvalid={!!emailFormatError}
              required
            />
            <Form.Control.Feedback type="invalid">
              {emailFormatError}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="formGridEmailConfirm">
            <Form.Label>Confirm Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Confirm email"
              ref={emailConfirmRef}
              onChange={handleEmailChange}
              isInvalid={!!emailError}
              required
            />
            <Form.Control.Feedback type="invalid">
              {emailError}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>
        <Form.Label>Gender</Form.Label>
        
        {[ 'radio'].map((type) => (
        <div key={`gender-${type}`} className="mb-3">
          <Form.Check
            type={type}
            name="gender"
            id="Male"
            label="Male"
            value="Male"
            checked={gender === "Male"}
            onChange={onGenderChange}
            required
          />

          <Form.Check
            type={type}
            name="gender"
            id="Female"
            label="Female"
            value="Female"
            checked={gender === "Female"}
            onChange={onGenderChange}
            required
          />
        </div>
      ))}
        
        {/* <label>
          <input
            type="radio"
            name="gender"
            value="Male"
            checked={gender === "Male"}
            onChange={onGenderChange}
            required
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="Female"
            checked={gender === "Female"}
            onChange={onGenderChange}
            required
          />
          Female
        </label> */}
        <Form.Label>Role(Select coach if you are a fitness coach and want to upload content)</Form.Label>
        {[ 'radio'].map((type) => (
        <div key={`role-${type}`} className="mb-3">
          <Form.Check
            type={type}
            name="role"
            id="coach"
            label="coach"
            value="coach"
            checked={role === "coach"}
            onChange={onOptionChange}
            required
          />

          <Form.Check
            type={type}
            name="role"
            id="user"
            label="user"
            value="user"
            checked={role === "user"}
            onChange={onOptionChange}
            required
          />
        </div>
        ))}
        
        {/* <input
          type="radio"
          name="role"
          checked={role === "coach"}
          value="coach"
          onChange={onOptionChange}
          required
        />
        <label htmlFor="role-user">User</label>
        <input
          type="radio"
          name="role"
          checked={role === "user"}
          value="user"
          onChange={onOptionChange}
          required
        /> */}
        <Row className="mb-3">
        <Form.Group as={Col} controlId="formGridPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter Password"
            name="password"
            ref={passwordRef}
            onChange={handlePasswordChange}
            required
          />
        </Form.Group>

        <Form.Group as={Col} controlId="formGridPasswordConfirm">
          <Form.Label>Password Confirm</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm Password"
            name="passwordc"
            ref={passwordcRef}
            onChange={handlePasswordChange}
            isInvalid={!!passwordError}
            required
          />
          <Form.Control.Feedback type="invalid">
            {passwordError}
          </Form.Control.Feedback>
        </Form.Group>
        </Row>

        {/* <label htmlFor="password">Password:</label>
        <input type="password" ref={passwordRef} name="password" required />
        <label htmlFor="passwordc">Password Confirm:</label>
        <input type="password" ref={passwordcRef} name="passwordc" required /> */}
        <Form.Group controlId="formFileLg" className="mb-3">
          <Form.Label>Profile Picture</Form.Label>
          <Form.Control type="file" name="profilePicture" ref={profilePictureRef} onChange={handleFileChange} size="lg" accept="image/*" required />
        </Form.Group>
        {/* <label htmlFor="profilePicture">Profile Picture</label> */}
        
        {/* <input
          name="profilePicture"
          type="file"
          ref={profilePictureRef}
          onChange={handleFileChange}
          accept="image/*"
          required
        /> */}
        {/* <button type="submit">SignUp</button> */}
        <Button variant="primary" type="submit"  className='w-100'>
        Submit
        </Button>
      </Form>
      <p className="mt-3" style={{ textAlign: "center" }}>
        Already have an account?{" "}
        <Link to={`/login`}>LogIn</Link>
      </p>
      </Container>
    </div>
  );
}

export default SignUp