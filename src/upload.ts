import AWS from "aws-sdk";

const s3 = new AWS.S3();

export const uploadImagesToS3 = async (
  images: { name: string; content: Buffer }[]
): Promise<string[]> => {
  if (!process.env.S3_BUCKET_NAME) {
    throw new Error("Variável de ambiente S3_BUCKET_NAME não definida.");
  }

  const uploadPromises = images.map((image) => {
    const extension = image.name.split(".").pop()?.toLowerCase();

    const mimeTypes: Record<string, string> = {
      png: "image/png",
      webp: "image/webp",
      jpeg: "image/jpeg",
      jpg: "image/jpeg",
    };

    const uploadParams: AWS.S3.PutObjectRequest = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `${image.name}`,
      Body: image.content,
      ACL: "public-read",
    };

    if (extension && mimeTypes[extension]) {
      uploadParams.ContentType = mimeTypes[extension];
    }

    return s3.upload(uploadParams).promise();
  });

  await Promise.all(uploadPromises);

  return images.map((image) => image.name);
};
