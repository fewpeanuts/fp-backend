import express from "express";
import { authUser, authAdmin } from "../../middleware/auth";
import { createQuestionnaire, getQuestionnaireById } from "./questionnaire";

const QuestionnaireRouter = express.Router();

QuestionnaireRouter.post("/create", authAdmin, createQuestionnaire);
QuestionnaireRouter.get("/list", authUser, getQuestionnaireById);

export default QuestionnaireRouter;
