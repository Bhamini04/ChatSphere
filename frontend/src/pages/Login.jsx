import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../api";
import { useAuth } from "../context/AuthContext";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { user, token } = await loginUser(email.trim(), password);
      // Persist both user & token – AuthContext can store as you already do
      login({ user, token });
      navigate("/chat");
    } catch (error) {
      const msg = error?.response?.data?.error || "Login failed";
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
          <div className="auth-title">Welcome back!</div>
          <div className="auth-sub">Let’s login to continue</div>
        </div>
        <div className="auth-body">
          <form onSubmit={onSubmit}>
            <div className="auth-row">
              <div className="icon-badge">✉</div>
              <input
                className="input-pill"
                placeholder="enter your email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {err && <div style={{color:"#f87171", margin:"6px 2px"}}>{err}</div>}

            <button className="btn-solid" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div style={{height:10}} />
          <button className="btn-google" type="button">
            <img alt="" src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width="18" height="18" />
            Sign in with Google
          </button>

          <div style={{marginTop:14, textAlign:"center"}}>
            <Link className="btn-link" to="/register">Don’t have an account? Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

