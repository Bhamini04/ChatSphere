// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div className="d-flex flex-column align-items-center justify-content-center min-vh-100">
    <h1>Welcome to ChatSphere</h1>
    <p>Connect with your friends instantly.</p>
    <div className="mt-3">
      <Link className="btn btn-primary me-2" to="/login">Login</Link>
      <Link className="btn btn-secondary" to="/register">Register</Link>
    </div>
  </div>
);

export default Home;
