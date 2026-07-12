import React from "react";
import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";

export default function VideoCard({ video, onDelete }) {
  // Helper to format duration
  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
    }
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  // Helper to format view counts
  const formatViews = (views) => {
    if (views >= 1000000) {
      return `${(views / 1000000).toFixed(1)}M views`;
    }
    if (views >= 1000) {
      return `${(views / 1000).toFixed(1)}K views`;
    }
    return `${views} views`;
  };

  // Helper to format upload date
  const formatRelativeTime = (dateStr) => {
    try {
      const created = new Date(dateStr);
      const diffMs = Date.now() - created.getTime();
      const diffSecs = Math.floor(diffMs / 1000);
      const diffMins = Math.floor(diffSecs / 60);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffDays > 0) {
        if (diffDays === 1) return "1 day ago";
        if (diffDays > 30) {
          const months = Math.floor(diffDays / 30);
          return `${months} month${months > 1 ? "s" : ""} ago`;
        }
        return `${diffDays} days ago`;
      }
      if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
      if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
      return "just now";
    } catch (e) {
      return "";
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      gap: "12px",
      cursor: "pointer",
      position: "relative",
      borderRadius: "var(--border-radius)",
      overflow: "hidden",
      transition: "transform var(--transition-fast)"
    }} className="video-card-container">
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (window.confirm("Are you sure you want to delete this video?")) {
              onDelete();
            }
          }}
          style={{
            position: "absolute",
            top: "8px",
            right: "8px",
            backgroundColor: "rgba(0,0,0,0.85)",
            padding: "6px",
            borderRadius: "50%",
            color: "var(--accent-red)",
            zIndex: 10,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
          }}
          className="delete-badge-hover"
          title="Delete Video"
        >
          <Trash2 size={15} />
        </button>
      )}
      <Link to={`/v/${video._id}`} style={{ width: "100%" }}>
        {/* Thumbnail Wrapper */}
        <div style={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%", // 16:9 Aspect Ratio
          borderRadius: "var(--border-radius)",
          overflow: "hidden",
          backgroundColor: "var(--bg-secondary)"
        }}>
          <img
            src={video.thumbnail}
            alt={video.title}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform var(--transition-normal)"
            }}
            className="card-thumbnail-img"
          />
          {/* Duration Badge */}
          <span style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            backgroundColor: "rgba(0,0,0,0.8)",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontWeight: 600,
            color: "#fff"
          }}>
            {formatDuration(video.duration)}
          </span>
        </div>
      </Link>

      {/* Meta Content */}
      <div style={{ display: "flex", gap: "12px", padding: "0 4px" }}>
        {/* Channel Avatar */}
        <Link to={`/c/${video.owner.username}`}>
          <div style={{
            width: "36px",
            height: "36px",
            borderRadius: "50%",
            overflow: "hidden",
            backgroundColor: "var(--bg-tertiary)",
            border: "1px solid var(--border-color)",
            flexShrink: 0
          }}>
            {video.owner.avatar ? (
              <img
                src={video.owner.avatar}
                alt={video.owner.username}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justify: "center" }}>
                {video.owner.username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        </Link>

        {/* Video Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          <Link to={`/v/${video._id}`}>
            <h3 style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              lineHeight: "1.35",
              color: "var(--text-primary)"
            }} className="line-clamp-2">
              {video.title}
            </h3>
          </Link>
          <div style={{ display: "flex", flexDirection: "column", fontSize: "0.82rem", color: "var(--text-secondary)" }}>
            <Link to={`/c/${video.owner.username}`} className="channel-link-hover">
              {video.owner.fullName}
            </Link>
            <span style={{ color: "var(--text-muted)", marginTop: "2px" }}>
              {formatViews(video.views)} • {formatRelativeTime(video.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <style>{`
        .video-card-container:hover {
          transform: translateY(-2px);
        }
        .video-card-container:hover .card-thumbnail-img {
          transform: scale(1.05);
        }
        .channel-link-hover:hover {
          color: var(--text-primary);
        }
      `}</style>
    </div>
  );
}
