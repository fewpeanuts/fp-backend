import express from "express";
import { authUser, authAdmin } from "../../middleware/auth";
import {
  createQuestion,
  deleteQuestion,
  getQuestionList,
  updateQuestion,
} from "./question";

const QuestionRouter = express.Router();

QuestionRouter.post("/admin/create", authAdmin, createQuestion);
QuestionRouter.put("/admin/update", authAdmin, updateQuestion);
QuestionRouter.get("/admin/list", authAdmin, getQuestionList);
QuestionRouter.delete("/admin/delete/:id", authAdmin, deleteQuestion);

export default QuestionRouter;
