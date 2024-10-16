import express from "express";
import { authUser, authAdmin } from "../../middleware/auth";
import {
  createBusiness,
  getBusinessAdminList,
  getBusinessList,
} from "./business";

const BusinessRouter = express.Router();

BusinessRouter.post("/admin/create", authAdmin, createBusiness);
BusinessRouter.get("/admin/list", authAdmin, getBusinessAdminList);
BusinessRouter.get("/list", getBusinessList);

export default BusinessRouter;
