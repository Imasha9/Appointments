import React, { useContext, useEffect } from "react";
import { useLocation, Route, Routes, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

import BookAppointment from "./BookAppointment";
import BookedAppointments from "./BookedAppointments";
import Login from "./Login";
import Signup from "./Signup";
import AddSlot from "./AddSlot";
import AdminAppointments from "./AdminAppointments";
import AdminNavbar from "./AdminNavbar";
import Navbar from "./Navbar";

const AppContent = () => {
  const location = useLocation();
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  // The logic for navigation based on user role is always executed within the useEffect.
  useEffect(() => {
    // Early return if still loading
    if (loading) return;

    // Perform the redirection logic if user is authenticated.
    if (user) {
      if (user.email === "admin@example.com") {
        // Redirect to the admin page if user is admin
        if (location.pathname === "/" || location.pathname === "/signup") {
          navigate("/adapp"); // Redirect to admin dashboard if on login or signup
        }
      } else {
        // Redirect to book page if user is a regular user
        if (location.pathname === "/" || location.pathname === "/signup") {
          navigate("/book");
        }
      }
    }
  }, [user, loading, location.pathname, navigate]);

  // Hide navbar on login/signup pages
  const hideNavbar = location.pathname === "/" || location.pathname === "/signup";

  return (
    <div className="App">
      {/* Conditionally render Navbar or AdminNavbar based on user's role */}
      {!hideNavbar && (user?.email === "admin@example.com" ? <AdminNavbar /> : <Navbar />)}

      <div className="container mx-auto p-4">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Routes for regular users */}
          <Route path="/book" element={<BookAppointment />} />
          <Route path="/appointments" element={<BookedAppointments />} />

          {/* Admin routes (only for users with admin email) */}
          {user?.email === "admin@example.com" && (
            <>
              <Route path="/add" element={<AddSlot />} />
              <Route path="/adapp" element={<AdminAppointments />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  );
};

export default AppContent;