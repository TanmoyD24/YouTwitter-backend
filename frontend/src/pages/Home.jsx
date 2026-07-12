import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import VideoCard from "../components/VideoCard";
import { api } from "../api";
import { Loader2 } from "lucide-react";

const CATEGORIES = ["All", "Coding", "Lo-Fi", "Vlogs", "JavaScript", "CSS", "Tech", "Relaxation"];

export default function Home() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchParams] = useSearchParams();
  const searchQ = searchParams.get("search") || "";

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const response = await api.getVideos(searchQ);
        let docs = response.data?.data?.docs || [];
        
        // Filter by category if category is selected
        if (activeCategory !== "All") {
          docs = docs.filter(v => 
            v.title.toLowerCase().includes(activeCategory.toLowerCase()) || 
            v.description.toLowerCase().includes(activeCategory.toLowerCase())
          );
        }
        setVideos(docs);
      } catch (err) {
        console.error("Error fetching videos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideos();
  }, [searchQ, activeCategory]);

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
      {/* Category Strip */}
      <div style={{
        display: "flex",
        gap: "8px",
        overflowX: "auto",
        paddingBottom: "8px",
        whiteSpace: "nowrap"
      }} className="category-strip">
        {CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            style={{
              padding: "6px 12px",
              borderRadius: "16px",
              fontSize: "0.85rem",
              fontWeight: 500,
              backgroundColor: activeCategory === category ? "var(--text-primary)" : "var(--bg-secondary)",
              color: activeCategory === category ? "var(--bg-primary)" : "var(--text-primary)",
              border: activeCategory === category ? "none" : "1px solid var(--border-color)",
              flexShrink: 0
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Videos Display */}
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "100px 0" }}>
          <Loader2 className="spinner" size={32} color="var(--accent-red)" />
        </div>
      ) : videos.length > 0 ? (
        <div className="video-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      ) : (
        <div style={{
          textAlign: "center",
          padding: "80px 20px",
          color: "var(--text-secondary)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px"
        }}>
          <span style={{ fontSize: "1.1rem", fontWeight: 600 }}>No videos found</span>
          <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
            Try adjusting your search queries or category filters.
          </span>
        </div>
      )}

      <style>{`
        .category-strip::-webkit-scrollbar {
          height: 4px;
        }
        .spinner {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
