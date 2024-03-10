import { S3 } from "aws-sdk";
const bucket_name = "aqpel";
import crypto from "crypto";
import { promisify } from "util";
const randomBytes = promisify(crypto.randomBytes);
import mime from "mime";

const s3 = new S3({
  region: "eu-north-1",
  credentials: {
    accessKeyId: process.env.AWS_SECRET_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  // signatureVersion: "v4",
});

export const getS3Url = async (fileExtension: string) => {
  const rawBytes = await randomBytes(16);
  const imageName = rawBytes.toString("hex");

  const params = {
    //   "conditions": [
    //  {"key" : imageName},
    //   { "bucket": bucket_name },
    //   ["content-length-range", 1048576, 2097152]
    // ]
    Bucket: bucket_name,
    // Key: imageName,
    Expires: 200,
    Conditions: [
      ["content-length-range", 0, 1000000],
      // {acl: 'public-read'},
      // {success_action_status: "201"},
      // ["starts-with", "$Content-Type", "image/"],
      // {'x-amz-algorithm': 'AWS4-HMAC-SHA256'}
    ],
    Fields: {
      key: `${imageName}.${fileExtension}`,
    },
    // ContentLengthRange: [1,20],

    // ContentType: "text/plain",
    // "content-length-range": [1048576, 2097152],
  };

  const uploadURL = await s3.createPresignedPost(params);
  // s3.createPresignedPost(params, function (err, data) {
  //   if (err) {
  //     console.log("Error", err);
  //     res.status(500).json({
  //       msg: "Error",
  //       Error: "Error creating presigned URL",
  //     });
  //   } else {
  //     console.log(data)
  //     // res.status(200).json(data);
  //   }
  // });
  return uploadURL;
};
