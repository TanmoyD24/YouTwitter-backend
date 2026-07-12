import React from "react";
import { NavLink } from "react-router-dom";
import { Home, Heart, Users, ListVideo, MessageSquare, ShieldCheck } from "lucide-react";

export default function Sidebar({ isOpen, user }) {
  const links = [
    { to: "/", icon: <Home size={20} />, label: "Home" },
    { to: "/tweets", icon: <MessageSquare size={20} />, label: "Tweets" },
  ];

  if (user) {
    links.push(
      { to: `/u/subscriptions`, icon: <Users size={20} />, label: "Subscriptions" },
      { to: "/liked-videos", icon: <Heart size={20} />, label: "Liked" },
      { to: "/playlists", icon: <ListVideo size={20} />, label: "Playlists" }
    );
  }

  return (
    <aside style={{
      width: isOpen ? "240px" : "72px",
      minWidth: isOpen ? "240px" : "72px",
      backgroundColor: "var(--bg-secondary)",
      borderRight: "1px solid var(--border-color)",
      position: "fixed",
      top: "56px",
      bottom: 0,
      left: 0,
      zIndex: 90,
      padding: "12px",
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      transition: "width var(--transition-normal)",
      overflowY: "auto",
      overflowX: "hidden"
    }} className="sidebar-container">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          style={({ isActive }) => ({
            display: "flex",
            alignItems: "center",
            gap: isOpen ? "16px" : "0",
            justifyContent: isOpen ? "flex-start" : "center",
            padding: "12px",
            borderRadius: "8px",
            color: isActive ? "#fff" : "var(--text-secondary)",
            backgroundColor: isActive ? "rgba(239, 68, 68, 0.15)" : "transparent",
            fontWeight: isActive ? 600 : 400,
            textDecoration: "none",
            width: "100%",
            transition: "all var(--transition-fast)"
          })}
          className="sidebar-link"
        >
          <span style={{ display: "flex", alignItems: "center", color: "inherit" }} className="sidebar-icon">
            {link.icon}
          </span>
          {isOpen && <span style={{ fontSize: "0.9rem" }}>{link.label}</span>}
        </NavLink>
      ))}

      <style>{`
        .sidebar-link:hover {
          background-color: var(--bg-tertiary) !important;
          color: var(--text-primary) !important;
        }
        @media (max-width: 768px) {
          .sidebar-container {
            width: ${isOpen ? "240px" : "0px"} !important;
            min-width: ${isOpen ? "240px" : "0px"} !important;
            padding: ${isOpen ? "12px" : "0px"} !important;
            border-right: ${isOpen ? "1px solid var(--border-color)" : "none"} !important;
          }
        }
      `}</style>
    </aside>
  );
}
