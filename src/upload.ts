import AWS from "aws-sdk";

const s3 = new AWS.S3();

export const uploadImagesToS3 = async (
  images: { name: string; content: Buffer }[],
  s3Path: string
): Promise<string[]> => {
  if (!process.env.S3_BUCKET_NAME) {
    throw new Error("Variável de ambiente S3_BUCKET_NAME não definida.");
  }

  const uploadedFiles: string[] = [];

  for (const image of images) {
    const extension = image.name.split(".").pop()?.toLowerCase();
    let contentType = "image/jpeg";
    if (extension === "png") {
      contentType = "image/png";
    } else if (extension === "jpeg" || extension === "jpg") {
      contentType = "image/jpeg";
    }

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `${s3Path}/${image.name}`,
      Body: image.content,
      ContentType: contentType,
    };

    await s3.upload(uploadParams).promise();
    uploadedFiles.push(image.name);
  }

  return uploadedFiles;
};
