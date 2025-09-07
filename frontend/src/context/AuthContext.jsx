// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Persist user in localStorage
  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (savedUser) setUser(savedUser);
  }, []);

  // ✅ Login → save full user object from backend response
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Register → same as login
  const register = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // ✅ Logout → clear user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/"; // redirect to login
  };

  // ✅ Update profile → update fields but keep _id
  const updateProfile = ({ username, avatar }) => {
    setUser((prev) => ({
      ...prev,
      username: username || prev.username,
      avatar: avatar || prev.avatar,
    }));
    localStorage.setItem(
      "user",
      JSON.stringify({
        ...user,
        username: username || user.username,
        avatar: avatar || user.avatar,
      })
    );
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
};


