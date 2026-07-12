import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const channelId = req.user._id;

  // 1. Total videos and views
  const videoStats = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
    {
      $group: {
        _id: null,
        totalVideos: { $sum: 1 },
        totalViews: { $sum: "$views" }
      }
    }
  ]);

  const totalVideos = videoStats[0]?.totalVideos || 0;
  const totalViews = videoStats[0]?.totalViews || 0;

  // 2. Total subscribers
  const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

  // 3. Total likes on channel's videos
  const likesStats = await Video.aggregate([
    { $match: { owner: new mongoose.Types.ObjectId(channelId) } },
    {
      $lookup: {
        from: "likes",
        localField: "_id",
        foreignField: "video",
        as: "videoLikes"
      }
    },
    {
      $project: {
        likesCount: { $size: "$videoLikes" }
      }
    },
    {
      $group: {
        _id: null,
        totalLikes: { $sum: "$likesCount" }
      }
    }
  ]);

  const totalLikes = likesStats[0]?.totalLikes || 0;

  const stats = {
    totalVideos,
    totalViews,
    totalSubscribers,
    totalLikes
  };

  return res
    .status(200)
    .json(new ApiResponse(200, stats, "Channel stats fetched successfully"));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const channelId = req.user._id;

  const videos = await Video.find({ owner: channelId }).sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, videos, "Channel videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
