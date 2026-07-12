import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const existingLike = await Like.findOne({
    video: videoId,
    likedBy: req.user._id
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { liked: false }, "Video unliked successfully"));
  } else {
    await Like.create({
      video: videoId,
      likedBy: req.user._id
    });
    return res
      .status(200)
      .json(new ApiResponse(200, { liked: true }, "Video liked successfully"));
  }
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const existingLike = await Like.findOne({
    comment: commentId,
    likedBy: req.user._id
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { liked: false }, "Comment unliked successfully"));
  } else {
    await Like.create({
      comment: commentId,
      likedBy: req.user._id
    });
    return res
      .status(200)
      .json(new ApiResponse(200, { liked: true }, "Comment liked successfully"));
  }
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const existingLike = await Like.findOne({
    tweet: tweetId,
    likedBy: req.user._id
  });

  if (existingLike) {
    await Like.findByIdAndDelete(existingLike._id);
    return res
      .status(200)
      .json(new ApiResponse(200, { liked: false }, "Tweet unliked successfully"));
  } else {
    await Like.create({
      tweet: tweetId,
      likedBy: req.user._id
    });
    return res
      .status(200)
      .json(new ApiResponse(200, { liked: true }, "Tweet liked successfully"));
  }
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likedVideos = await Like.aggregate([
    {
      $match: {
        likedBy: new mongoose.Types.ObjectId(req.user._id),
        video: { $exists: true, $ne: null }
      }
    },
    {
      $lookup: {
        from: "videos",
        localField: "video",
        foreignField: "_id",
        as: "videoDetails"
      }
    },
    {
      $unwind: "$videoDetails"
    },
    {
      $lookup: {
        from: "users",
        localField: "videoDetails.owner",
        foreignField: "_id",
        as: "ownerDetails"
      }
    },
    {
      $unwind: "$ownerDetails"
    },
    {
      $project: {
        _id: 1,
        video: {
          _id: "$videoDetails._id",
          videoFile: "$videoDetails.videoFile",
          thumbnail: "$videoDetails.thumbnail",
          title: "$videoDetails.title",
          description: "$videoDetails.description",
          views: "$videoDetails.views",
          duration: "$videoDetails.duration",
          createdAt: "$videoDetails.createdAt",
          owner: {
            _id: "$ownerDetails._id",
            username: "$ownerDetails.username",
            fullName: "$ownerDetails.fullName",
            avatar: "$ownerDetails.avatar"
          }
        }
      }
    }
  ]);

  return res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
