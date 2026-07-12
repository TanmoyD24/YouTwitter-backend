import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ThumbsUp, MessageSquare, Trash2, Send, Heart, Play, Share2 } from "lucide-react";
import { api } from "../api";

export default function VideoDetail({ user }) {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscribersCount, setSubscribersCount] = useState(0);
  const [recommendations, setRecommendations] = useState([]);
  const [descExpanded, setDescExpanded] = useState(false);

  useEffect(() => {
    const fetchVideoData = async () => {
      try {
        const videoRes = await api.getVideoById(videoId);
        const currentVid = videoRes.data.data;
        setVideo(currentVid);

        // Fetch channel info for subscription check
        const profileRes = await api.getUserProfile(currentVid.owner.username);
        setIsSubscribed(profileRes.data.data.isSubscribed);
        setSubscribersCount(profileRes.data.data.subscribersCount);

        // Fetch likes
        const likeRes = await api.getVideoLikeStatus(videoId);
        setIsLiked(likeRes.data.data.liked);
        setLikesCount(likeRes.data.data.likesCount);

        // Fetch comments
        const commentRes = await api.getComments(videoId);
        setComments(commentRes.data.data.docs || []);

        // Fetch recommendations (other videos)
        const allVidsRes = await api.getVideos();
        const docs = allVidsRes.data?.data?.docs || [];
        setRecommendations(docs.filter((v) => v._id !== videoId));
      } catch (err) {
        console.error("Error loading video details:", err);
      }
    };

    fetchVideoData();
  }, [videoId]);

  const handleLikeToggle = async () => {
    if (!user) return alert("Please sign in to like videos");
    try {
      const res = await api.toggleVideoLike(videoId);
      setIsLiked(res.data.data.liked);
      setLikesCount((prev) => (res.data.data.liked ? prev + 1 : prev - 1));
    } catch (err) {
      console.error("Like toggle failed:", err);
    }
  };

  const handleSubscribeToggle = async () => {
    if (!user) return alert("Please sign in to subscribe");
    if (user._id === video.owner._id) return alert("You cannot subscribe to your own channel");
    try {
      const res = await api.toggleSubscription(video.owner._id);
      setIsSubscribed(res.data.data.subscribed);
      setSubscribersCount((prev) => (res.data.data.subscribed ? prev + 1 : prev - 1));
    } catch (err) {
      console.error("Subscription toggle failed:", err);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!user) return alert("Please sign in to comment");
    if (!newComment.trim()) return;

    try {
      const res = await api.addComment(videoId, newComment);
      setComments((prev) => [res.data.data, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("Adding comment failed:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
    } catch (err) {
      console.error("Deleting comment failed:", err);
    }
  };

  if (!video) return <div style={{ padding: "40px", textAlign: "center" }}>Loading video player...</div>;

  const isAudio = video.videoFile?.endsWith(".mp3") ||
                  (video.videoFileType && video.videoFileType.startsWith("audio"));

  return (
    <div className="animate-fade-in detail-layout" style={{
      display: "grid",
      gridTemplateColumns: "1fr",
      gap: "24px",
      alignItems: "start"
    }}>
      {/* Left Column (Player & Info) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Video Player */}
        <div style={{
          position: "relative",
          width: "100%",
          paddingBottom: "56.25%", // 16:9
          borderRadius: "var(--border-radius)",
          overflow: "hidden",
          backgroundColor: "#000",
          boxShadow: "var(--shadow-lg)"
        }}>
          <video
            src={video.videoFile}
            controls
            autoPlay
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              zIndex: 1
            }}
          />
          {isAudio && (
            <div style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `url(${video.thumbnail})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              zIndex: 2,
              pointerEvents: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}>
              {/* Blur glassmorphic background layer */}
              <div style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backdropFilter: "blur(24px)",
                backgroundColor: "rgba(0, 0, 0, 0.65)"
              }} />
              {/* Album art cover card */}
              <div style={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "14px",
                zIndex: 3,
                textAlign: "center",
                padding: "20px"
              }}>
                <div style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.6)",
                  border: "4px solid rgba(255,255,255,0.15)",
                  animation: "spin 20s linear infinite"
                }} className="spinning-vinyl">
                  <img src={video.thumbnail} alt="album art" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ fontWeight: 700, fontSize: "1.15rem", textShadow: "0 2px 4px rgba(0,0,0,0.8)", color: "#fff" }}>{video.title}</div>
                <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>{video.owner.fullName}</div>
              </div>
            </div>
          )}
        </div>

        {/* Video Title */}
        <h1 style={{ fontSize: "1.3rem", fontWeight: 700, lineHeight: 1.3 }}>{video.title}</h1>

        {/* Owner Info & Actions Row */}
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "16px"
        }}>
          {/* Channel Info */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link to={`/c/${video.owner.username}`}>
              <div style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                overflow: "hidden",
                border: "1px solid var(--border-color)"
              }}>
                <img src={video.owner.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            </Link>
            <div>
              <Link to={`/c/${video.owner.username}`} style={{ fontWeight: 600, fontSize: "0.95rem" }} className="hover-white">
                {video.owner.fullName}
              </Link>
              <div style={{ fontSize: "0.78rem", color: "var(--text-secondary)" }}>
                {subscribersCount} subscribers
              </div>
            </div>

            {/* Subscribe Button */}
            {(!user || user._id !== video.owner._id) && (
              <button
                onClick={handleSubscribeToggle}
                style={{
                  backgroundColor: isSubscribed ? "var(--bg-tertiary)" : "var(--text-primary)",
                  color: isSubscribed ? "var(--text-primary)" : "var(--bg-primary)",
                  padding: "8px 16px",
                  borderRadius: "20px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  marginLeft: "12px"
                }}
              >
                {isSubscribed ? "Subscribed" : "Subscribe"}
              </button>
            )}
          </div>

          {/* Action buttons (Like, Share) */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              onClick={handleLikeToggle}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 16px",
                borderRadius: "20px",
                backgroundColor: isLiked ? "rgba(239, 68, 68, 0.15)" : "var(--bg-secondary)",
                color: isLiked ? "var(--accent-red)" : "var(--text-primary)",
                fontSize: "0.85rem",
                fontWeight: 600,
                border: isLiked ? "1px solid var(--accent-red)" : "1px solid var(--border-color)"
              }}
            >
              <ThumbsUp size={16} />
              <span>{likesCount}</span>
            </button>

            <button style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "20px",
              backgroundColor: "var(--bg-secondary)",
              fontSize: "0.85rem",
              fontWeight: 600,
              border: "1px solid var(--border-color)"
            }}>
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Video Description */}
        <div style={{
          backgroundColor: "var(--bg-secondary)",
          borderRadius: "var(--border-radius)",
          padding: "16px",
          fontSize: "0.9rem",
          cursor: "pointer"
        }} onClick={() => setDescExpanded(!descExpanded)}>
          <div style={{ display: "flex", gap: "12px", color: "var(--text-primary)", fontWeight: 600, fontSize: "0.85rem", marginBottom: "6px" }}>
            <span>{video.views.toLocaleString()} views</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>
          <p style={{
            color: "var(--text-secondary)",
            whiteSpace: "pre-wrap",
            lineHeight: 1.4,
            overflow: "hidden",
            display: "-webkit-box",
            WebkitLineClamp: descExpanded ? "unset" : 3,
            WebkitBoxOrient: "vertical"
          }}>
            {video.description}
          </p>
          <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "var(--text-primary)", marginTop: "8px", display: "inline-block" }}>
            {descExpanded ? "Show less" : "Show more"}
          </span>
        </div>

        {/* Comments Section */}
        <div style={{ display: "flex", flexDirection: "column", gap: "20px", marginTop: "12px" }}>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700 }}>
            {comments.length} Comment{comments.length !== 1 ? "s" : ""}
          </h3>

          {/* Write comment */}
          {user ? (
            <form onSubmit={handleAddComment} style={{ display: "flex", gap: "12px" }}>
              <div style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                overflow: "hidden",
                flexShrink: 0
              }}>
                <img src={user.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ display: "flex", flex: 1, position: "relative" }}>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={{ width: "100%", paddingRight: "40px", borderRadius: "20px" }}
                />
                <button type="submit" style={{
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--accent-red)"
                }}>
                  <Send size={16} />
                </button>
              </div>
            </form>
          ) : (
            <div style={{ color: "var(--text-secondary)", fontSize: "0.85rem" }}>
              Please <Link to="/auth" style={{ color: "var(--accent-blue)", fontWeight: 600 }}>Sign In</Link> to comment on this video.
            </div>
          )}

          {/* Comments List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginTop: "12px" }}>
            {comments.map((comment) => (
              <div key={comment._id} style={{ display: "flex", gap: "12px", position: "relative" }} className="comment-item">
                <div style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  overflow: "hidden",
                  backgroundColor: "var(--bg-tertiary)",
                  flexShrink: 0
                }}>
                  <img src={comment.owner.avatar} alt="avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 600 }}>{comment.owner.fullName}</span>
                    <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>@{comment.owner.username}</span>
                  </div>
                  <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.35 }}>{comment.content}</p>
                </div>

                {user && user.username === comment.owner.username && (
                  <button
                    onClick={() => handleDeleteComment(comment._id)}
                    style={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                      color: "var(--text-muted)",
                      padding: "4px"
                    }}
                    className="delete-comment-btn"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column (Recommendations) */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }} className="recommendations-sidebar">
        <h2 style={{ fontSize: "1rem", fontWeight: 700, color: "var(--text-primary)" }}>Recommended</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {recommendations.map((rec) => (
            <div key={rec._id} style={{ display: "flex", gap: "10px" }}>
              <Link to={`/v/${rec._id}`} style={{ width: "140px", flexShrink: 0 }}>
                <div style={{
                  width: "100%",
                  paddingBottom: "56.25%",
                  position: "relative",
                  borderRadius: "8px",
                  overflow: "hidden",
                  backgroundColor: "var(--bg-secondary)"
                }}>
                  <img src={rec.thumbnail} alt={rec.title} style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                </div>
              </Link>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <Link to={`/v/${rec._id}`}>
                  <h4 style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.25 }} className="line-clamp-2">
                    {rec.title}
                  </h4>
                </Link>
                <div style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
                  <Link to={`/c/${rec.owner.username}`} className="hover-white">{rec.owner.fullName}</Link>
                  <div style={{ color: "var(--text-muted)", marginTop: "2px" }}>
                    {rec.views.toLocaleString()} views
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .hover-white:hover {
          color: #fff !important;
        }
        .comment-item:hover .delete-comment-btn {
          opacity: 1;
        }
        .delete-comment-btn {
          opacity: 0;
          transition: opacity var(--transition-fast);
        }
        .delete-comment-btn:hover {
          color: var(--accent-red) !important;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .spinning-vinyl {
          animation: spin 20s linear infinite;
        }
        @media (min-width: 1024px) {
          .detail-layout {
            grid-template-columns: 1fr 340px !important;
          }
        }
      `}</style>
    </div>
  );
}
