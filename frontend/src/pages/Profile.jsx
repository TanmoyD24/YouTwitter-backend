import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Plus, ListVideo, Trash2, Video, MessageSquare, PlusCircle } from "lucide-react";
import { api } from "../api";
import VideoCard from "../components/VideoCard";

export default function Profile({ currentUser }) {
  const { username } = useParams();
  const [profile, setProfile] = useState(null);
  const [activeTab, setActiveTab] = useState("videos"); // videos, playlists, tweets
  const [videos, setVideos] = useState([]);
  const [playlists, setPlaylists] = useState([]);
  const [tweets, setTweets] = useState([]);
  
  // Create playlist form
  const [newPlayName, setNewPlayName] = useState("");
  const [newPlayDesc, setNewPlayDesc] = useState("");
  const [showPlayForm, setShowPlayForm] = useState(false);

  // Post tweet form
  const [tweetContent, setTweetContent] = useState("");

  const isOwnProfile = currentUser && currentUser.username === username?.toLowerCase();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const profileRes = await api.getUserProfile(username);
        const data = profileRes.data.data;
        setProfile(data);

        // Videos
        const videosRes = await api.getVideos();
        const allVids = videosRes.data.data.docs || [];
        setVideos(allVids.filter(v => v.owner._id === data._id));

        // Playlists
        const playlistsRes = await api.getPlaylists(data._id);
        setPlaylists(playlistsRes.data.data || []);

        // Tweets
        const tweetsRes = await api.getUserTweets(data._id);
        setTweets(tweetsRes.data.data || []);
      } catch (err) {
        console.error("Error loading profile data:", err);
      }
    };

    fetchProfileData();
  }, [username]);

  const handleSubscribeToggle = async () => {
    if (!currentUser) return alert("Please sign in to subscribe");
    try {
      const res = await api.toggleSubscription(profile._id);
      setProfile(prev => ({
        ...prev,
        isSubscribed: res.data.data.subscribed,
        subscribersCount: res.data.data.subscribed ? prev.subscribersCount + 1 : prev.subscribersCount - 1
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreatePlaylist = async (e) => {
    e.preventDefault();
    if (!newPlayName.trim() || !newPlayDesc.trim()) return;

    try {
      const res = await api.createPlaylist(newPlayName, newPlayDesc);
      setPlaylists(prev => [...prev, res.data.data]);
      setNewPlayName("");
      setNewPlayDesc("");
      setShowPlayForm(false);
    } catch (err) {
      console.error("Error creating playlist:", err);
    }
  };

  const handleDeletePlaylist = async (id) => {
    try {
      await api.deletePlaylist(id);
      setPlaylists(prev => prev.filter(p => p._id !== id));
    } catch (err) {
      console.error("Error deleting playlist:", err);
    }
  };

  const handlePostTweet = async (e) => {
    e.preventDefault();
    if (!tweetContent.trim()) return;

    try {
      const res = await api.createTweet(tweetContent);
      setTweets(prev => [res.data.data, ...prev]);
      setTweetContent("");
    } catch (err) {
      console.error("Error posting tweet:", err);
    }
  };

  const handleDeleteTweet = async (id) => {
    try {
      await api.deleteTweet(id);
      setTweets(prev => prev.filter(t => t._id !== id));
    } catch (err) {
      console.error("Error deleting tweet:", err);
    }
  };

  const handleDeleteVideo = async (id) => {
    try {
      await api.deleteVideo(id);
      setVideos(prev => prev.filter(v => v._id !== id));
    } catch (err) {
      console.error("Error deleting video:", err);
    }
  };

  if (!profile) return <div style={{ padding: "40px", textAlign: "center" }}>Loading profile...</div>;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Channel Banner */}
      <div style={{
        width: "100%",
        height: "150px",
        borderRadius: "var(--border-radius)",
        background: profile.coverImage 
          ? `url(${profile.coverImage}) center/cover no-repeat`
          : "linear-gradient(90deg, #18181b 0%, #ef4444 100%)",
        border: "1px solid var(--border-color)"
      }} />

      {/* Channel Identity Section */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "20px",
        padding: "0 8px"
      }}>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <div style={{
            width: "80px",
            height: "80px",
            borderRadius: "50%",
            overflow: "hidden",
            border: "3px solid var(--bg-primary)",
            marginTop: "-40px",
            boxShadow: "var(--shadow-lg)"
          }}>
            <img src={profile.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800 }}>{profile.fullName}</h1>
            <div style={{ display: "flex", gap: "8px", alignItems: "center", fontSize: "0.85rem", color: "var(--text-secondary)" }}>
              <span>@{profile.username}</span>
              <span>•</span>
              <span>{profile.subscribersCount} subscribers</span>
              <span>•</span>
              <span>{videos.length} videos</span>
            </div>
          </div>
        </div>

        {/* Subscribe / Manage Channel */}
        {!isOwnProfile ? (
          <button
            onClick={handleSubscribeToggle}
            style={{
              backgroundColor: profile.isSubscribed ? "var(--bg-tertiary)" : "var(--text-primary)",
              color: profile.isSubscribed ? "var(--text-primary)" : "var(--bg-primary)",
              padding: "10px 24px",
              borderRadius: "24px",
              fontWeight: 600,
              fontSize: "0.9rem"
            }}
          >
            {profile.isSubscribed ? "Subscribed" : "Subscribe"}
          </button>
        ) : (
          <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 500 }}>
            Your Official Channel Dashboard
          </div>
        )}
      </div>

      {/* Tabs Menu */}
      <div style={{
        display: "flex",
        borderBottom: "1px solid var(--border-color)",
        gap: "24px",
        padding: "0 8px"
      }}>
        {["videos", "playlists", "tweets"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "12px 4px",
              fontSize: "0.95rem",
              fontWeight: 600,
              textTransform: "capitalize",
              color: activeTab === tab ? "var(--text-primary)" : "var(--text-secondary)",
              borderBottom: activeTab === tab ? "3px solid var(--accent-red)" : "3px solid transparent",
              transition: "all var(--transition-fast)"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div style={{ padding: "0 8px" }}>
        {/* Videos Tab */}
        {activeTab === "videos" && (
          videos.length > 0 ? (
            <div className="video-grid">
              {videos.map(video => (
                <VideoCard 
                  key={video._id} 
                  video={video} 
                  onDelete={isOwnProfile ? () => handleDeleteVideo(video._id) : null}
                />
              ))}
            </div>
          ) : (
            <div style={{ textAlign: "center", padding: "60px 0", color: "var(--text-secondary)" }}>
              No videos uploaded by this channel yet.
            </div>
          )
        )}

        {/* Playlists Tab */}
        {activeTab === "playlists" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {isOwnProfile && (
              <div>
                {!showPlayForm ? (
                  <button
                    onClick={() => setShowPlayForm(true)}
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
                ) : (
                  <form onSubmit={handleCreatePlaylist} className="glass" style={{
                    padding: "20px",
                    borderRadius: "var(--border-radius)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                    maxWidth: "400px"
                  }}>
                    <h3 style={{ fontSize: "0.95rem", fontWeight: 700 }}>New Playlist</h3>
                    <input
                      type="text"
                      placeholder="Playlist Name"
                      value={newPlayName}
                      onChange={(e) => setNewPlayName(e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Description"
                      value={newPlayDesc}
                      onChange={(e) => setNewPlayDesc(e.target.value)}
                      required
                    />
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button type="submit" style={{
                        backgroundColor: "var(--accent-red)",
                        color: "#fff",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontWeight: 600,
                        fontSize: "0.85rem"
                      }}>
                        Save
                      </button>
                      <button type="button" onClick={() => setShowPlayForm(false)} style={{
                        backgroundColor: "var(--bg-tertiary)",
                        padding: "6px 12px",
                        borderRadius: "6px",
                        fontSize: "0.85rem"
                      }}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {playlists.length > 0 ? (
              <div className="video-grid">
                {playlists.map(play => (
                  <div key={play._id} className="glass" style={{
                    padding: "16px",
                    borderRadius: "var(--border-radius)",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    minHeight: "130px",
                    position: "relative"
                  }}>
                    <Link to={`/playlist/${play._id}`}>
                      <div style={{ display: "flex", gap: "10px", alignItems: "center", color: "var(--accent-red)", marginBottom: "8px" }}>
                        <ListVideo size={20} />
                        <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", fontWeight: 600 }}>
                          {play.videos.length} videos
                        </span>
                      </div>
                      <h4 style={{ fontWeight: 700, fontSize: "1rem", color: "#fff" }} className="line-clamp-1">
                        {play.name}
                      </h4>
                      <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)", marginTop: "4px" }} className="line-clamp-2">
                        {play.description}
                      </p>
                    </Link>

                    {isOwnProfile && (
                      <button
                        onClick={() => handleDeletePlaylist(play._id)}
                        style={{
                          position: "absolute",
                          right: "12px",
                          bottom: "12px",
                          color: "var(--text-muted)"
                        }}
                        className="delete-btn-hover"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>
                No playlists created yet.
              </div>
            )}
          </div>
        )}

        {/* Tweets Tab */}
        {activeTab === "tweets" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "20px", maxWidth: "600px" }}>
            {/* Create Tweet Form */}
            {isOwnProfile && (
              <form onSubmit={handlePostTweet} className="glass" style={{
                padding: "16px",
                borderRadius: "var(--border-radius)",
                display: "flex",
                flexDirection: "column",
                gap: "12px"
              }}>
                <textarea
                  placeholder="Share a status update or thought..."
                  value={tweetContent}
                  onChange={(e) => setTweetContent(e.target.value)}
                  required
                  rows={3}
                  maxLength={280}
                  style={{ resize: "none" }}
                />
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                    {280 - tweetContent.length} characters left
                  </span>
                  <button type="submit" style={{
                    backgroundColor: "var(--accent-red)",
                    color: "#fff",
                    padding: "6px 16px",
                    borderRadius: "16px",
                    fontWeight: 600,
                    fontSize: "0.85rem"
                  }}>
                    Post
                  </button>
                </div>
              </form>
            )}

            {/* Tweets Feed */}
            {tweets.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {tweets.map(tweet => (
                  <div key={tweet._id} className="glass" style={{
                    padding: "16px",
                    borderRadius: "var(--border-radius)",
                    position: "relative"
                  }}>
                    <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "8px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", overflow: "hidden" }}>
                        <img src={profile.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>{profile.fullName}</div>
                        <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          @{profile.username} • {new Date(tweet.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: "0.95rem", color: "var(--text-secondary)", lineHeight: 1.4, whiteSpace: "pre-wrap" }}>
                      {tweet.content}
                    </p>

                    {isOwnProfile && (
                      <button
                        onClick={() => handleDeleteTweet(tweet._id)}
                        style={{
                          position: "absolute",
                          right: "16px",
                          top: "16px",
                          color: "var(--text-muted)"
                        }}
                        className="delete-btn-hover"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0", color: "var(--text-secondary)" }}>
                No tweets posted yet.
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        .delete-btn-hover:hover {
          color: var(--accent-red) !important;
        }
      `}</style>
    </div>
  );
}
