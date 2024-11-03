import express from "express";
import { authAdmin, authUser } from "../../middleware/auth";
import {
  createReview,
  getReviewByBusinessId,
  getReviewsListforAdmin,
  getAllBusinessReviewList,
  createVoteForReview,
  getReviewVoteStats,
} from "./review";

const ReviewRouter = express.Router();

ReviewRouter.post("/create", authUser, createReview);
ReviewRouter.get("/list/:businessId", getReviewByBusinessId);
ReviewRouter.get("/review-stats", getAllBusinessReviewList);
ReviewRouter.post("/:reviewId/vote", authUser, createVoteForReview);
ReviewRouter.get("/:reviewId/vote-stats", getReviewVoteStats);

ReviewRouter.get("/admin/list", authAdmin, getReviewsListforAdmin);

export default ReviewRouter;
