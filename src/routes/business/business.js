import makeResponse from "../../utils/response";
import { ObjectId } from "mongodb";
import { BusinessModal, validateBusiness } from "../../models/Business";
import { generateError, generateMetadata, generatePagination } from "../utils";

export const createBusiness = async (req, res, next) => {
  try {
    const businessParams = req.body;
    const userId = req.user;
    businessParams.createdBy = userId;

    const { error } = validateBusiness(businessParams, { abortEarly: false });
    if (error) return makeResponse(res, 400, error.details[0].message);

    let business = await BusinessModal.findOne({ name: businessParams.name });
    if (business) return makeResponse(res, 400, "Business Name already exists");

    //add new business to DB
    business = new BusinessModal(businessParams);

    const data = await business.save();
    return makeResponse(res, 201, "Success", {
      msg: "Business added Successfully",
      results: [{ id: data?._id }],
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const getBusinessList = async (req, res, next) => {
  try {
    const { id, name, industry, limit, page } = req.query;
    const { pageSize, skip } = generatePagination(limit, page);
    const sortBy = "updateTime";

    const filter = {};

    if (id) filter._id = new ObjectId(id);
    if (name) filter.name = new RegExp(name, "i");
    if (industry) filter.industry = new RegExp(industry, "i");

    const data = await BusinessModal.aggregate([
      {
        $match: filter,
      },
      { $sort: { [sortBy]: -1 } },
      { $skip: skip },
      { $limit: parseInt(pageSize) },
      {
        $addFields: { id: "$_id" },
      },
      { $project: { _id: 0, __v: 0, createdBy: 0, createdAt: 0 } },
    ]);
    const total = await BusinessModal.countDocuments(filter);
    const metadata = generateMetadata(skip, pageSize, total);
    return makeResponse(res, 201, "Success", {
      results: [...data],
      metadata,
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const getBusinessAdminList = async (req, res, next) => {
  try {
    const { id, name, industry, limit, page } = req.query;
    const { pageSize, skip } = generatePagination(limit, page);
    const sortBy = "createdAt";

    const filter = {};

    if (id) filter._id = new ObjectId(id);
    if (name) filter.name = new RegExp(name, "i");
    if (industry) filter.industry = new RegExp(industry, "i");

    const data = await BusinessModal.aggregate([
      {
        $match: filter,
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        // Flatten the users array if you expect only one user per business (optional)
        $unwind: {
          path: "$user",
          preserveNullAndEmptyArrays: true, // In case 'createdBy' has no matching user
        },
      },
      { $sort: { [sortBy]: -1 } },
      { $skip: skip },
      { $limit: parseInt(pageSize) },
      {
        $addFields: { id: "$_id", "user.id": "$user._id" },
      },
      {
        $project: {
          id: 1,
          name: 1,
          industry: 1,
          location: 1,
          createdAt: 1,
          "user.id": 1,
          "user.firstName": 1,
          "user.lastName": 1,
        },
      },
    ]);
    const total = await BusinessModal.countDocuments(filter);
    const metadata = generateMetadata(skip, pageSize, total);
    return makeResponse(res, 201, "Success", {
      results: [...data],
      metadata,
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
