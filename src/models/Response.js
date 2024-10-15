import { mongoose } from "../db/mongolize";
import Joi from "joi";

const AnswerSchema = mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Question",
    required: true,
  },
  answerText: {
    type: String,
    required: true,
  },
});

const ResponseSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questionnaireId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Questionnaire",
      required: true,
    },
    answers: [AnswerSchema],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { Collection: "response" }
);

const ResponseModel = mongoose.model("ResponseSchema", ResponseSchema);
module.exports = ResponseModel;
