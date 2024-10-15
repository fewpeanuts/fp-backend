import { mongoose } from "../db/mongolize";
import Joi from "joi";

const QuestionnaireSchema = mongoose.Schema(
  {
    title: { type: String, required: true, index: true, trim: true },
    description: { type: String, trim: true },
    type: { type: String, required: true, index: true, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: "Question" }],
    createdAt: { type: Date, index: true, default: Date.now() },
    updatedAt: { type: Date, index: true, default: Date.now() },
  },
  { Collection: "questionnaire" }
);

const validateQuestionnaire = (questionnaire) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().optional(),
    type: Joi.string().required(),
    createdBy: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/) // Valid ObjectId
      .required(),
    questions: Joi.array()
      .items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
      .min(1)
      .required(),
    // createdAt: Joi.date().default(() => new Date(), "current date"),
    // updatedAt: Joi.date().default(() => new Date(), "current date"),
  });
  return schema.validate(questionnaire);
};

const QuestionnaireModel = mongoose.model("Questionnaire", QuestionnaireSchema);
exports.QuestionnaireModel = QuestionnaireModel;
exports.validateQuestionnaire = validateQuestionnaire;
