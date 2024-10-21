import makeResponse from "../../utils/response";

import { ReviewModel, validateReview } from "../../models/Review";
import { QuestionModel } from "../../models/Question";
import { generateError, generateMetadata, generatePagination } from "../utils";
import {
  buildQery,
  buildQuestionsMap,
  formatBusinessReviews,
  formatReview,
  formatUserReview,
  processReviews,
} from "./helper";

export const createReview = async (req, res, next) => {
  try {
    const responseParams = req.body;
    responseParams.userId = String(req.user);

    const { error } = validateReview(responseParams, { abortEarly: false });
    if (error) return makeResponse(res, 400, error.details[0].message);

    const existingReview = await ReviewModel.findOne({
      businessId: responseParams.businessId,
      userId: responseParams.userId,
    }).lean();
    if (existingReview)
      return makeResponse(
        res,
        400,
        "User has already submitted a review for this business"
      );

    let review = await new ReviewModel({
      businessId: responseParams.businessId,
      userId: responseParams.userId, // Assuming the auth middleware adds user to req
      answers: responseParams.answers,
    }).save();

    return makeResponse(res, 201, "Success", {
      msg: "Review submitted Successfully",
      result: review,
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const getReviewByBusinessId = async (req, res, next) => {
  try {
    const businessId = req.params.businessId;
    if (!businessId)
      return makeResponse(
        res,
        400,
        "Cannot find a review with given businessId"
      );

    const [reviews, questions] = await Promise.all([
      ReviewModel.find({ businessId }).populate("userId", "firstName lastName"),
      QuestionModel.find(),
    ]);

    let reviewSummary = processReviews(reviews, questions);

    return makeResponse(res, 201, "Success", {
      totalReviews: reviews.length,
      reviewSummary,
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const getReviewsListforAdmin = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      businessId,
      userId,
      sortBy = "submittedAt",
      sortOrder = "desc",
    } = req.query;
    const query = buildQery(businessId, userId);

    const { pageSize, skip } = generatePagination(limit, page);

    const sortOption = { [sortBy]: sortOrder === "desc" ? -1 : 1 };
    const populateOption = [
      { path: "userId", select: "firstName lastName email" },
      { path: "businessId", select: "name" },
    ];

    const totalResults = await ReviewModel.countDocuments(query);

    const reviews = await ReviewModel.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(pageSize)
      .populate(populateOption)
      .lean();
    const formattedReviews = formatReview(reviews);

    const questions = await QuestionModel.find().lean();
    const questionMap = buildQuestionsMap(questions);

    const response = userId
      ? formatUserReview(formattedReviews, questionMap)
      : formatBusinessReviews(formattedReviews, questions, businessId);

    const metadata = generateMetadata(page, pageSize, totalResults);
    return makeResponse(res, 200, "Success", { ...response, metadata });
  } catch (err) {
    console.error(err);
    generateError(err, req, res, next);
  }
};
