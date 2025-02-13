import React, { useState } from "react";
import axios from "axios";
import {
  TextField,
  Button,
  Container,
  Typography,
  Paper,
} from "@mui/material";

const Signup = () => {
  const [user, setUser] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post("http://localhost:5000/api/register", user);
      alert("Registration Successful! Please login.");

      // ✅ Clear the form fields after successful signup
      setUser({ username: "", email: "", password: "" });
    } catch (err) {
      console.error("Error during registration:", err);
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <Container maxWidth="xs">
        <Paper elevation={6} className="p-6 rounded-lg shadow-lg">
          <Typography
            variant="h4"
            className="text-center text-blue-600 font-semibold mb-4"
          >
            Sign Up
          </Typography>

          {error && (
            <Typography color="error" className="text-center mb-3">
              {error}
            </Typography>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              margin="normal"
              label="Username"
              name="username"
              value={user.username}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Email"
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <TextField
              fullWidth
              margin="normal"
              label="Password"
              type="password"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
              variant="outlined"
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className="mt-3"
            >
              Sign Up
            </Button>
          </form>

          <div className="text-center mt-4">
            <Typography>
              Already have an account?{" "}
              <a href="/" className="text-blue-600 hover:underline">
                Login here
              </a>
            </Typography>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default Signup;
