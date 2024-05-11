import S3 from "aws-sdk/clients/s3";
const bucket_name = "aqpel";
import { v4 as uuid } from "uuid";

const s3 = new S3({
  region: "eu-north-1",
  // credentials: {
  accessKeyId: process.env.AWS_SECRET_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  // },
  signatureVersion: "v4",
});

export const getS3Url = async (fileExtension: string, userId: string) => {
  const Key = `${userId}/${uuid()}.${fileExtension}`;
  const params = {
    //   "conditions": [
    //  {"key" : imageName},
    //   { "bucket": bucket_name },
    //   ["content-length-range", 1048576, 2097152]
    // ]
    Bucket: bucket_name,
    ContentType: `image/${fileExtension}`,
    Key,
    // Expires: 10000,
    // Conditions: [
    //   ["content-length-range", 0, 1000000],
    // {acl: 'public-read'},
    // {success_action_status: "201"},
    // ["starts-with", "$Content-Type", "image/"],
    // {'x-amz-algorithm': 'AWS4-HMAC-SHA256'}
    // ],
    // Fields: {
    //   key: `${userId}/${uuid()}.${fileExtension}`,
    // },
    // ContentLengthRange: [1,20],

    // ContentType: "text/plain",
    // "content-length-range": [1048576, 2097152],
  };

  // const uploadURL = await s3.getSignedUrl("PutObject", params);

  const uploadURL = await getPresignedUrlPromiseFunction(s3, params);
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
  return { url: uploadURL, key: Key };
};

function getPresignedUrlPromiseFunction(
  s3: any,
  s3Params: {}
): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      await s3.getSignedUrl(
        "putObject",
        s3Params,
        function (err: any, data: any) {
          if (err) {
            return reject(err);
          }
          resolve(data);
        }
      );
    } catch (error) {
      return reject(error);
    }
  });
}
