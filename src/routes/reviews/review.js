import makeResponse from "../../utils/response";

import { ReviewModel, validateReview } from "../../models/Review";
import { QuestionModel } from "../../models/Question";
import { BusinessModal } from "../../models/Business";
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

    const [reviews, questions, business] = await Promise.all([
      ReviewModel.find({ businessId }).populate("userId", "firstName lastName"),
      QuestionModel.find(),
      BusinessModal.findById({ _id: businessId })
        .select("name industry location")
        .lean(),
    ]);

    let reviewSummary = processReviews(reviews, questions);

    return makeResponse(res, 201, "Success", {
      totalReviews: reviews.length,
      business: {
        businessId: business._id,
        name: business.name,
        location: business.location,
        industry: business.industry,
      },
      reviewSummary,
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const getAllBusinessReviewList = async (req, res, next) => {
  try {
    const {
      page = 1,
      limit = 10,
      name,
      location,
      industry,
      minRating,
    } = req.query;
    const { pageSize, skip } = generatePagination(limit, page);

    const searchStage = {
      $match: { $and: [] },
    };
    let lookupStage = {};
    // Only add search conditions if they are provided
    if (name || location || industry) {
      // Add lookup stage at the beginning for business search
      lookupStage = {
        $lookup: {
          from: "businesses",
          localField: "businessId",
          foreignField: "_id",
          as: "business",
        },
      };
      // Add match conditions based on search parameters
      if (name) {
        searchStage.$match.$and.push({
          "business.name": { $regex: name, $options: "i" },
        });
      }
      if (location) {
        searchStage.$match.$and.push({
          "business.location": { $regex: location, $options: "i" },
        });
      }
      if (industry) {
        searchStage.$match.$and.push({
          "business.industry": { $regex: industry, $options: "i" },
        });
      }
    }
    const pipeline = [
      // Add search stages only if there are search conditions
      ...(searchStage.$match.$and.length > 0 ? [lookupStage, searchStage] : []),
      // Stage 1: Deconstruct the answers array
      {
        $unwind: {
          path: "$answers",
          preserveNullAndEmptyArrays: false,
        },
      },

      // Stage 2: Look up business details
      {
        $lookup: {
          from: "businesses",
          localField: "businessId",
          foreignField: "_id",
          as: "business",
        },
      },

      // Stage 3: Group and calculate statistics
      {
        $group: {
          _id: "$businessId",
          businessName: { $first: { $arrayElemAt: ["$business.name", 0] } },
          businessLocation: {
            $first: { $arrayElemAt: ["$business.location", 0] },
          },
          businessIndustry: {
            $first: { $arrayElemAt: ["$business.industry", 0] },
          },
          helpfulnessVotes: { $push: "$helpfulnessVotes" },
          uniqueReviews: { $addToSet: "$_id" },

          // Track ratings
          ratings: {
            $push: {
              $cond: [
                { $eq: ["$answers.questionType", "rating"] },
                "$answers.rating",
                null,
              ],
            },
          },

          // Track yes/no responses
          yesNoResponses: {
            $push: {
              $cond: [
                { $eq: ["$answers.questionType", "yes-no"] },
                { response: "$answers.answerText" },
                null,
              ],
            },
          },

          // Track open-ended comments with timestamps
          openEndedComments: {
            $push: {
              $cond: [
                { $eq: ["$answers.questionType", "open-ended"] },
                {
                  text: "$answers.answerText",
                  date: "$submittedAt",
                },
                null,
              ],
            },
          },
        },
      },

      // Stage 4: Calculate final metrics
      {
        $project: {
          _id: 0,
          businessId: "$_id",
          businessName: 1,
          businessLocation: 1,
          businessIndustry: 1,
          totalReviews: { $size: "$uniqueReviews" },

          // Calculate average rating
          averageRating: {
            $round: [
              {
                $avg: {
                  $filter: {
                    input: "$ratings",
                    cond: { $ne: ["$$this", null] },
                  },
                },
              },
              1,
            ],
          },

          // Calculate yes/no percentages
          yesNoMetrics: {
            $let: {
              vars: {
                validResponses: {
                  $filter: {
                    input: "$yesNoResponses",
                    cond: { $ne: ["$$this", null] },
                  },
                },
              },
              in: {
                total: { $size: "$$validResponses" },
                yesCount: {
                  $size: {
                    $filter: {
                      input: "$$validResponses",
                      cond: { $eq: ["$$this.response", "yes"] },
                    },
                  },
                },
              },
            },
          },

          // Get latest open-ended comment
          latestComment: {
            $arrayElemAt: [
              {
                $sortArray: {
                  input: {
                    $filter: {
                      input: "$openEndedComments",
                      cond: { $ne: ["$$this", null] },
                    },
                  },
                  sortBy: { date: -1 },
                },
              },
              0,
            ],
          },
        },
      },

      // Stage 5: Format final output
      {
        $project: {
          businessId: 1,
          businessName: 1,
          businessLocation: 1,
          businessIndustry: 1,
          totalReviews: 1,
          averageRating: 1,
          yesPercentage: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      "$yesNoMetrics.yesCount",
                      { $max: ["$yesNoMetrics.total", 1] },
                    ],
                  },
                  100,
                ],
              },
              1,
            ],
          },
          noPercentage: {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      {
                        $subtract: [
                          "$yesNoMetrics.total",
                          "$yesNoMetrics.yesCount",
                        ],
                      },
                      { $max: ["$yesNoMetrics.total", 1] },
                    ],
                  },
                  100,
                ],
              },
              1,
            ],
          },
          latestOpenEndedComment: "$latestComment.text",
        },
      },

      // Stage 6: Sort by review count and paginate data
      { $sort: { totalReviews: -1 } },
      { $skip: skip },
      { $limit: parseInt(pageSize) },
      {
        $addFields: {
          debug_helpfulResponses: "$wasThisReviewHelpful",
        },
      },
    ];

    if (minRating) {
      pipeline.push({
        $match: {
          averageRating: { $gte: parseFloat(minRating) },
        },
      });
    }
    // Add sorting and pagination
    pipeline.push(
      { $sort: { totalReviews: -1 } },
      { $skip: skip },
      { $limit: parseInt(pageSize) }
    );
    // Create count pipeline
    const countPipeline = pipeline.slice(0, -2); // Remove skip and limit stages
    countPipeline.push({
      $count: "totalResults",
    });

    // Execute both pipelines
    const [reviewStats, countResult] = await Promise.all([
      ReviewModel.aggregate(pipeline),
      ReviewModel.aggregate(countPipeline),
    ]);

    const totalResults = countResult[0]?.totalResults || 0;
    const metadata = generateMetadata(page, pageSize, totalResults);

    return makeResponse(res, 201, "Success", { result: reviewStats, metadata });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const createVoteForReview = async (req, res, next) => {
  try {
    const { voteType } = req.body; // 'like' or 'dislike'
    const reviewId = req.params.reviewId;
    const userId = req.user;

    if (!["like", "dislike"].includes(voteType)) {
      return res.status(400).json({ message: "Invalid vote type" });
    }
    const review = await ReviewModel.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Find existing vote by this user
    const existingVoteIndex = review.helpfulnessVotes.findIndex(
      (vote) => vote.userId.toString() === userId.toString()
    );

    if (existingVoteIndex !== -1) {
      const existingVote = review.helpfulnessVotes[existingVoteIndex];

      if (existingVote.voteType === voteType) {
        // If clicking the same button again, remove the vote
        review.helpfulnessVotes.splice(existingVoteIndex, 1);
      } else {
        // If clicking different button, update the vote
        existingVote.voteType = voteType;
        existingVote.votedAt = new Date();
      }
    } else {
      // Add new vote
      review.helpfulnessVotes.push({
        userId,
        voteType,
        votedAt: new Date(),
      });
    }

    const data = await review.save();
    return makeResponse(res, 201, "Success", {
      msg: "Review Vote submitted Successfully",
      result: data.helpfulnessVotes,
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const getReviewVoteStats = async (req, res, next) => {
  try {
    const userId = req.query.userId;

    const review = await ReviewModel.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const stats = {
      likes: review.helpfulnessVotes.filter((vote) => vote.voteType === "like")
        .length,
      dislikes: review.helpfulnessVotes.filter(
        (vote) => vote.voteType === "dislike"
      ).length,
      userVote:
        review.helpfulnessVotes.find(
          (vote) => vote.userId.toString() === userId?.toString()
        )?.voteType || null,
    };
    return makeResponse(res, 201, "Success", {
      result: stats,
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
//admin
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
    return makeResponse(res, 200, "Success", { reviews: response, metadata });
  } catch (err) {
    console.error(err);
    generateError(err, req, res, next);
  }
};
