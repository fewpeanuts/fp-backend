import makeResponse from "../../utils/response";
import { ObjectId } from "mongodb";
import { UserModal, validateUser } from "../../models/User";
import { OtpModal } from "../../models/Otp";
import {
  comparePassword,
  generateError,
  generateMetadata,
  generateOtp,
  generatePagination,
  generateReferralCode,
  hashPassword,
} from "../utils";
export const registerUser = async (req, res, next) => {
  try {
    const userParams = req.body;
    const { error } = validateUser(userParams);

    if (error) return makeResponse(res, 400, error.details[0].message);

    let user = await UserModal.findOne({ email: userParams.email });
    if (user) return makeResponse(res, 400, "Email Id already exists ");

    //add user to DB
    user = new UserModal(userParams);
    if (userParams.password)
      user.password = await hashPassword(userParams.password);

    const data = await user.save();

    //generate OTP
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    // Save OTP in the OTP collection
    await OtpModal.create({ userId: user._id, otp, expiresAt: otpExpiry });

    // Send OTP via email
    // await sendEmail(email, otp);

    return makeResponse(res, 201, "Success", {
      msg: "User registered and Otp sent successfully",
      results: [{ userId: data?._id }],
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await UserModal.findOne({ email: email });

    if (!user) return makeResponse(res, 400, "Invalid email or password");

    if (!user.emailVerified) {
      makeResponse(res, 400, "Please verify your email id first");
    }
    if (user && (await comparePassword(password, user.password))) {
      await UserModal.findOneAndUpdate(
        { email: email },
        { lastLogin: new Date() }
      );
      const token = user.generateAuthToken();

      return makeResponse(res, 200, "Success", {
        msg: "User logged in successfully",
        results: [
          {
            id: user?._id,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email: user?.email,
            token,
          },
        ],
      });
    }
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const validateToken = async (req, res, next) => {
  try {
    const user = req.user;
    return makeResponse(res, 200, "Success", {
      msg: "User validated",
      isValid: true,
      userId: user.id,
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
export const getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user;

    const user = await UserModal.findById({ _id: userId });
    if (!user) return makeResponse(res, 400, "User not found");
    const data = user.toJSON();
    makeResponse(res, 200, "Success", data);
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
export const getUserProfileById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await UserModal.findById({ _id: id });
    if (!user) return makeResponse(res, 400, "User not found");
    const data = user.toJSON();
    makeResponse(res, 200, "Success", data);
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
export const getAllUserProfile = async (req, res, next) => {
  try {
    const { limit, page, id, name, email, sortBy = "createTime" } = req.query;
    const { pageSize, skip } = generatePagination(limit, page);
    const filter = {};
    if (id) filter._id = new ObjectId(id);
    if (email) filter.email = new RegExp(email, "i");

    const matchConditions =
      Object.keys(filter).length === 0 && !name
        ? {}
        : name
        ? {
            $or: [
              { firstName: { $regex: name, $options: "i" } },
              { lastName: { $regex: name, $options: "i" } },
            ],
          }
        : filter;
    const data = await UserModal.aggregate([
      { $match: matchConditions },
      { $sort: { [sortBy]: -1 } },
      { $skip: skip },
      { $limit: parseInt(pageSize) },
      { $project: { __v: 0, password: 0 } },
    ]);

    const total = await UserModal.countDocuments(data);
    const metadata = generateMetadata(skip, pageSize, total);

    makeResponse(res, 200, "Success", { data, metadata });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
export const sendOtp = async (req, res, next) => {
  try {
    const { userId } = req.body;

    const user = await UserModal.findOne({ _id: userId });

    if (!user) return makeResponse(res, 400, "Invalid user");

    if (user.emailVerified)
      return makeResponse(res, 400, "Email Id is already verified ");

    //generate OTP
    const otp = generateOtp();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    // Save OTP in the OTP collection
    await OtpModal.create({ userId: user._id, otp, expiresAt: otpExpiry });

    // Send OTP via email
    // await sendEmail(email, otp);

    return makeResponse(res, 201, "Success", {
      msg: "OTP sent successfully",
      results: [{ userId: userId }],
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
export const verifyOtp = async (req, res, next) => {
  try {
    const { userId, otp } = req.body;

    const user = await UserModal.findOne({ _id: userId });

    if (!user) return makeResponse(res, 400, "Invalid user");

    const otpRecord = await OtpModal.findOne({ userId: user._id, otp });
    if (!otpRecord) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (otpRecord.expiresAt < Date.now()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // OTP is valid, verify the user
    user.emailVerified = true;
    await user.save();

    // Delete the OTP record after verification
    await OtpModal.deleteMany({ userId: user._id });
    return makeResponse(res, 201, "Success", {
      msg: "Email verified successfully",
      results: [{ userId: user._id }],
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
