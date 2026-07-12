import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, UserMinus } from "lucide-react";
import { api } from "../api";

export default function Subscriptions({ user }) {
  const [channels, setChannels] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSubs = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.getSubscribedChannels(user._id);
      // API returns subscription list with channel object
      const list = res.data.data.map(s => s.channel).filter(Boolean);
      setChannels(list);
    } catch (err) {
      console.error("Failed to load subscriptions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubs();
  }, [user]);

  const handleUnsubscribe = async (channelId, e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await api.toggleSubscription(channelId);
      setChannels(prev => prev.filter(c => c._id !== channelId));
    } catch (err) {
      console.error("Failed to unsubscribe:", err);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <Users size={48} color="var(--accent-red)" style={{ marginBottom: "16px" }} />
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Subscriptions</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "6px" }}>
          Please <Link to="/auth" style={{ color: "var(--accent-blue)", fontWeight: 600 }}>Sign In</Link> to view your subscribed channels.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Users size={24} color="var(--accent-red)" />
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Subscribed Channels</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>Loading subscriptions...</div>
      ) : channels.length > 0 ? (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
          gap: "16px"
        }}>
          {channels.map((chan) => (
            <div key={chan._id} className="glass" style={{
              padding: "16px",
              borderRadius: "var(--border-radius)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "12px"
            }} className="subscription-card glass">
              <Link to={`/c/${chan.username}`} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "50%", overflow: "hidden", border: "1px solid var(--border-color)", flexShrink: 0 }}>
                  <img src={chan.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 700, color: "#fff" }} className="line-clamp-1">
                    {chan.fullName}
                  </h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    @{chan.username}
                  </span>
                </div>
              </Link>
              
              <button
                onClick={(e) => handleUnsubscribe(chan._id, e)}
                style={{
                  color: "var(--text-muted)",
                  padding: "8px",
                  borderRadius: "50%"
                }}
                className="unsub-btn"
                title="Unsubscribe"
              >
                <UserMinus size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
          You have not subscribed to any channels yet.
        </div>
      )}

      <style>{`
        .subscription-card {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px;
          border-radius: var(--border-radius);
          transition: transform var(--transition-fast);
        }
        .subscription-card:hover {
          transform: translateY(-2px);
        }
        .unsub-btn:hover {
          color: var(--accent-red) !important;
          background-color: rgba(239, 68, 68, 0.1);
        }
      `}</style>
    </div>
  );
}
