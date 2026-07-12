import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, Mail, User, Video, CheckCircle } from "lucide-react";
import { api } from "../api";

export default function Auth({ onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        // Login API
        const res = await api.login(email || username, password);
        onLogin(res.data.data.user);
        navigate("/");
      } else {
        // Register API
        const formData = new FormData();
        formData.append("username", username);
        formData.append("email", email);
        formData.append("fullName", fullName);
        formData.append("password", password);

        const res = await api.register(formData);
        onLogin(res.data.data);
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Authentication failed. Please check details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in flex-center" style={{ minHeight: "calc(100vh - 120px)", padding: "20px" }}>
      <div className="glass" style={{
        width: "100%",
        maxWidth: "400px",
        borderRadius: "var(--border-radius)",
        padding: "32px",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        boxShadow: "var(--shadow-lg)"
      }}>
        {/* Title */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", textAlign: "center" }}>
          <div style={{
            background: "linear-gradient(135deg, var(--accent-red), #b91c1c)",
            padding: "8px",
            borderRadius: "10px"
          }}>
            <Video size={24} color="#fff" />
          </div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>
            {isLogin ? "Welcome Back" : "Join YouTwitter"}
          </h2>
          <span style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            {isLogin ? "Enter credentials to access your account" : "Create a new account to publish and comment"}
          </span>
        </div>

        {error && (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid var(--accent-red)",
            color: "var(--accent-red)",
            padding: "10px 14px",
            borderRadius: "8px",
            fontSize: "0.85rem"
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {!isLogin && (
            <>
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>Full Name</label>
                <div style={{ position: "relative" }}>
                  <User size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    style={{ paddingLeft: "42px", width: "100%" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>Username</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", fontSize: "0.9rem", fontWeight: 600 }}>@</span>
                  <input
                    type="text"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{ paddingLeft: "36px", width: "100%" }}
                  />
                </div>
              </div>
            </>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>
              {isLogin ? "Username or Email" : "Email Address"}
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type={isLogin ? "text" : "email"}
                placeholder={isLogin ? "Enter username or email" : "name@example.com"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ paddingLeft: "42px", width: "100%" }}
              />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 500 }}>Password</label>
            <div style={{ position: "relative" }}>
              <Lock size={16} style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ paddingLeft: "42px", width: "100%" }}
              />
            </div>
          </div>

          <button type="submit" disabled={loading} style={{
            backgroundColor: "var(--accent-red)",
            color: "#fff",
            padding: "12px",
            borderRadius: "8px",
            fontWeight: 600,
            fontSize: "0.9rem",
            marginTop: "10px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px"
          }} className="submit-btn">
            {loading ? "Processing..." : isLogin ? "Sign In" : "Register"}
          </button>
        </form>

        {/* Footer toggle */}
        <div style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            style={{ color: "var(--accent-blue)", fontWeight: 600 }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>
      </div>

      <style>{`
        .submit-btn:hover {
          background-color: var(--accent-red-hover);
        }
      `}</style>
    </div>
  );
}
