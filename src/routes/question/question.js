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
    question = new QuestionModel(questionParams);

    const data = await question.save();
    return makeResponse(res, 201, "Success", {
      msg: "Question created Successfully",
      id: data?._id,
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};

export const getQuestionList = async (req, res, next) => {
  try {
    const { id, limit, page } = req.query;
    const { pageSize, skip } = generatePagination(limit, page);
    const sortBy = "updateTime";

    const filter = {};

    if (id) filter._id = new ObjectId(id);

    const data = await QuestionModel.aggregate([
      {
        $match: filter,
      },
      { $sort: { [sortBy]: -1 } },
      { $skip: skip },
      { $limit: parseInt(pageSize) },
      { $project: { __v: 0 } },
    ]);
    const total = await QuestionModel.countDocuments(filter);
    const metadata = generateMetadata(skip, pageSize, total);
    return makeResponse(res, 201, "Success", {
      data,
      metadata,
    });
  } catch (err) {
    console.log(err);
    generateError(err, req, res, next);
  }
};
