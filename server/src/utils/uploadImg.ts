import { v4 as uuidv4 } from "uuid";
import AWS from "aws-sdk";

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

export async function uploadImg(imageURI: string) {
  let imageUrl = "";
  const image = imageURI;
  const imageName = uuidv4();
  const imageData = image.replace(/^data:image\/\w+;base64,/, "");
  const imageBuffer = Buffer.from(imageData, "base64");
  imageUrl = process.env.IMAGE_SERVER!.endsWith("/")
    ? process.env.IMAGE_SERVER + imageName
    : process.env.IMAGE_SERVER + "/" + imageName;

  const { Location } = await s3.upload({
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: imageName,
    Body: imageBuffer,
    ContentType: "image/jpeg",
    CacheControl: "max-age=31536000"
  }).promise();

  imageUrl = Location;
  console.info("imageUrl:", imageUrl);
  return imageUrl;
}