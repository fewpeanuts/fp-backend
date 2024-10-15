import express from "express";
import { authUser, authAdmin } from "../../middleware/auth";
import { createBusiness, getBusinessList } from "./business";

const BusinessRouter = express.Router();

BusinessRouter.post("/create", authAdmin, createBusiness);
BusinessRouter.get("/list", getBusinessList);

export default BusinessRouter;
