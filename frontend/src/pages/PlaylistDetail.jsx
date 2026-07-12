import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Play, Trash2, ListVideo, ArrowLeft } from "lucide-react";
import { api } from "../api";

export default function PlaylistDetail({ user }) {
  const { playlistId } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchPlaylistDetails = async () => {
    setLoading(true);
    try {
      const res = await api.getPlaylistById(playlistId);
      setPlaylist(res.data.data);
    } catch (err) {
      console.error("Failed to load playlist details:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylistDetails();
  }, [playlistId]);

  const handleRemoveVideo = async (videoId) => {
    try {
      await api.removeVideoFromPlaylist(playlistId, videoId);
      setPlaylist(prev => ({
        ...prev,
        videos: prev.videos.filter(v => v._id !== videoId)
      }));
    } catch (err) {
      console.error("Failed to remove video from playlist:", err);
    }
  };

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading playlist details...</div>;
  if (!playlist) return <div style={{ padding: "40px", textAlign: "center" }}>Playlist not found.</div>;

  const isOwner = user && user._id === playlist.owner;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Back button */}
      <div>
        <Link to="/playlists" style={{ display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--text-secondary)", fontSize: "0.85rem" }} className="hover-white">
          <ArrowLeft size={16} />
          <span>Back to Playlists</span>
        </Link>
      </div>

      {/* Playlist Meta Header */}
      <div className="glass" style={{
        padding: "24px",
        borderRadius: "var(--border-radius)",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        position: "relative"
      }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", color: "var(--accent-red)" }}>
          <ListVideo size={24} />
          <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>Playlist • {playlist.videos.length} videos</span>
        </div>
        <h1 style={{ fontSize: "1.6rem", fontWeight: 800 }}>{playlist.name}</h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.95rem", lineHeight: 1.4 }}>{playlist.description}</p>
        
        {playlist.videos.length > 0 && (
          <Link to={`/v/${playlist.videos[0]._id}`} style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "#fff",
            color: "#000",
            padding: "10px 20px",
            borderRadius: "20px",
            fontWeight: 600,
            fontSize: "0.85rem",
            width: "fit-content",
            marginTop: "8px"
          }}>
            <Play size={16} fill="#000" />
            <span>Play All</span>
          </Link>
        )}
      </div>

      {/* Playlist Videos List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {playlist.videos.length > 0 ? (
          playlist.videos.map((vid, idx) => (
            <div key={vid._id} className="glass playlist-video-row" style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 16px",
              borderRadius: "8px",
              position: "relative"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                {/* Index number */}
                <span style={{ fontSize: "0.9rem", color: "var(--text-muted)", width: "20px", textAlign: "right" }}>
                  {idx + 1}
                </span>

                {/* Thumbnail */}
                <Link to={`/v/${vid._id}`} style={{ width: "120px", flexShrink: 0 }}>
                  <div style={{
                    width: "100%",
                    paddingBottom: "56.25%",
                    position: "relative",
                    borderRadius: "6px",
                    overflow: "hidden"
                  }}>
                    <img src={vid.thumbnail} alt={vid.title} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                </Link>

                {/* Video Info */}
                <div>
                  <Link to={`/v/${vid._id}`}>
                    <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "var(--text-primary)" }}>{vid.title}</h4>
                  </Link>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)", marginTop: "2px" }}>
                    <span>{vid.owner?.fullName || "Creator"}</span>
                    <span style={{ color: "var(--text-muted)", margin: "0 6px" }}>•</span>
                    <span>{vid.views.toLocaleString()} views</span>
                  </div>
                </div>
              </div>

              {/* Remove button */}
              {isOwner && (
                <button
                  onClick={() => handleRemoveVideo(vid._id)}
                  style={{ color: "var(--text-muted)", padding: "8px" }}
                  className="remove-video-btn"
                >
                  <Trash2 size={16} />
                </button>
              )}
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)", fontSize: "0.9rem" }}>
            No videos in this playlist. Start browsing and add some videos!
          </div>
        )}
      </div>

      <style>{`
        .playlist-video-row {
          transition: background-color var(--transition-fast);
        }
        .playlist-video-row:hover {
          background-color: var(--bg-secondary);
        }
        .remove-video-btn:hover {
          color: var(--accent-red) !important;
        }
        .hover-white:hover {
          color: #fff !important;
        }
      `}</style>
    </div>
  );
}
