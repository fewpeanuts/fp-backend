import { mongoose } from "../db/mongolize";
import Joi from "joi";

const QuestionSchema = mongoose.Schema({
  questionText: { type: String, required: true, index: true, trim: true },
  questionType: {
    type: String,
    enum: ["multiple-choice", "yes-no", "open-ended"],
    required: true,
  },
  choices: {
    type: [String], //only applicable for multiple-choice questions
    required: function () {
      return this.questionType === "multiple-choice";
    },
  },
  createdAt: { type: Date, index: true, default: Date.now() },
  updatedAt: { type: Date, index: true, default: Date.now() },
});

const validateQuestion = (question) => {
  const schema = Joi.object({
    questionText: Joi.string().required(),
    questionType: Joi.string()
      .valid("multiple-choice", "yes-no", "open-ended")
      .required(),

    choices: Joi.when("questionType", {
      is: "multiple-choice",
      then: Joi.array().items(Joi.string()).min(2).required(),
      otherwise: Joi.forbidden(),
    }),
  });
  return schema.validate(question);
};
const QuestionModel = mongoose.model("Question", QuestionSchema);
exports.QuestionModel = QuestionModel;
exports.validateQuestion = validateQuestion;
