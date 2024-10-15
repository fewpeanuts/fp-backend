import express from "express";
// import { auth, authAdmin } from "../../middleware/auth";
import { createResponse, getResponseById } from "./response";

const ResponseRouter = express.Router();

ResponseRouter.post("/create", createResponse);
ResponseRouter.get("/list", getResponseById);

export default ResponseRouter;
