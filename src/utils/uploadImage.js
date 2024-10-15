import { createId } from "@paralleldrive/cuid2";
import { uploadToBucket } from "./s3";

export const uploadImg = async (base64, dir) => {
  const id = createId();
  const s3Key = `${dir}/` + id + ".jpeg";

  await uploadToBucket(process.env.S3_CDN_BUCKET_NAME, {
    path: s3Key,
    mediaType: "image/png",
    content: base64,
  });

  const URL = `${process.env.CLOUDFRONT_URL}/${dir}/${id}.jpeg`;

  const doc = {
    URL,
    type: "image",
  };

  return doc;
};
export const uploadDoc = async (base64, dir) => {
  const id = createId();
  const s3Key = `${dir}/` + id + ".pdf";

  await uploadToBucket(process.env.S3_CDN_BUCKET_NAME, {
    path: s3Key,
    mediaType: "application/pdf",
    content: base64,
  });

  const URL = `${process.env.CLOUDFRONT_URL}/${dir}/${id}.pdf`;

  const doc = {
    URL,
    type: "application/pdf",
  };

  return doc;
};
