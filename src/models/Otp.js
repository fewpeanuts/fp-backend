import { mongoose } from "../db/mongolize";
import Joi from "joi";

const OtpSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: { type: Number, required: true, index: true, trim: true },
    expiresAt: { type: Date, index: true, required: true },
    isUsed: { type: Boolean, default: false },
    createdAt: { type: Date, index: true, default: Date.now() },
  },
  { Collection: "otp" }
);

OtpSchema.set("toJSON", {
  versionKey: false,
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

const validateOtp = (otp) => {
  const schema = Joi.object({
    userId: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/) // Valid ObjectId
      .required(),
    otp: Joi.number().min(6).required().max(6),
  });
  return schema.validate(otp);
};

const OtpModal = mongoose.model("Otp", OtpSchema);
exports.OtpModal = OtpModal;
exports.validateOtp = validateOtp;
