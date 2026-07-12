import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ListVideo, Trash2, PlusCircle, FolderHeart } from "lucide-react";
import { api } from "../api";

export default function Playlists({ user }) {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (!user) return;
      setLoading(true);
      try {
        const res = await api.getPlaylists(user._id);
        setPlaylists(res.data.data || []);
      } catch (err) {
        console.error("Failed to load playlists:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlaylists();
  }, [user]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    try {
      const res = await api.createPlaylist(name, description);
      setPlaylists((prev) => [...prev, res.data.data]);
      setName("");
      setDescription("");
      setShowForm(false);
    } catch (err) {
      console.error("Failed to create playlist:", err);
    }
  };

  const handleDelete = async (id, e) => {
    e.preventDefault(); // prevent navigation
    e.stopPropagation();
    try {
      await api.deletePlaylist(id);
      setPlaylists((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Failed to delete playlist:", err);
    }
  };

  if (!user) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <FolderHeart size={48} color="var(--accent-red)" style={{ marginBottom: "16px" }} />
        <h2 style={{ fontSize: "1.2rem", fontWeight: 700 }}>Your Playlists</h2>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.85rem", marginTop: "6px" }}>
          Please <Link to="/auth" style={{ color: "var(--accent-blue)", fontWeight: 600 }}>Sign In</Link> to create and view your custom playlists.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <ListVideo size={24} color="var(--accent-red)" />
          <h1 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Custom Playlists</h1>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            backgroundColor: "var(--bg-secondary)",
            padding: "8px 16px",
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: 600,
            border: "1px solid var(--border-color)"
          }}
        >
          <PlusCircle size={16} color="var(--accent-red)" />
          Create Playlist
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="glass" style={{
          padding: "20px",
          borderRadius: "var(--border-radius)",
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          maxWidth: "450px"
        }}>
          <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>New Playlist</h3>
          <input
            type="text"
            placeholder="Playlist Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="submit" style={{
              backgroundColor: "var(--accent-red)",
              color: "#fff",
              padding: "8px 16px",
              borderRadius: "6px",
              fontWeight: 600,
              fontSize: "0.85rem"
            }}>
              Create
            </button>
            <button type="button" onClick={() => setShowForm(false)} style={{
              backgroundColor: "var(--bg-tertiary)",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "0.85rem"
            }}>
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0" }}>Loading playlists...</div>
      ) : playlists.length > 0 ? (
        <div className="video-grid">
          {playlists.map((playlist) => (
            <div key={playlist._id} className="glass" style={{
              padding: "20px",
              borderRadius: "var(--border-radius)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              minHeight: "140px",
              position: "relative"
            }} className="playlist-card glass">
              <Link to={`/playlist/${playlist._id}`}>
                <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "var(--accent-red)", marginBottom: "8px" }}>
                  <ListVideo size={20} />
                  <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                    {playlist.videos.length} videos
                  </span>
                </div>
                <h4 style={{ fontWeight: 700, fontSize: "1.05rem", color: "#fff" }} className="line-clamp-1">
                  {playlist.name}
                </h4>
                <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginTop: "4px" }} className="line-clamp-2">
                  {playlist.description}
                </p>
              </Link>
              <button
                onClick={(e) => handleDelete(playlist._id, e)}
                style={{
                  position: "absolute",
                  right: "12px",
                  bottom: "12px",
                  color: "var(--text-muted)"
                }}
                className="del-playlist-btn"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
          No playlists created yet. Start organizing your favorite videos!
        </div>
      )}

      <style>{`
        .playlist-card {
          transition: transform var(--transition-fast);
        }
        .playlist-card:hover {
          transform: translateY(-2px);
        }
        .del-playlist-btn:hover {
          color: var(--accent-red) !important;
        }
      `}</style>
    </div>
  );
}
