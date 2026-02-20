// client/src/AuthContext.jsx
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;
const AuthContext = createContext();
export function AuthProvider({ children }) {
  let [user, setUser] = useState(null);
  
  useEffect(() => {
    axios.get(`${API_BASE_URL}/me`, { withCredentials: true })
      .then(res => setUser(res.data.user))
      .catch(() => setUser(null));
  }, []);
  return <AuthContext.Provider value={{ user, setUser }}>{children}</AuthContext.Provider>;
}
export const useAuth = () => useContext(AuthContext);