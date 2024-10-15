import AWS from "aws-sdk";

const s3 = () =>
  new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECERT_KEY,
  });

export const uploadToBucket = (bucket, file) =>
  s3()
    .putObject({
      Bucket: bucket,
      Key: file.path,
      Body: Buffer.from(file.content.split(",")[1], "base64"),
      ContentEncoding: "base64",
      ContentType: file.mediaType,
    })
    .promise();

export const uploadToBucketDirect = (bucket, file) =>
  s3()
    .putObject({
      Bucket: bucket,
      Key: file.path,
      Body: Buffer.from(file.content, "base64"),
      ContentEncoding: "base64",
      ContentType: file.mediaType,
    })
    .promise();

export const getFileFromBucket = (path) =>
  s3().getObject({ Bucket: process.env.S3_BUCKET_NAME, Key: path }).promise();
