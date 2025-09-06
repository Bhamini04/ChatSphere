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

  const login = ({ username, avatar }) => {
    const userData = { username, avatar: avatar || "/default-avatar.png" };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const register = ({ username, avatar }) => {
    const userData = { username, avatar: avatar || "/default-avatar.png" };
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.location.href = "/"; // redirect to login
  };

  const updateProfile = ({ username, avatar }) => {
    setUser((prev) => ({
      ...prev,
      username: username || prev.username,
      avatar: avatar || prev.avatar,
    }));
    localStorage.setItem(
      "user",
      JSON.stringify({
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

