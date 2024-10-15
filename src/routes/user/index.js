import express from "express";
import {
  getAllUserProfile,
  getUserProfileById,
  getUserProfile,
  loginUser,
  registerUser,
  sendOtp,
  validateToken,
  verifyOtp,
} from "./user";
import { authAdmin, authUser } from "../../middleware/auth";

const UserRouter = express.Router();
//amdin
// UserRouter.post("/adminLogin", adminLogin);
UserRouter.get("/list", authAdmin, getAllUserProfile);

UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);

UserRouter.get("/profile", authUser, getUserProfile);
UserRouter.get("/profile/:id", authUser, getUserProfileById);

UserRouter.post("/verifyOtp", verifyOtp);
UserRouter.post("/sendOtp", sendOtp);

UserRouter.get("/validate-token", authUser, validateToken);

export default UserRouter;
