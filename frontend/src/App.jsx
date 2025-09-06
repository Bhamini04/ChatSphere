// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ChatPage from "./pages/chatPage";
import { useAuth } from "./context/AuthContext";
import AuthProtected from "./components/AuthProtected";

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path="/"
        element={user ? <Navigate to="/chat" replace /> : <Login />}
      />
      <Route
        path="/register"
        element={user ? <Navigate to="/chat" replace /> : <Register />}
      />

      {/* Protected route */}
      <Route
        path="/chat"
        element={
          <AuthProtected>
            <ChatPage />
          </AuthProtected>
        }
      />

      {/* Catch-all → redirect */}
      <Route
        path="*"
        element={<Navigate to={user ? "/chat" : "/"} replace />}
      />
    </Routes>
  );
}

export default App;



