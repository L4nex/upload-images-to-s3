import AWS from "aws-sdk";

const s3 = new AWS.S3();

export const uploadImagesToS3 = async (
  images: { name: string; content: Buffer }[],
  _s3Path?: string
): Promise<string[]> => {
  if (!process.env.S3_BUCKET_NAME) {
    throw new Error("Variável de ambiente S3_BUCKET_NAME não definida.");
  }

  const uploadPromises = images.map((image) => {
    const extension = image.name.split(".").pop()?.toLowerCase();
    let contentType = "image/jpeg";
    if (extension === "png") {
      contentType = "image/png";
    }
    if (extension === "webp") {
      contentType = "image/webp";
    } else if (extension === "jpeg" || extension === "jpg") {
      contentType = "image/jpeg";
    }

    const uploadParams = {
      Bucket: process.env.S3_BUCKET_NAME!,
      Key: `${image.name}`,
      Body: image.content,
      ContentType: contentType,
      ACL: "public-read", // Define permissão de leitura pública
    };

    return s3.upload(uploadParams).promise();
  });

  // Aguarda todos os uploads serem concluídos
  await Promise.all(uploadPromises);

  // Retorna os nomes das imagens enviadas
  return images.map((image) => image.name);
};
