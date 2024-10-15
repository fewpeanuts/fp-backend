import express from "express";
import { authUser, authAdmin } from "../../middleware/auth";
import { createQuestion, getQuestionList } from "./question";

const QuestionRouter = express.Router();

QuestionRouter.post("/create", authAdmin, createQuestion);
QuestionRouter.get("/list", authAdmin, getQuestionList);

export default QuestionRouter;
