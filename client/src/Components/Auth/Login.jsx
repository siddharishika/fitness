import axios from 'axios';
 
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;

function Login() {
  var navigate = useNavigate();
  var nameRef = useRef();
  var passwordRef = useRef();
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
      navigate("/");
    } catch (e) {
      console.log(e, "Nahi ho payega");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input ref={nameRef} type="text" name="username" />
        <label htmlFor="password">Password</label>
        <input ref={passwordRef} type="password" name="password" id="" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login