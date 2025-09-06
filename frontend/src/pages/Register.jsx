import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { registerUser } from "../api";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail]     = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [err, setErr]           = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    if (password !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { user, token } = await registerUser(username.trim(), email.trim(), password);
      login({ user, token });
      navigate("/chat");
    } catch (error) {
      const msg = error?.response?.data?.error || "Registration failed";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-head">
          <div className="auth-illus" />
          <div className="auth-title">Let’s get started</div>
          <div className="auth-sub">Create an account to get all features</div>
        </div>
        <div className="auth-body">
          <form onSubmit={onSubmit}>
            <div className="auth-row">
              <div className="icon-badge">👤</div>
              <input
                className="input-pill"
                placeholder="enter your full name"
                value={username}
                onChange={(e)=>setUsername(e.target.value)}
                required
              />
            </div>
            <div className="auth-row">
              <div className="icon-badge">✉</div>
              <input
                className="input-pill"
                placeholder="enter your email"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
            </div>
            <div className="auth-row">
              <div className="icon-badge">🔒</div>
              <input
                className="input-pill"
                placeholder="password"
                type="password"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
                required
              />
            </div>
            <div className="auth-row">
              <div className="icon-badge">🔁</div>
              <input
                className="input-pill"
                placeholder="confirm password"
                type="password"
                value={confirm}
                onChange={(e)=>setConfirm(e.target.value)}
                required
              />
            </div>

            {err && <div style={{color:"#f87171", margin:"6px 2px"}}>{err}</div>}

            <button className="btn-solid" disabled={loading}>
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          <div style={{height:10}} />
          <button className="btn-google" type="button">
            <img alt="" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" />
            Sign Up with Google
          </button>

          <div style={{marginTop:14, textAlign:"center"}}>
            <Link className="btn-link" to="/">Already have an account? Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
