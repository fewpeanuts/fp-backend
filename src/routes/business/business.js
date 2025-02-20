import makeResponse from "../../utils/response";
import { ObjectId } from "mongodb";
import { BusinessModal, validateBusiness } from "../../models/Business";
import { generateError, generateMetadata, generatePagination } from "../utils";

export const createBusiness = async (req, res, next) => {
  try {
    const businessParams = req.body;
    const userId = req.user;
    businessParams.createdBy = userId;
    businessParams.status = true;

    const { error } = validateBusiness(businessParams, { abortEarly: false });
    if (error) return makeResponse(res, 400, error.details[0].message);

    let business = await BusinessModal.findOne({
      placeId: businessParams?.placeId,
    }).lean();

    if (business) {
      return makeResponse(
        res,
        400,
        "Business with same place id already exist"
      );
    }
    business = new BusinessModal(businessParams);

    const { _id } = await business.save();
    return makeResponse(res, 201, "Success", {
      msg: "Business added Successfully",
      results: [{ id: _id }],
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const requestToAddBusiness = async (req, res, next) => {
  try {
    const businessParams = req.body;
    businessParams.createdBy = "670c05b90d7bd1b566b7f5fd";
    businessParams.status = false;

    const { error } = validateBusiness(businessParams, { abortEarly: false });
    if (error) return makeResponse(res, 400, error.details[0].message);

    let business = await BusinessModal.findOne({
      placeId: businessParams?.placeId,
    }).lean();

    if (business) {
      return makeResponse(
        res,
        400,
        "Business with same name and address already requested to add"
      );
    }
    business = new BusinessModal(businessParams);

    const { _id } = await business.save();
    return makeResponse(res, 201, "Success", {
      msg: "Business requested Successfully",
      results: [{ id: _id }],
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
export const getBusinessList = async (req, res, next) => {
  try {
    const { id, searchText, name, industry, limit, page } = req.query;
    const { pageSize, skip } = generatePagination(limit, page);
    const sortBy = "updatedAt";

    const filter = { status: true };

    if (id) filter._id = new ObjectId(id);
    if (name) filter.name = new RegExp(name, "i");
    if (industry) filter.industry = new RegExp(industry, "i");
    if (searchText) {
      filter.$or = [
        { name: new RegExp(searchText.trim(), "i") },
        { location: new RegExp(searchText.trim(), "i") },
        { industry: new RegExp(searchText.trim(), "i") },
      ];
    }
    const [data, total] = await Promise.all([
      BusinessModal.aggregate([
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
      ]),
      BusinessModal.countDocuments(filter),
    ]);

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

    const [data, total] = await Promise.all([
      BusinessModal.aggregate([
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
      ]),
      BusinessModal.countDocuments(filter),
    ]);

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

export const updateBusiness = async (req, res, next) => {
  try {
    const { id, name, industry, location, status, placeId } = req.body;

    let business = await BusinessModal.findOne({ placeId: placeId });

    // if (!business)
    //   return makeResponse(res, 400, "Invalid business id to update");
    const businessParams = {
      name: name ? name : business?.name,
      industry: industry ? industry : business?.industry,
      location: location ? location : business?.location,
      // status: status ? status : business?.status,
      status: true,
      placeId: placeId,
      createdBy: "670c05b90d7bd1b566b7f5fd" || String(business?.createdBy),
    };

    if (!business) {
      business = new BusinessModal({
        ...businessParams,
        createdAt: Date.now(),
      });

      await business.save();
      return makeResponse(res, 201, "Business created successfully", business);
    } else {
      const data = await BusinessModal.findByIdAndUpdate(
        { _id: business._id },
        { ...businessParams, updatedAt: Date.now() },
        { new: true, runValidators: true }
      );
      return makeResponse(res, 200, "Success", data);
    }

    // const { error } = validateBusiness(businessParams);
    // console.log("error=>", error);
    // if (error) return makeResponse(res, 400, error.details[0].message);
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
export const deleteBusiness = async (req, res, next) => {
  try {
    const id = req.params.id;
    const business = await BusinessModal.findByIdAndDelete(id);
    if (!business) return makeResponse(res, 400, "Invalid business id");
    return makeResponse(res, 200, "Success", { id });
  } catch (error) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
