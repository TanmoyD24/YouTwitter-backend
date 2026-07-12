import React, { useState } from "react";
import { X, UploadCloud, Film, Image as ImageIcon } from "lucide-react";
import { api } from "../api";

export default function UploadModal({ onClose, onUploadSuccess }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!videoFile || !thumbnail) {
      setError("Please select both a video file and a thumbnail image.");
      return;
    }

    setError("");
    setLoading(true);

    // Simulate upload progress animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("videoFile", videoFile);
      formData.append("thumbnail", thumbnail);

      const response = await api.publishVideo(formData);
      
      setProgress(100);
      clearInterval(interval);

      setTimeout(() => {
        setLoading(false);
        onUploadSuccess(response.data.data);
        onClose();
      }, 300);

    } catch (err) {
      clearInterval(interval);
      setLoading(false);
      setProgress(0);
      setError(err.message || "Failed to publish video. Try again.");
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0,0,0,0.85)",
      backdropFilter: "blur(8px)",
      zIndex: 200,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px"
    }}>
      <div className="glass animate-fade-in" style={{
        width: "100%",
        maxWidth: "520px",
        borderRadius: "var(--border-radius)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        position: "relative"
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700 }}>Upload Video</h2>
          <button onClick={onClose} style={{ padding: "6px", borderRadius: "50%", display: "flex" }} className="close-hover">
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{
            backgroundColor: "rgba(239, 68, 68, 0.15)",
            border: "1px solid var(--accent-red)",
            color: "var(--accent-red)",
            padding: "10px 14px",
            borderRadius: "6px",
            fontSize: "0.85rem"
          }}>
            {error}
          </div>
        )}

        {/* Content Form */}
        {!loading ? (
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>Video Title</label>
              <input
                type="text"
                placeholder="Enter video title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: 500 }}>Description</label>
              <textarea
                placeholder="What is this video about?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                required
                style={{
                  resize: "none",
                  backgroundColor: "var(--bg-tertiary)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "8px",
                  padding: "10px 14px",
                  color: "var(--text-primary)"
                }}
              />
            </div>

            {/* File Pickers */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {/* Video File Picker */}
              <label style={{
                border: "2px dashed var(--border-color)",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                backgroundColor: videoFile ? "rgba(239, 68, 68, 0.05)" : "rgba(255,255,255,0.01)",
                borderColor: videoFile ? "var(--accent-red)" : "var(--border-color)",
                cursor: "pointer",
                transition: "all var(--transition-fast)"
              }} className="file-box-hover">
                <input
                  type="file"
                  accept="video/*,audio/*,.mp4,.mkv,.mp3"
                  onChange={(e) => setVideoFile(e.target.files[0] || null)}
                  style={{ display: "none" }}
                />
                <Film size={24} color={videoFile ? "var(--accent-red)" : "var(--text-secondary)"} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center" }} className="line-clamp-2">
                  {videoFile ? videoFile.name : "Select Video File"}
                </span>
              </label>

              {/* Thumbnail Image Picker */}
              <label style={{
                border: "2px dashed var(--border-color)",
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "8px",
                backgroundColor: thumbnail ? "rgba(59, 130, 246, 0.05)" : "rgba(255,255,255,0.01)",
                borderColor: thumbnail ? "var(--accent-blue)" : "var(--border-color)",
                cursor: "pointer",
                transition: "all var(--transition-fast)"
              }} className="file-box-hover">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setThumbnail(e.target.files[0] || null)}
                  style={{ display: "none" }}
                />
                <ImageIcon size={24} color={thumbnail ? "var(--accent-blue)" : "var(--text-secondary)"} />
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", textAlign: "center" }} className="line-clamp-2">
                  {thumbnail ? thumbnail.name : "Select Thumbnail"}
                </span>
              </label>
            </div>

            <button type="submit" style={{
              backgroundColor: "var(--accent-red)",
              color: "#fff",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: 600,
              marginTop: "8px"
            }} className="submit-btn-hover">
              Publish Video
            </button>
          </form>
        ) : (
          /* Loading Status */
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "40px 0",
            gap: "20px"
          }}>
            <UploadCloud size={48} className="upload-pulse" color="var(--accent-red)" />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontWeight: 600, fontSize: "1rem" }}>Uploading and processing video...</div>
              <div style={{ color: "var(--text-secondary)", fontSize: "0.8rem", marginTop: "4px" }}>
                This will take just a moment.
              </div>
            </div>
            {/* Progress bar */}
            <div style={{
              width: "100%",
              height: "6px",
              backgroundColor: "var(--bg-tertiary)",
              borderRadius: "3px",
              overflow: "hidden",
              marginTop: "8px"
            }}>
              <div style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "var(--accent-red)",
                transition: "width 0.2s ease"
              }} />
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{progress}% completed</div>
          </div>
        )}
      </div>

      <style>{`
        .close-hover:hover {
          background-color: var(--bg-tertiary);
        }
        .submit-btn-hover:hover {
          background-color: var(--accent-red-hover);
        }
        .upload-pulse {
          animation: pulse 1.5s infinite;
        }
      `}</style>
    </div>
  );
}
