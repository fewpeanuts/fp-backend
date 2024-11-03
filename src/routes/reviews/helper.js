import { ObjectId } from "mongodb";

export const processReviews = (reviews, questions) => {
  const reviewSummary = initializeReviewSummary(questions);

  reviews.forEach((review) => {
    review.reviewId = review._id;
    const stats = {
      likes: review.helpfulnessVotes.filter((vote) => vote.voteType === "like")
        .length,
      dislikes: review.helpfulnessVotes.filter(
        (vote) => vote.voteType === "dislike"
      ).length,
      userVote: null,
      reviewId: review._id,
    };

    review.answers.forEach((answer) => {
      updateQuestionSummary(
        reviewSummary[answer.questionId],
        answer,
        review,
        stats
      );
    });
  });

  finalizeReviewSummary(reviewSummary);
  return reviewSummary;
};

const initializeReviewSummary = (questions) => {
  return questions.reduce((acc, question) => {
    acc[question._id] = {
      questionText: question.questionText,
      questionType: question.questionType,
      yesCount: 0,
      noCount: 0,
      totalRating: 0,
      ratingCount: 0,
      openEndedResponses: [],
    };

    return acc;
  }, {});
};

const updateQuestionSummary = (summary, answer, review, stats) => {
  switch (summary.questionType) {
    case "yes-no":
      summary[
        answer.answerText.toLowerCase() === "yes" ? "yesCount" : "noCount"
      ]++;
      break;
    case "rating":
      summary.totalRating += answer.rating;
      summary.ratingCount++;
      break;
    case "open-ended":
      summary.openEndedResponses.push({
        response: answer.answerText,
        user: `${review.userId.firstName} ${review.userId.lastName}`,
        submittedAt: review.submittedAt,
        likes: stats.likes,
        dislikes: stats.dislikes,
        userVote: stats.userVote,
        reviewId: stats.reviewId,
      });
      break;
  }
};
const finalizeReviewSummary = (reviewSummary) => {
  Object.values(reviewSummary).forEach((summary) => {
    if (summary.questionType === "rating") {
      summary.averageRating =
        summary.ratingCount > 0 ? summary.totalRating / summary.ratingCount : 0;
      delete summary.totalRating;
      delete summary.ratingCount;
    } else if (summary.questionType === "open-ended") {
      summary.openEndedResponses.sort((a, b) => b.submittedAt - a.submittedAt);
      summary.openEndedResponses = summary.openEndedResponses;
    }
  });
};

export const buildQery = (businessId, userId) => {
  const query = {};

  if (businessId) query.businessId = new ObjectId(businessId);
  if (userId) query.userId = new ObjectId(userId);

  return query;
};

export const buildQuestionsMap = (questions) => {
  return questions.reduce((acc, question) => {
    acc[question._id.toString()] = {
      questionText: question.questionText,
      questionType: question.questionType,
    };
    return acc;
  }, {});
};

export const formatReview = (reviews) =>
  reviews.map((review) => {
    const { _id, __v, ...rest } = review;
    return { id: _id.toString(), ...rest };
  });

export const formatUserReview = (reviews, questionMap) => ({
  review: reviews.map((review) => ({
    ...review,
    answers: review.answers.map((answer) => ({
      ...answer,
      questionText: questionMap[answer.questionId.toString()].questionText,
      questionType: questionMap[answer.questionId.toString()].questionType,
    })),
  })),
});

export const formatBusinessReviews = (reviews, questions, businessId) => {
  const reviewSummary = businessId
    ? { [businessId]: initializeBusinessSummary(reviews, questions) }
    : groupReviewsByBusiness(reviews, questions);

  Object.keys(reviewSummary).forEach((businessId) => {
    const businessReviews = reviews.filter(
      (review) => review.businessId._id.toString() === businessId
    );
    processBusinessReviews(
      reviewSummary[businessId],
      businessReviews,
      questions
    );
  });
  return reviewSummary;
};
const initializeBusinessSummary = (reviews, questions) => ({
  businessName: reviews[0]?.businessId.name || "Unknown Business",
  totalReviews: reviews.length,
  questions: initializeQuestionsSummary(questions),
});

const groupReviewsByBusiness = (reviews, questions) =>
  reviews.reduce((acc, review) => {
    const businessId = review.businessId._id.toString();
    if (!acc[businessId]) {
      acc[businessId] = initializeBusinessSummary([review], questions);
    } else {
      acc[businessId].totalReviews++;
    }
    return acc;
  }, {});

const initializeQuestionsSummary = (questions) =>
  questions.reduce((acc, question) => {
    acc[question._id] = {
      questionText: question.questionText,
      questionType: question.questionType,
      yesCount: 0,
      noCount: 0,
      totalRating: 0,
      ratingCount: 0,
      openEndedResponses: [],
    };
    return acc;
  }, {});

const processBusinessReviews = (businessSummary, businessReviews) => {
  businessReviews.forEach((review) => {
    review.answers.forEach((answer) => {
      updateQuestionSummary(
        businessSummary.questions[answer.questionId],
        answer,
        review
      );
    });
  });

  finalizeReviewSummary(businessSummary.questions);
};
