import express from "express";
import bodyParser from "body-parser";
import corsFilter from "cors";
import { v4 as uuidv4 } from "uuid";
import logger from "./utils/logging";
import _ from "./utils/env";
import makeResponse from "./utils/response";
import rateLimit from "express-rate-limit";
import { NotFoundError, ERROR_TYPES as errors } from "./utils/errors";
import db, { mongoose } from "./db/mongolize";
import UserRouter from "./routes/user";
import BusinessRouter from "./routes/business";
import QuestionRouter from "./routes/question";

db();
const app = express();

app.disable("etag");

app.use(bodyParser.json({ limit: "1024mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "1024mb" }));
app.use(corsFilter());
app.options("*", corsFilter());

app.use((req, _, next) => {
  req.requestId = uuidv4();
  logger.info(
    "request id:" + req.requestId + "request route: " + req.originalUrl
  );
  logger.info("request id:" + req.requestId + "request route: " + req.method);
  next();
});

const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 500, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false,
});
// Apply the rate limiting middleware to all requests
app.use(limiter);

app.get("/health", async (req, res) => {
  if (mongoose.connection.readyState === 1) {
    return makeResponse(res, 200, "HEALTHY!");
  } else {
    return makeResponse(res, 599, "DB Connection Error");
  }
});

//all API routes
app.use("/api/user", UserRouter);
app.use("/api/business", BusinessRouter);
app.use("/api/question", QuestionRouter);

app.use((req, res, next) => {
  if (res.response) {
    res.send(res.response);
    logger.info(
      "request id: " +
        req.requestId +
        " response status: " +
        JSON.stringify(res.statusCode)
    );
    logger.info(
      "request id: " +
        req.requestId +
        " response body: " +
        JSON.stringify(res.response)
    );
  } else {
    next();
  }
});

app.use("*", (_, res, next) => {
  // any url that didn't match our routes will get to this middleware.
  if (res.statusCode === 200) {
    res.statusCode = 404;
  }
  next(new NotFoundError(errors.NOT_FOUND));
});

// error handlers
app.use((err, req, res, _) => {
  logger.error(
    "request id: " +
      req.requestId +
      " response headers: " +
      JSON.stringify(res.headers)
  );

  if (err?.statusCode) {
    res.statusCode = err?.statusCode;
  }

  if (res.statusCode === 404 || res.statusCode === 200) {
    res.statusCode = 404;
    logger.error("request id: " + req.requestId + " response status: 404");
    logger.error("request id: " + req.requestId + " response body: " + err);
    res.send({
      status: res.statusCode,
      message: err.message,
    });
  } else {
    res.statusCode = res.statusCode || 500;
    logger.error(
      "request id: " + req.requestId + " response status: " + res.statusCode
    );
    logger.error("request id: " + req.requestId + " response body: " + err);
    res.send({
      status: res.statusCode,
      message: err.message,
    });
  }
});
export default app;
