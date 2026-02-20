import axios from 'axios';
 
import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from '../Utils/AuthProvider';
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