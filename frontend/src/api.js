import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api/v1";

const client = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Seed data
const SEED_VIDEOS = [
  {
    _id: "vid_1",
    title: "Build YouTwitter from Scratch - Node.js, Express & MongoDB",
    description: "In this comprehensive tutorial, we build a fully functional video hosting and community microblogging platform like YouTube and Twitter. We cover JWT authentication, file uploads with Multer & Cloudinary, Mongoose aggregations, and performance tips.",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
    thumbnail: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&auto=format&fit=crop",
    duration: 1420,
    views: 12500,
    isPublished: true,
    createdAt: "2026-06-10T12:00:00Z",
    owner: {
      _id: "user_chai",
      username: "chaiaurcode",
      fullName: "Hitesh Choudhary",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"
    }
  },
  {
    _id: "vid_2",
    title: "How I Learned Code in 30 Days (Secret Method)",
    description: "Stop wasting years on tutorials! In this video, I explain the project-based roadmap that helped me transition from a non-tech background to landing my first job within 30 days. No bootcamps, no expensive courses.",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop",
    duration: 600,
    views: 98420,
    isPublished: true,
    createdAt: "2026-07-01T15:30:00Z",
    owner: {
      _id: "user_devlife",
      username: "devlife",
      fullName: "Nikhil Sinha",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop"
    }
  },
  {
    _id: "vid_3",
    title: "Relaxing LoFi Beats for Coding, Writing & Studying 🎧",
    description: "Get in the zone with this curated playlist of lo-fi hip hop tracks. Perfect background music for programmers, designers, writers, and students. Grab a cup of chai and start coding!",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&auto=format&fit=crop",
    duration: 3600,
    views: 432900,
    isPublished: true,
    createdAt: "2026-05-15T08:00:00Z",
    owner: {
      _id: "user_chill",
      username: "chillvibes",
      fullName: "Lofi Cafe",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop"
    }
  },
  {
    _id: "vid_4",
    title: "Modern CSS Layout Tricks That Will Wow Your Clients",
    description: "Css is awesome! We explore some of the coolest styling techniques in 2026 including container queries, scroll-driven animations, CSS grid subgrids, and custom properties for fluid typography.",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbnail: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?w=800&auto=format&fit=crop",
    duration: 750,
    views: 18700,
    isPublished: true,
    createdAt: "2026-07-08T18:45:00Z",
    owner: {
      _id: "user_design",
      username: "designacademy",
      fullName: "Sarah Connor",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop"
    }
  },
  {
    _id: "vid_5",
    title: "Why JavaScript is Still King in 2026",
    description: "With TS, Deno, Bun, React Compiler, and edge runtimes, JS has evolved massively. Let's discuss why JS remains the most important programming language to master, despite other language hypes.",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
    thumbnail: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?w=800&auto=format&fit=crop",
    duration: 920,
    views: 54120,
    isPublished: true,
    createdAt: "2026-07-10T10:00:00Z",
    owner: {
      _id: "user_tech",
      username: "techworld",
      fullName: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop"
    }
  },
  {
    _id: "vid_6",
    title: "Vlog: A Day in the Life of a Google Engineer in Bangalore",
    description: "Spend a day with me at the Google Bangalore office. I walk you through the workspace, the amazing food courts, my meetings, coding sessions, and gym time. Hopefully, this inspires your dev journey!",
    videoFile: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
    thumbnail: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop",
    duration: 1100,
    views: 820500,
    isPublished: true,
    createdAt: "2026-04-20T09:00:00Z",
    owner: {
      _id: "user_siddharth",
      username: "siddharthcodes",
      fullName: "Siddharth Roy",
      avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop"
    }
  }
];

const SEED_TWEETS = [
  {
    _id: "twt_1",
    content: "🚀 Just finished building the backend for YouTwitter! MongoDB aggregations are incredibly powerful when designed right. Who wants a tutorial on Mongoose aggregate pipelines?",
    createdAt: "2026-07-12T10:15:00Z",
    owner: {
      _id: "user_chai",
      username: "chaiaurcode",
      fullName: "Hitesh Choudhary",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop"
    },
    likesCount: 142
  },
  {
    _id: "twt_2",
    content: "Chai and coding is the best combination. Spent the entire Sunday debugging a race condition. Found it, fixed it. The feeling is unmatched! 💻☕",
    createdAt: "2026-07-12T14:20:00Z",
    owner: {
      _id: "user_devlife",
      username: "devlife",
      fullName: "Nikhil Sinha",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop"
    },
    likesCount: 57
  },
  {
    _id: "twt_3",
    content: "Consistency beats talent. Write code every single day. Even if it is just a simple console.log. Over 365 days, it adds up to massive growth! Keep going tech community.",
    createdAt: "2026-07-11T09:00:00Z",
    owner: {
      _id: "user_tech",
      username: "techworld",
      fullName: "Alex Rivera",
      avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop"
    },
    likesCount: 95
  }
];

const SEED_COMMENTS = {
  vid_1: [
    {
      _id: "com_1",
      content: "This is exactly what I was looking for! The section on JWT verification and refresh token mechanics was masterclass.",
      createdAt: "2026-07-12T11:00:00Z",
      owner: { username: "devlife", fullName: "Nikhil Sinha", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop" }
    },
    {
      _id: "com_2",
      content: "Hitesh bhaiya, your explanation makes complex concepts so easy. Thanks for the high-quality free content!",
      createdAt: "2026-07-12T12:30:00Z",
      owner: { username: "siddharthcodes", fullName: "Siddharth Roy", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop" }
    }
  ],
  vid_2: [
    {
      _id: "com_3",
      content: "Totally agree! Project-based learning changed my life. I built 3 small React apps and understood state management better than reading docs for weeks.",
      createdAt: "2026-07-11T16:00:00Z",
      owner: { username: "techworld", fullName: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop" }
    }
  ]
};

// Initialize localStorage mock DB if empty
if (!localStorage.getItem("yt_users")) {
  localStorage.setItem("yt_users", JSON.stringify([
    { _id: "user_chai", username: "chaiaurcode", email: "hitesh@chai.com", fullName: "Hitesh Choudhary", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop", coverImage: "https://images.unsplash.com/photo-1618401471353-b98aedd07871?w=800&auto=format&fit=crop", watchHistory: [] },
    { _id: "user_devlife", username: "devlife", email: "nikhil@dev.com", fullName: "Nikhil Sinha", avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop", coverImage: "", watchHistory: [] },
    { _id: "user_chill", username: "chillvibes", email: "lofi@cafe.com", fullName: "Lofi Cafe", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop", coverImage: "", watchHistory: [] },
    { _id: "user_design", username: "designacademy", email: "sarah@design.com", fullName: "Sarah Connor", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop", coverImage: "", watchHistory: [] },
    { _id: "user_tech", username: "techworld", email: "alex@tech.com", fullName: "Alex Rivera", avatar: "https://images.unsplash.com/photo-1628157582853-a796fa650a6a?w=150&auto=format&fit=crop", coverImage: "", watchHistory: [] },
    { _id: "user_siddharth", username: "siddharthcodes", email: "siddharth@google.com", fullName: "Siddharth Roy", avatar: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop", coverImage: "", watchHistory: [] },
  ]));
}
if (!localStorage.getItem("yt_videos")) {
  localStorage.setItem("yt_videos", JSON.stringify(SEED_VIDEOS));
}
if (!localStorage.getItem("yt_tweets")) {
  localStorage.setItem("yt_tweets", JSON.stringify(SEED_TWEETS));
}
if (!localStorage.getItem("yt_comments")) {
  localStorage.setItem("yt_comments", JSON.stringify(SEED_COMMENTS));
}
if (!localStorage.getItem("yt_likes")) {
  localStorage.setItem("yt_likes", JSON.stringify([]));
}
if (!localStorage.getItem("yt_subscriptions")) {
  localStorage.setItem("yt_subscriptions", JSON.stringify([
    { subscriber: "user_devlife", channel: "user_chai" }
  ]));
}
if (!localStorage.getItem("yt_playlists")) {
  localStorage.setItem("yt_playlists", JSON.stringify([
    {
      _id: "play_1",
      name: "React Roadmap",
      description: "My personal collection of react guides and tutorials.",
      videos: ["vid_1", "vid_2"],
      owner: "user_devlife"
    }
  ]));
}

// Current logged in user (starts null or cached)
let currentUser = JSON.parse(localStorage.getItem("yt_current_user") || "null");

// Force fallback mode to mock database to make demo robust, since backend cloud MongoDB config is failing DNS.
// If the user starts backend locally, it will attempt actual HTTP calls.
let useMock = true;

const checkBackendHealth = async () => {
  try {
    const res = await client.get("/healthcheck");
    if (res.status === 200) {
      useMock = false;
      console.log("Connected to actual backend server.");
    }
  } catch (err) {
    useMock = true;
    console.log("Backend offline or unreachable. Operating in interactive mockup fallback mode.");
  }
};
checkBackendHealth();

export const setMockMode = (mode) => {
  useMock = mode;
};

export const getMockMode = () => useMock;

export const api = {
  // Authentication
  register: async (formData) => {
    if (useMock) {
      const username = formData.get("username")?.toLowerCase();
      const email = formData.get("email");
      const fullName = formData.get("fullName");
      const password = formData.get("password");
      
      const users = JSON.parse(localStorage.getItem("yt_users") || "[]");
      if (users.find(u => u.username === username || u.email === email)) {
        throw new Error("User with username or email already exists");
      }

      const newUser = {
        _id: "user_" + Math.random().toString(36).substr(2, 9),
        username,
        email,
        fullName,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop", // Fallback avatar
        coverImage: "",
        watchHistory: []
      };

      users.push(newUser);
      localStorage.setItem("yt_users", JSON.stringify(users));
      
      currentUser = newUser;
      localStorage.setItem("yt_current_user", JSON.stringify(currentUser));
      return { data: { success: true, data: currentUser, message: "User registered" } };
    }
    return client.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  login: async (emailOrUsername, password) => {
    if (useMock) {
      const users = JSON.parse(localStorage.getItem("yt_users") || "[]");
      const user = users.find(u => u.email === emailOrUsername || u.username === emailOrUsername.toLowerCase());
      if (!user) {
        throw new Error("User does not exist");
      }

      currentUser = user;
      localStorage.setItem("yt_current_user", JSON.stringify(currentUser));
      return { data: { success: true, data: { user }, message: "Logged in" } };
    }
    return client.post("/users/login", { email: emailOrUsername, username: emailOrUsername, password });
  },

  logout: async () => {
    if (useMock) {
      currentUser = null;
      localStorage.removeItem("yt_current_user");
      return { data: { success: true, message: "Logged out" } };
    }
    return client.post("/users/logout");
  },

  getCurrentUser: async () => {
    if (useMock) {
      return { data: { success: true, data: currentUser } };
    }
    return client.get("/users/current-user");
  },

  getUserProfile: async (username) => {
    if (useMock) {
      const users = JSON.parse(localStorage.getItem("yt_users") || "[]");
      const user = users.find(u => u.username === username.toLowerCase());
      if (!user) {
        throw new Error("Channel profile not found");
      }

      const subs = JSON.parse(localStorage.getItem("yt_subscriptions") || "[]");
      const subscribersCount = subs.filter(s => s.channel === user._id).length;
      const channelSubscribedToCount = subs.filter(s => s.subscriber === user._id).length;
      const isSubscribed = currentUser ? subs.some(s => s.subscriber === currentUser._id && s.channel === user._id) : false;

      const profile = {
        ...user,
        subscribersCount,
        channelSubscribedToCount,
        isSubscribed
      };
      return { data: { success: true, data: profile } };
    }
    return client.get(`/users/c/${username}`);
  },

  // Videos
  getVideos: async (query = "") => {
    if (useMock) {
      const vids = JSON.parse(localStorage.getItem("yt_videos") || "[]");
      let filtered = vids.filter(v => v.isPublished);
      if (query) {
        filtered = filtered.filter(v => 
          v.title.toLowerCase().includes(query.toLowerCase()) || 
          v.description.toLowerCase().includes(query.toLowerCase())
        );
      }
      return { data: { success: true, data: { docs: filtered } } };
    }
    return client.get(`/videos?query=${query}`);
  },

  getVideoById: async (id) => {
    if (useMock) {
      const vids = JSON.parse(localStorage.getItem("yt_videos") || "[]");
      const index = vids.findIndex(v => v._id === id);
      if (index === -1) throw new Error("Video not found");
      
      vids[index].views += 1;
      localStorage.setItem("yt_videos", JSON.stringify(vids));

      // Add to watch history
      if (currentUser) {
        const users = JSON.parse(localStorage.getItem("yt_users") || "[]");
        const uIndex = users.findIndex(u => u._id === currentUser._id);
        if (uIndex !== -1) {
          if (!users[uIndex].watchHistory) users[uIndex].watchHistory = [];
          if (!users[uIndex].watchHistory.includes(id)) {
            users[uIndex].watchHistory.push(id);
            localStorage.setItem("yt_users", JSON.stringify(users));
            currentUser.watchHistory = users[uIndex].watchHistory;
            localStorage.setItem("yt_current_user", JSON.stringify(currentUser));
          }
        }
      }

      return { data: { success: true, data: vids[index] } };
    }
    return client.get(`/videos/${id}`);
  },

  publishVideo: async (formData) => {
    if (useMock) {
      if (!currentUser) throw new Error("Authentication required");
      const title = formData.get("title");
      const description = formData.get("description");
      const videoFileObj = formData.get("videoFile");
      const thumbnailObj = formData.get("thumbnail");
      const videoFileType = videoFileObj ? videoFileObj.type : "";

      const isAudio = videoFileType.startsWith("audio") || (videoFileObj && videoFileObj.name.endsWith(".mp3"));
      const isBrowserVideo = videoFileType.startsWith("video/mp4") || 
                             videoFileType.startsWith("video/webm") || 
                             videoFileType.startsWith("video/ogg") || 
                             (videoFileObj && (videoFileObj.name.endsWith(".mp4") || videoFileObj.name.endsWith(".webm") || videoFileObj.name.endsWith(".ogg")));
      
      let videoFile = "";
      if (isAudio || isBrowserVideo) {
        videoFile = videoFileObj && videoFileObj.size > 0
          ? URL.createObjectURL(videoFileObj)
          : "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4";
      } else {
        const streams = [
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
        ];
        const randomIndex = Math.floor(Math.random() * streams.length);
        videoFile = streams[randomIndex];
      }
      
      let thumbnail = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop";
      if (thumbnailObj && thumbnailObj.size > 0) {
        try {
          thumbnail = await new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(thumbnailObj);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
          });
        } catch (e) {
          console.error("Failed to convert thumbnail to Base64, falling back to object URL:", e);
          thumbnail = URL.createObjectURL(thumbnailObj);
        }
      }

      const vids = JSON.parse(localStorage.getItem("yt_videos") || "[]");
      const newVid = {
        _id: "vid_" + Math.random().toString(36).substr(2, 9),
        title,
        description,
        videoFile,
        videoFileType,
        thumbnail,
        duration: 320,
        views: 0,
        isPublished: true,
        createdAt: new Date().toISOString(),
        owner: {
          _id: currentUser._id,
          username: currentUser.username,
          fullName: currentUser.fullName,
          avatar: currentUser.avatar
        }
      };

      try {
        vids.unshift(newVid);
        localStorage.setItem("yt_videos", JSON.stringify(vids));
      } catch (storageError) {
        console.warn("localStorage quota exceeded for Base64 image, saving with fallback placeholder instead.", storageError);
        newVid.thumbnail = "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop";
        // Update first element and save again
        vids[0] = newVid;
        localStorage.setItem("yt_videos", JSON.stringify(vids));
      }

      return { data: { success: true, data: newVid } };
    }
    return client.post("/videos", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
  },

  deleteVideo: async (id) => {
    if (useMock) {
      let vids = JSON.parse(localStorage.getItem("yt_videos") || "[]");
      vids = vids.filter(v => v._id !== id);
      localStorage.setItem("yt_videos", JSON.stringify(vids));
      return { data: { success: true, message: "Video deleted" } };
    }
    return client.delete(`/videos/${id}`);
  },

  // Comments
  getComments: async (videoId) => {
    if (useMock) {
      const commentsMap = JSON.parse(localStorage.getItem("yt_comments") || "{}");
      const list = commentsMap[videoId] || [];
      return { data: { success: true, data: { docs: list } } };
    }
    return client.get(`/comments/${videoId}`);
  },

  addComment: async (videoId, content) => {
    if (useMock) {
      if (!currentUser) throw new Error("Authentication required");
      const commentsMap = JSON.parse(localStorage.getItem("yt_comments") || "{}");
      if (!commentsMap[videoId]) commentsMap[videoId] = [];

      const newComment = {
        _id: "com_" + Math.random().toString(36).substr(2, 9),
        content,
        createdAt: new Date().toISOString(),
        owner: {
          username: currentUser.username,
          fullName: currentUser.fullName,
          avatar: currentUser.avatar
        }
      };

      commentsMap[videoId].unshift(newComment);
      localStorage.setItem("yt_comments", JSON.stringify(commentsMap));
      return { data: { success: true, data: newComment } };
    }
    return client.post(`/comments/${videoId}`, { content });
  },

  deleteComment: async (commentId) => {
    if (useMock) {
      const commentsMap = JSON.parse(localStorage.getItem("yt_comments") || "{}");
      for (const vid in commentsMap) {
        commentsMap[vid] = commentsMap[vid].filter(c => c._id !== commentId);
      }
      localStorage.setItem("yt_comments", JSON.stringify(commentsMap));
      return { data: { success: true } };
    }
    return client.delete(`/comments/c/${commentId}`);
  },

  // Tweets
  getTweets: async () => {
    if (useMock) {
      const twts = JSON.parse(localStorage.getItem("yt_tweets") || "[]");
      return { data: { success: true, data: twts } };
    }
    return client.get("/tweets/user/all"); // custom endpoint or fetch all
  },

  getUserTweets: async (userId) => {
    if (useMock) {
      const twts = JSON.parse(localStorage.getItem("yt_tweets") || "[]");
      const filtered = twts.filter(t => t.owner._id === userId);
      return { data: { success: true, data: filtered } };
    }
    return client.get(`/tweets/user/${userId}`);
  },

  createTweet: async (content) => {
    if (useMock) {
      if (!currentUser) throw new Error("Authentication required");
      const twts = JSON.parse(localStorage.getItem("yt_tweets") || "[]");
      const newTwt = {
        _id: "twt_" + Math.random().toString(36).substr(2, 9),
        content,
        createdAt: new Date().toISOString(),
        owner: {
          _id: currentUser._id,
          username: currentUser.username,
          fullName: currentUser.fullName,
          avatar: currentUser.avatar
        },
        likesCount: 0
      };
      twts.unshift(newTwt);
      localStorage.setItem("yt_tweets", JSON.stringify(twts));
      return { data: { success: true, data: newTwt } };
    }
    return client.post("/tweets", { content });
  },

  deleteTweet: async (tweetId) => {
    if (useMock) {
      let twts = JSON.parse(localStorage.getItem("yt_tweets") || "[]");
      twts = twts.filter(t => t._id !== tweetId);
      localStorage.setItem("yt_tweets", JSON.stringify(twts));
      return { data: { success: true } };
    }
    return client.delete(`/tweets/${tweetId}`);
  },

  // Subscriptions
  toggleSubscription: async (channelId) => {
    if (useMock) {
      if (!currentUser) throw new Error("Authentication required");
      const subs = JSON.parse(localStorage.getItem("yt_subscriptions") || "[]");
      const index = subs.findIndex(s => s.subscriber === currentUser._id && s.channel === channelId);
      
      let subscribed = false;
      if (index !== -1) {
        subs.splice(index, 1);
      } else {
        subs.push({ subscriber: currentUser._id, channel: channelId });
        subscribed = true;
      }
      localStorage.setItem("yt_subscriptions", JSON.stringify(subs));
      return { data: { success: true, data: { subscribed } } };
    }
    return client.post(`/subscriptions/c/${channelId}`);
  },

  getSubscribedChannels: async (userId) => {
    if (useMock) {
      const subs = JSON.parse(localStorage.getItem("yt_subscriptions") || "[]");
      const filtered = subs.filter(s => s.subscriber === userId);
      const users = JSON.parse(localStorage.getItem("yt_users") || "[]");
      const channelDetails = filtered.map(s => {
        const found = users.find(u => u._id === s.channel);
        return {
          _id: s.channel,
          channel: found ? { _id: found._id, username: found.username, fullName: found.fullName, avatar: found.avatar } : { _id: s.channel, username: "unknown", fullName: "Unknown Channel", avatar: "" }
        };
      });
      return { data: { success: true, data: channelDetails } };
    }
    return client.get(`/subscriptions/u/${userId}`);
  },

  // Likes
  toggleVideoLike: async (videoId) => {
    if (useMock) {
      if (!currentUser) throw new Error("Authentication required");
      const likes = JSON.parse(localStorage.getItem("yt_likes") || "[]");
      const index = likes.findIndex(l => l.likedBy === currentUser._id && l.video === videoId);

      let liked = false;
      if (index !== -1) {
        likes.splice(index, 1);
      } else {
        likes.push({ likedBy: currentUser._id, video: videoId });
        liked = true;
      }
      localStorage.setItem("yt_likes", JSON.stringify(likes));
      return { data: { success: true, data: { liked } } };
    }
    return client.post(`/likes/toggle/v/${videoId}`);
  },

  getVideoLikeStatus: async (videoId) => {
    if (useMock) {
      if (!currentUser) return { data: { success: true, data: { liked: false, likesCount: 0 } } };
      const likes = JSON.parse(localStorage.getItem("yt_likes") || "[]");
      const liked = likes.some(l => l.likedBy === currentUser._id && l.video === videoId);
      const likesCount = likes.filter(l => l.video === videoId).length;
      return { data: { success: true, data: { liked, likesCount } } };
    }
    // backend returns total likes through aggregate when video details are fetched, or custom query.
    return { data: { success: true, data: { liked: false, likesCount: 0 } } }; 
  },

  getLikedVideos: async () => {
    if (useMock) {
      if (!currentUser) return { data: { success: true, data: [] } };
      const likes = JSON.parse(localStorage.getItem("yt_likes") || "[]");
      const filtered = likes.filter(l => l.likedBy === currentUser._id && l.video);
      const vids = JSON.parse(localStorage.getItem("yt_videos") || "[]");
      const results = filtered.map(l => {
        const video = vids.find(v => v._id === l.video);
        return video ? { _id: l.video, video } : null;
      }).filter(Boolean);
      return { data: { success: true, data: results } };
    }
    return client.get("/likes/videos");
  },

  // Playlists
  getPlaylists: async (userId) => {
    if (useMock) {
      const lists = JSON.parse(localStorage.getItem("yt_playlists") || "[]");
      const filtered = lists.filter(p => p.owner === userId);
      return { data: { success: true, data: filtered } };
    }
    return client.get(`/playlist/user/${userId}`);
  },

  createPlaylist: async (name, description) => {
    if (useMock) {
      if (!currentUser) throw new Error("Authentication required");
      const lists = JSON.parse(localStorage.getItem("yt_playlists") || "[]");
      const newPlay = {
        _id: "play_" + Math.random().toString(36).substr(2, 9),
        name,
        description,
        videos: [],
        owner: currentUser._id
      };
      lists.push(newPlay);
      localStorage.setItem("yt_playlists", JSON.stringify(lists));
      return { data: { success: true, data: newPlay } };
    }
    return client.post("/playlist", { name, description });
  },

  addVideoToPlaylist: async (playlistId, videoId) => {
    if (useMock) {
      const lists = JSON.parse(localStorage.getItem("yt_playlists") || "[]");
      const index = lists.findIndex(p => p._id === playlistId);
      if (index === -1) throw new Error("Playlist not found");
      
      if (!lists[index].videos.includes(videoId)) {
        lists[index].videos.push(videoId);
        localStorage.setItem("yt_playlists", JSON.stringify(lists));
      }
      return { data: { success: true, data: lists[index] } };
    }
    return client.patch(`/playlist/add/${videoId}/${playlistId}`);
  },

  removeVideoFromPlaylist: async (playlistId, videoId) => {
    if (useMock) {
      const lists = JSON.parse(localStorage.getItem("yt_playlists") || "[]");
      const index = lists.findIndex(p => p._id === playlistId);
      if (index === -1) throw new Error("Playlist not found");

      lists[index].videos = lists[index].videos.filter(vId => vId !== videoId);
      localStorage.setItem("yt_playlists", JSON.stringify(lists));
      return { data: { success: true, data: lists[index] } };
    }
    return client.patch(`/playlist/remove/${videoId}/${playlistId}`);
  },

  deletePlaylist: async (playlistId) => {
    if (useMock) {
      let lists = JSON.parse(localStorage.getItem("yt_playlists") || "[]");
      lists = lists.filter(p => p._id !== playlistId);
      localStorage.setItem("yt_playlists", JSON.stringify(lists));
      return { data: { success: true } };
    }
    return client.delete(`/playlist/${playlistId}`);
  },

  getPlaylistById: async (playlistId) => {
    if (useMock) {
      const lists = JSON.parse(localStorage.getItem("yt_playlists") || "[]");
      const playlist = lists.find(p => p._id === playlistId);
      if (!playlist) throw new Error("Playlist not found");
      
      const vids = JSON.parse(localStorage.getItem("yt_videos") || "[]");
      const populatedVideos = playlist.videos.map(vId => vids.find(v => v._id === vId)).filter(Boolean);
      
      return {
        data: {
          success: true,
          data: {
            ...playlist,
            videos: populatedVideos
          }
        }
      };
    }
    return client.get(`/playlist/${playlistId}`);
  },

  // Dashboard / Channel Stats
  getChannelStats: async () => {
    if (useMock) {
      if (!currentUser) throw new Error("Authentication required");
      const vids = JSON.parse(localStorage.getItem("yt_videos") || "[]");
      const userVids = vids.filter(v => v.owner._id === currentUser._id);
      
      const totalVideos = userVids.length;
      const totalViews = userVids.reduce((sum, v) => sum + v.views, 0);

      const subs = JSON.parse(localStorage.getItem("yt_subscriptions") || "[]");
      const totalSubscribers = subs.filter(s => s.channel === currentUser._id).length;

      const likes = JSON.parse(localStorage.getItem("yt_likes") || "[]");
      const videoIds = userVids.map(v => v._id);
      const totalLikes = likes.filter(l => videoIds.includes(l.video)).length;

      return {
        data: {
          success: true,
          data: {
            totalVideos,
            totalViews,
            totalSubscribers,
            totalLikes
          }
        }
      };
    }
    return client.get("/dashboard/stats");
  },

  getChannelVideos: async () => {
    if (useMock) {
      if (!currentUser) throw new Error("Authentication required");
      const vids = JSON.parse(localStorage.getItem("yt_videos") || "[]");
      const userVids = vids.filter(v => v.owner._id === currentUser._id);
      return { data: { success: true, data: userVids } };
    }
    return client.get("/dashboard/videos");
  },
};
