import express from "express";
import { authUser, authAdmin } from "../../middleware/auth";
import {
  createBusiness,
  deleteBusiness,
  getBusinessAdminList,
  getBusinessList,
  requestToAddBusiness,
  updateBusiness,
} from "./business";

const BusinessRouter = express.Router();

BusinessRouter.post("/admin/create", authAdmin, createBusiness);
BusinessRouter.get("/admin/list", authAdmin, getBusinessAdminList);
BusinessRouter.put("/admin/update", authAdmin, updateBusiness);
BusinessRouter.delete("/admin/delete/:id", authAdmin, deleteBusiness);

BusinessRouter.get("/list", getBusinessList);
BusinessRouter.post("/request-to-add", requestToAddBusiness);

export default BusinessRouter;
