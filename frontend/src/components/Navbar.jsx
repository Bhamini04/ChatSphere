import React, { useContext } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary px-3">
      <Link to="/" className="navbar-brand fw-bold">
        ChatSphere
      </Link>

      <div className="ms-auto d-flex align-items-center">
        <ThemeToggle />
        {user ? (
          <>
            <Link to="/profile" className="btn btn-light ms-2">
              {user.username}
            </Link>
            <button className="btn btn-danger ms-2" onClick={logout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-light ms-2">
              Login
            </Link>
            <Link to="/register" className="btn btn-outline-light ms-2">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
