import { createId } from "@paralleldrive/cuid2";
import { uploadToBucket } from "./s3";
import { getMediaConvertTemplate } from "./AWSMediaConvertJobTempate";
import { mediaConvert } from "../controllers/utils";

const uploadVideo = async (base64, dir) => {
  const id = createId();
  const s3Key = `${dir}/` + id + ".mp4";

  await uploadToBucket(process.env.S3_CDN_BUCKET_NAME, {
    path: s3Key,
    mediaType: "video/mp4",
    content: base64,
  });

  const URL = `${process.env.CLOUDFRONT_URL}/${dir}/${id}.mp4`;

  const mediaConvertTemplate = getMediaConvertTemplate(
    process.env.S3_CDN_BUCKET_NAME,
    s3Key,
    `${dir}/` + id + "/convert"
  );

  const data = await mediaConvert.createJob(mediaConvertTemplate).promise();
  const videoHLSUrl = {
    480: {
      url:
        process.env.CLOUDFRONT_URL + `/${dir}/${id}/convert/HLS/${id}_480.m3u8`,
    },
    720: {
      url:
        process.env.CLOUDFRONT_URL + `/${dir}/${id}/convert/HLS/${id}_720.m3u8`,
    },
    1080: {
      url:
        process.env.CLOUDFRONT_URL +
        `/${dir}/${id}/convert/HLS/${id}_1080.m3u8`,
    },
  };

  const doc = {
    URL,
    type: "video",
    videoJobId: data.Job.Id,
    videoHLSUrl,
    [process.env.VIDEO_PRIMARY_KEY]: videoHLSUrl,
    mediaConvertStatus: "SUBMITTED",
  };

  return doc;
};

export default uploadVideo;
