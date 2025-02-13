import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check authentication status on initial load
  useEffect(() => {
    axios
  .get("http://localhost:5000/api/me", { withCredentials: true })
  .then((res) => {
    setUser(res.data);
  })
  .catch(() => {
    setUser(null);
  });

  }, []);


  // Login method
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/login",
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data.user);
      if (response.data.user.isAdmin) {
        navigate("/adapp");
      } else {
        navigate("/book");
      }
      return response.data;
    } catch (error) {
      console.error("Login error:", error.response?.data?.error || "Unknown error");
      throw error;
    }
  };

  // Logout method
  const logout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error.response?.data?.error || "Unknown error");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
