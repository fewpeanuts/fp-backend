import { mongoose } from "../db/mongolize";
import Joi, { required } from "joi";
import mongoosePaginate from "mongoose-paginate-v2";

const AnswerSchema = mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  questionType: {
    type: String,
    enum: ["open-ended", "yes-no", "rating"],
    required: true,
  },
  answerText: {
    type: String,
    required: function () {
      return (
        this.questionType === "open-ended" || this.questionType === "yes-no"
      );
    },
  },
  rating: {
    type: Number,
    required: function () {
      return this.questionType === "rating";
    },
  },
});

const ReviewSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    businessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Business",
      required: true,
    },

    answers: [AnswerSchema],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { Collection: "review" }
);
ReviewSchema.set("toJSON", {
  versionKey: false,
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id, delete ret._v;
  },
});
// Add pagination plugin
ReviewSchema.plugin(mongoosePaginate);
const validateReview = (review) => {
  const schema = Joi.object({
    businessId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),
    userId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/)
      .required(),

    answers: Joi.array()
      .items(
        Joi.object({
          questionId: Joi.string()
            .regex(/^[0-9a-fA-F]{24}$/)
            .required(),
          questionType: Joi.string()
            .valid("open-ended", "yes-no", "rating")
            .required(),
          answerText: Joi.string().when("questionType", {
            is: Joi.valid("open-ended", "yes-no"),
            then: Joi.required(),
            otherwise: Joi.forbidden(),
          }),
          rating: Joi.number().integer().min(1).max(10).when("questionType", {
            is: "rating",
            then: Joi.required(),
            otherwise: Joi.forbidden(),
          }),
        })
      )
      .min(1)
      .required(),
  });
  return schema.validate(review);
};
const ReviewModel = mongoose.model("Review", ReviewSchema);
exports.ReviewModel = ReviewModel;
exports.validateReview = validateReview;
