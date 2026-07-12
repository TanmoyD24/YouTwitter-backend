import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Video, MessageSquare, LogOut, User, Menu, Bell } from "lucide-react";
import { api } from "../api";

export default function Navbar({ onMenuClick, user, onLogout, onUploadClick }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/?search=${encodeURIComponent(searchQuery)}`);
  };

  const handleLogoutClick = async () => {
    try {
      await api.logout();
      onLogout();
      setDropdownOpen(false);
      navigate("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <nav className="glass" style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      height: "56px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 16px",
      zIndex: 100,
      borderBottom: "1px solid var(--border-color)"
    }}>
      {/* Left side */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        <button 
          onClick={onMenuClick} 
          style={{ padding: "8px", borderRadius: "50%", display: "flex", alignItems: "center" }}
          className="nav-btn-hover"
        >
          <Menu size={20} />
        </button>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{
            background: "linear-gradient(135deg, var(--accent-red), #b91c1c)",
            padding: "6px",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 10px rgba(239, 68, 68, 0.3)"
          }}>
            <Video size={18} color="#fff" />
          </div>
          <span style={{ fontWeight: 800, fontSize: "1.2rem", letterSpacing: "-0.5px" }}>
            You<span style={{ color: "var(--accent-red)" }}>Twitter</span>
          </span>
        </Link>
      </div>

      {/* Middle side (Search) */}
      <form onSubmit={handleSearchSubmit} style={{
        display: "flex",
        alignItems: "center",
        flex: "0 1 500px",
        margin: "0 16px",
        position: "relative"
      }}>
        <input
          type="text"
          placeholder="Search videos..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "8px 40px 8px 16px",
            borderRadius: "20px",
            backgroundColor: "rgba(255,255,255,0.05)",
            border: "1px solid var(--border-color)",
            fontSize: "0.9rem"
          }}
        />
        <button type="submit" style={{
          position: "absolute",
          right: "12px",
          top: "50%",
          transform: "translateY(-50%)",
          color: "var(--text-secondary)"
        }}>
          <Search size={16} />
        </button>
      </form>

      {/* Right side */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {user ? (
          <>
            <button 
              onClick={onUploadClick}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "20px",
                backgroundColor: "var(--bg-tertiary)",
                fontSize: "0.85rem",
                fontWeight: 600
              }}
              className="action-btn-hover"
            >
              <Video size={16} color="var(--accent-red)" />
              <span className="hide-mobile">Create</span>
            </button>

            <Link to="/tweets" style={{ padding: "8px", borderRadius: "50%", color: "var(--text-primary)" }}>
              <MessageSquare size={20} />
            </Link>

            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  width: "32px",
                  height: "32px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  border: "2px solid var(--border-color)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "var(--bg-tertiary)"
                }}
              >
                {user.avatar ? (
                  <img src={user.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <User size={16} />
                )}
              </button>

              {dropdownOpen && (
                <div className="glass" style={{
                  position: "absolute",
                  right: 0,
                  top: "40px",
                  width: "220px",
                  borderRadius: "var(--border-radius)",
                  boxShadow: "var(--shadow-lg)",
                  padding: "8px 0",
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden"
                }}>
                  <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border-color)" }}>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem" }} className="line-clamp-1">{user.fullName}</div>
                    <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem" }}>@{user.username}</div>
                  </div>
                  <Link 
                    to={`/c/${user.username}`} 
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      padding: "10px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "0.9rem"
                    }}
                    className="menu-item-hover"
                  >
                    <User size={16} />
                    Your Channel
                  </Link>
                  <button 
                    onClick={handleLogoutClick}
                    style={{
                      padding: "10px 16px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      fontSize: "0.9rem",
                      textAlign: "left",
                      color: "var(--accent-red)",
                      width: "100%"
                    }}
                    className="menu-item-hover"
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <Link 
            to="/auth" 
            style={{
              padding: "8px 16px",
              borderRadius: "20px",
              border: "1px solid var(--accent-red)",
              color: "var(--accent-red)",
              fontSize: "0.85rem",
              fontWeight: 600
            }}
          >
            Sign In
          </Link>
        )}
      </div>

      <style>{`
        .nav-btn-hover:hover {
          background-color: var(--bg-tertiary);
        }
        .action-btn-hover:hover {
          background-color: var(--bg-hover);
        }
        .menu-item-hover:hover {
          background-color: var(--bg-tertiary);
        }
        @media (max-width: 576px) {
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
