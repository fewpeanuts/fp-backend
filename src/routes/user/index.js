import express from "express";
import {
  getAllUserProfile,
  getUserProfileById,
  getUserProfile,
  loginUser,
  registerUser,
  sendOtp,
  verifyOtp,
  adminLogin,
} from "./user";
import { authAdmin, authUser } from "../../middleware/auth";

const UserRouter = express.Router();

//admin
UserRouter.post("/admin/login", adminLogin);
UserRouter.get("/list", authAdmin, getAllUserProfile);

//user
UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);
UserRouter.get("/profile", authUser, getUserProfile);
UserRouter.get("/profile/:id", authUser, getUserProfileById);

//OTP
UserRouter.post("/verifyOtp", verifyOtp);
UserRouter.post("/sendOtp", sendOtp);

export default UserRouter;
