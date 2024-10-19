import { mongoose } from "../db/mongolize";
import Joi from "joi";

const BusinessSchema = mongoose.Schema(
  {
    name: { type: String, required: true, index: true, trim: true },
    industry: { type: String, required: true, index: true, trim: true },
    location: { type: String, required: true, index: true, trim: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: { type: Date, index: true, default: Date.now() },
    updatedAt: { type: Date, index: true, default: Date.now() },
  },
  { Collection: "business" }
);

BusinessSchema.set("toJSON", {
  versionKey: false,
  virtuals: true,
  transform: (doc, ret) => {
    delete ret._id;
  },
});

const validateBusiness = (business) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    industry: Joi.string().min(3).required(),
    location: Joi.string().min(3).required(),
    createdBy: Joi.string()
      .regex(/^[0-9a-fA-F]{24}$/) // Valid ObjectId
      .required(),
    createTime: { type: Date, index: true, default: Date.now() },
  });
  return schema.validate(business);
};

const BusinessModal = mongoose.model("Business", BusinessSchema);
exports.BusinessModal = BusinessModal;
exports.validateBusiness = validateBusiness;
