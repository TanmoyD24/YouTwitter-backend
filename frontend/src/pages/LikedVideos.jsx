import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, FolderHeart } from "lucide-react";
import { api } from "../api";
import VideoCard from "../components/VideoCard";

export default function LikedVideos({ user }) {
  const [likedVideos, setLikedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLiked = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await api.getLikedVideos();
        // The API returns likes in shape of { _id, video: { ... } }
        const list = res.data.data.map(l => l.video).filter(Boolean);
        setLikedVideos(list);
      } catch (err) {
        console.error("Failed to load liked videos:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchLiked();
  }, [user]);

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <FolderHeart size={48} color="var(--accent-red)" style={{ marginBottom: "16px" }} />
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Liked Videos</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "6px" }}>
          Please <Link to="/auth" style={{ color: "var(--accent-blue)", fontWeight: 600 }}>Sign In</Link> to view your liked videos.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Heart size={24} color="var(--accent-red)" fill="var(--accent-red)" />
        <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Liked Videos</h1>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>Loading liked videos...</div>
      ) : likedVideos.length > 0 ? (
        <div className="video-grid">
          {likedVideos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
          No liked videos yet. Tap the like button on videos you enjoy!
        </div>
      )}
    </div>
  );
}
