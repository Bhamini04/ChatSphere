import React, { useState } from "react";
import api from "../api";

function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/auth/register", form);
      setSuccess("Account created! Please login.");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h3 className="mb-3">Register</h3>
      {success && <div className="alert alert-success">{success}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="username"
          className="form-control mb-2"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          className="form-control mb-2"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          className="form-control mb-2"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />
        <button type="submit" className="btn btn-success w-100">
          Register
        </button>
      </form>
    </div>
  );
}