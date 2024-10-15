import jwt from "jsonwebtoken";
import { AuthenticationError } from "../utils/errors";
import makeResponse from "../utils/response";
import { UserModal } from "../models/User";
import { generateError } from "../routes/utils";

export const authUser = (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    // console.log("token", token);
    if (token && token.startsWith("Bearer")) {
      const splitToken = token.split(" ");
      const decode = jwt.verify(splitToken[1], process.env.JWT_PRIVATE_KEY);

      if (decode.exp * 1000 < Date.now()) {
        return next(new AuthenticationError("Token Expired"));
      }

      req.user = decode.id;
      return next();
    } else {
      return next(new AuthenticationError("Missing Authorization"));
    }
  } catch (err) {
    generateError(err, req, res, next);
  }
};

export const verifyUser = async (req, res, next) => {
  try {
    const { id } = req.query;
    const user = await UserModal.findById({ _id: id });
    if (!user) return makeResponse(res, 400, "User does not exist");
    req.user = user.toJSON();
    return next();
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const authAdmin = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    console.log("token", token);
    if (token && token.startsWith("Bearer")) {
      const splitToken = token.split(" ");
      const decode = jwt.verify(splitToken[1], process.env.JWT_PRIVATE_KEY);

      if (decode.exp * 1000 < Date.now()) {
        return next(new AuthenticationError("Token Expired"));
      }
      const userId = decode.id;
      const user = await UserModal.findById({ _id: userId });
      if (!user) return makeResponse(res, 400, "User does not exist");

      if (user.type !== "admin")
        return next(new AuthenticationError("Missing Authorization"));

      req.user = decode.id;
      return next();
    } else {
      return next(new AuthenticationError("Missing Authorization"));
    }
  } catch (err) {
    generateError(err, req, res, next);
  }
};
