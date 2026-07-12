import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Heart, Trash2, Send } from "lucide-react";
import { api } from "../api";

export default function Tweets({ user }) {
  const [tweets, setTweets] = useState([]);
  const [newTweet, setNewTweet] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTweets = async () => {
      setLoading(true);
      try {
        const res = await api.getTweets();
        setTweets(res.data.data || []);
      } catch (err) {
        console.error("Failed to load tweets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTweets();
  }, []);

  const handlePostTweet = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please sign in to write tweets.");
    if (!newTweet.trim()) return;

    try {
      const res = await api.createTweet(newTweet);
      setTweets((prev) => [res.data.data, ...prev]);
      setNewTweet("");
    } catch (err) {
      console.error("Failed to post tweet:", err);
    }
  };

  const handleDeleteTweet = async (id) => {
    try {
      await api.deleteTweet(id);
      setTweets((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error("Failed to delete tweet:", err);
    }
  };

  const handleLikeToggle = async (id) => {
    if (!user) return alert("Please sign in to like tweets.");
    try {
      // Toggle tweet like via Likes API
      const res = await api.toggleTweetLike(id);
      
      setTweets((prev) => 
        prev.map((t) => {
          if (t._id === id) {
            const liked = res.data.data.liked;
            return {
              ...t,
              likedByUser: liked,
              likesCount: liked ? t.likesCount + 1 : Math.max(0, t.likesCount - 1)
            };
          }
          return t;
        })
      );
    } catch (err) {
      console.error("Failed to toggle tweet like:", err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px", maxWidth: "600px", margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <MessageSquare size={24} color="var(--accent-red)" />
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Community Tweets</h1>
      </div>

      {/* Post Tweet Card */}
      {user ? (
        <form onSubmit={handlePostTweet} className="glass" style={{
          padding: "16px",
          borderRadius: "var(--border-radius)",
          display: "flex",
          flexDirection: "column",
          gap: "12px"
        }}>
          <textarea
            placeholder="Share what's on your mind with the community..."
            value={newTweet}
            onChange={(e) => setNewTweet(e.target.value)}
            required
            rows={3}
            maxLength={280}
            style={{ resize: "none" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
              {280 - newTweet.length} characters remaining
            </span>
            <button type="submit" style={{
              backgroundColor: "var(--accent-red)",
              color: "#fff",
              padding: "6px 16px",
              borderRadius: "16px",
              fontWeight: 600,
              fontSize: "0.85rem",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}>
              <Send size={14} />
              Post Tweet
            </button>
          </div>
        </form>
      ) : (
        <div className="glass" style={{ padding: "16px", borderRadius: "var(--border-radius)", color: "var(--text-secondary)", fontSize: "0.85rem", textAlign: "center" }}>
          Please <Link to="/auth" style={{ color: "var(--accent-blue)", fontWeight: 600 }}>Sign In</Link> to post tweets in the community board.
        </div>
      )}

      {/* Tweets Feed */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>Loading community feed...</div>
      ) : tweets.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {tweets.map((tweet) => (
            <div key={tweet._id} className="glass" style={{
              padding: "16px",
              borderRadius: "var(--border-radius)",
              position: "relative",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            }}>
              {/* Header */}
              <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Link to={`/c/${tweet.owner.username}`}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", overflow: "hidden", border: "1px solid var(--border-color)" }}>
                    <img src={tweet.owner.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </Link>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Link to={`/c/${tweet.owner.username}`} style={{ fontSize: "0.9rem", fontWeight: 700 }} className="hover-white">
                      {tweet.owner.fullName}
                    </Link>
                    <span style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>@{tweet.owner.username}</span>
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "1px" }}>
                    {new Date(tweet.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Body */}
              <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.45, whiteSpace: "pre-wrap" }}>
                {tweet.content}
              </p>

              {/* Footer (Actions) */}
              <div style={{ display: "flex", gap: "20px", marginTop: "4px" }}>
                <button
                  onClick={() => handleLikeToggle(tweet._id)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    fontSize: "0.8rem",
                    color: tweet.likedByUser ? "var(--accent-red)" : "var(--text-secondary)"
                  }}
                  className="tweet-like-btn"
                >
                  <Heart size={15} fill={tweet.likedByUser ? "var(--accent-red)" : "transparent"} />
                  <span>{tweet.likesCount || 0}</span>
                </button>
              </div>

              {/* Delete owned tweets */}
              {user && user._id === tweet.owner._id && (
                <button
                  onClick={() => handleDeleteTweet(tweet._id)}
                  style={{
                    position: "absolute",
                    right: "16px",
                    top: "16px",
                    color: "var(--text-muted)",
                    padding: "4px"
                  }}
                  className="delete-twt-hover"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
          No tweets posted yet. Be the first one to write a tweet!
        </div>
      )}

      <style>{`
        .hover-white:hover {
          color: #fff !important;
        }
        .tweet-like-btn:hover {
          color: var(--accent-red) !important;
        }
        .delete-twt-hover:hover {
          color: var(--accent-red) !important;
        }
      `}</style>
    </div>
  );
}
