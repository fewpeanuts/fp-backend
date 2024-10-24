import express from "express";
import { authAdmin, authUser } from "../../middleware/auth";
import {
  createReview,
  getReviewByBusinessId,
  getReviewsListforAdmin,
  getAllBusinessReviewList,
} from "./review";

const ReviewRouter = express.Router();

ReviewRouter.post("/create", authUser, createReview);
ReviewRouter.get("/list/:businessId", getReviewByBusinessId);
ReviewRouter.get("/review-stats", getAllBusinessReviewList);

ReviewRouter.get("/admin/list", authAdmin, getReviewsListforAdmin);

export default ReviewRouter;
