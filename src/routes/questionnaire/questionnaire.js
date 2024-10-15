import makeResponse from "../../utils/response";
import { ObjectId } from "mongodb";
import {
  QuestionnaireModel,
  validateQuestionnaire,
} from "../../models/Questionnaire";
import { generateError, generateMetadata, generatePagination } from "../utils";

export const createQuestionnaire = async (req, res, next) => {
  try {
    const questionnaireParams = req.body;

    const { error } = validateQuestionnaire(questionnaireParams, {
      abortEarly: false,
    });

    if (error) return makeResponse(res, 400, error.details[0].message);

    let questionnaire = await QuestionnaireModel.findOne({
      title: questionnaireParams.title,
    });
    if (questionnaire)
      return makeResponse(res, 400, "Questionnaire already exists");

    // add new questionnaire to DB
    questionnaire = new QuestionnaireModel(questionnaireParams);

    const data = await questionnaire.save();
    return makeResponse(res, 201, "Success", {
      msg: "Questionnaire created Successfully",
      id: data?._id,
    });
  } catch (err) {
    generateError(err, req, res, next);
  }
};

export const getQuestionnaireById = async (req, res, next) => {
  try {
    const { id, limit, page } = req.query;
    const { pageSize, skip } = generatePagination(limit, page);
    const sortBy = "updateTime";

    const data = await QuestionnaireModel.aggregate([
      {
        $match: { _id: new ObjectId(id) },
      },
      {
        $lookup: {
          from: "questions", // Collection name for Question model
          localField: "questions", // Field in Questionnaire that contains the question ObjectIds
          foreignField: "_id", // Field in the Question collection to match
          as: "questions", // Output array with the populated questions
        },
      },
      { $sort: { [sortBy]: -1 } },
      { $skip: skip },
      { $limit: parseInt(pageSize) },
      {
        $project: {
          title: 1,
          description: 1,
          createdBy: 1,
          questions: {
            $map: {
              input: "$questions",
              as: "question",
              in: {
                id: "$$question._id", // Rename _id to id
                questionText: "$$question.questionText",
                questionType: "$$question.questionType",
                choices: "$$question.choices",
                createdAt: "$$question.createdAt",
                updatedAt: "$$question.updatedAt",
              },
            },
          },
          createdAt: 1,
          updatedAt: 1,
        },
      },
    ]);
    const total = await QuestionnaireModel.countDocuments(data);
    const metadata = generateMetadata(skip, pageSize, total);
    return makeResponse(res, 201, "Success", {
      data,
      metadata,
    });
  } catch (err) {
    generateError(err, req, res, next);
  }
};
