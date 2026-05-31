// client/src/AuthContext.jsx
import axios from 'axios';
import React, { createContext, useContext, useEffect, useState } from 'react';


const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || window.location.origin;
const AuthContext = createContext();
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/me`, { withCredentials: true })
      .then((res) => setUser(res.data.user ?? null))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => useContext(AuthContext);