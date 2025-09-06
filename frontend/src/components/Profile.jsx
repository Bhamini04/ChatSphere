// frontend/src/components/Profile.jsx
import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-3 h-100 d-flex flex-column">
      {/* Profile Picture */}
      <div className="text-center mb-3">
        <img
          src={user?.avatar || "https://via.placeholder.com/100"}
          alt="Profile"
          className="rounded-circle mb-2"
          width="100"
          height="100"
        />
        <h5>{user?.username || "Guest"}</h5>
        <p className="text-muted">{user?.email || "No email available"}</p>
      </div>

      {/* Options */}
      <div className="mt-auto">
        <button
          className="btn btn-outline-danger w-100"
          onClick={logout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
