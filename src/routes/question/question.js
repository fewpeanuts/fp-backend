import makeResponse from "../../utils/response";
import { ObjectId } from "mongodb";
import { QuestionModel, validateQuestion } from "../../models/Question";
import { generateError, generateMetadata, generatePagination } from "../utils";

export const createQuestion = async (req, res, next) => {
  try {
    const questionParams = req.body;

    const { error } = validateQuestion(questionParams, { abortEarly: false });
    if (error) return makeResponse(res, 400, error.details[0].message);

    let question = await QuestionModel.findOne({
      questionText: questionParams.questionText,
    });
    if (question) return makeResponse(res, 400, "Question already exists");

    //add new business to DB
    question = new QuestionModel({
      questionText: questionParams.questionText,
      questionType: questionParams.questionType,
      maxRating: questionParams.maxRating,
    });

    const data = await question.save();

    return makeResponse(res, 201, "Success", {
      msg: "Question created Successfully",
      result: data,
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const getQuestionList = async (req, res, next) => {
  try {
    const { questionText, questionType, limit, page } = req.query;
    const { pageSize, skip } = generatePagination(limit, page);
    const sortBy = "updatedAt";

    const filter = {};

    if (questionText) {
      filter.questionText = { $regex: questionText, $options: "i" };
    }

    if (questionType) {
      filter.questionType = questionType;
    }

    const pipeline = [
      {
        $match: filter,
      },
      { $sort: { [sortBy]: 1 } },
      { $skip: skip },
      { $limit: parseInt(pageSize) },
      { $project: { __v: 0 } },
    ];
    const [data, total] = await Promise.all([
      QuestionModel.aggregate(pipeline),
      QuestionModel.countDocuments(filter),
    ]);

    const metadata = generateMetadata(skip, pageSize, total);
    return makeResponse(res, 201, "Success", {
      results: data,
      metadata,
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const updateQuestion = async (req, res, next) => {
  try {
    const { id, questionText, questionType, maxRating } = req.body;

    let question = await QuestionModel.findById({ _id: id });
    if (!question)
      return makeResponse(res, 400, "Invalid question id to update");

    const questionParams = {
      questionText,
      questionType,
      maxRating,
    };

    const { error } = validateQuestion(questionParams);
    if (error) return makeResponse(res, 400, error.details[0].message);

    const data = await QuestionModel.findByIdAndUpdate(
      { _id: id },
      { ...questionParams },
      { new: true, runValidators: true }
    );
    return makeResponse(res, 200, "Success", data);
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
export const deleteQuestion = async (req, res, next) => {
  try {
    const id = req.params.id;
    const question = await QuestionModel.findByIdAndDelete(id);
    if (!question) return makeResponse(res, 400, "Invalid business id");
    return makeResponse(res, 200, "Success", { id });
  } catch (error) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
