import { mongoose } from "../db/mongolize";
import Joi, { required } from "joi";

const QuestionSchema = mongoose.Schema({
  questionText: { type: String, required: true, index: true, trim: true },
  questionType: {
    type: String,
    enum: ["rating", "yes-no", "open-ended"],
    required: true,
  },
  maxRating: {
    type: Number,
    required: function () {
      return this.questionType === "rating";
    },
    default: 1,
  },
  createdAt: { type: Date, index: true, default: Date.now() },
  updatedAt: { type: Date, index: true, default: Date.now() },
});

QuestionSchema.set("toJSON", {
  versionKey: false,
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id, delete ret._v;
  },
});
const validateQuestion = (question) => {
  const schema = Joi.object({
    questionText: Joi.string().required(),
    questionType: Joi.string()
      .valid("yes-no", "rating", "open-ended")
      .required(),

    maxRating: Joi.when("questionType", {
      is: "rating",
      then: Joi.number().integer().min(1).max(10).required(),
      otherwise: Joi.forbidden(),
    }),
  });
  return schema.validate(question);
};
const QuestionModel = mongoose.model("Question", QuestionSchema);
exports.QuestionModel = QuestionModel;
exports.validateQuestion = validateQuestion;
