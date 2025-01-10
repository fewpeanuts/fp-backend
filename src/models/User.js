import { mongoose } from "../db/mongolize";
import jwt from "jsonwebtoken";
import Joi from "joi";

const UserSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, index: true, trim: true },
    lastName: { type: String, required: true, index: true, trim: true },
    email: {
      type: String,
      unique: true,
      required: true,
      index: true,
      trim: true,
    },
    password: {
      type: String,
      unique: false,
      required: false,
      index: true,
    },
    avatarUrl: { type: String, index: true, default: null },
    bio: { type: String, index: true, default: null },
    organization: { type: String, index: true, default: null },
    phoneNumber: { type: String, index: true, default: null },

    emailVerified: { type: Boolean, default: false },
    phoneVerified: { type: Boolean, default: false },
    type: { type: String, index: true, default: "user" },

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },

    createdAt: { type: Date, index: true, default: Date.now() },
    updatedAt: { type: Date, index: true, default: Date.now() },
    lastLogin: { type: Date },
    loginIP: { type: String },
  },
  { Collection: "user" }
);

UserSchema.set("toJSON", {
  versionKey: false,
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id, delete ret.password;
  },
});

UserSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { id: this.id, email: this.email },
    process.env.JWT_PRIVATE_KEY,
    { expiresIn: process.env.JWT_EXPIRE_HOURS }
  );
  return token;
};

const validateUser = (user) => {
  const schema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().min(3).required().email(),
    password: Joi.string().min(3).required(),
    avatarUrl: Joi.string(),
    bio: Joi.string(),
    organization: Joi.string(),
  });
  return schema.validate(user);
};

const UserModal = mongoose.model("User", UserSchema);
exports.UserModal = UserModal;
exports.validateUser = validateUser;
