import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import UploadModal from "./components/UploadModal";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import VideoDetail from "./pages/VideoDetail";
import Profile from "./pages/Profile";
import Tweets from "./pages/Tweets";
import Playlists from "./pages/Playlists";
import PlaylistDetail from "./pages/PlaylistDetail";
import LikedVideos from "./pages/LikedVideos";
import Subscriptions from "./pages/Subscriptions";
import { api } from "./api";

export default function App() {
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [uploadTrigger, setUploadTrigger] = useState(0);

  // Check if user session exists on mount
  useEffect(() => {
    const checkUserSession = async () => {
      try {
        const res = await api.getCurrentUser();
        if (res.data?.success && res.data?.data) {
          setUser(res.data.data);
        }
      } catch (err) {
        console.log("No active session cached.");
      } finally {
        setLoading(false);
      }
    };
    checkUserSession();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: "100vh", backgroundColor: "var(--bg-primary)" }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--accent-red)" }}>
          Loading YouTwitter...
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="app-container">
        {/* Header Navbar */}
        <Navbar
          onMenuClick={toggleSidebar}
          user={user}
          onLogout={handleLogout}
          onUploadClick={() => setUploadOpen(true)}
        />

        <div className="main-content">
          {/* Left Sidebar Navigation */}
          <Sidebar isOpen={sidebarOpen} user={user} />

          {/* Main Page Area */}
          <main className="page-container" style={{
            marginLeft: sidebarOpen ? "240px" : "72px",
            transition: "margin-left var(--transition-normal)",
            width: "100%"
          }}>
            <Routes>
              <Route path="/" element={<Home key={uploadTrigger} />} />
              <Route path="/auth" element={user ? <Navigate to="/" /> : <Auth onLogin={handleLogin} />} />
              <Route path="/v/:videoId" element={<VideoDetail user={user} />} />
              <Route path="/c/:username" element={<Profile currentUser={user} />} />
              <Route path="/tweets" element={<Tweets user={user} />} />
              <Route path="/playlists" element={<Playlists user={user} />} />
              <Route path="/playlist/:playlistId" element={<PlaylistDetail user={user} />} />
              <Route path="/liked-videos" element={<LikedVideos user={user} />} />
              <Route path="/u/subscriptions" element={<Subscriptions user={user} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </main>
        </div>

        {/* Upload Video Overlay Modal */}
        {uploadOpen && (
          <UploadModal
            onClose={() => setUploadOpen(false)}
            onUploadSuccess={(newVideo) => {
              alert("Video published successfully!");
              setUploadTrigger(prev => prev + 1);
              setUploadOpen(false);
            }}
          />
        )}
      </div>
    </Router>
  );
}
